
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume1, Volume2, VolumeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SoundOption {
  name: string;
  emoji: string;
  src: string;
  color?: string;
}

const SOUND_OPTIONS: SoundOption[] = [
  { name: "Rain", emoji: "🌧️", src: "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3", color: "from-blue-300/40 to-blue-500/40" },
  { name: "Ocean", emoji: "🌊", src: "https://assets.mixkit.co/sfx/preview/mixkit-ocean-waves-loop-1196.mp3", color: "from-cyan-300/40 to-blue-400/40" },
  { name: "Forest", emoji: "🌲", src: "https://assets.mixkit.co/sfx/preview/mixkit-forest-ambience-1230.mp3", color: "from-green-300/40 to-green-600/40" },
  { name: "Lo-Fi", emoji: "🎵", src: "https://elements.envato.com/lofi-chill-hop-3YLSVEU.mp3", color: "from-purple-300/40 to-purple-500/40" },
  { name: "Fire", emoji: "🔥", src: "https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3", color: "from-orange-300/40 to-red-400/40" },
  { name: "White Noise", emoji: "🌫️", src: "https://assets.mixkit.co/sfx/preview/mixkit-white-noise-ambience-1197.mp3", color: "from-slate-300/40 to-slate-500/40" },
  { name: "Birds", emoji: "🐦", src: "https://assets.mixkit.co/sfx/preview/mixkit-birds-in-the-wilderness-918.mp3", color: "from-yellow-300/40 to-amber-400/40" },
  { name: "Stream", emoji: "🏞️", src: "https://assets.mixkit.co/sfx/preview/mixkit-stream-in-the-forest-1229.mp3", color: "from-teal-300/40 to-cyan-500/40" }
];

const ZenSoundsTool = () => {
  const [currentSound, setCurrentSound] = useState<SoundOption | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  const toggleSound = (sound: SoundOption) => {
    if (audioRef.current) {
      // If the same sound is clicked, toggle play/pause
      if (currentSound && currentSound.name === sound.name) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play().catch(e => console.error("Error playing audio:", e));
          setIsPlaying(true);
        }
      } 
      // If a different sound is clicked, switch to it
      else {
        if (isPlaying) {
          audioRef.current.pause();
        }
        
        audioRef.current.src = sound.src;
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        setCurrentSound(sound);
        setIsPlaying(true);
      }
    }
  };
  
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };
  
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeOff size={20} />;
    if (volume <= 0.5) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-xl font-semibold mb-4 text-center">Zen Sounds</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {SOUND_OPTIONS.map((sound) => (
          <Button
            key={sound.name}
            onClick={() => toggleSound(sound)}
            variant="outline"
            className={`h-16 flex items-center justify-center gap-2 ${
              currentSound?.name === sound.name && isPlaying
                ? `bg-gradient-to-r ${sound.color || ""} border-neuroPurple`
                : ""
            } hover:bg-gradient-to-r hover:${sound.color || ""} hover:opacity-80 transition-all`}
          >
            <span className="text-2xl">{sound.emoji}</span>
            <span>{sound.name}</span>
            {currentSound?.name === sound.name && isPlaying && (
              <Badge variant="secondary" className="ml-1 animate-pulse">
                Playing
              </Badge>
            )}
          </Button>
        ))}
      </div>
      
      {currentSound && (
        <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-100/30 to-blue-100/30 dark:from-purple-900/30 dark:to-blue-900/30">
          <button onClick={() => handleVolumeChange(0)}>
            {getVolumeIcon()}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          
          <span className="text-sm">{Math.round(volume * 100)}%</span>
        </div>
      )}
      
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {currentSound 
          ? `Now playing: ${currentSound.emoji} ${currentSound.name}`
          : "Select a sound to create your perfect calming environment"}
      </p>
    </Card>
  );
};

export default ZenSoundsTool;
