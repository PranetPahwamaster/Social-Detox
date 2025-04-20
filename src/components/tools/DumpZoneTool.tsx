
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const DumpZoneTool = () => {
  const [thoughts, setThoughts] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = async () => {
    if (!thoughts.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call to GPT (in a real app, this would call OpenAI)
      // This is a placeholder for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Predefined supportive responses for demo
      const supportiveResponses = [
        "I hear you, and your feelings are completely valid. Take it one step at a time.",
        "It sounds like you've been dealing with a lot. Remember to be gentle with yourself.",
        "Thank you for sharing that. It takes courage to express your feelings, and I'm here to listen.",
        "That's a lot to carry. Remember that difficult feelings are temporary, and you won't always feel this way.",
        "I appreciate you opening up. Sometimes just getting thoughts out can help us process them better.",
      ];
      
      // Select a random response
      const randomResponse = supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
      setResponse(randomResponse);
      setSubmitted(true);
      
      // Save to local storage for history
      const journalEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
      journalEntries.push({
        thoughts,
        response: randomResponse,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
      
    } catch (error) {
      console.error("Error generating response:", error);
      setResponse("Sorry, I couldn't process that right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setThoughts("");
    setResponse("");
    setSubmitted(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-xl font-semibold mb-4 text-center">Dump Zone</h2>
      
      <p className="text-sm text-muted-foreground mb-4 text-center">
        Write down whatever's on your mind. No judgment, just a place to let it all out.
      </p>
      
      {!submitted ? (
        <>
          <Textarea
            ref={textareaRef}
            placeholder="What's on your mind today? Type anything you're feeling..."
            className="min-h-[150px] mb-4"
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
          />
          
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-neuroPurple hover:bg-neuroPurple/90"
            disabled={!thoughts.trim() || isLoading}
          >
            {isLoading ? "Thinking..." : "Share Your Thoughts"}
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="bg-neuroLight dark:bg-muted p-4 rounded-lg">
            <p className="italic text-sm text-muted-foreground mb-2">You wrote:</p>
            <p className="text-sm">{thoughts}</p>
          </div>
          
          <div className="bg-neuroPurple/10 p-4 rounded-lg">
            <p className="font-bold mb-1">NeuroBot says:</p>
            <p>{response}</p>
          </div>
          
          <Button 
            onClick={handleReset} 
            variant="outline" 
            className="w-full mt-4"
          >
            Write Something New
          </Button>
        </div>
      )}
    </Card>
  );
};

export default DumpZoneTool;
