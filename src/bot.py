from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional


@dataclass(frozen=True)
class Show:
    show_id: str
    title: str
    date: str


SHOWS: List[Show] = [
    Show(show_id="funcion-101", title="Cocoloco: Apertura", date="2024-10-05"),
    Show(show_id="funcion-102", title="Cocoloco: Noche de estreno", date="2024-10-12"),
]


MENU_OPTIONS = (
    "1) Próximas funciones",
    "2) Ver flyer",
    "3) Obtener QR",
)


@dataclass
class BotState:
    awaiting: Optional[str] = None
    has_received_message: bool = False


class CocolocoBot:
    def __init__(self, assets_dir: Path) -> None:
        self.assets_dir = assets_dir
        self.state = BotState()

    def handle_message(self, message: str) -> Dict[str, object]:
        normalized = message.strip().lower()

        if not self.state.has_received_message:
            self.state.has_received_message = True
            return self._menu_response()

        if normalized == "hola":
            return self._menu_response()

        if self.state.awaiting:
            return self._handle_asset_request(normalized)

        if normalized == "próximas funciones":
            return self._upcoming_shows_response()

        if normalized == "ver flyer":
            self.state.awaiting = "flyer"
            return {
                "type": "text",
                "text": "Indica el número/ID de la función para enviarte el flyer.",
            }

        if normalized == "obtener qr":
            self.state.awaiting = "qr"
            return {
                "type": "text",
                "text": "Indica el número/ID de la función para enviarte el QR.",
            }

        return self._menu_response()

    def _menu_response(self) -> Dict[str, object]:
        return {
            "type": "menu",
            "title": "Menú principal",
            "options": list(MENU_OPTIONS),
        }

    def _upcoming_shows_response(self) -> Dict[str, object]:
        formatted = [f"{show.show_id}: {show.title} ({show.date})" for show in SHOWS]
        return {
            "type": "list",
            "title": "Próximas funciones",
            "items": formatted,
        }

    def _handle_asset_request(self, normalized: str) -> Dict[str, object]:
        show_ids = {show.show_id for show in SHOWS}
        request_type = self.state.awaiting
        self.state.awaiting = None

        if normalized not in show_ids:
            return {
                "type": "text",
                "text": "No encontré ese ID. Intenta con uno de la lista de próximas funciones.",
            }

        if request_type == "flyer":
            file_path = self.assets_dir / "flyers" / f"{normalized}.txt"
        else:
            file_path = self.assets_dir / "qrs" / f"{normalized}.txt"

        return {
            "type": "file",
            "file_path": str(file_path),
            "caption": f"Archivo para {normalized}.",
        }


def demo() -> None:
    bot = CocolocoBot(Path("assets"))
    for message in ["hola", "Próximas funciones", "Ver flyer", "funcion-101"]:
        response = bot.handle_message(message)
        print(message, "->", response)


if __name__ == "__main__":
    demo()
