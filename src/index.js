import express from "express";

const {
  PORT = "3000",
  VERIFY_TOKEN,
  ACCESS_TOKEN,
  PHONE_NUMBER_ID,
  GRAPH_API_VERSION = "v19.0",
} = process.env;

const app = express();
app.use(express.json());

const GRAPH_API_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

function assertEnv() {
  const missing = [];
  if (!VERIFY_TOKEN) missing.push("VERIFY_TOKEN");
  if (!ACCESS_TOKEN) missing.push("ACCESS_TOKEN");
  if (!PHONE_NUMBER_ID) missing.push("PHONE_NUMBER_ID");

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

async function sendInteractiveMenu({ to }) {
  assertEnv();
  const url = `${GRAPH_API_BASE_URL}/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: "¡Hola! Elige una opción del menú:",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "menu_next_features",
              title: "Próximas funciones",
            },
          },
          {
            type: "reply",
            reply: {
              id: "menu_view_flyer",
              title: "Ver flyer",
            },
          },
          {
            type: "reply",
            reply: {
              id: "menu_get_qr",
              title: "Obtener QR",
            },
          },
        ],
      },
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to send interactive menu. Status ${response.status}: ${errorBody}`,
    );
  }

  return response.json();
}

function getMessageSender(body) {
  return body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ?? null;
}

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const sender = getMessageSender(req.body);

    if (sender) {
      await sendInteractiveMenu({ to: sender });
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Webhook handling failed:", error);
    return res.sendStatus(500);
  }
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
});
