import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Music } from "lucide-react";
import { Wind, Smile, Frown, Zap, AlertTriangle, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const MOODS = [
  { name: "happy", emoji: "😊", icon: Smile },
  { name: "sad", emoji: "😢", icon: Frown },
  { name: "anxious", emoji: "😰", icon: AlertTriangle },
  { name: "excited", emoji: "🤩", icon: Zap },
  { name: "angry", emoji: "😡", icon: AlertTriangle },
  { name: "tired", emoji: "😴", icon: Moon }
];

const MOOD_RESPONSES = {
  happy: "Awesome! Let's keep that positive energy flowing today!",
  sad: "I'm here for you. Sometimes we all need a moment to feel our emotions.",
  anxious: "Let's take a breath together. I've got some calming exercises ready.",
  excited: "That energy is contagious! Let's channel it into something amazing!",
  angry: "It's okay to feel angry. Let's find a healthy way to express it.",
  tired: "Everyone needs rest. Let's focus on gentle activities today."
};

const Home = () => {
  const [userName, setUserName] = useState("champ");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [botMessage, setBotMessage] = useState("");
  
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) setUserName(savedName);
    
    const savedMood = localStorage.getItem("lastMood");
    if (savedMood) {
      setSelectedMood(savedMood);
      setBotMessage(MOOD_RESPONSES[savedMood as keyof typeof MOOD_RESPONSES] || "");
    }
  }, []);
  
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setBotMessage(MOOD_RESPONSES[mood as keyof typeof MOOD_RESPONSES] || "");
    
    localStorage.setItem("lastMood", mood);
    
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    moodHistory.push({
      mood,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
  };

  return (
    <div className="space-y-6 pb-6">
      <section className="text-center">
        <h1 className="text-2xl font-bold mb-1">Hey, {userName}!</h1>
        <p className="text-muted-foreground">Welcome to your NeuroNest</p>
      </section>
      
      <Card className="p-6 glass-card animate-float">
        <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {MOODS.map((mood) => (
            <button
              key={mood.name}
              onClick={() => handleMoodSelect(mood.name)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                selectedMood === mood.name ? "bg-muted scale-110" : ""
              }`}
            >
              <span className="mood-icon mb-1">{mood.emoji}</span>
              <span className="text-sm capitalize">{mood.name}</span>
            </button>
          ))}
        </div>
        
        {botMessage && (
          <div className="mt-4 p-3 rounded-lg bg-neuroLight dark:bg-muted">
            <p className="text-sm font-medium">
              <span className="font-bold">NeuroBot:</span> {botMessage}
            </p>
          </div>
        )}
      </Card>
      
      <div className="grid grid-cols-3 gap-3">
        <Link to="/toolkit/breathe">
          <Button 
            className="w-full h-24 flex flex-col items-center justify-center gap-1 bg-neuroPurple hover:bg-neuroPurple/90"
          >
            <Wind size={24} />
            <span>Breathe</span>
          </Button>
        </Link>
        
        <Link to="/neurobot">
          <Button 
            className="w-full h-24 flex flex-col items-center justify-center gap-1 bg-neuroTeal hover:bg-neuroTeal/90 text-black"
          >
            <MessageSquare size={24} />
            <span>Talk to NeuroBot</span>
          </Button>
        </Link>
        
        <Link to="/toolkit/distract">
          <Button 
            className="w-full h-24 flex flex-col items-center justify-center gap-1 bg-neuroBlue hover:bg-neuroBlue/90 text-black"
          >
            <Music size={24} />
            <span>Distract Me</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
