"use client";
import { RefObject, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

interface Props {
  audioRef: RefObject<HTMLAudioElement | null>;
  onTimeUpdate: (t: number) => void;
  duration: number;
}

// Free sample audio for the player
const SAMPLE_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export default function MediaPlayer({ audioRef, onTimeUpdate, duration }: Props) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [audioDuration, setAudioDuration] = useState(duration);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const handleTime = () => { setCurrentTime(el.currentTime); onTimeUpdate(el.currentTime); };
    const handleDuration = () => setAudioDuration(el.duration || duration);
    const handleEnded = () => setPlaying(false);
    el.addEventListener("timeupdate", handleTime);
    el.addEventListener("loadedmetadata", handleDuration);
    el.addEventListener("ended", handleEnded);
    return () => { el.removeEventListener("timeupdate", handleTime); el.removeEventListener("loadedmetadata", handleDuration); el.removeEventListener("ended", handleEnded); };
  }, [audioRef, onTimeUpdate, duration]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); } else { el.play().catch(() => {}); setPlaying(true); }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
    onTimeUpdate(t);
  };

  const toggleMute = () => {
    if (audioRef.current) audioRef.current.muted = !muted;
    setMuted(m => !m);
  };

  const pct = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <audio ref={audioRef} src={SAMPLE_AUDIO} preload="metadata" />
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-90 flex-shrink-0"
          style={{ background: "var(--accent)" }}
        >
          {playing ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
        </button>

        <span className="text-xs font-mono text-gray-500 flex-shrink-0 w-10 text-right">
          {formatTimestamp(currentTime)}
        </span>

        <div className="flex-1 relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: "var(--accent)" }}
          />
          <input
            type="range"
            min={0}
            max={audioDuration || duration}
            step={0.5}
            value={currentTime}
            onChange={seek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          />
        </div>

        <span className="text-xs font-mono text-gray-500 flex-shrink-0 w-10">
          {formatTimestamp(audioDuration || duration)}
        </span>

        <button onClick={toggleMute} className="text-gray-400 hover:text-gray-600 transition-colors">
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <span className="text-xs text-gray-400 border border-gray-200 px-2 py-1 rounded text-nowrap">Sample audio</span>
      </div>
    </div>
  );
}
