
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

const BreatheTool = () => {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [counter, setCounter] = useState(4);
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
          
          // Use the phase directly from the component state
          // instead of an undefined "currentPhase" variable
          return phase === "inhale" ? 7 : phase === "hold" ? 8 : phase === "exhale" ? 4 : 2;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Get the appropriate animation and instruction based on the current phase
  const getAnimation = () => {
    switch (phase) {
      case "inhale":
        return "scale-100 animate-[breathe-in_4s_ease-in_forwards]";
      case "hold":
        return "scale-125";
      case "exhale":
        return "scale-125 animate-[breathe-in_8s_ease-out_reverse_forwards]";
      case "rest":
        return "scale-100";
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
          className={`breathe-bubble ${getAnimation()}`}
        >
          <div className="text-center">
            <div className="text-xl">{getInstruction()}</div>
            <div className="text-3xl font-bold mt-2">{counter}</div>
          </div>
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
