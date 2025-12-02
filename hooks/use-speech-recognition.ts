export function useSpeechRecognition() {
  return {
    transcript: "",
    isListening: false,
    isSupported: false,
    startListening: () => {},
    stopListening: () => {},
    resetTranscript: () => {},
    error: "removed" as string | null,
  }
}
