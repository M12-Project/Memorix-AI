import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDecks } from "../context/DeckContext";

export default function DeckList() {
  const navigate = useNavigate();
  const { decks, deleteDeck } = useDecks();
  const [activeDeck, setActiveDeck] = useState<number | null>(null);

  const toggleDeckOptions = (id: number) => {
    setActiveDeck(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-white text-slate-950 overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Memorix‑AI
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Erstelle deine Lernkarten, verwalte Decks und starte gezieltes Lernen — alles in einem klaren, modernen Interface.
          </p>
        </header>

        <div className="mt-14 flex gap-6 overflow-x-auto pb-4" style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <button
            className="group relative flex min-h-[18rem] min-w-[18rem] flex-col items-center justify-center gap-4 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-lg shadow-slate-200/10 transition hover:-translate-y-1 hover:shadow-xl flex-shrink-0"
            style={{ minWidth: "9rem", minHeight: "8rem", borderRadius: "2rem" }}
            onClick={() => navigate("/create")}
          >
            <div className="grid h-16 w-16 place-items-center rounded-full bg-cyan-500 text-4xl font-semibold text-white shadow-lg shadow-cyan-500/25">
              +
            </div>
            <span className="text-lg font-semibold">Neues Deck</span>
          </button>

          {decks.map(deck => (
            <article
              key={deck.id}
              className="relative flex-shrink-0 min-w-[18rem] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-lg shadow-slate-200/50"
              style={{ minWidth: "18rem", flexShrink: 0, borderRadius: "2rem" }}
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-slate-950">{deck.name}</h2>
                <p className="text-sm text-slate-500">
                  {deck.cards.length} Karte{deck.cards.length === 1 ? "" : "n"}
                </p>
              </div>

              <button
                className="absolute right-4 bottom-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md shadow-slate-200/50 transition hover:bg-slate-100"
                onClick={() => toggleDeckOptions(deck.id)}
                aria-label="Deck Optionen"
              >
                <span className="text-lg">⚙️</span>
              </button>

              {activeDeck === deck.id && (
                <div className="absolute right-4 bottom-20 z-10 w-44 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70">
                  <button
                    className="mb-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 text-left transition hover:bg-slate-200"
                    onClick={() => navigate(`/edit/${deck.id}`)}
                  >
                    Bearbeiten
                  </button>
                  <button
                    className="mb-2 w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 text-left transition hover:bg-red-100"
                    onClick={() => deleteDeck(deck.id)}
                  >
                    Löschen
                  </button>
                  <button
                    className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 text-left transition hover:bg-slate-200"
                    onClick={() => navigate(`/learn/${deck.id}`)}
                  >
                    Starten
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>

        {decks.length === 0 && (
          <div className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center text-slate-600 shadow-lg shadow-slate-200/50">
            Noch keine Decks vorhanden.
          </div>
        )}
      </div>
    </div>
  );
}
