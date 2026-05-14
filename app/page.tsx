"use client";

import { useState, useEffect } from 'react';

const LINE_COLORS: { [key: string]: string } = {
  'T10':'#1565C0','T11':'#1565C0','T13':'#E53935','T14':'#E53935','T17':'#4CAF50','T18':'#4CAF50','T19':'#4CAF50',
};

// KLISTRA IN HELA DIN LISTA FRÅN INDEX.HTML HÄR
 const STATIONS = [
      // Blå linjen
      {name:'Kungsträdgården',      lines:['T10','T11'], distTC: 1, underground: true},
      {name:'T-Centralen',          lines:['T10','T11','T13','T14','T17','T18','T19'], distTC: 0, underground: true},
      {name:'Rådhuset',             lines:['T10','T11'], distTC: 1, underground: true},
      {name:'Fridhemsplan',         lines:['T10','T11','T17','T18','T19'], distTC: 2, distTC2: 5, underground: true, opened:1952},
      {name:'Stadshagen',           lines:['T10','T11'], distTC: 3, underground: true},
      {name:'Västra skogen',        lines:['T10','T11'], distTC: 4, underground: true},
      {name:'Huvudsta',             lines:['T10'],       distTC: 5, underground: true},
      {name:'Solna strand',         lines:['T10'],       distTC: 6, underground: true},
      {name:'Sundbybergs centrum',  lines:['T10'],       distTC: 7, underground: true},
      {name:'Duvbo',                lines:['T10'],       distTC: 8, underground: true},
      {name:'Rissne',               lines:['T10'],       distTC: 9, underground: true},
      {name:'Rinkeby',              lines:['T10'],       distTC:10, underground: true},
      {name:'Tensta',               lines:['T10'],       distTC:11, underground: true},
      {name:'Hjulsta',              lines:['T10'],       distTC:12, underground: true},
      {name:'Solna centrum',        lines:['T11'],       distTC: 5, underground: true},
      {name:'Näckrosen',            lines:['T11'],       distTC: 6, underground: true},
      {name:'Hallonbergen',         lines:['T11'],       distTC: 7, underground: true},
      {name:'Kista',                lines:['T11'],       distTC: 8, underground: false},
      {name:'Husby',                lines:['T11'],       distTC: 9, underground: true},
      {name:'Akalla',               lines:['T11'],       distTC:10, underground: true},
      // Röda linjen
      {name:'Mörby centrum',        lines:['T14'],       distTC: 7, underground: true},
      {name:'Danderyds sjukhus',    lines:['T14'],       distTC: 6, underground: true},
      {name:'Bergshamra',           lines:['T14'],       distTC: 5, underground: true},
      {name:'Universitetet',        lines:['T14'],       distTC: 4, underground: true},
      {name:'Tekniska högskolan',   lines:['T14'],       distTC: 3, underground: true},
      {name:'Stadion',              lines:['T14'],       distTC: 2, underground: true},
      {name:'Ropsten',              lines:['T13'],       distTC: 4, underground: false},
      {name:'Gärdet',               lines:['T13'],       distTC: 3, underground: true},
      {name:'Karlaplan',            lines:['T13'],       distTC: 2, underground: true},
      {name:'Östermalmstorg',       lines:['T13','T14'], distTC: 1, underground: true},
      {name:'Gamla stan',           lines:['T13','T14','T17','T18','T19'], distTC: 1, underground: false},
      {name:'Slussen',              lines:['T13','T14','T17','T18','T19'], distTC: 2, underground: true},
      {name:'Mariatorget',          lines:['T13','T14'], distTC: 3, underground: true},
      {name:'Zinkensdamm',          lines:['T13','T14'], distTC: 4, underground: true},
      {name:'Hornstull',            lines:['T13','T14'], distTC: 5, underground: true},
      {name:'Liljeholmen',          lines:['T13','T14'], distTC: 6, underground: true},
      {name:'Midsommarkransen',     lines:['T14'],       distTC: 7, underground: true},
      {name:'Telefonplan',          lines:['T14'],       distTC: 8, underground: false},
      {name:'Hägerstensåsen',       lines:['T14'],       distTC: 9, underground: false},
      {name:'Västertorp',           lines:['T14'],       distTC:10, underground: false},
      {name:'Fruängen',             lines:['T14'],       distTC:11, underground: false},
      {name:'Aspudden',             lines:['T13'],       distTC: 7, underground: true},
      {name:'Örnsberg',             lines:['T13'],       distTC: 8, underground: false},
      {name:'Axelsberg',            lines:['T13'],       distTC: 9, underground: false},
      {name:'Mälarhöjden',          lines:['T13'],       distTC:10, underground: true},
      {name:'Bredäng',              lines:['T13'],       distTC:11, underground: false},
      {name:'Sätra',                lines:['T13'],       distTC:12, underground: false},
      {name:'Skärholmen',           lines:['T13'],       distTC:13, underground: true},
      {name:'Vårberg',              lines:['T13'],       distTC:14, underground: false},
      {name:'Vårby gård',           lines:['T13'],       distTC:15, underground: false},
      {name:'Masmo',                lines:['T13'],       distTC:16, underground: true},
      {name:'Fittja',               lines:['T13'],       distTC:17, underground: false},
      {name:'Alby',                 lines:['T13'],       distTC:18, underground: true},
      {name:'Hallunda',             lines:['T13'],       distTC:19, underground: false},
      {name:'Norsborg',             lines:['T13'],       distTC:20, underground: false},
      // Gröna linjen
      {name:'Hässelby strand',      lines:['T19'],       distTC:20, underground: false},
      {name:'Hässelby gård',        lines:['T19'],       distTC:19, underground: false},
      {name:'Johannelund',          lines:['T19'],       distTC:18, underground: false},
      {name:'Vällingby',            lines:['T19'],       distTC:17, underground: false},
      {name:'Råcksta',              lines:['T19'],       distTC:16, underground: false},
      {name:'Blackeberg',           lines:['T19'],       distTC:15, underground: false},
      {name:'Islandstorget',        lines:['T17'], distTC:14, underground: false},
      {name:'Ängbyplan',            lines:['T17'], distTC:13, underground: false},
      {name:'Åkeshov',              lines:['T17','T19'], distTC:12, underground: false},
      {name:'Brommaplan',           lines:['T17','T19'], distTC:11, underground: false},
      {name:'Abrahamsberg',         lines:['T17','T19'], distTC:10, underground: false},
      {name:'Stora mossen',         lines:['T17','T19'], distTC: 9, underground: false},
      {name:'Alvik',                lines:['T17','T18','T19'], distTC: 8, underground: false},
      {name:'Kristineberg',         lines:['T17','T18','T19'], distTC: 7, underground: false},
      {name:'Thorildsplan',         lines:['T17','T18','T19'], distTC: 6, underground: false},
      {name:'S:t Eriksplan',        lines:['T17','T18','T19'], distTC: 4, underground: true},
      {name:'Odenplan',             lines:['T17','T18','T19'], distTC: 3, underground: true},
      {name:'Rådmansgatan',         lines:['T17','T18','T19'], distTC: 2, underground: true},
      {name:'Hötorget',             lines:['T17','T18','T19'], distTC: 1, underground: true},
      {name:'Medborgarplatsen',     lines:['T17','T18','T19'], distTC: 3, underground: true},
      {name:'Skanstull',            lines:['T17','T18','T19'], distTC: 4, underground: true},
      {name:'Gullmarsplan',         lines:['T17','T18','T19'], distTC: 5, underground: false},
      {name:'Skärmarbrink',         lines:['T17','T18'],       distTC: 6, underground: false},
      {name:'Hammarbyhöjden',       lines:['T17'],             distTC: 7, underground: false},
      {name:'Björkhagen',           lines:['T17'],             distTC: 8, underground: false},
      {name:'Kärrtorp',             lines:['T17'],             distTC: 9, underground: false},
      {name:'Bagarmossen',          lines:['T17'],             distTC:10, underground: true},
      {name:'Skarpnäck',            lines:['T17'],             distTC:11, underground: true},
      {name:'Blåsut',               lines:['T18'],             distTC: 7, underground: false},
      {name:'Sandsborg',            lines:['T18'],             distTC: 8, underground: false},
      {name:'Skogskyrkogården',     lines:['T18'],             distTC: 9, underground: false},
      {name:'Tallkrogen',           lines:['T18'],             distTC:10, underground: false},
      {name:'Gubbängen',            lines:['T18'],             distTC:11, underground: false},
      {name:'Hökarängen',           lines:['T18'],             distTC:12, underground: false},
      {name:'Farsta',               lines:['T18'],             distTC:13, underground: false},
      {name:'Farsta strand',        lines:['T18'],             distTC:14, underground: false},
      {name:'Globen',               lines:['T19'],             distTC: 6, underground: false},
      {name:'Enskede gård',         lines:['T19'],             distTC: 7, underground: false},
      {name:'Sockenplan',           lines:['T19'],             distTC: 8, underground: false},
      {name:'Svedmyra',             lines:['T19'],             distTC: 9, underground: false},
      {name:'Stureby',              lines:['T19'],             distTC:10, underground: false},
      {name:'Bandhagen',            lines:['T19'],             distTC:11, underground: false},
      {name:'Högdalen',             lines:['T19'],             distTC:12, underground: false},
      {name:'Rågsved',              lines:['T19'],             distTC:13, underground: false},
      {name:'Hagsätra',             lines:['T19'],             distTC:14, underground: false}
    ];

export default function TubdleGame() {
  const [target, setTarget] = useState<any>(null);
  const [guesses, setGuesses] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const now = new Date();
    const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const pseudoRandom = Math.abs(Math.sin(seed) * 10000);
    setTarget(STATIONS[Math.floor(pseudoRandom % STATIONS.length)]);
  }, []);

  const handleGuess = () => {
    const s = STATIONS.find(x => x.name.toLowerCase() === input.toLowerCase());
    if (s && !guesses.find(g => g.name === s.name)) {
      const newGuesses = [s, ...guesses];
      setGuesses(newGuesses);
      setInput("");
      if (s.name === target.name || newGuesses.length >= 8) setGameOver(true);
    }
  };

  if (!target) return null;

  return (
    <div className="main-wrapper">
      <div className="game-container">
        <h1 className="title">TUBDLE</h1>
        
        <div className="input-container">
          <input 
            className="guess-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
            placeholder="Gissa en station..."
            disabled={gameOver}
          />
          <button className="guess-button" onClick={handleGuess} disabled={gameOver}>GISSA</button>
        </div>

        <div className="guesses-container">
          {guesses.map((s, i) => (
            <div key={i} className="guess-row">
              <div className={`guess-cell ${s.name === target.name ? 'cell-correct' : 'cell-wrong'}`}>
                {/* Här skapas de färgade prickarna */}
                <span style={{display:'inline-flex', gap:'4px', marginRight:'10px'}}>
                  {s.lines.map((l:string) => (
                    <span key={l} className="line-dot" style={{backgroundColor: LINE_COLORS[l] || '#ccc', width:'10px', height:'10px', borderRadius:'50%'}}></span>
                  ))}
                </span>
                {s.name}
              </div>
              <div className={`guess-cell ${s.lines.some((l:any)=>target.lines.includes(l)) ? (s.lines.every((l:any)=>target.lines.includes(l)) && s.lines.length === target.lines.length ? 'cell-correct' : 'cell-partial') : 'cell-wrong'}`}>
                {s.lines.join(', ')}
              </div>
              <div className={`guess-cell ${s.distTC === target.distTC ? 'cell-correct' : 'cell-wrong'}`}>
                {s.distTC} {s.distTC < target.distTC ? '↑' : s.distTC > target.distTC ? '↓' : ''}
              </div>
              <div className={`guess-cell ${s.underground === target.underground ? 'cell-correct' : 'cell-wrong'}`}>
                {s.underground ? 'Under' : 'Över'}
              </div>
            </div>
          ))}
        </div>

        {gameOver && (
          <div id="endBanner">
            <div className={guesses[0].name === target.name ? "win-banner" : "lose-banner"}>
              {guesses[0].name === target.name ? "Rätt! 🎉" : "Game Over"}
              <div style={{fontSize: '16px'}}>Dagens station var {target.name}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}