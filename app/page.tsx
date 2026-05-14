"use client";
import { useState } from 'react';

export default function Tubdle() {
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState<any[]>([]);

  return (
    <div className="main-wrapper">
      <div className="game-card">
        <h1 className="title">TUBDLE</h1>
        
        <input 
          className="station-input" 
          placeholder="Vilken station?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        <button className="guess-btn">GISSA</button>

        <div className="guesses-list" style={{marginTop: '20px'}}>
          {guesses.map((g, i) => (
            <div key={i} className="guess-row">
              <div className="guess-cell">{g.name}</div>
              <div className="guess-cell">{g.lines}</div>
              <div className="guess-cell">{g.dist}</div>
              <div className="guess-cell">{g.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}