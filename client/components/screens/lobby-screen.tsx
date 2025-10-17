"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

const STICKERS = ["🔥", "💯", "😎", "🚀", "⚡", "💪", "🎯", "👑"]

interface LobbyScreenProps {
  username: string
  avatar: string
  opponent: string | null
  onStart: () => void
  onBack: () => void
}

export default function LobbyScreen({ username, avatar, opponent, onStart, onBack }: LobbyScreenProps) {
  const [messages, setMessages] = useState<Array<{ user: string; text: string }>>([
    { user: "System", text: "Welcome to the lobby!" },
  ])
  const [messageInput, setMessageInput] = useState("")
  const [floatingStickers, setFloatingStickers] = useState<
    Array<{ id: string; sticker: string; x: number; y: number }>
  >([])

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages((prev) => [...prev, { user: username, text: messageInput }])
      setMessageInput("")
    }
  }

  const handleThrowSticker = (sticker: string) => {
    const id = Math.random().toString()
    const x = Math.random() * 80 + 10
    const y = Math.random() * 60 + 20

    setFloatingStickers((prev) => [...prev, { id, sticker, x, y }])

    setTimeout(() => {
      setFloatingStickers((prev) => prev.filter((s) => s.id !== id))
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-background to-purple-900/20 pointer-events-none" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Floating stickers */}
      {floatingStickers.map((item) => (
        <div
          key={item.id}
          className="fixed text-4xl animate-float-up pointer-events-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
        >
          {item.sticker}
        </div>
      ))}

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in-left">
          <h2 className="text-4xl font-bold mb-2 animate-neon-pink-glow">LOBBY</h2>
          <p className="text-pink-300">Waiting for battle...</p>
        </div>

        {/* Main content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Players section */}
          <div className="md:col-span-1 space-y-4">
            <div className="glass-pink rounded-2xl p-6 animate-slide-in-left">
              <h3 className="text-lg font-bold text-pink-300 mb-4">PLAYERS</h3>

              {/* Player 1 */}
              <div className="glass rounded-lg p-4 mb-4">
                <div className="text-3xl mb-2">{avatar}</div>
                <p className="font-semibold text-foreground">{username}</p>
                <p className="text-xs text-foreground/60">Ready</p>
              </div>

              {/* Player 2 */}
              <div className="glass rounded-lg p-4">
                <div className="text-3xl mb-2 animate-pulse">👤</div>
                <p className="font-semibold text-foreground">{opponent}</p>
                <p className="text-xs text-foreground/60 animate-pulse">Connecting...</p>
              </div>
            </div>

            {/* Stickers */}
            <div className="glass-blue rounded-2xl p-4">
              <h4 className="text-sm font-bold text-blue-300 mb-3">THROW STICKERS</h4>
              <div className="grid grid-cols-4 gap-2">
                {STICKERS.map((sticker) => (
                  <button
                    key={sticker}
                    onClick={() => handleThrowSticker(sticker)}
                    className="text-2xl p-2 glass rounded-lg hover:scale-110 transition-transform duration-200"
                  >
                    {sticker}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat section */}
          <div className="md:col-span-2 glass rounded-2xl p-6 flex flex-col h-96 animate-slide-in-right">
            <h3 className="text-lg font-bold text-purple-300 mb-4">CHAT</h3>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
              {messages.map((msg, idx) => (
                <div key={idx} className="text-sm">
                  <span className="text-purple-300 font-semibold">{msg.user}:</span>
                  <span className="text-foreground ml-2">{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Say something..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="bg-input border-primary/50 text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-primary/50 rounded-lg flex-1"
              />
              <button onClick={handleSendMessage} className="neon-button-pink px-4">
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <button onClick={onStart} className="neon-button-pink text-lg px-8 py-3">
            START BATTLE
          </button>
          <button onClick={onBack} className="neon-button px-8 py-3">
            BACK
          </button>
        </div>
      </div>
    </div>
  )
}
