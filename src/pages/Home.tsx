
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Music, Wind, Smile, Frown, Zap, AlertTriangle, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';

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

const POWER_THOUGHTS = [
  "You're stronger than you think. Let's prove it.",
  "Every challenge you face is helping you grow.",
  "Your potential has no limits except the ones you set.",
  "Small steps lead to big changes. You're on the right path.",
  "You don't have to be perfect to be amazing.",
  "Your mind is your most powerful tool. Use it wisely.",
  "Today is full of possibilities waiting for you to discover.",
  "Breathe in courage, breathe out fear.",
  "You've overcome difficult times before, and you'll do it again."
];

const Home = () => {
  const [userName, setUserName] = useState("champ");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [botMessage, setBotMessage] = useState("");
  const [powerThought, setPowerThought] = useState("");
  const [moodSelected, setMoodSelected] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) setUserName(savedName);
    
    const savedMood = localStorage.getItem("lastMood");
    if (savedMood) {
      setSelectedMood(savedMood);
      setBotMessage(MOOD_RESPONSES[savedMood as keyof typeof MOOD_RESPONSES] || "");
    }
    
    // Set today's power thought
    const today = new Date().toDateString();
    const savedPowerThoughtDate = localStorage.getItem("powerThoughtDate");
    
    if (savedPowerThoughtDate !== today) {
      // Generate new power thought for today
      const randomIndex = Math.floor(Math.random() * POWER_THOUGHTS.length);
      setPowerThought(POWER_THOUGHTS[randomIndex]);
      localStorage.setItem("powerThought", POWER_THOUGHTS[randomIndex]);
      localStorage.setItem("powerThoughtDate", today);
    } else {
      // Use saved power thought
      const savedPowerThought = localStorage.getItem("powerThought");
      if (savedPowerThought) setPowerThought(savedPowerThought);
    }
    
    // Check for newly unlocked badges
    const unviewedBadges = localStorage.getItem("unviewedBadges");
    if (unviewedBadges && JSON.parse(unviewedBadges).length > 0) {
      showBadgeNotification();
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
    
    // Check if it's the first time selecting a mood today
    if (!moodSelected) {
      setMoodSelected(true);
      checkForNewBadges(moodHistory);
    }
    
    // Trigger animation
    const moodElement = document.getElementById(`mood-${mood}`);
    if (moodElement) {
      moodElement.classList.add("scale-110", "transition-transform", "duration-500");
      setTimeout(() => {
        moodElement.classList.remove("scale-110", "transition-transform", "duration-500");
      }, 500);
    }
  };
  
  const checkForNewBadges = (moodHistory: any[]) => {
    const badges = JSON.parse(localStorage.getItem("badges") || "[]");
    const unviewedBadges = JSON.parse(localStorage.getItem("unviewedBadges") || "[]");
    
    // Check for mood tracking badge
    if (moodHistory.length >= 5 && !badges.includes("mood-tracker")) {
      badges.push("mood-tracker");
      unviewedBadges.push({
        id: "mood-tracker",
        name: "Mood Tracker",
        description: "Logged 5+ moods",
        icon: "🏆"
      });
      showBadgeNotification();
    }
    
    // Check for streak badge
    const uniqueDays = new Set(
      moodHistory.map((entry: any) => 
        new Date(entry.timestamp).toLocaleDateString()
      )
    );
    
    if (uniqueDays.size >= 3 && !badges.includes("streak")) {
      badges.push("streak");
      unviewedBadges.push({
        id: "streak",
        name: "3-Day Streak",
        description: "Used NeuroNest for 3+ days",
        icon: "🔥"
      });
      showBadgeNotification();
    }
    
    localStorage.setItem("badges", JSON.stringify(badges));
    localStorage.setItem("unviewedBadges", JSON.stringify(unviewedBadges));
  };
  
  const showBadgeNotification = () => {
    const unviewedBadges = JSON.parse(localStorage.getItem("unviewedBadges") || "[]");
    if (unviewedBadges.length > 0) {
      const latestBadge = unviewedBadges[0];
      
      toast({
        title: "New Badge Unlocked! 🎉",
        description: `${latestBadge.icon} ${latestBadge.name}: ${latestBadge.description}`,
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              window.location.href = "/mind-graph";
              localStorage.setItem("unviewedBadges", JSON.stringify([]));
            }}
          >
            View Badges
          </Button>
        ),
      });
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
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
              id={`mood-${mood.name}`}
              key={mood.name}
              onClick={() => handleMoodSelect(mood.name)}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                selectedMood === mood.name ? "bg-muted scale-110" : "hover:bg-muted/50 hover:scale-105"
              }`}
            >
              <span className="mood-icon text-2xl mb-2 transition-transform">{mood.emoji}</span>
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
      
      {powerThought && (
        <Card className="p-4 glass-card bg-gradient-to-r from-neuroPurple/30 to-neuroTeal/30">
          <div className="flex items-center gap-2">
            <div className="text-xl">✨</div>
            <div>
              <h3 className="text-sm font-semibold">Today's Power Thought:</h3>
              <p className="text-base">{powerThought}</p>
            </div>
          </div>
        </Card>
      )}
      
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
