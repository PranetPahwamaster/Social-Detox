
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DistractionItem {
  type: "fact" | "joke" | "riddle" | "puzzle" | "inspiration" | "challenge";
  title: string;
  content: string;
  emoji?: string;
}

const DISTRACTIONS: DistractionItem[] = [
  {
    type: "fact",
    title: "Amazing Fact",
    content: "Your brain uses about 20% of all the oxygen you breathe! It's a real energy consumer!",
    emoji: "🧠"
  },
  {
    type: "fact",
    title: "Brain Fact",
    content: "Your brain generates enough electricity to power a small light bulb, even when you're sleeping.",
    emoji: "💡"
  },
  {
    type: "joke",
    title: "Quick Laugh",
    content: "Why don't scientists trust atoms? Because they make up everything!",
    emoji: "🤣"
  },
  {
    type: "joke",
    title: "Silly Joke",
    content: "What did one wall say to the other wall? I'll meet you at the corner!",
    emoji: "🧱"
  },
  {
    type: "puzzle",
    title: "Brain Teaser",
    content: "I'm tall when I'm young, and short when I'm old. What am I? (Answer: A candle)",
    emoji: "🕯️"
  },
  {
    type: "riddle",
    title: "Mind Puzzle",
    content: "What has a head, a tail, is brown, and has no legs? (Answer: A penny)",
    emoji: "🪙"
  },
  {
    type: "riddle",
    title: "Quick Riddle",
    content: "What has to be broken before you can use it? (Answer: An egg)",
    emoji: "🥚"
  },
  {
    type: "inspiration",
    title: "Mind Quote",
    content: "'The mind is everything. What you think, you become.' – Buddha",
    emoji: "✨"
  },
  {
    type: "inspiration",
    title: "Positive Thought",
    content: "'Your mind is a garden. Your thoughts are the seeds. You can grow flowers or you can grow weeds.'",
    emoji: "🌱"
  },
  {
    type: "puzzle",
    title: "Number Puzzle",
    content: "Complete the sequence: 1, 4, 9, 16, 25, ? (Answer: 36 - they're perfect squares!)",
    emoji: "🔢"
  },
  {
    type: "challenge",
    title: "Quick Challenge",
    content: "Stand up and touch your toes 10 times. Get that blood flowing!",
    emoji: "🏃"
  },
  {
    type: "challenge",
    title: "Mental Reset",
    content: "Name 5 blue objects you can see around you right now.",
    emoji: "👁️"
  },
  {
    type: "fact",
    title: "Space Fact",
    content: "There are more stars in the universe than grains of sand on all of Earth's beaches combined.",
    emoji: "🌌"
  },
  {
    type: "joke",
    title: "Dad Joke",
    content: "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    emoji: "👨"
  }
];

const DistractTool = () => {
  const [currentDistraction, setCurrentDistraction] = useState<DistractionItem | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [categories, setCategories] = useState<Record<string, boolean>>({
    fact: true,
    joke: true,
    riddle: true,
    puzzle: true,
    inspiration: true,
    challenge: true
  });
  
  useEffect(() => {
    // Load saved completed count
    const saved = localStorage.getItem("distractionCompleted");
    if (saved) {
      setCompletedCount(parseInt(saved, 10));
    }
  }, []);
  
  const getRandomDistraction = () => {
    // Filter by selected categories
    const filteredDistractions = DISTRACTIONS.filter(item => categories[item.type]);
    
    if (filteredDistractions.length === 0) {
      // If no categories selected, show all
      setCategories({
        fact: true,
        joke: true,
        riddle: true,
        puzzle: true,
        inspiration: true,
        challenge: true
      });
      return;
    }
    
    let newDistraction: DistractionItem;
    do {
      newDistraction = filteredDistractions[Math.floor(Math.random() * filteredDistractions.length)];
    } while (newDistraction === currentDistraction && filteredDistractions.length > 1);
    
    setCurrentDistraction(newDistraction);
    setShowAnswer(false);
  };
  
  const handleComplete = () => {
    const newCount = completedCount + 1;
    setCompletedCount(newCount);
    localStorage.setItem("distractionCompleted", newCount.toString());
    getRandomDistraction();
  };
  
  const toggleCategory = (category: string) => {
    setCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const hasAnswer = (content: string) => {
    return content.includes("(Answer:");
  };
  
  const getContentWithoutAnswer = (content: string) => {
    if (!hasAnswer(content)) return content;
    return content.split("(Answer:")[0].trim();
  };
  
  const getAnswer = (content: string) => {
    if (!hasAnswer(content)) return "";
    return content.split("(Answer:")[1].replace(")", "").trim();
  };
  
  const getCategoryColor = (type: string) => {
    switch (type) {
      case "fact":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "joke":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "riddle":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "puzzle":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inspiration":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      case "challenge":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-xl font-semibold mb-4 text-center">Distract Me</h2>
      
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {Object.keys(categories).map(category => (
          <Button
            key={category}
            size="sm"
            variant={categories[category] ? "default" : "outline"}
            className={`px-2 py-1 text-xs ${categories[category] ? "opacity-100" : "opacity-60"}`}
            onClick={() => toggleCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>
      
      {currentDistraction ? (
        <div className="animate-float">
          <div className="bg-gradient-to-r from-neuroLight/70 to-neuroLight/30 dark:bg-accent p-6 rounded-lg mb-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">{currentDistraction.title}</h3>
              <Badge className={getCategoryColor(currentDistraction.type)}>
                {currentDistraction.type}
              </Badge>
            </div>
            
            {currentDistraction.emoji && (
              <div className="text-4xl mb-3 text-center">{currentDistraction.emoji}</div>
            )}
            
            <p className="text-base">{getContentWithoutAnswer(currentDistraction.content)}</p>
            
            {hasAnswer(currentDistraction.content) && (
              <div className="mt-4">
                {showAnswer ? (
                  <p className="font-medium p-2 bg-green-100/50 dark:bg-green-900/30 rounded">
                    <span className="font-bold">Answer:</span> {getAnswer(currentDistraction.content)}
                  </p>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAnswer(true)}
                  >
                    Reveal Answer
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={getRandomDistraction} 
              className="flex-1 bg-neuroTeal hover:bg-neuroTeal/90 text-black"
            >
              Show Me Another
            </Button>
            
            <Button 
              onClick={handleComplete} 
              variant="outline"
              className="flex-1"
            >
              Mark Completed
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="mb-6 text-muted-foreground">
            Need a quick distraction? Click the button for a random fact, joke, or brain puzzle!
          </p>
          <Button 
            onClick={getRandomDistraction} 
            className="bg-neuroTeal hover:bg-neuroTeal/90 text-black"
            size="lg"
          >
            Distract Me Now
          </Button>
        </div>
      )}
      
      {completedCount > 0 && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          You've completed {completedCount} distractions! 
          {completedCount >= 10 && " You're a distraction master! 🏆"}
        </div>
      )}
    </Card>
  );
};

export default DistractTool;
