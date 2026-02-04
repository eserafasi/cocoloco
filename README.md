# cocoloco

Aplicación mínima para recibir webhooks de WhatsApp Cloud API y responder con un menú interactivo.

## Requisitos

- Node.js 18+ (incluye `fetch`).
- Token y credenciales de WhatsApp Cloud API.

## Configuración

1. Instala dependencias:

```bash
npm install
```

2. Exporta las variables de entorno necesarias:

```bash
export PORT=3000
export VERIFY_TOKEN=tu_token_de_verificacion
export ACCESS_TOKEN=tu_access_token
export PHONE_NUMBER_ID=tu_phone_number_id
export GRAPH_API_VERSION=v19.0
```

3. Inicia el servidor:

```bash
npm start
```

## Endpoints

- `GET /webhook`: verificación del webhook (Facebook/Meta envía `hub.mode`, `hub.verify_token`, `hub.challenge`).
- `POST /webhook`: recibe eventos entrantes y responde con un menú interactivo.
- `GET /health`: healthcheck simple.

## Notas

- El menú interactivo incluye las opciones “Próximas funciones”, “Ver flyer”, “Obtener QR”.
- La respuesta se envía usando el endpoint `/messages` de la Graph API con el `PHONE_NUMBER_ID` configurado.
