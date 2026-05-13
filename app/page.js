"use client"; // Måste vara med i Next.js när vi använder interaktiva saker som useState

import { useState, useEffect } from 'react';
// Importera din CSS om den inte redan är importerad i layout.js
import './globals.css'; 

// --- DIN DATA ---
const LINE_COLORS = {
  'T10':'#1565C0','T11':'#1565C0',
  'T13':'#E53935','T14':'#E53935',
  'T17':'#4CAF50','T18':'#4CAF50','T19':'#4CAF50',
};

// Klistra in HELA din STATIONS-array här
const STATIONS = [
  {name:'Kungsträdgården', lines:['T10','T11'], distTC: 1, underground: true},
  {name:'T-Centralen', lines:['T10','T11','T13','T14','T17','T18','T19'], distTC: 0, underground: true},
  // ... (KLISTRA IN ALLA DINA STATIONER) ...
];

const MAX_GUESSES = 8;
const currentDate = new Date();
const CURRENT_SEED = currentDate.getFullYear() * 10000 + (currentDate.getMonth() + 1) * 100 + currentDate.getDate();

function getDailyStation() {
  const pseudoRandom = Math.abs(Math.sin(CURRENT_SEED) * 10000);
  return STATIONS[Math.floor(pseudoRandom) % STATIONS.length];
}

function getYesterdayStation() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const seed = yesterday.getFullYear() * 10000 + (yesterday.getMonth() + 1) * 100 + yesterday.getDate();
  const pseudoRandom = Math.abs(Math.sin(seed) * 10000);
  return STATIONS[Math.floor(pseudoRandom) % STATIONS.length];
}

const TARGET = getDailyStation();
const YESTERDAY = getYesterdayStation();

// --- HJÄLPFUNKTIONER ---
function countLetters(name) { return name.replace(/[^a-zåäöA-ZÅÄÖ]/g, '').length; }
function getUniqueColors(lines) { return [...new Set(lines.map(l => LINE_COLORS[l] || '#888'))]; }
function getEffectiveDist(station) {
  if (station.distTC2 !== undefined) {
    const d1 = Math.abs(station.distTC - TARGET.distTC);
    const d2 = Math.abs(station.distTC2 - TARGET.distTC);
    return d1 <= d2 ? station.distTC : station.distTC2;
  }
  return station.distTC;
}

export default function TubdleGame() {
  // --- REACT STATES (Ersätter dina globala variabler) ---
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [matches, setMatches] = useState([]);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [timer, setTimer] = useState('--:--:--');
  const [isLoaded, setIsLoaded] = useState(false); // För att vänta på localStorage

  // --- KOPPLING TILL DATABASEN ---
  const saveToDatabase = async (attempts, isSolved) => {
    try {
      await fetch('/api/spara-spel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attempts: attempts, solved: isSolved })
      });
      console.log("Sparat till databasen!");
    } catch (error) {
      console.error("Kunde inte spara till databasen", error);
    }
  };

  // --- STARTA SPELET & LADDA FRÅN LOCALSTORAGE ---
  useEffect(() => {
    const savedDataJson = localStorage.getItem('tubdle_save');
    if (savedDataJson) {
      const savedData = JSON.parse(savedDataJson);
      if (savedData.seed === CURRENT_SEED) {
        setGameOver(savedData.gameOver);
        setWon(savedData.won);
        const loadedGuesses = savedData.guesses.map(name => STATIONS.find(s => s.name === name)).filter(Boolean);
        setGuesses(loadedGuesses);
      } else {
        localStorage.removeItem('tubdle_save');
      }
    }
    setIsLoaded(true);
  }, []);

  // --- TIMER LOGIK ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow - now;
      if (diff <= 0) return setTimer('00:00:00');
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimer(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- SÖKFUNKTION ---
  const handleInput = (e) => {
    const val = e.target.value;
    setInputVal(val);
    setFeedbackMsg('');
    if (!val.trim()) { setMatches([]); return; }
    
    const guessedNames = guesses.map(g => g.name);
    const foundMatches = STATIONS.filter(s => s.name.toLowerCase().startsWith(val.toLowerCase()) && !guessedNames.includes(s.name));
    setMatches(foundMatches);
  };

  // --- GISSA FUNKTION ---
  const makeGuess = (stationToGuess) => {
    if (gameOver) return;
    
    let station = stationToGuess;
    if (!station) {
       station = STATIONS.find(s => s.name.toLowerCase() === inputVal.trim().toLowerCase());
    }

    if (!station) { setFeedbackMsg('Station hittades inte – välj ur listan.'); return; }
    if (guesses.find(g => g.name === station.name)) { setFeedbackMsg(`Du har redan gissat ${station.name}!`); return; }

    const newGuesses = [station, ...guesses]; // Lägg till högst upp
    setGuesses(newGuesses);
    setInputVal('');
    setMatches([]);

    let isGameNowOver = false;
    let isWon = false;

    if (station.name === TARGET.name) {
      isGameNowOver = true;
      isWon = true;
    } else if (newGuesses.length >= MAX_GUESSES) {
      isGameNowOver = true;
      isWon = false;
    }

    if (isGameNowOver) {
      setGameOver(true);
      setWon(isWon);
      saveToDatabase(newGuesses.length, isWon); // SKICKA TILL DATABASEN!
    }

    // Spara till localStorage
    localStorage.setItem('tubdle_save', JSON.stringify({
      seed: CURRENT_SEED,
      guesses: newGuesses.map(g => g.name).reverse(), // Bevara kronologisk ordning i localStorage
      gameOver: isGameNowOver,
      won: isWon
    }));
  };

  if (!isLoaded) return null; // Vänta tills localStorage är laddat så vi inte får en ful blinkning

  return (
    <div className="page-wrap">
      <div className="game-card">
        
        <div className="game-header">
          <div className="game-title">TUB<span>DLE</span></div>
          <div className="game-tagline-wrap">
            <div className="tagline-line"></div>
            <div className="game-tagline">GISSA DAGENS TUNNELBANESTATION &nbsp;·&nbsp; NY STATION VARJE DAG!</div>
            <div className="tagline-line right"></div>
          </div>
        </div>

        {/* --- INPUT --- */}
        <div className="input-row">
          <input 
            className="station-input" 
            value={inputVal}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') makeGuess();
              if (e.key === 'Escape') setMatches([]);
            }}
            disabled={gameOver}
            type="text" 
            placeholder="Skriv en station..." 
          />
          <button className="guess-btn" onClick={() => makeGuess()} disabled={gameOver}>GISSA</button>
          
          {/* Autocomplete */}
          {matches.length > 0 && (
            <div className="autocomplete-list" style={{display: 'block'}}>
              {matches.map(s => (
                <div key={s.name} className="autocomplete-item" onClick={() => { setInputVal(s.name); makeGuess(s); }}>
                  <span style={{display:'flex', gap:'4px'}}>
                    {getUniqueColors(s.lines).map(color => (
                      <span key={color} className="autocomplete-dot" style={{background: color}}></span>
                    ))}
                  </span>
                  {s.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- FEEDBACK & STATS --- */}
        <div className="mid-section">
          <div className="feedback-msg">{feedbackMsg}</div>
          <div className="attempts-counter">Försök: {guesses.length} / {MAX_GUESSES}</div>
          <hr className="divider" />
          <div className="col-headers">
            <div className="col-header">GISSAD STATION</div>
            <div className="col-header">LINJE</div>
            <div className="col-header">FRÅN TC</div>
            <div className="col-header">LÄGE</div>
            <div className="col-header">BOKSTÄVER</div>
          </div>
        </div>

        {/* --- GISSNINGAR --- */}
        <div className="guesses-list">
          {guesses.map((station, index) => {
            const tLines = TARGET.lines.slice().sort().join(',');
            const gLines = station.lines.slice().sort().join(',');
            const lineMatch = tLines === gLines;
            const linePartial = !lineMatch && station.lines.some(l => TARGET.lines.includes(l));

            const distDiff = getEffectiveDist(station) - TARGET.distTC;
            const distMatch = distDiff === 0;

            const underMatch = station.underground === TARGET.underground;
            const lettersDiff = countLetters(station.name) - countLetters(TARGET.name);
            const lettersMatch = lettersDiff === 0;

            return (
              <div key={index} className="guess-row">
                <div className={`guess-cell ${station.name === TARGET.name ? 'cell-correct' : 'cell-wrong'}`}>
                  {station.name}
                </div>
                <div className={`guess-cell ${lineMatch ? 'cell-correct' : linePartial ? 'cell-partial' : 'cell-wrong'}`}>
                  {station.lines.join(', ')}
                </div>
                <div className={`guess-cell ${distMatch ? 'cell-correct' : 'cell-wrong'}`}>
                  {station.distTC} {distDiff !== 0 && (distDiff < 0 ? '↑' : '↓')}
                </div>
                <div className={`guess-cell ${underMatch ? 'cell-correct' : 'cell-wrong'}`}>
                  {station.underground ? 'Under' : 'Över'}
                </div>
                <div className={`guess-cell ${lettersMatch ? 'cell-correct' : 'cell-wrong'}`}>
                  {countLetters(station.name)} {lettersDiff !== 0 && (lettersDiff < 0 ? '↑' : '↓')}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- BANNER --- */}
        {gameOver && (
          <div id="endBanner">
            {won ? (
              <div className="win-banner">
                <div className="banner-title">Rätt! 🎉</div>
                <div className="banner-sub">Du hittade <strong>{TARGET.name}</strong> på {guesses.length} försök!</div>
              </div>
            ) : (
              <div className="lose-banner">
                <div className="banner-title">Game over</div>
                <div className="banner-sub">Dagens station var <strong>{TARGET.name}</strong>. Försök igen imorgon!</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="footer-container">
        <div className="footer">
          GÅRDAGENS STATION: <span>{YESTERDAY.name}</span>
          <br/>&middot; &middot; &middot;<br/>
          <div className="timer-box"><span className="timer-label">Ny station om&nbsp;</span><span className="timer-value">{timer}</span></div>
        </div>
      </div>
      <div className="est-text" style={{position: 'fixed', bottom: '5px'}}>Est. by Shurda.</div>
    </div>
  );
}