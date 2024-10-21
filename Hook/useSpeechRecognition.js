"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [
    browserSupportsSpeechRecognition,
    setBrowserSupportsSpeechRecognition,
  ] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      setBrowserSupportsSpeechRecognition(true);

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(interimTranscript);
        if (finalTranscript) {
          setFinalTranscript(finalTranscript);
          recognition.stop();
          setIsListening(false);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
          setIsListening(true);
        } else {
          recognition.stop();
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isListening]);

  const startListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition || !recognitionRef.current) return;

    recognitionRef.current.start();
    setIsListening(true);
  }, [browserSupportsSpeechRecognition]);

  const stopListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition || !recognitionRef.current) return;

    recognitionRef.current.stop();
    recognitionRef.current.abort(); // Forcefully stop if needed
    recognitionRef.current = null;
    setIsListening(false);
  }, [browserSupportsSpeechRecognition]);

  return {
    isListening,
    transcript: finalTranscript,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition,
  };
}
