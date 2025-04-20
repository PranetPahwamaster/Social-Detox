
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BreatheTool = () => {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [counter, setCounter] = useState(4);
  const [isActive, setIsActive] = useState(true);
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    startBreathingExercise();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const startBreathingExercise = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setPhase("inhale");
    setCounter(4);
    setIsActive(true);
    
    timerRef.current = window.setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          setPhase((currentPhase) => {
            switch (currentPhase) {
              case "inhale":
                return "hold";
              case "hold":
                return "exhale";
              case "exhale":
                return "rest";
              case "rest":
                return "inhale";
              default:
                return "inhale";
            }
          });
          
          // Use the phase from functional update
          return (prevPhase) => {
            if (prevPhase === "inhale") return 7;
            if (prevPhase === "hold") return 8;
            if (prevPhase === "exhale") return 4;
            return 2; // rest
          };
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const pauseBreathingExercise = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsActive(false);
  };
  
  const resumeBreathingExercise = () => {
    startBreathingExercise();
  };
  
  // Get the appropriate animation and instruction based on the current phase
  const getAnimation = () => {
    switch (phase) {
      case "inhale":
        return "scale-100 animate-[breathe-in_4s_ease-in_forwards] bg-gradient-to-r from-blue-400/50 to-purple-400/50";
      case "hold":
        return "scale-125 bg-gradient-to-r from-purple-500/60 to-indigo-500/60";
      case "exhale":
        return "scale-125 animate-[breathe-in_8s_ease-out_reverse_forwards] bg-gradient-to-r from-indigo-400/50 to-blue-300/50";
      case "rest":
        return "scale-100 bg-gradient-to-r from-blue-300/40 to-purple-300/40";
      default:
        return "";
    }
  };
  
  const getInstruction = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "rest":
        return "Rest";
      default:
        return "";
    }
  };

  return (
    <Card className="p-8 glass-card">
      <h2 className="text-xl font-semibold mb-6 text-center">Breathe Buddy</h2>
      
      <div className="flex flex-col items-center justify-center">
        <div 
          className={`breathe-bubble shadow-lg ${getAnimation()}`}
        >
          <div className="text-center">
            <div className="text-xl">{getInstruction()}</div>
            <div className="text-3xl font-bold mt-2">{counter}</div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center gap-4">
          {isActive ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={pauseBreathingExercise}
            >
              Pause
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resumeBreathingExercise}
            >
              Resume
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={startBreathingExercise}
          >
            Restart
          </Button>
        </div>
        
        <p className="mt-8 text-center text-muted-foreground">
          Focus on the bubble and follow along with your breath.
          <br />
          Let your thoughts come and go like clouds.
        </p>
      </div>
    </Card>
  );
};

export default BreatheTool;
