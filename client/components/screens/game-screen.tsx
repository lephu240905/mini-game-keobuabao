"use client"

import { useState } from "react"

type Choice = "rock" | "paper" | "scissors" | null
type Result = "win" | "lose" | "draw" | null

const CHOICES = [
  { name: "rock", emoji: "✊", label: "ROCK" },
  { name: "paper", emoji: "✋", label: "PAPER" },
  { name: "scissors", emoji: "✌️", label: "SCISSORS" },
]

interface GameScreenProps {
  username: string
  avatar: string
  opponent: string | null
  gameMode: "computer" | "online" | null
  onBack: () => void
}

export default function GameScreen({ username, avatar, opponent, gameMode, onBack }: GameScreenProps) {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null)
  const [opponentChoice, setOpponentChoice] = useState<Choice>(null)
  const [result, setResult] = useState<Result>(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [gameActive, setGameActive] = useState(true)
  const [roundCount, setRoundCount] = useState(0)

  const getComputerChoice = (): Choice => {
    const choices: Choice[] = ["rock", "paper", "scissors"]
    return choices[Math.floor(Math.random() * 3)]
  }

  const determineWinner = (player: Choice, opponent: Choice): Result => {
    if (player === opponent) return "draw"
    if (
      (player === "rock" && opponent === "scissors") ||
      (player === "paper" && opponent === "rock") ||
      (player === "scissors" && opponent === "paper")
    ) {
      return "win"
    }
    return "lose"
  }

  const handleChoice = (choice: Choice) => {
    if (!gameActive || playerChoice) return

    setPlayerChoice(choice)

    const opponentChosen = gameMode === "computer" ? getComputerChoice() : "rock"
    setOpponentChoice(opponentChosen)

    const gameResult = determineWinner(choice, opponentChosen)
    setResult(gameResult)

    if (gameResult === "win") {
      setPlayerScore((prev) => prev + 1)
    } else if (gameResult === "lose") {
      setOpponentScore((prev) => prev + 1)
    }

    setRoundCount((prev) => prev + 1)
    setGameActive(false)
  }

  const handleNextRound = () => {
    setPlayerChoice(null)
    setOpponentChoice(null)
    setResult(null)
    setGameActive(true)
  }

  const handlePlayAgain = () => {
    setPlayerScore(0)
    setOpponentScore(0)
    setRoundCount(0)
    setPlayerChoice(null)
    setOpponentChoice(null)
    setResult(null)
    setGameActive(true)
  }

  const isGameOver = roundCount >= 5

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-blue-900/20 pointer-events-none" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in-left">
          <h2 className="text-4xl font-bold mb-2 animate-neon-glow">BATTLE ARENA</h2>
          <p className="text-purple-300">Round {roundCount + 1}</p>
        </div>

        {/* Score board */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Player 1 */}
          <div className="glass-pink rounded-2xl p-6 text-center animate-slide-in-left">
            <div className="text-4xl mb-2">{avatar}</div>
            <p className="font-bold text-pink-300 mb-2">{username}</p>
            <p className="text-3xl font-bold text-pink-300">{playerScore}</p>
          </div>

          {/* VS */}
          <div className="glass rounded-2xl p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-300 mb-2">VS</p>
              {result && (
                <p
                  className={`text-lg font-bold ${
                    result === "win" ? "text-green-400" : result === "lose" ? "text-red-400" : "text-yellow-400"
                  }`}
                >
                  {result.toUpperCase()}
                </p>
              )}
            </div>
          </div>

          {/* Player 2 */}
          <div className="glass-blue rounded-2xl p-6 text-center animate-slide-in-right">
            <div className="text-4xl mb-2">👤</div>
            <p className="font-bold text-blue-300 mb-2">{opponent || "Computer"}</p>
            <p className="text-3xl font-bold text-blue-300">{opponentScore}</p>
          </div>
        </div>

        {/* Game area */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Player choice */}
            <div className="text-center">
              <p className="text-sm font-semibold text-pink-300 mb-4">YOUR CHOICE</p>
              <div className="text-8xl mb-4 animate-flip-in">
                {playerChoice ? CHOICES.find((c) => c.name === playerChoice)?.emoji : "?"}
              </div>
              {playerChoice && (
                <p className="text-pink-300 font-bold">{CHOICES.find((c) => c.name === playerChoice)?.label}</p>
              )}
            </div>

            {/* Opponent choice */}
            <div className="text-center">
              <p className="text-sm font-semibold text-blue-300 mb-4">OPPONENT CHOICE</p>
              <div className="text-8xl mb-4 animate-flip-in" style={{ animationDelay: "0.2s" }}>
                {opponentChoice ? CHOICES.find((c) => c.name === opponentChoice)?.emoji : "?"}
              </div>
              {opponentChoice && (
                <p className="text-blue-300 font-bold">{CHOICES.find((c) => c.name === opponentChoice)?.label}</p>
              )}
            </div>
          </div>

          {/* Choice buttons */}
          {!isGameOver && (
            <div className="grid grid-cols-3 gap-4">
              {CHOICES.map((choice) => (
                <button
                  key={choice.name}
                  onClick={() => handleChoice(choice.name as Choice)}
                  disabled={!gameActive || playerChoice !== null}
                  className={`p-6 rounded-xl transition-all duration-300 font-bold text-lg ${
                    playerChoice === choice.name
                      ? "neon-button-pink scale-110"
                      : "neon-button disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  }`}
                >
                  <div className="text-4xl mb-2">{choice.emoji}</div>
                  {choice.label}
                </button>
              ))}
            </div>
          )}

          {/* Game over screen */}
          {isGameOver && (
            <div className="text-center space-y-6 animate-slide-in-left">
              <div>
                <p className="text-2xl font-bold text-purple-300 mb-2">GAME OVER</p>
                <p
                  className={`text-4xl font-bold ${
                    playerScore > opponentScore
                      ? "text-green-400"
                      : playerScore < opponentScore
                        ? "text-red-400"
                        : "text-yellow-400"
                  }`}
                >
                  {playerScore > opponentScore ? "YOU WIN!" : playerScore < opponentScore ? "YOU LOSE!" : "DRAW!"}
                </p>
              </div>
              <button onClick={handlePlayAgain} className="neon-button-pink text-lg px-8 py-3">
                PLAY AGAIN
              </button>
            </div>
          )}

          {/* Next round button */}
          {!isGameOver && playerChoice && (
            <div className="text-center mt-6">
              <button onClick={handleNextRound} className="neon-button-blue text-lg px-8 py-3">
                NEXT ROUND
              </button>
            </div>
          )}
        </div>

        {/* Back button */}
        <div className="text-center">
          <button onClick={onBack} className="text-foreground/60 hover:text-foreground transition-colors">
            ← Back to Mode Selection
          </button>
        </div>
      </div>
    </div>
  )
}
