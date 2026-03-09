import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import Database from "better-sqlite3";
import fetch from "node-fetch";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

// --- Typ für Gemini ---
type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
};

// --- SQLite ---
const db = new Database("memorix.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS decks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    FOREIGN KEY(deck_id) REFERENCES decks(id)
  )
`).run();

// --- IPC: Decks ---
ipcMain.handle("getDecks", () => {
  const decks = db.prepare("SELECT * FROM decks").all();
  const cards = db.prepare("SELECT * FROM cards").all();

  return decks.map(deck => ({
    ...deck,
    cards: cards.filter(c => c.deck_id === deck.id)
  }));
});

ipcMain.handle("createDeck", (event, deck) => {
  const result = db.prepare("INSERT INTO decks (name) VALUES (?)")
    .run(deck.name);

  const deckId = result.lastInsertRowid;

  const insertCard = db.prepare(
    "INSERT INTO cards (deck_id, question, answer) VALUES (?, ?, ?)"
  );

  deck.cards.forEach(card => {
    insertCard.run(deckId, card.question, card.answer);
  });

  return deckId;
});

ipcMain.handle("updateDeck", (event, id, deck) => {
  db.prepare("UPDATE decks SET name = ? WHERE id = ?")
    .run(deck.name, id);

  db.prepare("DELETE FROM cards WHERE deck_id = ?").run(id);

  const insertCard = db.prepare(
    "INSERT INTO cards (deck_id, question, answer) VALUES (?, ?, ?)"
  );

  deck.cards.forEach(card => {
    insertCard.run(id, card.question, card.answer);
  });

  return true;
});

ipcMain.handle("deleteDeck", (event, id) => {
  db.prepare("DELETE FROM cards WHERE deck_id = ?").run(id);
  db.prepare("DELETE FROM decks WHERE id = ?").run(id);
  return true;
});

ipcMain.handle("evaluateAnswer", async (event, payload) => {
  const { question, answer, userAnswer } = payload;

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const prompt = `
Du bist ein Bewertungsmodell. Antworte ausschließlich mit gültigem JSON.

Bewerte die Nutzerantwort im Vergleich zur offiziellen Lösung.

{
  "score": 0-5,
  "assessment": "kurze Bewertung",
  "improvement": "konkreter Verbesserungsvorschlag"
}

Frage: ${question}
Lösung: ${answer}
Nutzer: ${userAnswer}
`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        }),
      }
    );

    const raw = await response.json();
    const data = raw as GeminiResponse;

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini Fehler:", err);
    return {
      score: 0,
      assessment: "Fehler bei der KI‑Auswertung.",
      improvement: "Bitte erneut versuchen.",
    };
  }
});

// --- Fenster erstellen ---
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:5173");
}

app.whenReady().then(createWindow);
