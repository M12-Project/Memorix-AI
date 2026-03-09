import { Routes, Route } from "react-router-dom";
import DeckList from "./pages/DeckList";
import CreateDeck from "./pages/CreateDeck";
import LearnDeck from "./pages/LearnDeck";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DeckList />} />
      <Route path="/create" element={<CreateDeck />} />
      <Route path="/edit/:id" element={<CreateDeck />} />
      <Route path="/learn/:id" element={<LearnDeck />} />
    </Routes>
  );
}
