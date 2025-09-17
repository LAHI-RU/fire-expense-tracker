// Enhanced textarea with voice input capability
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { VoiceInputButton } from "./voice-input-button"
import { cn } from "@/lib/utils"

interface VoiceTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  rows?: number
  id?: string
  required?: boolean
}

export function VoiceTextarea({ value, onChange, placeholder, className, rows = 3, id, required }: VoiceTextareaProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleVoiceTranscript = (transcript: string) => {
    // Append voice input to existing text
    const newValue = localValue ? `${localValue} ${transcript}` : transcript
    setLocalValue(newValue)
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          id={id}
          value={localValue}
          onChange={handleTextChange}
          placeholder={placeholder}
          className={cn("pr-12", className)}
          rows={rows}
          required={required}
        />
        <div className="absolute top-2 right-2">
          <VoiceInputButton onTranscript={handleVoiceTranscript} size="sm" variant="ghost" />
        </div>
      </div>
    </div>
  )
}
