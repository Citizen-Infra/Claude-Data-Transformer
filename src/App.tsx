import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import AnalyzeStep from "./components/AnalyzeStep";
import ResultsPage from "./components/ResultsPage";
import type { AppView, ParsedConversation, AnalysisResults } from "./lib/types";

export default function App() {
  const [view, setView] = useState<AppView>("landing");
  const [apiKey, setApiKey] = useState("");
  const [useAI, setUseAI] = useState(false);
  const [conversations, setConversations] = useState<ParsedConversation[] | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);

  const handleDataReady = (key: string, convs: ParsedConversation[], ai: boolean) => {
    setApiKey(key);
    setUseAI(ai);
    setConversations(convs);
    setView("flow");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: "16px",
        color: "#1a1a1a",
      }}
    >
      <Header
        view={view}
        onLogoClick={() => {
          setView("landing");
          setResults(null);
          setConversations(null);
          window.scrollTo(0, 0);
        }}
      />

      {view === "landing" && (
        <LandingPage onDataReady={handleDataReady} />
      )}

      {view === "flow" && conversations && (
        <AnalyzeStep
          conversations={conversations}
          apiKey={apiKey}
          useAI={useAI}
          onComplete={(res) => {
            setResults(res);
            setView("results");
            window.scrollTo(0, 0);
          }}
        />
      )}

      {view === "results" && results && <ResultsPage results={results} />}

      <Footer />
    </div>
  );
}
