
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "bot",
    content: "Hi there! I'm NeuroBot, your friendly mind companion! How can I help you today?",
    timestamp: new Date()
  }
];

// For a more realistic AI-like experience with varied responses
const AI_KNOWLEDGE_BASE = {
  "feelings": [
    "It sounds like you're going through a lot right now. Your feelings are completely valid.",
    "Emotions are complex, but they're also what make us human. What you're feeling makes sense to me.",
    "Thank you for sharing that with me. It takes courage to talk about your feelings.",
    "I'm here to listen whenever you need to express yourself. Your emotional well-being matters.",
    "It's perfectly okay to feel that way. Many people experience similar emotions."
  ],
  "anxiety": [
    "When you're feeling anxious, try the 5-4-3-2-1 technique: notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    "Deep breathing can help reduce anxiety. Try breathing in for 4 counts, holding for 7, and exhaling for 8.",
    "Anxiety is often about future concerns. Try to gently bring your attention back to the present moment.",
    "Physical activity is a great way to reduce anxiety. Even a short walk can help clear your mind."
  ],
  "depression": [
    "Depression can make everything feel overwhelming. It's okay to focus on just one small task at a time.",
    "Remember that depression lies to you about your worth and capabilities. You matter more than you know.",
    "Self-care isn't selfish - it's necessary. What's one small thing you could do for yourself today?",
    "Even on the hardest days, you're doing better than you think. I'm here to support you."
  ],
  "math": [
    "I'd be happy to help with that calculation! {RESULT}",
    "The answer to your math question is {RESULT}",
    "Let me solve that for you: {RESULT}",
    "Based on my calculations, I get {RESULT}"
  ],
  "science": [
    "From a scientific perspective, {FACT}",
    "According to scientific understanding, {FACT}",
    "Science tells us that {FACT}",
    "That's an interesting scientific question! {FACT}"
  ],
  "default": [
    "I'm here to help with that. Can you tell me more?",
    "That's an interesting question. Let me share some thoughts on that.",
    "I appreciate you asking about that. Here's what I can tell you.",
    "Thanks for bringing that up. I'll do my best to address your question.",
    "I'm listening and I want to understand better. Could you elaborate a bit more?",
    "I'm designed to be helpful with a variety of topics. Let me try to assist with that."
  ]
};

// Scientific facts for demonstrating knowledge
const SCIENCE_FACTS = [
  "the human brain contains approximately 86 billion neurons, each forming thousands of connections.",
  "water can exist in three states of matter simultaneously at what's called the 'triple point'.",
  "DNA in a single human cell would stretch to about 2 meters if fully extended.",
  "quantum entanglement allows particles to be connected regardless of distance, what Einstein called 'spooky action at a distance'.",
  "light takes approximately 8 minutes and 20 seconds to travel from the Sun to Earth.",
  "every atom in your body was created inside stars billions of years ago through nuclear fusion.",
  "the Higgs boson particle gives mass to other fundamental particles, and was discovered in 2012 after a 50-year search.",
  "your body contains more bacterial cells than human cells, forming what scientists call the microbiome."
];

const NeuroBot = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("neuroBotMessages");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert string timestamps back to Date objects
        const formattedMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      } catch (e) {
        console.error("Error parsing saved messages:", e);
      }
    }
  }, []);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 1) { // Don't save if it's just the initial message
      localStorage.setItem("neuroBotMessages", JSON.stringify(messages));
    }
  }, [messages]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate API delay more realistically
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
    
    // Generate a more realistic AI response based on the content
    const botMessage: Message = {
      role: "bot",
      content: generateResponse(input),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
    
    // Update badges for conversation milestones
    checkForBadges();
  };
  
  const generateResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    // Check for math calculations
    if (/(\d+\s*[\+\-\*\/]\s*\d+)/.test(input)) {
      try {
        // Simple math calculation - this is simplified and not secure for production
        const calculation = input.match(/(\d+\s*[\+\-\*\/]\s*\d+)/)?.[0];
        if (calculation) {
          // eslint-disable-next-line no-eval
          const result = eval(calculation);
          const template = getRandomResponse("math");
          return template.replace("{RESULT}", result);
        }
      } catch (e) {
        return "I'm sorry, I couldn't calculate that. Could you try rephrasing?";
      }
    }
    
    // Check for feelings-related content
    if (input.includes("feel") || input.includes("sad") || input.includes("happy") || 
        input.includes("upset") || input.includes("worried") || input.includes("stressed")) {
      return getRandomResponse("feelings");
    }
    
    // Check for anxiety-related content
    if (input.includes("anxiety") || input.includes("anxious") || input.includes("panic") || 
        input.includes("nervous") || input.includes("worry")) {
      return getRandomResponse("anxiety");
    }
    
    // Check for depression-related content
    if (input.includes("depress") || input.includes("hopeless") || input.includes("worthless") || 
        input.includes("empty") || input.includes("tired of everything")) {
      return getRandomResponse("depression");
    }
    
    // Check for science-related questions
    if (input.includes("science") || input.includes("why does") || input.includes("how does") || 
        input.includes("what is") || input.includes("explain")) {
      const fact = SCIENCE_FACTS[Math.floor(Math.random() * SCIENCE_FACTS.length)];
      const template = getRandomResponse("science");
      return template.replace("{FACT}", fact);
    }
    
    // Default response if no specific category matches
    return getRandomResponse("default");
  };
  
  const getRandomResponse = (category: string) => {
    const responses = AI_KNOWLEDGE_BASE[category as keyof typeof AI_KNOWLEDGE_BASE] || AI_KNOWLEDGE_BASE.default;
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  const checkForBadges = () => {
    const uniqueMessages = messages.filter(msg => msg.role === "user").length;
    const badges = JSON.parse(localStorage.getItem("badges") || "[]");
    const unviewedBadges = JSON.parse(localStorage.getItem("unviewedBadges") || "[]");
    
    if (uniqueMessages >= 5 && !badges.includes("neurobot-friend")) {
      badges.push("neurobot-friend");
      unviewedBadges.push({
        id: "neurobot-friend",
        name: "NeuroBot Friend",
        description: "Had 5+ conversations with NeuroBot",
        icon: "🤖"
      });
      
      toast({
        title: "New Badge Unlocked! 🎉",
        description: "🤖 NeuroBot Friend: Had 5+ conversations",
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
    }
    
    localStorage.setItem("badges", JSON.stringify(badges));
    localStorage.setItem("unviewedBadges", JSON.stringify(unviewedBadges));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <h1 className="text-2xl font-bold mb-4">NeuroBot</h1>
      
      <Card className="flex flex-col flex-1 p-4 glass-card overflow-hidden">
        <div className="flex-1 overflow-y-auto mb-4 pr-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "ml-auto" : ""
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[85%] ${
                  message.role === "user"
                    ? "bg-neuroPurple text-white ml-auto"
                    : "bg-neuroLight dark:bg-muted"
                }`}
              >
                {message.content}
              </div>
              <div
                className={`text-xs text-muted-foreground mt-1 ${
                  message.role === "user" ? "text-right" : ""
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-1 text-muted-foreground mb-4">
              <div className="flex">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
              </div>
              <span className="text-xs">NeuroBot is thinking</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="mt-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask NeuroBot anything..."
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isTyping}
            className="bg-neuroPurple hover:bg-neuroPurple/90"
          >
            <Send size={18} />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NeuroBot;
