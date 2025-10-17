"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

interface ModeSelectionScreenProps {
  username: string
  onModeSelect: (mode: "computer" | "online", roomId?: string, opponent?: string) => void
  onBack: () => void
}

export default function ModeSelectionScreen({ username, onModeSelect, onBack }: ModeSelectionScreenProps) {
  const [showRoomInput, setShowRoomInput] = useState(false)
  const [roomId, setRoomId] = useState("")

  const handleComputerMode = () => {
    onModeSelect("computer")
  }

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(7).toUpperCase()
    onModeSelect("online", newRoomId, "Waiting for opponent...")
  }

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      onModeSelect("online", roomId, "Opponent")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-background to-purple-900/20 pointer-events-none" />
      <div className="absolute top-32 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-32 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-in-left">
          <h2 className="text-4xl font-bold mb-2 animate-neon-blue-glow">SELECT GAME MODE</h2>
          <p className="text-blue-300">Welcome, {username}</p>
        </div>

        {/* Mode cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Computer mode */}
          <div
            onClick={handleComputerMode}
            className="glass-blue rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 animate-slide-in-left"
          >
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-blue-300 mb-2">VS COMPUTER</h3>
            <p className="text-foreground/70 mb-6">Challenge the AI and test your skills</p>
            <button className="neon-button-blue w-full">PLAY NOW</button>
          </div>

          {/* Online mode */}
          <div className="glass-pink rounded-2xl p-8 animate-slide-in-right">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-pink-300 mb-2">ONLINE BATTLE</h3>
            <p className="text-foreground/70 mb-6">Play with friends or random opponents</p>
            <div className="space-y-3">
              <button onClick={handleCreateRoom} className="neon-button-pink w-full">
                CREATE ROOM
              </button>
              <button onClick={() => setShowRoomInput(!showRoomInput)} className="neon-button-pink w-full">
                JOIN ROOM
              </button>
            </div>
          </div>
        </div>

        {/* Room input */}
        {showRoomInput && (
          <div className="glass rounded-2xl p-6 mb-8 animate-slide-in-left">
            <label className="block text-sm font-semibold text-purple-300 mb-3">Enter Room Code</label>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Room code..."
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
                className="bg-input border-primary/50 text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-primary/50 rounded-lg flex-1"
                maxLength={10}
              />
              <button
                onClick={handleJoinRoom}
                disabled={!roomId.trim()}
                className="neon-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                JOIN
              </button>
            </div>
          </div>
        )}

        {/* Back button */}
        <div className="text-center">
          <button onClick={onBack} className="text-foreground/60 hover:text-foreground transition-colors">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
