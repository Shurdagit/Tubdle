'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  STATIONS,
  LINE_TOOLTIPS,
  type Station,
  countLetters,
  getUniqueColors,
  getSeed,
  getStationBySeed,
  getEffectiveDist,
  getDistDisplay,
} from './data';

const MAX_GUESSES = 8;

// ─── TYPER ───────────────────────────────────────────────────────────────────
type GuessRow = {
  station: Station;
  isTarget: boolean;
  lineMatch: boolean;
  linePartial: boolean;
  distDisplay: string;
  distMatch: boolean;
  underMatch: boolean;
  underText: string;
  lettersGuess: number;
  lettersArrow: string;
  lettersMatch: boolean;
  uniqueColors: string[];
};

type SavedState = {
  seed: number;
  guesses: string[];
  gameOver: boolean;
  won: boolean;
};

// ─── SPELLOGIK ───────────────────────────────────────────────────────────────
function buildGuessRow(station: Station, target: Station): GuessRow {
  const tLines = target.lines.slice().sort().join(',');
  const gLines = station.lines.slice().sort().join(',');
  const lineMatch = tLines === gLines;
  const linePartial = !lineMatch && station.lines.some((l) => target.lines.includes(l));

  const effectiveDist = getEffectiveDist(station, target);
  const distDiff = effectiveDist - target.distTC;
  const distMatch = distDiff === 0;
  const distDisplay =
    getDistDisplay(station) + (distMatch ? '' : distDiff < 0 ? ' ↑' : ' ↓');

  const underMatch = station.underground === target.underground;
  const underText = station.underground ? 'Under' : 'Över';

  const lettersGuess = countLetters(station.name);
  const lettersDiff = lettersGuess - countLetters(target.name);
  const lettersArrow = lettersDiff === 0 ? '' : lettersDiff < 0 ? ' ↑' : ' ↓';
  const lettersMatch = lettersDiff === 0;

  return {
    station,
    isTarget: station.name === target.name,
    lineMatch,
    linePartial,
    distDisplay,
    distMatch,
    underMatch,
    underText,
    lettersGuess,
    lettersArrow,
    lettersMatch,
    uniqueColors: getUniqueColors(station.lines),
  };
}

// ─── KOMPONENT ───────────────────────────────────────────────────────────────
export default function TubdlePage() {
  // Allt som beror på datum räknas ut klientsidan för att undvika hydreringsfel
  const [target, setTarget]       = useState<Station | null>(null);
  const [yesterday, setYesterday] = useState<Station | null>(null);
  const [currentSeed, setCurrentSeed] = useState<number>(0);

  const [guesses, setGuesses]           = useState<Station[]>([]);
  const [guessRows, setGuessRows]       = useState<GuessRow[]>([]);
  const [gameOver, setGameOver]         = useState(false);
  const [won, setWon]                   = useState(false);
  const [inputValue, setInputValue]     = useState('');
  const [autocompleteItems, setAutocompleteItems] = useState<Station[]>([]);
  const [showAutocomplete, setShowAutocomplete]   = useState(false);
  const [feedbackMsg, setFeedbackMsg]   = useState('');
  const [timerDisplay, setTimerDisplay] = useState('--:--:--');
  const [openTooltipIdx, setOpenTooltipIdx] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const userIdRef = useRef<string>('');

  // ── Initiera datum + ladda sparad speldata ──────────────────────────────
  useEffect(() => {
    const now = new Date();
    const seed = getSeed(now);
    setCurrentSeed(seed);

    const todayTarget = getStationBySeed(seed);
    setTarget(todayTarget);

    const yday = new Date(now);
    yday.setDate(yday.getDate() - 1);
    setYesterday(getStationBySeed(getSeed(yday)));

    // Generera/hämta anonymt användar-ID
    let uid = localStorage.getItem('tubdle_user_id') ?? '';
    if (!uid) {
      uid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('tubdle_user_id', uid);
    }
    userIdRef.current = uid;

    // Ladda sparad speldata
    try {
      const raw = localStorage.getItem('tubdle_save');
      if (raw) {
        const saved: SavedState = JSON.parse(raw);
        if (saved.seed === seed) {
          const restored: Station[] = [];
          const restoredRows: GuessRow[] = [];
          saved.guesses.forEach((name) => {
            const s = STATIONS.find((st) => st.name === name);
            if (s) {
              restored.push(s);
              restoredRows.unshift(buildGuessRow(s, todayTarget));
            }
          });
          setGuesses(restored);
          setGuessRows(restoredRows);
          if (saved.gameOver) {
            setGameOver(true);
            setWon(saved.won);
          }
        } else {
          localStorage.removeItem('tubdle_save');
        }
      }
    } catch (e) {
      console.error('Kunde inte läsa sparad speldata:', e);
    }
  }, []);

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    function tick() {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = +tomorrow - +now;
      if (diff <= 0) { setTimerDisplay('00:00:00'); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimerDisplay(
        `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Stäng autocomplete vid klick utanför ─────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.input-row')) setShowAutocomplete(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // ── Stäng tooltip på mobil vid klick utanför ─────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (window.matchMedia('(hover: hover)').matches) return;
      if (!(e.target as HTMLElement).closest('.line-pill-wrap')) setOpenTooltipIdx(null);
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  // ── Spara spelstatus ─────────────────────────────────────────────────────
  const saveState = useCallback(
    (newGuesses: Station[], isGameOver: boolean, isWon: boolean) => {
      const state: SavedState = {
        seed: currentSeed,
        guesses: newGuesses.map((g) => g.name),
        gameOver: isGameOver,
        won: isWon,
      };
      localStorage.setItem('tubdle_save', JSON.stringify(state));

      // Skicka även till servern (databasen)
      if (userIdRef.current) {
        fetch(`/spara-spel?userId=${userIdRef.current}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state),
        }).catch((err) => console.error('Kunde inte spara till server:', err));
      }
    },
    [currentSeed]
  );

  // ── Hantera textinput ─────────────────────────────────────────────────────
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInputValue(val);
    setFeedbackMsg('');
    if (!val.trim()) { setShowAutocomplete(false); return; }
    const guessedNames = guesses.map((g) => g.name);
    const matches = STATIONS.filter(
      (s) =>
        s.name.toLowerCase().startsWith(val.trim().toLowerCase()) &&
        !guessedNames.includes(s.name)
    );
    setAutocompleteItems(matches);
    setShowAutocomplete(matches.length > 0);
  }

  function selectStation(station: Station) {
    setInputValue(station.name);
    setShowAutocomplete(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') makeGuess();
    if (e.key === 'Escape') setShowAutocomplete(false);
  }

  // ── Gissa ────────────────────────────────────────────────────────────────
  function makeGuess() {
    if (gameOver || !target) return;
    const val = inputValue.trim();
    const station = STATIONS.find((s) => s.name.toLowerCase() === val.toLowerCase());

    if (!station) {
      setFeedbackMsg('Station hittades inte – välj ur listan.');
      return;
    }
    if (guesses.find((g) => g.name === station.name)) {
      setFeedbackMsg(`Du har redan gissat ${station.name}!`);
      return;
    }

    const newGuesses = [...guesses, station];
    const row = buildGuessRow(station, target);

    setGuessRows((prev) => [row, ...prev]); // nyast överst
    setGuesses(newGuesses);
    setInputValue('');
    setShowAutocomplete(false);
    setFeedbackMsg('');

    const isWon = station.name === target.name;
    const isGameOver = isWon || newGuesses.length >= MAX_GUESSES;

    if (isGameOver) {
      setGameOver(true);
      setWon(isWon);
    }

    saveState(newGuesses, isGameOver, isWon);
  }

  // ── Tooltip-toggle (mobil) ────────────────────────────────────────────────
  function handlePillClick(idx: number) {
    if (window.matchMedia('(hover: hover)').matches) return;
    setOpenTooltipIdx((prev) => (prev === idx ? null : idx));
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="page-wrap">
      <div className="game-card">

        {/* HEADER */}
        <div className="game-header">
          <div className="game-title">
            TUB<span>DLE</span>
          </div>
          <div className="game-tagline-wrap">
            <div className="tagline-line" />
            <div className="game-tagline">
              GISSA DAGENS TUNNELBANESTATION &nbsp;·&nbsp; NY STATION VARJE DAG!
            </div>
            <div className="tagline-line right" />
          </div>
        </div>

        {/* INSTRUKTIONER */}
        <div className="instructions-panel">
          <div className="instructions-row">
            VARJE GISSNING GER DIG LEDTRÅDAR OM:
            <div className="hint-chips-row">
              <div className="hint-chip">LINJE</div>
              <div className="hint-chip">ANTAL STATIONER FRÅN T-CENTRALEN</div>
              <div className="hint-chip">LÄGE ÖVER/UNDER JORD</div>
              <div className="hint-chip">ANTAL BOKSTÄVER I NAMNET</div>
            </div>
          </div>
          <div className="instructions-row">
            PIL ↑ (UPP) BETYDER ATT STATIONEN HAR ETT HÖGRE VÄRDE &nbsp;·&nbsp; PIL ↓ (NED) BETYDER ETT LÄGRE VÄRDE
          </div>
        </div>

        {/* LINJE-PILLS */}
        <div className="line-legend">
          {LINE_TOOLTIPS.map((lt, i) => (
            <div
              key={lt.label}
              className={`line-pill-wrap${openTooltipIdx === i ? ' tooltip-open' : ''}`}
            >
              <div
                className="line-pill"
                style={{ background: lt.color }}
                onClick={() => handlePillClick(i)}
              >
                {lt.label}
              </div>
              <div
                className="line-tooltip"
                style={{ borderColor: lt.borderColor, color: lt.borderColor }}
              >
                <div className="tooltip-title">Slutstationer</div>
                {lt.lines.map((l) => (
                  <div key={l.id} className="tooltip-line-row">
                    <span className="tooltip-line-label" style={{ background: lt.color }}>
                      {l.id}
                    </span>
                    <span className="tooltip-stations">{l.ends}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="input-row">
          <input
            ref={inputRef}
            className="station-input"
            type="text"
            placeholder="Skriv en station..."
            autoComplete="off"
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={gameOver}
          />
          <button className="guess-btn" onClick={makeGuess} disabled={gameOver}>
            GISSA
          </button>
          {showAutocomplete && (
            <div className="autocomplete-list">
              {autocompleteItems.map((s) => (
                <div
                  key={s.name}
                  className="autocomplete-item"
                  onClick={() => selectStation(s)}
                >
                  <span style={{ display: 'flex', gap: 4 }}>
                    {getUniqueColors(s.lines).map((c, ci) => (
                      <span
                        key={ci}
                        className="autocomplete-dot"
                        style={{ background: c }}
                      />
                    ))}
                  </span>
                  {s.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MELLANSEKTIONEN */}
        <div className="mid-section">
          <div className="color-legend">
            <span className="color-box color-correct">RÄTT</span>
            <span className="color-box color-partial">DELVIS RÄTT</span>
            <span className="color-box color-wrong">FEL</span>
          </div>
          <div className="feedback-msg">{feedbackMsg}</div>
          <div className="attempts-counter">
            Försök: {guesses.length} / {MAX_GUESSES}
          </div>
          <hr className="divider" />
          <div className="col-headers">
            <div className="col-header">GISSAD STATION</div>
            <div className="col-header">LINJE</div>
            <div className="col-header">FRÅN TC</div>
            <div className="col-header">LÄGE</div>
            <div className="col-header">BOKSTÄVER</div>
          </div>
        </div>

        {/* GISSNINGAR */}
        <div className="guesses-list">
          {guessRows.map((row, i) => (
            <div key={`${row.station.name}-${i}`} className="guess-row">
              {/* Stationsnamn */}
              <div className={`guess-cell ${row.isTarget ? 'cell-correct' : 'cell-wrong'}`}>
                <span style={{ display: 'inline-flex', gap: 4, marginRight: 10 }}>
                  {row.uniqueColors.map((c, ci) => (
                    <span
                      key={ci}
                      className="line-dot"
                      style={{ background: c, marginRight: 0 }}
                    />
                  ))}
                </span>
                {row.station.name}
              </div>
              {/* Linje */}
              <div
                className={`guess-cell ${
                  row.lineMatch ? 'cell-correct' : row.linePartial ? 'cell-partial' : 'cell-wrong'
                }`}
              >
                {row.station.lines.join(', ')}
              </div>
              {/* Avstånd */}
              <div className={`guess-cell ${row.distMatch ? 'cell-correct' : 'cell-wrong'}`}>
                {row.distDisplay}
              </div>
              {/* Under/Över jord */}
              <div className={`guess-cell ${row.underMatch ? 'cell-correct' : 'cell-wrong'}`}>
                {row.underText}
              </div>
              {/* Bokstäver */}
              <div className={`guess-cell ${row.lettersMatch ? 'cell-correct' : 'cell-wrong'}`}>
                {row.lettersGuess}{row.lettersArrow}
              </div>
            </div>
          ))}
        </div>

        {/* SLUTBANNER */}
        {gameOver && (
          <div>
            {won ? (
              <div className="win-banner">
                <div className="banner-title">Rätt! 🎉</div>
                <div className="banner-sub">
                  Du hittade <strong>{target?.name}</strong> på {guesses.length} försök!
                </div>
              </div>
            ) : (
              <div className="lose-banner">
                <div className="banner-title">Game over</div>
                <div className="banner-sub">
                  Dagens station var <strong>{target?.name}</strong>. Försök igen imorgon!
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="footer-container">
        <div className="footer">
          GÅRDAGENS STATION: <span>{yesterday?.name ?? '...'}</span>
          <br />· · ·<br />
          <div className="timer-box">
            <span className="timer-label">Ny station om&nbsp;</span>
            <span className="timer-value">{timerDisplay}</span>
          </div>
        </div>
      </div>

      {/* EST. BY SHURDA */}
      <div className="est-text">Est. by Shurda.</div>
    </div>
  );
}