'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Link from "next/link"

import {track} from '@vercel/analytics'

export default function HomePage() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [defaultLang, setDefaultLang] = useState("en");

  const languages = [
    { code: 'en', label: '🇬🇧 English' },
    { code: 'fr', label: '🇫🇷 Français' },
    { code: 'de', label: '🇩🇪 Deutsch' },
    { code: 'es', label: '🇪🇸 Español' },
    { code: 'ru', label: '🇷🇺 Русский' },
    { code: 'zh', label: '🇨🇳 中文' },
    { code: 'ja', label: '🇯🇵 日本語' },
    { code: 'ko', label: '🇰🇷 한국어' },
  ];

  const startGame = () => {
    if (!selectedLang) {
      setError('Please select a language to start the game.');
      return;
    }
    track("the selected language is " + selectedLang)
    router.push(`/game?lang=${selectedLang}&defaultLang=${defaultLang}`);
  };

  return (
    <div className="overlay">
      <div className="playboard">
        <h1>SynMatch</h1>

        <div className="language-row">
          {languages.map(({ code, label }) => (
            <button
              key={code}
              className={`selection-button ${selectedLang === code ? 'selected' : ''}`}
              onClick={() => {
                setSelectedLang(code);
                setError(null);
              }}
            >
              {label}
            </button>
          ))}
        </div>
          
        <button className="green-button" onClick={startGame}>
          Start Game
        </button>

        <div>
          <select 
      value={defaultLang}
        onChange={(e) => setDefaultLang(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>

      <p className='display-text-extra-small'>
        In Game Translation to : {defaultLang}
      </p>
        </div>

        {error && <p className="error-message">{error}</p>}
        <footer className="footer">
      <Link href="/about">About</Link>
      <Link href="/privacy-policy">Privacy Policy</Link>
      <Link href="/contact">Contact</Link>
    </footer>
      </div>
    </div>
  );
}
