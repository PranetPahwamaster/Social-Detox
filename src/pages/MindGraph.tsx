
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

interface MoodEntry {
  mood: string;
  timestamp: string;
}

interface JournalEntry {
  thoughts: string;
  response: string;
  timestamp: string;
}

interface ToolUsage {
  tool: string;
  count: number;
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

const MindGraph = () => {
  const [moodData, setMoodData] = useState<ChartDataItem[]>([]);
  const [toolData, setToolData] = useState<ChartDataItem[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  
  useEffect(() => {
    // Load and process mood data
    const moodHistory: MoodEntry[] = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    const moodCounts: Record<string, number> = {};
    
    moodHistory.forEach((entry) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    const formattedMoodData = Object.keys(moodCounts).map((mood) => ({
      name: mood,
      value: moodCounts[mood],
      emoji: MOOD_EMOJIS[mood] || "😐"
    }));
    
    setMoodData(formattedMoodData);
    
    // Process journal entries for dump tool usage
    const journalEntries: JournalEntry[] = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    
    // Process neurobot messages for neurobot usage
    const neuroBotMessages = JSON.parse(localStorage.getItem("neuroBotMessages") || "[]");
    const userMessages = neuroBotMessages.filter((msg: any) => msg.role === "user").length;
    
    // For demo, create simulated tool usage
    const toolUsage: ToolUsage[] = [
      { tool: "breathe", count: Math.floor(Math.random() * 10) + (moodCounts["anxious"] || 0) },
      { tool: "sounds", count: Math.floor(Math.random() * 8) + 2 },
      { tool: "dump", count: journalEntries.length },
      { tool: "distract", count: Math.floor(Math.random() * 7) + 3 },
      { tool: "neurobot", count: userMessages }
    ];
    
    const formattedToolData = toolUsage.map((tool) => ({
      name: tool.tool,
      value: tool.count,
      emoji: TOOL_EMOJIS[tool.tool] || "🛠️"
    }));
    
    setToolData(formattedToolData);
    
    // Generate badges
    const newBadges = [];
    
    if (moodHistory.length >= 5) {
      newBadges.push("🏆 Mood Tracker: Logged 5+ moods");
    }
    
    if (journalEntries.length >= 3) {
      newBadges.push("✍️ Journaling Star: Used Dump Zone 3+ times");
    }
    
    if (userMessages >= 5) {
      newBadges.push("🤖 NeuroBot Friend: Had 5+ conversations");
    }
    
    // Check for multiple days usage
    const uniqueDays = new Set(
      [...moodHistory].map(entry => 
        new Date(entry.timestamp).toLocaleDateString()
      )
    );
    
    if (uniqueDays.size >= 3) {
      newBadges.push("🔥 3-Day Streak: Used NeuroNest for 3+ days");
    }
    
    setBadges(newBadges);
    
  }, []);

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
      
      <Card className="p-6 glass-card mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Mood This Week</h2>
        
        {moodData.length > 0 ? (
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
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No mood data yet. Tell us how you're feeling on the home page!</p>
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
      </Card>
      
      <Card className="p-6 glass-card">
        <h2 className="text-xl font-semibold mb-4">Your Badges</h2>
        
        {badges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <div 
                key={index} 
                className="p-4 bg-neuroLight dark:bg-muted rounded-lg flex items-center gap-3 animate-pulse-soft"
              >
                <span className="text-2xl">{badge.split(" ")[0]}</span>
                <div>
                  <p className="font-medium">{badge.split(" ").slice(1).join(" ")}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Keep using NeuroNest to earn badges and track your progress!</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MindGraph;
