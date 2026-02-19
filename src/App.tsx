import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import ResultsPage from "./components/ResultsPage";
import type { AppView, AnalysisResults } from "./lib/types";

export default function App() {
  const [view, setView] = useState<AppView>("landing");
  const [results, setResults] = useState<AnalysisResults | null>(null);

  const handleDataReady = (res: AnalysisResults) => {
    setResults(res);
    setView("results");
    window.scrollTo(0, 0);
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
          window.scrollTo(0, 0);
        }}
      />

      {view === "landing" && (
        <LandingPage onDataReady={handleDataReady} />
      )}

      {view === "results" && results && <ResultsPage results={results} />}

      <Footer />
    </div>
  );
}
