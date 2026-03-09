import { createContext, useContext, useState, useEffect } from "react";

export type Card = {
  question: string;
  answer: string;
};

export type Deck = {
  id: number;
  name: string;
  cards: Card[];
};

type DeckContextType = {
  decks: Deck[];
  addDeck: (deck: Omit<Deck, "id">) => void;
  updateDeck: (id: number, deck: Omit<Deck, "id">) => void;
  deleteDeck: (id: number) => void;
};

const DeckContext = createContext<DeckContextType | null>(null);

export function DeckProvider({ children }: { children: React.ReactNode }) {
  const [decks, setDecks] = useState<Deck[]>([]);

  // 🔥 WICHTIG: useEffect MUSS HIER REIN
  useEffect(() => {
    if (window.api?.getDecks) {
      window.api.getDecks().then(setDecks);
    }
  }, []);

  const addDeck = (deck: Omit<Deck, "id">) => {
    // Wenn SQLite aktiv ist:
    if (window.api?.createDeck) {
      window.api.createDeck(deck).then((id: number) => {
        setDecks(prev => [...prev, { id, ...deck }]);
      });
      return;
    }

    // Fallback ohne DB:
    setDecks(prev => [...prev, { id: Date.now(), ...deck }]);
  };

  const updateDeck = (id: number, updated: Omit<Deck, "id">) => {
    if (window.api?.updateDeck) {
      window.api.updateDeck(id, updated).then(() => {
        setDecks(prev =>
          prev.map(d => (d.id === id ? { id, ...updated } : d))
        );
      });
      return;
    }

    setDecks(prev =>
      prev.map(d => (d.id === id ? { id, ...updated } : d))
    );
  };

  const deleteDeck = (id: number) => {
    if (window.api?.deleteDeck) {
      window.api.deleteDeck(id).then(() => {
        setDecks(prev => prev.filter(d => d.id !== id));
      });
      return;
    }

    setDecks(prev => prev.filter(d => d.id !== id));
  };

  return (
    <DeckContext.Provider value={{ decks, addDeck, updateDeck, deleteDeck }}>
      {children}
    </DeckContext.Provider>
  );
}

export function useDecks() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("useDecks must be used inside DeckProvider");
  return ctx;
}