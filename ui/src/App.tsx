import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Confetti from "./pages/Confetti";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/confetti" element={<Confetti />} />
    </Routes>
  );
}


