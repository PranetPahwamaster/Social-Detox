
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Happy, Sad, Angry, Tired } from "lucide-react";

interface Activity {
  title: string;
  description: string;
  emoji: string;
  duration?: string;
}

// Activities based on mood
const ACTIVITIES_BY_MOOD: Record<string, Activity[]> = {
  happy: [
    { emoji: "🏃‍♂️", title: "Energy Boost", description: "Do 10 jumping jacks to boost your happy energy!", duration: "30 sec" },
    { emoji: "🎵", title: "Dance Party", description: "Put on your favorite song and dance for 1 minute!", duration: "1 min" },
    { emoji: "✨", title: "Spread Joy", description: "Write down 3 people you could make smile today", duration: "2 min" }
  ],
  sad: [
    { emoji: "☕", title: "Comfort Break", description: "Take a moment to enjoy a warm drink slowly", duration: "3 min" },
    { emoji: "🌈", title: "Color Therapy", description: "Look around and find 5 different colors in your environment", duration: "1 min" },
    { emoji: "🤗", title: "Self Hug", description: "Give yourself a gentle hug and take 3 deep breaths", duration: "30 sec" }
  ],
  anxious: [
    { emoji: "🫁", title: "Box Breathing", description: "Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat 5 times.", duration: "2 min" },
    { emoji: "👐", title: "Hand Massage", description: "Gently massage each finger and your palms", duration: "1 min" },
    { emoji: "🦶", title: "Grounding", description: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste", duration: "3 min" }
  ],
  excited: [
    { emoji: "📝", title: "Idea Blast", description: "Write down 5 ideas or goals you're excited about", duration: "2 min" },
    { emoji: "🎯", title: "Focus Time", description: "Channel your excitement into one focused task for 5 minutes", duration: "5 min" },
    { emoji: "🧘‍♀️", title: "Balance Energy", description: "Stand on one foot and focus on your balance for 30 seconds each side", duration: "1 min" }
  ],
  angry: [
    { emoji: "💧", title: "Water Break", description: "Drink a full glass of cold water slowly", duration: "1 min" },
    { emoji: "✊", title: "Release Tension", description: "Squeeze your fists tight for 5 seconds, then release. Repeat 5 times.", duration: "1 min" },
    { emoji: "🧊", title: "Cool Down", description: "Hold something cold in your hands or place a cool cloth on your forehead", duration: "2 min" }
  ],
  tired: [
    { emoji: "🙆‍♀️", title: "Energy Stretch", description: "Reach your arms up high, then touch your toes. Repeat 5 times.", duration: "1 min" },
    { emoji: "👁️", title: "Eye Break", description: "Close your eyes for 20 seconds, then look at something far away for 20 seconds", duration: "1 min" },
    { emoji: "🍎", title: "Quick Fuel", description: "Eat a small healthy snack like a fruit or nuts", duration: "3 min" }
  ]
};

// Default activities if no mood is selected
const DEFAULT_ACTIVITIES: Activity[] = [
  { emoji: "🌞", title: "Sunshine Moment", description: "Stand by a window or go outside for 1 minute of sunlight", duration: "1 min" },
  { emoji: "💪", title: "Energy Move", description: "Do 5 gentle stretches or jumping jacks", duration: "1 min" },
  { emoji: "😊", title: "Smile Exercise", description: "Practice smiling for 30 seconds - it can actually boost your mood!", duration: "30 sec" },
  { emoji: "🧠", title: "Brain Break", description: "Close your eyes and count slowly to 30", duration: "30 sec" },
  { emoji: "🌬️", title: "Deep Breath", description: "Take 5 deep breaths, holding each for 4 seconds", duration: "1 min" }
];

const EnergyLab = () => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  useEffect(() => {
    // Get the last selected mood from localStorage
    const lastMood = localStorage.getItem("lastMood");
    if (lastMood) {
      setCurrentMood(lastMood);
      generateActivity(lastMood);
    } else {
      // If no mood is saved, use a default activity
      const randomDefaultActivity = DEFAULT_ACTIVITIES[Math.floor(Math.random() * DEFAULT_ACTIVITIES.length)];
      setCurrentActivity(randomDefaultActivity);
    }
  }, []);
  
  const generateActivity = (mood: string) => {
    setIsCompleted(false);
    
    const activities = ACTIVITIES_BY_MOOD[mood] || DEFAULT_ACTIVITIES;
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    setCurrentActivity(randomActivity);
  };
  
  const handleComplete = () => {
    setIsCompleted(true);
    
    // Save activity completion to localStorage
    const completedActivities = JSON.parse(localStorage.getItem("completedActivities") || "[]");
    completedActivities.push({
      activity: currentActivity?.title,
      mood: currentMood,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("completedActivities", JSON.stringify(completedActivities));
  };
  
  const handleNewActivity = () => {
    if (currentMood) {
      generateActivity(currentMood);
    } else {
      const randomDefaultActivity = DEFAULT_ACTIVITIES[Math.floor(Math.random() * DEFAULT_ACTIVITIES.length)];
      setCurrentActivity(randomDefaultActivity);
    }
  };
  
  // Get appropriate icon for current mood
  const getMoodIcon = () => {
    switch (currentMood) {
      case "happy":
      case "excited":
        return <Happy className="h-6 w-6 text-yellow-500" />;
      case "sad":
        return <Sad className="h-6 w-6 text-blue-500" />;
      case "angry":
        return <Angry className="h-6 w-6 text-red-500" />;
      case "tired":
      case "anxious":
        return <Tired className="h-6 w-6 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Energy Lab</h1>
      
      <Card className="p-6 glass-card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Your Energy Activity</h2>
          {currentMood && (
            <div className="flex items-center bg-muted px-2 py-1 rounded-full">
              {getMoodIcon()}
              <span className="ml-1 text-sm capitalize">{currentMood}</span>
            </div>
          )}
        </div>
        
        {currentActivity && (
          <div className="bg-neuroLight dark:bg-muted p-6 rounded-xl text-center">
            <div className="text-5xl mb-4">{currentActivity.emoji}</div>
            <h3 className="text-xl font-bold mb-2">{currentActivity.title}</h3>
            <p className="mb-4">{currentActivity.description}</p>
            {currentActivity.duration && (
              <div className="inline-block bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full text-sm font-medium mb-4">
                {currentActivity.duration}
              </div>
            )}
            
            {!isCompleted ? (
              <Button 
                onClick={handleComplete} 
                className="w-full bg-neuroPurple hover:bg-neuroPurple/90"
              >
                I Did It!
              </Button>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-700 dark:text-green-400">
                  Great job! Your energy is shifting! 🎉
                </div>
                <Button 
                  onClick={handleNewActivity} 
                  variant="outline" 
                  className="w-full"
                >
                  Try Another Activity
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
      
      <Card className="p-6 glass-card">
        <h2 className="text-xl font-semibold mb-4">Energy Tips</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="text-xl">💧</span>
            <span>Staying hydrated can boost your energy by up to 25%</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-xl">🧠</span>
            <span>Your brain uses different pathways for different emotions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-xl">🌿</span>
            <span>Just 2 minutes in nature can help reset your nervous system</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-xl">😊</span>
            <span>Smiling, even when forced, can actually improve your mood</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default EnergyLab;
