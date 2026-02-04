export type Show = {
  id: string;
  titulo: string;
  fecha: string;
  hora: string;
  lugar: string;
  flyer_url: string;
  qr_url: string;
};

export const shows: Show[] = [
  {
    id: "show-01",
    titulo: "Noche Tropical",
    fecha: "2024-10-05",
    hora: "21:00",
    lugar: "Teatro Luna, CABA",
    flyer_url: "https://example.com/flyers/noche-tropical.jpg",
    qr_url: "https://example.com/qr/noche-tropical.png",
  },
  {
    id: "show-02",
    titulo: "Ritmos del Caribe",
    fecha: "2024-10-12",
    hora: "20:30",
    lugar: "Centro Cultural Sur, CABA",
    flyer_url: "https://example.com/flyers/ritmos-caribe.jpg",
    qr_url: "https://example.com/qr/ritmos-caribe.png",
  },
  {
    id: "show-03",
    titulo: "Coco en Vivo",
    fecha: "2024-10-19",
    hora: "22:00",
    lugar: "Sala Azul, La Plata",
    flyer_url: "https://example.com/flyers/coco-en-vivo.jpg",
    qr_url: "https://example.com/qr/coco-en-vivo.png",
  },
  {
    id: "show-04",
    titulo: "Fiesta Latina",
    fecha: "2024-10-26",
    hora: "21:30",
    lugar: "Club Sol, Rosario",
    flyer_url: "https://example.com/flyers/fiesta-latina.jpg",
    qr_url: "https://example.com/qr/fiesta-latina.png",
  },
  {
    id: "show-05",
    titulo: "Cierre de Temporada",
    fecha: "2024-11-02",
    hora: "20:00",
    lugar: "Teatro del Río, Córdoba",
    flyer_url: "https://example.com/flyers/cierre-temporada.jpg",
    qr_url: "https://example.com/qr/cierre-temporada.png",
  },
];
