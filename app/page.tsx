"use client";

import { useState, useEffect } from 'react';

// --- DIN DATA FRÅN INDEX.HTML ---
const LINE_COLORS: { [key: string]: string } = {
  'T10':'#1565C0','T11':'#1565C0',
  'T13':'#E53935','T14':'#E53935',
  'T17':'#4CAF50','T18':'#4CAF50','T19':'#4CAF50',
};

// Här ser du att Vårberg är satt till 'underground: true' enligt din tidigare korrigering
const STATIONS = [
  {name:'Kungsträdgården', lines:['T10','T11'], distTC: 1, underground: true},
  {name:'T-Centralen', lines:['T10','T11','T13','T14','T17','T18','T19'], distTC: 0, underground: true},
  {name:'Vårberg', lines:['T13'], distTC: 18, underground: true},
  {name:'Skärholmen', lines:['T13'], distTC: 17, underground: true},
  // ... KLISTRA IN RESTEN AV DINA STATIONER FRÅN INDEX.HTML HÄR ...
];

const MAX_GUESSES = 8;

export default function TubdleGame() {
  const [target, setTarget] = useState<any>(null);
  const [guesses, setGuesses] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // Välj dagens station baserat på datum (Seed-logik från din HTML)
  useEffect(() => {
    const now = new Date();
    const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const pseudoRandom = Math.abs(Math.sin(seed) * 10000);
    const dailyStation = STATIONS[Math.floor(pseudoRandom % STATIONS.length)];
    setTarget(dailyStation);
  }, []);

  const submitGuess = async () => {
    if (gameOver || !inputValue) return;

    const station = STATIONS.find(s => s.name.toLowerCase() === inputValue.toLowerCase());
    if (!station) {
      alert("Stationen hittades inte!");
      return;
    }

    const newGuesses = [...guesses, station];
    setGuesses(newGuesses);
    setInputValue("");

    const isCorrect = station.name === target.name;
    const isOut = newGuesses.length >= MAX_GUESSES;

    if (isCorrect || isOut) {
      setGameOver(true);
      setWon(isCorrect);
      
      // SPARAR TILL DATABASEN (Kallar på din route.tsx)
      try {
        await fetch('/api/spara-spel', {
          method: 'POST',
          body: JSON.stringify({
            attempts: newGuesses.length,
            solved: isCorrect
          }),
        });
      } catch (e) {
        console.error("Kunde inte spara till DB", e);
      }
    }
  };

  if (!target) return null;

  return (
    <div className="main-wrapper">
      <div className="game-container">
        <h1 className="title">TUBDLE</h1>
        
        <div className="input-container">
          <input 
            type="text" 
            className="guess-input"
            placeholder="Skriv en station..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={gameOver}
            onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
          />
          <button className="guess-button" onClick={submitGuess} disabled={gameOver}>
            GISSA
          </button>
        </div>

        <div className="guesses-container">
          {guesses.map((s, i) => {
            const lineMatch = s.lines.some((l: string) => target.lines.includes(l));
            const lineAllMatch = s.lines.length === target.lines.length && s.lines.every((l: string) => target.lines.includes(l));
            
            return (
              <div key={i} className="guess-row">
                <div className={`guess-cell ${s.name === target.name ? 'cell-correct' : 'cell-wrong'}`}>
                  {s.name}
                </div>
                <div className={`guess-cell ${lineAllMatch ? 'cell-correct' : lineMatch ? 'cell-partial' : 'cell-wrong'}`}>
                  {s.lines.join(', ')}
                </div>
                <div className={`guess-cell ${s.distTC === target.distTC ? 'cell-correct' : 'cell-wrong'}`}>
                  {s.distTC} {s.distTC < target.distTC ? '↑' : s.distTC > target.distTC ? '↓' : ''}
                </div>
                <div className={`guess-cell ${s.underground === target.underground ? 'cell-correct' : 'cell-wrong'}`}>
                  {s.underground ? 'Under' : 'Över'}
                </div>
              </div>
            );
          })}
        </div>

        {gameOver && (
          <div className={won ? "win-banner" : "lose-banner"}>
            {won ? `Snyggt! Rätt svar var ${target.name}` : `Spelet slut. Rätt svar var ${target.name}`}
          </div>
        )}
      </div>
    </div>
  );
}