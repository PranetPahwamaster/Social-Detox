
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Frown, AlertTriangle, Moon, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  title: string;
  description: string;
  emoji: string;
  duration?: string;
  id: string;
}

const ACTIVITIES_BY_MOOD: Record<string, Activity[]> = {
  happy: [
    { id: "happy-1", emoji: "🏃‍♂️", title: "Energy Boost", description: "Do 10 jumping jacks to boost your happy energy!", duration: "30 sec" },
    { id: "happy-2", emoji: "🎵", title: "Dance Party", description: "Put on your favorite song and dance for 1 minute!", duration: "1 min" },
    { id: "happy-3", emoji: "✨", title: "Spread Joy", description: "Write down 3 people you could make smile today", duration: "2 min" }
  ],
  sad: [
    { id: "sad-1", emoji: "☕", title: "Comfort Break", description: "Take a moment to enjoy a warm drink slowly", duration: "3 min" },
    { id: "sad-2", emoji: "🌈", title: "Color Therapy", description: "Look around and find 5 different colors in your environment", duration: "1 min" },
    { id: "sad-3", emoji: "🤗", title: "Self Hug", description: "Give yourself a gentle hug and take 3 deep breaths", duration: "30 sec" }
  ],
  anxious: [
    { id: "anxious-1", emoji: "🫁", title: "Box Breathing", description: "Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat 5 times.", duration: "2 min" },
    { id: "anxious-2", emoji: "👐", title: "Hand Massage", description: "Gently massage each finger and your palms", duration: "1 min" },
    { id: "anxious-3", emoji: "🦶", title: "Grounding", description: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste", duration: "3 min" }
  ],
  excited: [
    { id: "excited-1", emoji: "📝", title: "Idea Blast", description: "Write down 5 ideas or goals you're excited about", duration: "2 min" },
    { id: "excited-2", emoji: "🎯", title: "Focus Time", description: "Channel your excitement into one focused task for 5 minutes", duration: "5 min" },
    { id: "excited-3", emoji: "🧘‍♀️", title: "Balance Energy", description: "Stand on one foot and focus on your balance for 30 seconds each side", duration: "1 min" }
  ],
  angry: [
    { id: "angry-1", emoji: "💧", title: "Water Break", description: "Drink a full glass of cold water slowly", duration: "1 min" },
    { id: "angry-2", emoji: "✊", title: "Release Tension", description: "Squeeze your fists tight for 5 seconds, then release. Repeat 5 times.", duration: "1 min" },
    { id: "angry-3", emoji: "🧊", title: "Cool Down", description: "Hold something cold in your hands or place a cool cloth on your forehead", duration: "2 min" }
  ],
  tired: [
    { id: "tired-1", emoji: "🙆‍♀️", title: "Energy Stretch", description: "Reach your arms up high, then touch your toes. Repeat 5 times.", duration: "1 min" },
    { id: "tired-2", emoji: "👁️", title: "Eye Break", description: "Close your eyes for 20 seconds, then look at something far away for 20 seconds", duration: "1 min" },
    { id: "tired-3", emoji: "🍎", title: "Quick Fuel", description: "Eat a small healthy snack like a fruit or nuts", duration: "3 min" }
  ]
};

const DEFAULT_ACTIVITIES: Activity[] = [
  { id: "default-1", emoji: "🌞", title: "Sunshine Moment", description: "Stand by a window or go outside for 1 minute of sunlight", duration: "1 min" },
  { id: "default-2", emoji: "💪", title: "Energy Move", description: "Do 5 gentle stretches or jumping jacks", duration: "1 min" },
  { id: "default-3", emoji: "😊", title: "Smile Exercise", description: "Practice smiling for 30 seconds - it can actually boost your mood!", duration: "30 sec" },
  { id: "default-4", emoji: "🧠", title: "Brain Break", description: "Close your eyes and count slowly to 30", duration: "30 sec" },
  { id: "default-5", emoji: "🌬️", title: "Deep Breath", description: "Take 5 deep breaths, holding each for 4 seconds", duration: "1 min" }
];

const POWER_THOUGHTS = [
  "Small steps build big mountains. You're doing great.",
  "Your energy is a renewable resource - just needs the right recharge.",
  "Balance isn't about perfect equilibrium, but constant small adjustments.",
  "The way you channel your energy determines your direction.",
  "Momentum builds with consistency, not intensity.",
  "Every time you pause to reset, you're practicing self-mastery.",
  "Energy flows where attention goes - direct it wisely.",
  "Your energy is contagious - make it worth catching."
];

const EnergyLab = () => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activityHistory, setActivityHistory] = useState<Array<{activityId: string, completed: boolean}>>([]);
  const [powerThought, setPowerThought] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    const lastMood = localStorage.getItem("lastMood");
    if (lastMood) {
      setCurrentMood(lastMood);
      generateActivity(lastMood);
    } else {
      const randomDefaultActivity = DEFAULT_ACTIVITIES[Math.floor(Math.random() * DEFAULT_ACTIVITIES.length)];
      setCurrentActivity(randomDefaultActivity);
    }
    
    // Load activity history
    const savedHistory = localStorage.getItem("completedActivities");
    if (savedHistory) {
      setActivityHistory(JSON.parse(savedHistory));
    }
    
    // Set today's power thought
    const today = new Date().toDateString();
    const savedPowerThoughtDate = localStorage.getItem("energyLabThoughtDate");
    
    if (savedPowerThoughtDate !== today) {
      // Generate new power thought for today
      const randomIndex = Math.floor(Math.random() * POWER_THOUGHTS.length);
      setPowerThought(POWER_THOUGHTS[randomIndex]);
      localStorage.setItem("energyLabThought", POWER_THOUGHTS[randomIndex]);
      localStorage.setItem("energyLabThoughtDate", today);
    } else {
      // Use saved power thought
      const savedPowerThought = localStorage.getItem("energyLabThought");
      if (savedPowerThought) setPowerThought(savedPowerThought);
    }
  }, []);
  
  const generateActivity = (mood: string) => {
    setIsCompleted(false);
    
    const activities = ACTIVITIES_BY_MOOD[mood] || DEFAULT_ACTIVITIES;
    
    // Filter out recently completed activities
    const recentActivityIds = activityHistory
      .slice(-5)
      .map(item => item.activityId);
    
    const availableActivities = activities.filter(
      activity => !recentActivityIds.includes(activity.id)
    );
    
    // If all activities have been recently completed, use any activity
    const activityPool = availableActivities.length > 0 ? availableActivities : activities;
    const randomActivity = activityPool[Math.floor(Math.random() * activityPool.length)];
    
    setCurrentActivity(randomActivity);
  };
  
  const handleComplete = () => {
    if (!currentActivity) return;
    
    setIsCompleted(true);
    
    // Update activity history
    const updatedHistory = [
      ...activityHistory, 
      { 
        activityId: currentActivity.id, 
        completed: true, 
        timestamp: new Date().toISOString(),
        mood: currentMood
      }
    ];
    
    setActivityHistory(updatedHistory);
    localStorage.setItem("completedActivities", JSON.stringify(updatedHistory));
    
    // Check for badge
    const completedCount = updatedHistory.filter(item => item.completed).length;
    
    if (completedCount >= 5) {
      const badges = JSON.parse(localStorage.getItem("badges") || "[]");
      const unviewedBadges = JSON.parse(localStorage.getItem("unviewedBadges") || "[]");
      
      if (!badges.includes("self-care")) {
        badges.push("self-care");
        unviewedBadges.push({
          id: "self-care",
          name: "Self-Care Champion",
          description: "Completed 5+ energy lab activities",
          icon: "💪"
        });
        
        localStorage.setItem("badges", JSON.stringify(badges));
        localStorage.setItem("unviewedBadges", JSON.stringify(unviewedBadges));
        
        toast({
          title: "New Badge Unlocked! 🎉",
          description: "💪 Self-Care Champion: Completed 5+ activities",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = "/mind-graph"}
            >
              View Badges
            </Button>
          ),
        });
      }
    }
  };
  
  const handleNewActivity = () => {
    if (currentMood) {
      generateActivity(currentMood);
    } else {
      const randomDefaultActivity = DEFAULT_ACTIVITIES[Math.floor(Math.random() * DEFAULT_ACTIVITIES.length)];
      setCurrentActivity(randomDefaultActivity);
    }
  };
  
  const getMoodIcon = () => {
    switch (currentMood) {
      case "happy":
      case "excited":
        return <Smile className="h-6 w-6 text-yellow-500" />;
      case "sad":
        return <Frown className="h-6 w-6 text-blue-500" />;
      case "angry":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case "tired":
      case "anxious":
        return <Moon className="h-6 w-6 text-purple-500" />;
      default:
        return null;
    }
  };
  
  const getActivityBackground = () => {
    switch (currentMood) {
      case "happy":
      case "excited":
        return "bg-gradient-to-r from-yellow-100/50 to-amber-100/50 dark:from-yellow-900/30 dark:to-amber-900/30";
      case "sad":
        return "bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/30 dark:to-indigo-900/30";
      case "angry":
        return "bg-gradient-to-r from-red-100/50 to-orange-100/50 dark:from-red-900/30 dark:to-orange-900/30";
      case "tired":
      case "anxious":
        return "bg-gradient-to-r from-purple-100/50 to-violet-100/50 dark:from-purple-900/30 dark:to-violet-900/30";
      default:
        return "bg-gradient-to-r from-gray-100/50 to-slate-100/50 dark:from-gray-900/30 dark:to-slate-900/30";
    }
  };
  
  const getCompletedCount = () => {
    return activityHistory.filter(item => item.completed).length;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Energy Lab</h1>
      
      {powerThought && (
        <Card className="p-4 glass-card mb-6 bg-gradient-to-r from-neuroPurple/30 to-neuroTeal/30">
          <div className="flex items-center gap-2">
            <div className="text-xl">⚡</div>
            <div>
              <h3 className="text-sm font-semibold">Today's Power Thought:</h3>
              <p className="text-base">{powerThought}</p>
            </div>
          </div>
        </Card>
      )}
      
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
          <div className={`p-6 rounded-xl text-center ${getActivityBackground()}`}>
            <div className="text-5xl mb-4 animate-bounce-slow">{currentActivity.emoji}</div>
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
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg text-green-700 dark:text-green-400">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-5 w-5 fill-current" />
                    <span>Great job! Your energy is shifting! 🎉</span>
                  </div>
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
        
        {getCompletedCount() > 0 && (
          <div className="mt-4 text-center">
            <Badge variant="outline" className="text-xs">
              {getCompletedCount()} {getCompletedCount() === 1 ? 'activity' : 'activities'} completed
            </Badge>
          </div>
        )}
      </Card>
      
      <Card className="p-6 glass-card">
        <h2 className="text-xl font-semibold mb-4">Energy Tips</h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <span className="text-xl">💧</span>
            <div>
              <p className="font-medium">Hydration Boosts Energy</p>
              <p className="text-sm text-muted-foreground">Staying hydrated can boost your energy by up to 25%</p>
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <span className="text-xl">🧠</span>
            <div>
              <p className="font-medium">Emotional Pathways</p>
              <p className="text-sm text-muted-foreground">Your brain uses different neural pathways for different emotions</p>
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <span className="text-xl">🌿</span>
            <div>
              <p className="font-medium">Nature Reset</p>
              <p className="text-sm text-muted-foreground">Just 2 minutes in nature can help reset your nervous system</p>
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <span className="text-xl">😊</span>
            <div>
              <p className="font-medium">Smile Science</p>
              <p className="text-sm text-muted-foreground">Smiling, even when forced, can actually improve your mood</p>
            </div>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default EnergyLab;
