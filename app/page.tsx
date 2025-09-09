'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const languages = [
    { code: 'en', label: '🇬🇧 English' },
    { code: 'fr', label: '🇫🇷 Français' },
    { code: 'de', label: '🇩🇪 Deutsch' },
    { code: 'es', label: '🇪🇸 Español' },
    { code: 'ru', label: '🇷🇺 Русский' },
    { code: 'zh', label: '🇨🇳 中文' },
  ];

  const startGame = () => {
    if (!selectedLang) {
      setError('Please select a language to start the game.');
      return;
    }
    router.push(`/game?lang=${selectedLang}`);
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

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
