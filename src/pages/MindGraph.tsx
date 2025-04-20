
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, PieChart, Pie, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import confetti from 'canvas-confetti';

interface MoodEntry {
  mood: string;
  timestamp: string;
}

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface ChartDataItem {
  name: string;
  value: number;
  emoji: string;
}

const MOOD_EMOJIS: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  anxious: "😰",
  excited: "🤩",
  angry: "😡",
  tired: "😴"
};

const TOOL_EMOJIS: Record<string, string> = {
  breathe: "🫁",
  sounds: "🎧",
  dump: "📝",
  distract: "🧩",
  neurobot: "🤖"
};

const MOOD_COLORS: Record<string, string> = {
  happy: "#FFD700", // Gold
  sad: "#6495ED",   // Cornflower Blue
  anxious: "#9370DB", // Medium Purple
  excited: "#FF6347", // Tomato
  angry: "#DC143C",  // Crimson
  tired: "#708090"   // Slate Gray
};

const BADGE_DEFINITIONS: BadgeData[] = [
  { id: "mood-tracker", name: "Mood Tracker", description: "Logged 5+ moods", icon: "🏆" },
  { id: "journaling-star", name: "Journaling Star", description: "Used Dump Zone 3+ times", icon: "✍️" },
  { id: "neurobot-friend", name: "NeuroBot Friend", description: "Had 5+ conversations", icon: "🤖" },
  { id: "streak", name: "3-Day Streak", description: "Used NeuroNest for 3+ days", icon: "🔥" },
  { id: "zen-master", name: "Zen Master", description: "Used breathing exercises 10+ times", icon: "🧘" },
  { id: "distraction-pro", name: "Distraction Pro", description: "Completed 10+ distractions", icon: "🎯" },
  { id: "music-lover", name: "Sound Explorer", description: "Tried 5+ different sounds", icon: "🎵" },
  { id: "self-care", name: "Self-Care Champion", description: "Completed 5+ energy lab activities", icon: "💪" }
];

const MindGraph = () => {
  const [moodData, setMoodData] = useState<ChartDataItem[]>([]);
  const [toolData, setToolData] = useState<ChartDataItem[]>([]);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [unlockedBadge, setUnlockedBadge] = useState<BadgeData | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");
  
  useEffect(() => {
    loadData();
    
    // Check for new badges to view
    const unviewedBadges = JSON.parse(localStorage.getItem("unviewedBadges") || "[]");
    if (unviewedBadges.length > 0) {
      setUnlockedBadge(unviewedBadges[0]);
      // Clear unviewed badges on view
      localStorage.setItem("unviewedBadges", JSON.stringify([]));
      
      // Trigger confetti
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 500);
    }
  }, [timeRange]);
  
  const loadData = () => {
    // Load and process mood data with time filtering
    const moodHistory: MoodEntry[] = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    const filteredMoodHistory = filterDataByTime(moodHistory);
    
    const moodCounts: Record<string, number> = {};
    
    filteredMoodHistory.forEach((entry) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    const formattedMoodData = Object.keys(moodCounts).map((mood) => ({
      name: mood,
      value: moodCounts[mood],
      emoji: MOOD_EMOJIS[mood] || "😐"
    }));
    
    setMoodData(formattedMoodData);
    
    // Process journal entries for dump tool usage
    const journalEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    const filteredJournalEntries = filterDataByTime(journalEntries);
    
    // Process neurobot messages for neurobot usage
    const neuroBotMessages = JSON.parse(localStorage.getItem("neuroBotMessages") || "[]");
    const userMessages = neuroBotMessages.filter((msg: any) => msg.role === "user").length;
    
    // Get distraction completions
    const distractionCount = parseInt(localStorage.getItem("distractionCompleted") || "0", 10);
    
    // For demo, create tool usage with actual counts where available
    const toolUsage = [
      { tool: "breathe", count: Math.floor(Math.random() * 10) + (moodCounts["anxious"] || 0) },
      { tool: "sounds", count: Math.floor(Math.random() * 8) + 2 },
      { tool: "dump", count: filteredJournalEntries.length },
      { tool: "distract", count: distractionCount },
      { tool: "neurobot", count: userMessages }
    ];
    
    const formattedToolData = toolUsage.map((tool) => ({
      name: tool.tool,
      value: tool.count,
      emoji: TOOL_EMOJIS[tool.tool] || "🛠️"
    }));
    
    setToolData(formattedToolData);
    
    // Load badges
    const earnedBadgeIds = JSON.parse(localStorage.getItem("badges") || "[]");
    const earnedBadges = BADGE_DEFINITIONS.filter(badge => 
      earnedBadgeIds.includes(badge.id)
    );
    
    setBadges(earnedBadges);
  };
  
  const filterDataByTime = (data: any[]) => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "all":
      default:
        return data;
    }
    
    return data.filter((item: any) => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= cutoffDate;
    });
  };
  
  const closeBadgePopup = () => {
    setUnlockedBadge(null);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-card p-2 rounded-md shadow border">
          <p className="text-sm font-semibold capitalize">{data.name}</p>
          <p className="text-lg">{data.emoji} {data.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mind Graph</h1>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Data</h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={timeRange === "week" ? "default" : "outline"}
            onClick={() => setTimeRange("week")}
          >
            Week
          </Button>
          <Button
            size="sm"
            variant={timeRange === "month" ? "default" : "outline"}
            onClick={() => setTimeRange("month")}
          >
            Month
          </Button>
          <Button
            size="sm"
            variant={timeRange === "all" ? "default" : "outline"}
            onClick={() => setTimeRange("all")}
          >
            All Time
          </Button>
        </div>
      </div>
      
      <Card className="p-6 glass-card mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Mood Distribution</h2>
        
        {moodData.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={moodData}>
                  <XAxis 
                    dataKey="name" 
                    tickFormatter={(value) => MOOD_EMOJIS[value] || value}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.name] || "#8884d8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name }) => MOOD_EMOJIS[name] || name}
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.name] || "#8884d8"} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No mood data yet. Tell us how you're feeling on the home page!</p>
          </div>
        )}
        
        {moodData.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-neuroLight/50 dark:bg-muted">
            <p className="text-sm">
              <span className="font-semibold">AI Insight:</span> Based on your mood patterns, you tend to feel 
              {moodData.length > 0 ? ` ${moodData.sort((a, b) => b.value - a.value)[0].name} ` : " varied emotions "}
              most often. Remember that all emotions are valid and provide important information about your needs.
            </p>
          </div>
        )}
      </Card>
      
      <Card className="p-6 glass-card mb-6">
        <h2 className="text-xl font-semibold mb-4">Tool Usage</h2>
        
        {toolData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={toolData}>
              <XAxis 
                dataKey="name" 
                tickFormatter={(value) => TOOL_EMOJIS[value] || value}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#9b87f5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tool usage data yet. Explore the app to see stats here!</p>
          </div>
        )}
        
        {toolData.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-neuroLight/50 dark:bg-muted">
            <p className="text-sm">
              <span className="font-semibold">Recommendation:</span> You seem to use 
              {toolData.length > 0 ? ` ${toolData.sort((a, b) => b.value - a.value)[0].name} ` : " various tools "}
              the most. For a balanced approach to mindfulness, try exploring other tools like 
              {toolData.length > 0 ? ` ${toolData.sort((a, b) => a.value - b.value)[0].name}` : " breathe or zen sounds"}.
            </p>
          </div>
        )}
      </Card>
      
      <Card className="p-6 glass-card">
        <h2 className="text-xl font-semibold mb-4">Your Badges</h2>
        
        {badges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <div 
                key={index} 
                className="p-4 bg-neuroLight dark:bg-muted rounded-lg flex items-center gap-3 hover:bg-neuroLight/70 dark:hover:bg-muted/70 transition-colors"
              >
                <span className="text-3xl">{badge.icon}</span>
                <div>
                  <p className="font-medium">{badge.name}</p>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Keep using NeuroNest to earn badges and track your progress!</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              {BADGE_DEFINITIONS.slice(0, 4).map((badge, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded-lg flex flex-col items-center text-center opacity-50"
                >
                  <span className="text-2xl mb-1">{badge.icon}</span>
                  <p className="text-xs font-medium">{badge.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
      
      {unlockedBadge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-2xl font-bold text-center mb-2">New Badge Unlocked! 🎉</h2>
            <div className="text-center my-8">
              <div className="text-6xl mb-4 animate-bounce">{unlockedBadge.icon}</div>
              <h3 className="text-xl font-semibold">{unlockedBadge.name}</h3>
              <p className="text-muted-foreground">{unlockedBadge.description}</p>
            </div>
            <Badge className="w-full justify-center py-3 mb-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              Achievement Unlocked!
            </Badge>
            <Button onClick={closeBadgePopup} className="w-full">
              Continue
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MindGraph;
