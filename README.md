# cocoloco

Bot de ejemplo para manejar el menú interactivo y la entrega de flyers/QR.

## Uso rápido

```bash
python src/bot.py
```
## Documentación

### Estructura sugerida para assets

Puedes organizar los archivos de flyers y QR de dos formas:

* **Local**: guarda archivos en `assets/flyers/` y `assets/qr/` y publícalos como URLs públicas desde tu hosting.
* **Cloud**: sube los archivos a un bucket (AWS S3 o Firebase Storage) con URLs públicas.

### Ejemplos de nombres de archivo y referencias en `shows.json`

Ejemplos de nombres:

* Flyers: `assets/flyers/2024-12-05-la-renga.png`
* QR: `assets/qr/2024-12-05-la-renga-entrada.png`

Ejemplo de cómo referenciarlos en `shows.json`:

```json
{
  "id": "2024-12-05-la-renga",
  "title": "La Renga",
  "date": "2024-12-05",
  "flyerUrl": "https://tu-dominio.com/assets/flyers/2024-12-05-la-renga.png",
  "qrUrl": "https://tu-dominio.com/assets/qr/2024-12-05-la-renga-entrada.png"
}
```

### Nota sobre la versión gratuita

La versión gratuita no usa persistencia ni estados de boletería.
