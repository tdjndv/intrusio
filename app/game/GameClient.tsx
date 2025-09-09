'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

type Row = { word: string; groupid: string }
type Option = { word: string; groupid: string }
type Round = { prompt: Option; options: Option[]; correctGroupId: string }

function rnd<T>(a: T[]) { return a[Math.floor(Math.random() * a.length)] }
function shuffle<T>(a: T[]) {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[x[i], x[j]] = [x[j], x[i]]
  }
  return x
}

function buildRound(rows: Row[]): Round | null {
  if (!rows || rows.length < 5) return null

  const byGroup = new Map<string, string[]>()
  for (const r of rows) {
    if (!byGroup.has(r.groupid)) byGroup.set(r.groupid, [])
    byGroup.get(r.groupid)!.push(r.word)
  }

  const viable = [...byGroup.entries()].filter(([, ws]) => ws.length >= 2)
  if (!viable.length) return null

  const [gId, wordsInGroup] = rnd(viable)
  const gw = shuffle(wordsInGroup)
  const prompt = gw[0]
  const correct = gw.find(w => w !== prompt)
  if (!correct) return null

  const others = shuffle([...byGroup.entries()].filter(([id]) => id !== gId))
  const pool: Option[] = []
  for (const [ogId, ws] of others) {
    const w = rnd(ws)
    if (w && w !== prompt && w !== correct) pool.push({ word: w, groupid: ogId })
    if (pool.length >= 12) break
  }
  if (pool.length < 3) return null

  const options = shuffle([{ word: correct, groupid: gId }, ...shuffle(pool).slice(0, 3)])
  return { prompt: { word: prompt, groupid: gId }, options, correctGroupId: gId }
}

export default function GameClient({ lang, rows }: { lang: string; rows: Row[] }) {
  const router = useRouter()
  const [round, setRound] = useState<Round | null>(null)
  const [chosen, setChosen] = useState<Option | null>(null)
  const [score, setScore] = useState(0)
  const [q, setQ] = useState(0)

  const attempts = Math.max(0, (q - 1) + (chosen ? 1 : 0));
  const accuracyLabel = attempts ? `${Math.round((score / attempts) * 100)}%` : '—';

  // ⚡ Automatically start with first round
  useEffect(() => {
    if (rows.length) {
      const r = buildRound(rows)
      setRound(r)
      setQ(1)
    }
  }, [rows])

  const overlayVisible = !!chosen // only show after answering

  function nextRound() {
    const r = buildRound(rows)
    setChosen(null)
    setRound(r)
    setQ(x => x + 1)
  }

  function choose(opt: Option) {
    if (!round || chosen) return
    setChosen(opt)
    if (opt.groupid === round.correctGroupId) setScore(s => s + 1)
  }

  return (
    <div className='overlay'>
      <div className="playboard">
        <div className="game-header">
          <span className='lang-label'>{lang}</span>
            <span className="score-label">Accuracy: {accuracyLabel} · Q{q}</span>
        </div>

        {round && (
          <>
            <h2>
              {round.prompt.word}
            </h2>

            {/* 2×2 grid of buttons */}
            <div className="grid grid-cols-2 gap-4">
              {round.options.map((opt, i) => {
                const isPicked = chosen?.word === opt.word
                const isCorrect = opt.groupid === round.correctGroupId
                const status = chosen
                  ? isCorrect ? 'correct' : isPicked ? 'wrong' : ''
                  : ''

                return (
                  <button
                    key={i}
                    onClick={() => choose(opt)}
                    disabled={!!chosen}
                    className={`selection-button ${status}`}
                  >
                    {opt.word}
                  </button>
                )
              })}
            </div>
          </>
        )}
        <div>
          <button onClick={() => router.push('/')} className="green-button">
            ⬅ Back to Home
          </button>
        </div>
      </div>

      {/* Overlay (only after answer) */}
{overlayVisible && round && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="w-[min(92vw,560px)] rounded-2xl p-6 text-center shadow-lg bg-opacity-90">
      <div className="display-text-big">Round Result</div>

      {chosen!.groupid === round.correctGroupId ? (
        <div>
            <div className="display-text-small">✅ Correct!</div>
            <div>
                <button onClick={nextRound} className="green-button">Next</button>
            </div>
        </div>
      ) : (
        <div className="display-text-small">
          ❌ Wrong.<br />
          The correct answer was:
          <span className="font-bold block mt-1">
            {round.options.find(o => o.groupid === round.correctGroupId)?.word}
          </span>
          <button onClick={nextRound} className="red-button">
        Next
      </button>
        </div>
      )}
    </div>
  </div>
)}

    </div>
  )
}
