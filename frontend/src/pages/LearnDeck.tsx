import { useParams, useNavigate } from "react-router-dom";
import { useDecks } from "../context/DeckContext";
import { useState } from "react";

export default function LearnDeck() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { decks } = useDecks();

  const deck = decks.find(d => d.id === Number(id));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userInput, setUserInput] = useState("");

  const [evaluation, setEvaluation] = useState<{
    score: number;
    assessment: string;
    improvement: string;
  } | null>(null);

  if (!deck) {
    return <p>Deck nicht gefunden.</p>;
  }

  const card = deck.cards[currentIndex];

  const nextCard = () => {
    setShowAnswer(false);
    setUserInput("");
    setEvaluation(null);

    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/");
    }
  };

  async function handleSubmitAnswer() {
    if (!card) return;

    const result = await window.api.evaluateAnswer({
      question: card.question,
      answer: card.answer,
      userAnswer: userInput,
    });

    setEvaluation(result);
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Linke Seite */}
      <div style={{ flex: 1, padding: 40, borderRight: "1px solid #333" }}>
        <h1>{deck.name}</h1>

        <h2>Frage:</h2>
        <p style={{ fontSize: 24 }}>{card.question}</p>

        {showAnswer && (
          <>
            <h2>Antwort:</h2>
            <p style={{ fontSize: 24 }}>{card.answer}</p>
          </>
        )}

        {!showAnswer ? (
          <button onClick={() => setShowAnswer(true)} style={{ marginTop: 20 }}>
            Antwort anzeigen
          </button>
        ) : (
          <div style={{ marginTop: 20 }}>
            <button onClick={nextCard} style={{ marginRight: 10 }}>
              Gewusst
            </button>
            <button onClick={nextCard}>Nicht gewusst</button>
          </div>
        )}
      </div>

      {/* Rechte Seite: AI Chat */}
      <div style={{ flex: 1, padding: 40 }}>
        <h2>AI‑Chat</h2>

        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Deine Antwort..."
          style={{ width: "100%", height: 120 }}
        />

        <button onClick={handleSubmitAnswer} style={{ marginTop: 10 }}>
          Antwort bewerten lassen
        </button>

        {evaluation && (
          <div style={{ marginTop: 20 }}>
            <p><strong>Score:</strong> {evaluation.score}</p>
            <p><strong>Einschätzung:</strong> {evaluation.assessment}</p>
            <p><strong>Verbesserung:</strong> {evaluation.improvement}</p>
          </div>
        )}
      </div>

    </div>
  );
}
