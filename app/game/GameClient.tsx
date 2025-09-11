"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Types
type Row = {
  word: string
  groupid: string
  lang: string
  sample_sentence: string
}

type Option = {
  word: string // always in learning language
  groupid: string
}

type Round = {
  prompt: Option
  options: Option[]
  correctGroupId: string
  correctAsnwer: string
  sampleSentence: string
}

// Helpers
function rnd<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)]
}

function shuffle<T>(a: T[]): T[] {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[x[i], x[j]] = [x[j], x[i]]
  }
  return x
}

function buildRound(
  rows: Row[],
  lang: string,
  defaultLang: string
): Round | null {
  if (!rows || rows.length < 5) return null

  // group rows by groupid
  const byGroup = new Map<string, Row[]>()
  for (const r of rows) {
    if (!byGroup.has(r.groupid)) byGroup.set(r.groupid, [])
    byGroup.get(r.groupid)!.push(r)
  }

  // only groups with >= 2 learning words
  const viable = [...byGroup.entries()].filter(
    ([, ws]) => ws.filter((r) => r.lang === lang).length >= 2
  )
  if (!viable.length) return null

  // pick a group
  const [gId, wordsInGroup] = rnd(viable)
  const gw = shuffle(wordsInGroup.filter((r) => r.lang === lang))
  const promptRow = gw[0]
  const correctRow = gw.find((r) => r.word !== promptRow.word)
  if (!promptRow || !correctRow) return null

  // distractors from other groups
  const others = shuffle([...byGroup.entries()].filter(([id]) => id !== gId))
  const pool: Option[] = []
  for (const [ogId, ws] of others) {
    const choice = rnd(ws.filter((r) => r.lang === lang))
    if (choice) pool.push({ word: choice.word, groupid: ogId })
    if (pool.length >= 12) break
  }
  if (pool.length < 3) return null

  // build options: all learning language
  const options = shuffle([
    { word: correctRow.word, groupid: gId },
    ...shuffle(pool).slice(0, 3),
  ])

  return {
    prompt: { word: promptRow.word, groupid: gId },
    options,
    correctGroupId: gId,
    correctAsnwer: correctRow.word,
    sampleSentence: correctRow.sample_sentence,
  }
}

// Component
export default function GameClient({
  lang,
  rows,
  defaultLang,
}: {
  lang: string
  rows: Row[]
  defaultLang: string
}) {
  const router = useRouter()
  const [round, setRound] = useState<Round | null>(null)
  const [chosen, setChosen] = useState<Option | null>(null)
  const [score, setScore] = useState(0)
  const [q, setQ] = useState(0)

  const attempts = Math.max(0, q - 1 + (chosen ? 1 : 0))
  const accuracyLabel = attempts
    ? `${Math.round((score / attempts) * 100)}%`
    : "—"

  // Start first round
  useEffect(() => {
    if (rows.length) {
      const r = buildRound(rows, lang, defaultLang)
      setRound(r)
      setQ(1)
    }
  }, [rows, lang, defaultLang])

  function nextRound() {
    const r = buildRound(rows, lang, defaultLang)
    setChosen(null)
    setRound(r)
    setQ((x) => x + 1)
  }

  function choose(opt: Option) {
    if (!round || chosen) return
    setChosen(opt)
    if (opt.groupid === round.correctGroupId) {
      setScore((s) => s + 1)
    }
  }

  // helper: translation lookup
  function findTranslation(groupid: string) {
    return rows.find(
      (r) => r.groupid === groupid && r.lang === defaultLang
    )?.word
  }

  if (!round) return null

  const isCorrect = chosen?.groupid === round.correctGroupId
        const promptColor = !chosen ? undefined : isCorrect ? "#16a34a" : "#dc2626" // green/red

  return (
    <div className="overlay">
      <div className="playboard">
        <div className="game-header">
          <span className="lang-label">{lang}</span>
          <span className="score-label">
            Accuracy: {accuracyLabel} · Q{q}
          </span>
        </div>

        {/* Prompt */}
        

        <h2
          style={{ color: promptColor }}
          className="text-2xl font-bold mb-4"
        >
          {round!.prompt.word}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {round.options.map((opt, i) => {
            const isPicked = chosen?.word === opt.word
            const isAnswer = opt.groupid === round.correctGroupId
            const status = chosen
              ? isAnswer
                ? "correct"
                : isPicked
                ? "wrong"
                : ""
              : ""

            return (
              <div key={i} className="flex flex-col items-center">
                <button
                  onClick={() => choose(opt)}
                  disabled={!!chosen}
                  className={`selection-button ${status}`}
                >
                  {opt.word}
                </button>
                {/* Show translations after answer */}
                {chosen && (
                  <span className="display-text-small">
                    {findTranslation(opt.groupid) || "—"}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Show sample sentence only after answering */}
        {chosen && (
          <p className="display-text-small">
            Correct answer: {round.correctAsnwer} <br />
            {round.sampleSentence}
          </p>
        )}

        {/* Next button only after choosing */}
        {chosen && (
          <div>
            <button onClick={nextRound} className="green-button">
              Next Question
            </button>
          </div>
        )}

        <div className="mt-6">
          <button onClick={() => router.push("/")} className="green-button">
            ⬅ Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
