
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DistractionItem {
  type: "fact" | "joke" | "riddle" | "puzzle" | "inspiration";
  title: string;
  content: string;
}

const DISTRACTIONS: DistractionItem[] = [
  {
    type: "fact",
    title: "Amazing Fact",
    content: "Your brain uses about 20% of all the oxygen you breathe! It's a real energy consumer!"
  },
  {
    type: "fact",
    title: "Brain Fact",
    content: "Your brain generates enough electricity to power a small light bulb, even when you're sleeping."
  },
  {
    type: "joke",
    title: "Quick Laugh",
    content: "Why don't scientists trust atoms? Because they make up everything!"
  },
  {
    type: "joke",
    title: "Silly Joke",
    content: "What did one wall say to the other wall? I'll meet you at the corner!"
  },
  {
    type: "puzzle",
    title: "Brain Teaser",
    content: "I'm tall when I'm young, and short when I'm old. What am I? (Answer: A candle)"
  },
  {
    type: "riddle",
    title: "Mind Puzzle",
    content: "What has a head, a tail, is brown, and has no legs? (Answer: A penny)"
  },
  {
    type: "riddle",
    title: "Quick Riddle",
    content: "What has to be broken before you can use it? (Answer: An egg)"
  },
  {
    type: "inspiration",
    title: "Mind Quote",
    content: "'The mind is everything. What you think, you become.' – Buddha"
  },
  {
    type: "inspiration",
    title: "Positive Thought",
    content: "'Your mind is a garden. Your thoughts are the seeds. You can grow flowers or you can grow weeds.'"
  },
  {
    type: "puzzle",
    title: "Number Puzzle",
    content: "Complete the sequence: 1, 4, 9, 16, 25, ? (Answer: 36 - they're perfect squares!)"
  }
];

const DistractTool = () => {
  const [currentDistraction, setCurrentDistraction] = useState<DistractionItem | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const getRandomDistraction = () => {
    let newDistraction: DistractionItem;
    do {
      newDistraction = DISTRACTIONS[Math.floor(Math.random() * DISTRACTIONS.length)];
    } while (newDistraction === currentDistraction);
    
    setCurrentDistraction(newDistraction);
    setShowAnswer(false);
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

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-xl font-semibold mb-4 text-center">Distract Me</h2>
      
      {currentDistraction ? (
        <div className="animate-float">
          <div className="bg-neuroLight dark:bg-accent p-6 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-2">{currentDistraction.title}</h3>
            
            <p>{getContentWithoutAnswer(currentDistraction.content)}</p>
            
            {hasAnswer(currentDistraction.content) && (
              <div className="mt-4">
                {showAnswer ? (
                  <p className="font-medium">
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
          
          <Button 
            onClick={getRandomDistraction} 
            className="w-full bg-neuroTeal hover:bg-neuroTeal/90 text-black"
          >
            Show Me Another
          </Button>
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
    </Card>
  );
};

export default DistractTool;
