"use client"

import { useState } from "react"
import HomeScreen from "@/components/screens/home-screen"
import ModeSelectionScreen from "@/components/screens/mode-selection-screen"
import LobbyScreen from "@/components/screens/lobby-screen"
import GameScreen from "@/components/screens/game-screen"

type Screen = "home" | "mode" | "lobby" | "game"

interface GameState {
  username: string
  avatar: string
  gameMode: "computer" | "online" | null
  roomId: string | null
  opponent: string | null
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [gameState, setGameState] = useState<GameState>({
    username: "",
    avatar: "",
    gameMode: null,
    roomId: null,
    opponent: null,
  })

  const handleHomeComplete = (username: string, avatar: string) => {
    setGameState((prev) => ({ ...prev, username, avatar }))
    setCurrentScreen("mode")
  }

  const handleModeSelect = (mode: "computer" | "online", roomId?: string, opponent?: string) => {
    setGameState((prev) => ({
      ...prev,
      gameMode: mode,
      roomId: roomId || null,
      opponent: opponent || null,
    }))
    if (mode === "computer") {
      setCurrentScreen("game")
    } else {
      setCurrentScreen("lobby")
    }
  }

  const handleLobbyStart = () => {
    setCurrentScreen("game")
  }

  const handleBackToMode = () => {
    setGameState((prev) => ({
      ...prev,
      gameMode: null,
      roomId: null,
      opponent: null,
    }))
    setCurrentScreen("mode")
  }

  const handleBackToHome = () => {
    setGameState({
      username: "",
      avatar: "",
      gameMode: null,
      roomId: null,
      opponent: null,
    })
    setCurrentScreen("home")
  }

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {currentScreen === "home" && <HomeScreen onComplete={handleHomeComplete} />}
      {currentScreen === "mode" && (
        <ModeSelectionScreen username={gameState.username} onModeSelect={handleModeSelect} onBack={handleBackToHome} />
      )}
      {currentScreen === "lobby" && (
        <LobbyScreen
          username={gameState.username}
          avatar={gameState.avatar}
          opponent={gameState.opponent}
          onStart={handleLobbyStart}
          onBack={handleBackToMode}
        />
      )}
      {currentScreen === "game" && (
        <GameScreen
          username={gameState.username}
          avatar={gameState.avatar}
          opponent={gameState.opponent}
          gameMode={gameState.gameMode}
          onBack={handleBackToMode}
        />
      )}
    </main>
  )
}
