"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
  }

  function handlePhotoSelected(_file: File) {
    // /api/search/photo exige une session : on invite le visiteur à se connecter.
    router.push("/register?next=recherche-photo");
  }

  function handleVoiceClick() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("La recherche vocale n'est pas disponible sur ce navigateur.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      router.push(`/recherche?q=${encodeURIComponent(transcript)}`);
    };
    recognition.start();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-stretch flex-1 min-w-0 max-w-3xl h-12 bg-white rounded-full border border-white/20 overflow-hidden"
    >
      <Icon name="search" className="w-5 h-5 text-night/70 self-center ml-4 shrink-0" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un produit, une entreprise, un service, un freelance…"
        className="flex-1 min-w-0 font-sans text-sm text-night placeholder:text-night/40 px-3 focus:outline-none bg-transparent"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handlePhotoSelected(file);
        }}
      />
      <div className="flex shrink-0 bg-night border-l border-edge">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-0.5 px-4 text-white hover:bg-card border-r border-edge"
          title="Recherche par photo"
        >
          <Icon name="camera" className="w-4 h-4" />
          <span className="font-sans text-[11px]">Photo</span>
        </button>
        <button
          type="button"
          onClick={handleVoiceClick}
          className={`flex flex-col items-center justify-center gap-0.5 px-4 text-white hover:bg-card ${listening ? "animate-pulse text-sun" : ""}`}
          title="Recherche vocale"
        >
          <Icon name="mic" className="w-4 h-4" />
          <span className="font-sans text-[11px]">Vocal</span>
        </button>
      </div>
    </form>
  );
}
