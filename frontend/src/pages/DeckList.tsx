import { useNavigate } from "react-router-dom";
import { useDecks } from "../context/DeckContext";

export default function DeckList() {
  const navigate = useNavigate();
  const { decks, deleteDeck } = useDecks();

  return (
    <div style={{ padding: 20 }}>
      <h1>Memorix‑AI</h1>

      <button
        onClick={() => navigate("/create")}
        style={{ marginBottom: 20 }}
      >
        Neues Deck
      </button>

      {decks.length === 0 && <p>Noch keine Decks vorhanden.</p>}

      <ul>
        {decks.map(deck => (
          <li key={deck.id} style={{ marginBottom: 10 }}>
          {deck.name} ({deck.cards.length} Karten)

          <button
            style={{ marginLeft: 10 }}
            onClick={() => navigate(`/edit/${deck.id}`)}
          >
            Bearbeiten
          </button>

          <button
            style={{ marginLeft: 10, color: "red" }}
            onClick={() => deleteDeck(deck.id)}
          >
            Löschen
          </button>

          <button
            style={{ marginLeft: 10 }}
            onClick={() => navigate(`/learn/${deck.id}`)}
          >
            Starten
          </button>

        </li>
        ))}
      </ul>
    </div>
  );
}
