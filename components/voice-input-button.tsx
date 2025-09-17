// Voice input button component
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { cn } from "@/lib/utils"

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function VoiceInputButton({
  onTranscript,
  className,
  size = "default",
  variant = "outline",
}: VoiceInputButtonProps) {
  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript, error } =
    useSpeechRecognition()
  const [hasTranscript, setHasTranscript] = useState(false)

  useEffect(() => {
    if (transcript && transcript.trim()) {
      setHasTranscript(true)
      onTranscript(transcript.trim())
    }
  }, [transcript, onTranscript])

  const handleClick = () => {
    if (isListening) {
      stopListening()
    } else {
      resetTranscript()
      setHasTranscript(false)
      startListening()
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleClick}
        className={cn(
          "transition-all duration-200",
          isListening && "bg-red-100 border-red-300 text-red-700 hover:bg-red-200",
          hasTranscript && !isListening && "bg-green-100 border-green-300 text-green-700 hover:bg-green-200",
          className,
        )}
        disabled={!!error}
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4" />
            {size !== "sm" && <span className="ml-2">Stop</span>}
          </>
        ) : hasTranscript ? (
          <>
            <Volume2 className="h-4 w-4" />
            {size !== "sm" && <span className="ml-2">Voice Added</span>}
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            {size !== "sm" && <span className="ml-2">Voice Input</span>}
          </>
        )}
      </Button>

      {isListening && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs text-red-600">Listening...</span>
        </div>
      )}

      {error && <span className="text-xs text-red-600">Voice input unavailable</span>}
    </div>
  )
}
