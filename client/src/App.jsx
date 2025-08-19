import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Standings from "./pages/Standings";
import Fixtures from "./pages/Fixtures";
import LiveScores from "./pages/LiveScores";
import BPL from "./pages/BPL";
import { ChatbotProvider } from "./chatBot/ChatbotContext.jsx"
import ChatbotWrapper from "./chatBot/ChatbotWrapper.jsx";

function App() {
  return (
    <ChatbotProvider>
      <BrowserRouter>
        <Navbar />
        <div className="pt-16 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/live" element={<LiveScores />} />
            <Route path="/bpl" element={<BPL />} />
          </Routes>
          <ChatbotWrapper />
        </div>
      </BrowserRouter>
    </ChatbotProvider>
  );
}

export default App;
