import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDecks } from "../context/DeckContext";

export default function CreateDeck() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { decks, addDeck, updateDeck } = useDecks();

  const editing = Boolean(id);
  const existingDeck = editing
    ? decks.find(d => d.id === Number(id))
    : null;

  const [name, setName] = useState(existingDeck?.name || "");
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [cards, setCards] = useState(existingDeck?.cards || []);

  useEffect(() => {
    if (editing && existingDeck) {
      setName(existingDeck.name);
      setCards(existingDeck.cards);
    }
  }, [editing, existingDeck]);

  const addCard = () => {
    if (!question.trim() || !answer.trim()) return;

    setCards([...cards, { question, answer }]);
    setQuestion("");
    setAnswer("");
  };

  const deleteCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const startEditCard = (index: number) => {
    const card = cards[index];
    setQuestion(card.question);
    setAnswer(card.answer);
    setEditingCardIndex(index);
  };

  const updateCard = () => {
    if (editingCardIndex === null) return;

    const updated = [...cards];
    updated[editingCardIndex] = { question, answer };

    setCards(updated);
    setQuestion("");
    setAnswer("");
    setEditingCardIndex(null);
  };

  const saveDeck = () => {
    if (!name.trim() || cards.length === 0) return;

    if (editing) {
      updateDeck(Number(id), { name, cards });
    } else {
      addDeck({ name, cards });
    }

    navigate("/");
  };

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={() => navigate("/")}
        style={{ marginBottom: 20, padding: "8px 14px", borderRadius: 12, border: "1px solid #ccc", background: "white", cursor: "pointer" }}
      >
        Zurück
      </button>
      <h1>{editing ? "Deck bearbeiten" : "Neues Deck erstellen"}</h1>

      <input
        placeholder="Deck-Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: "300px", marginBottom: 20, display: "block" }}
      />

      <div style={{ display: "flex", gap: "40px" }}>
        <div style={{ flex: 1 }}>
          <h2>Karte {editingCardIndex === null ? "hinzufügen" : "bearbeiten"}</h2>

          <input
            placeholder="Frage"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />

          <input
            placeholder="Antwort"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            style={{ width: "100%", marginBottom: 20 }}
          />

          {editingCardIndex === null ? (
            <button onClick={addCard}>Karte hinzufügen</button>
          ) : (
            <button onClick={updateCard}>Karte aktualisieren</button>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h2>Erstellte Karten</h2>

          {cards.length === 0 && <p>Noch keine Karten.</p>}

          {cards.length > 0 && (
            <table
              border={1}
              cellPadding={8}
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Frage</th>
                  <th>Antwort</th>
                  <th>Aktion</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{card.question}</td>
                    <td>{card.answer}</td>
                    <td>
                      <button onClick={() => deleteCard(i)}>
                        Löschen
                      </button>
                      <button onClick={() => startEditCard(i)} style={{ marginLeft: 10 }}>
                        Bearbeiten
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <button
        onClick={saveDeck}
        style={{ marginTop: 30, padding: "10px 20px" }}
      >
        {editing ? "Änderungen speichern" : "Deck speichern"}
      </button>
    </div>
  );
}
