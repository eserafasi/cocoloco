const WHATSAPP_API_BASE_URL = "https://graph.facebook.com/v20.0";

function mapSelectionToShowId(messageText, shows) {
  const normalizedText = (messageText || "").trim().toLowerCase();
  if (!normalizedText) {
    return null;
  }

  const numericSelection = Number.parseInt(normalizedText, 10);
  if (!Number.isNaN(numericSelection)) {
    const showByIndex = shows[numericSelection - 1];
    return showByIndex ? showByIndex.id : null;
  }

  const matchedShow = shows.find((show) => {
    const aliases = [
      String(show.id),
      show.title,
      show.code,
    ]
      .filter(Boolean)
      .map((value) => String(value).trim().toLowerCase());
    return aliases.includes(normalizedText);
  });

  return matchedShow ? matchedShow.id : null;
}

function buildMenuMessage(shows) {
  const lines = ["Selecciona una opción:"];
  shows.forEach((show, index) => {
    lines.push(`${index + 1}. ${show.title}`);
  });
  return lines.join("\n");
}

function buildCaption(show) {
  const description = show.short_description || show.description || "";
  const trimmedDescription = description.trim();
  if (!trimmedDescription) {
    return show.title;
  }
  return `${show.title} - ${trimmedDescription}`;
}

async function sendWhatsAppMessage({
  phoneNumberId,
  accessToken,
  payload,
  fetchImpl = fetch,
}) {
  const response = await fetchImpl(
    `${WHATSAPP_API_BASE_URL}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`WhatsApp API error: ${response.status} ${errorBody}`);
  }

  return response.json();
}

async function sendImageMessage({
  phoneNumberId,
  accessToken,
  to,
  imageUrl,
  caption,
  fetchImpl,
}) {
  return sendWhatsAppMessage({
    phoneNumberId,
    accessToken,
    fetchImpl,
    payload: {
      messaging_product: "whatsapp",
      to,
      type: "image",
      image: {
        link: imageUrl,
        caption,
      },
    },
  });
}

async function sendDocumentMessage({
  phoneNumberId,
  accessToken,
  to,
  documentUrl,
  caption,
  filename,
  fetchImpl,
}) {
  return sendWhatsAppMessage({
    phoneNumberId,
    accessToken,
    fetchImpl,
    payload: {
      messaging_product: "whatsapp",
      to,
      type: "document",
      document: {
        link: documentUrl,
        filename,
        caption,
      },
    },
  });
}

async function handleIncomingMessage({
  messageText,
  from,
  shows,
  phoneNumberId,
  accessToken,
  fetchImpl,
}) {
  const selectedShowId = mapSelectionToShowId(messageText, shows);

  if (!selectedShowId) {
    const menuMessage = buildMenuMessage(shows);
    await sendWhatsAppMessage({
      phoneNumberId,
      accessToken,
      fetchImpl,
      payload: {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: {
          body: menuMessage,
        },
      },
    });
    return {
      handled: false,
      reason: "fallback",
    };
  }

  const selectedShow = shows.find((show) => show.id === selectedShowId);
  if (!selectedShow) {
    return {
      handled: false,
      reason: "show_not_found",
    };
  }

  const caption = buildCaption(selectedShow);

  if (selectedShow.flyer_url) {
    await sendImageMessage({
      phoneNumberId,
      accessToken,
      to: from,
      imageUrl: selectedShow.flyer_url,
      caption,
      fetchImpl,
    });
  }

  if (selectedShow.qr_url) {
    await sendDocumentMessage({
      phoneNumberId,
      accessToken,
      to: from,
      documentUrl: selectedShow.qr_url,
      caption,
      filename: `${selectedShow.title}-QR.pdf`,
      fetchImpl,
    });
  }

  return {
    handled: true,
    showId: selectedShowId,
  };
}

module.exports = {
  mapSelectionToShowId,
  buildMenuMessage,
  buildCaption,
  sendWhatsAppMessage,
  sendImageMessage,
  sendDocumentMessage,
  handleIncomingMessage,
};
