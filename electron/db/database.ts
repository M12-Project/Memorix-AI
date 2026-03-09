import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "memorix.db"));

db.exec(`
CREATE TABLE IF NOT EXISTS decks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deckId INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  FOREIGN KEY(deckId) REFERENCES decks(id)
);
`);

export default db;
