"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

const AVATARS = ["🎮", "⚡", "🔮", "🎯", "🌟", "💎", "🚀", "👾"]

interface HomeScreenProps {
  onComplete: (username: string, avatar: string) => void
}

export default function HomeScreen({ onComplete }: HomeScreenProps) {
  const [username, setUsername] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])

  const handleStart = () => {
    if (username.trim()) {
      onComplete(username, selectedAvatar)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-pink-900/20 pointer-events-none" />

      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-12 animate-slide-in-left">
          <h1 className="text-5xl font-bold mb-2 animate-neon-glow">CYBER RPS</h1>
          <p className="text-pink-300 text-lg animate-neon-pink-glow">Rock Paper Scissors Online</p>
        </div>

        {/* Main card */}
        <div className="glass rounded-2xl p-8 space-y-8 animate-slide-in-right">
          {/* Username input */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-blue-300">Enter Your Username</label>
            <Input
              type="text"
              placeholder="Player name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleStart()}
              className="bg-input border-primary/50 text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-primary/50 rounded-lg"
              maxLength={20}
            />
          </div>

          {/* Avatar selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-blue-300">Choose Your Avatar</label>
            <div className="grid grid-cols-4 gap-3">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`p-4 rounded-lg transition-all duration-300 text-2xl ${
                    selectedAvatar === avatar ? "glass-pink scale-110 animate-pulse-scale" : "glass hover:glass-pink"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            disabled={!username.trim()}
            className="w-full neon-button-pink disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4"
          >
            START GAME
          </button>
        </div>

        {/* Footer text */}
        <p className="text-center text-foreground/50 text-sm mt-8">Challenge players worldwide in real-time</p>
      </div>
    </div>
  )
}
