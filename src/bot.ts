import { shows } from "./data/shows";

const UPCOMING_SHOWS_TRIGGER = "próximas funciones";

const formatShowLine = (show: (typeof shows)[number], index: number): string => {
  return [
    `${index + 1}. ${show.titulo}`,
    `📅 ${show.fecha} ⏰ ${show.hora}`,
    `📍 ${show.lugar}`,
    `Flyer: ${show.flyer_url}`,
    `QR: ${show.qr_url}`,
  ].join("\n");
};

export const formatUpcomingShows = (): string => {
  return shows.map((show, index) => formatShowLine(show, index)).join("\n\n");
};

export const handleBotMessage = (message: string): string | null => {
  if (message.trim().toLowerCase() === UPCOMING_SHOWS_TRIGGER) {
    return formatUpcomingShows();
  }

  return null;
};
