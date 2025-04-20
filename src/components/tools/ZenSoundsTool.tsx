
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume1, Volume2, VolumeOff } from "lucide-react";

interface SoundOption {
  name: string;
  emoji: string;
  src: string;
}

const SOUND_OPTIONS: SoundOption[] = [
  { name: "Rain", emoji: "🌧️", src: "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3" },
  { name: "Ocean", emoji: "🌊", src: "https://assets.mixkit.co/sfx/preview/mixkit-ocean-waves-loop-1196.mp3" },
  { name: "Forest", emoji: "🌲", src: "https://assets.mixkit.co/sfx/preview/mixkit-forest-ambience-1230.mp3" },
  { name: "Lo-Fi", emoji: "🎵", src: "https://assets.mixkit.co/sfx/preview/mixkit-lo-fi-beat-287.mp3" },
  { name: "Fire", emoji: "🔥", src: "https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3" },
  { name: "White Noise", emoji: "🌫️", src: "https://assets.mixkit.co/sfx/preview/mixkit-white-noise-ambience-1197.mp3" }
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
                ? "bg-neuroLight dark:bg-accent border-neuroPurple"
                : ""
            }`}
          >
            <span className="text-2xl">{sound.emoji}</span>
            <span>{sound.name}</span>
          </Button>
        ))}
      </div>
      
      {currentSound && (
        <div className="mt-4 flex items-center gap-3">
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
