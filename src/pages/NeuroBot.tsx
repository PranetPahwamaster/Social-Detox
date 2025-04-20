
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

// Predefined bot responses for the demo
const BOT_RESPONSES = [
  "That's a great question! I'm here to help you figure things out.",
  "I understand how you feel. It's totally normal to have these thoughts.",
  "Let's look at this from a different angle. What would make you happy right now?",
  "Sometimes our brains can be tricky! Remember that thoughts aren't always facts.",
  "You're doing great just by talking about this. That takes courage!",
  "What's one small thing you could do today that might make you feel a little better?",
  "I'm really proud of you for sharing that with me. It's not always easy.",
  "Take a deep breath with me. In... and out. How does that feel?",
  "What would your best friend say to you right now?",
  "It's okay to feel this way. Your emotions are important and valid.",
  "Would a quick brain break help? Maybe try the Breathe tool or a fun distraction?",
  "You're stronger than you think. You've gotten through tough times before!"
];

const NeuroBot = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Get random response from our predefined list
    const botResponse = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
    
    // Add bot response
    const botMessage: Message = {
      role: "bot",
      content: botResponse,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
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
              <span className="text-xs">NeuroBot is typing</span>
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
