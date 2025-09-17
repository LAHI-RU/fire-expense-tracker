// Enhanced input with voice input capability
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { VoiceInputButton } from "./voice-input-button"
import { cn } from "@/lib/utils"

interface VoiceInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  type?: string
  id?: string
  required?: boolean
  step?: string
}

export function VoiceInput({
  value,
  onChange,
  placeholder,
  className,
  type = "text",
  id,
  required,
  step,
}: VoiceInputProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleVoiceTranscript = (transcript: string) => {
    // For number inputs, try to extract numbers from speech
    if (type === "number") {
      const numbers = transcript.match(/\d+\.?\d*/g)
      if (numbers && numbers.length > 0) {
        const newValue = numbers[0]
        setLocalValue(newValue)
        onChange(newValue)
      }
    } else {
      // For text inputs, replace the current value
      setLocalValue(transcript)
      onChange(transcript)
    }
  }

  // Don't show voice input for certain input types
  const showVoiceInput = !["date", "email", "password"].includes(type)

  return (
    <div className="flex gap-2">
      <Input
        id={id}
        type={type}
        value={localValue}
        onChange={handleTextChange}
        placeholder={placeholder}
        className={cn("flex-1", className)}
        required={required}
        step={step}
      />
      {showVoiceInput && <VoiceInputButton onTranscript={handleVoiceTranscript} size="sm" />}
    </div>
  )
}
