
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Affirmation {
  text: string;
  category: "confidence" | "calm" | "growth" | "joy";
}

const AFFIRMATIONS: Affirmation[] = [
  { text: "I am capable of amazing things", category: "confidence" },
  { text: "My mind is strong and creative", category: "confidence" },
  { text: "I believe in myself and my abilities", category: "confidence" },
  { text: "I am enough just as I am", category: "confidence" },
  { text: "I am calm and peaceful", category: "calm" },
  { text: "I release my worries and breathe freely", category: "calm" },
  { text: "My mind is a peaceful garden", category: "calm" },
  { text: "I am safe and supported", category: "calm" },
  { text: "Every day I am growing and learning", category: "growth" },
  { text: "Challenges help me become stronger", category: "growth" },
  { text: "My mind is always growing and expanding", category: "growth" },
  { text: "I learn from every experience", category: "growth" },
  { text: "Joy is within me right now", category: "joy" },
  { text: "I choose to focus on the good", category: "joy" },
  { text: "I deserve happiness and fun", category: "joy" },
  { text: "My smile brightens the world", category: "joy" }
];

const CATEGORY_COLORS: Record<string, string> = {
  confidence: "from-blue-400 to-purple-500",
  calm: "from-green-400 to-teal-500",
  growth: "from-yellow-400 to-orange-500",
  joy: "from-pink-400 to-red-500"
};

const CATEGORY_EMOJIS: Record<string, string> = {
  confidence: "💪",
  calm: "🧘‍♂️",
  growth: "🌱",
  joy: "✨"
};

const ZenPlay = () => {
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [favorites, setFavorites] = useState<Affirmation[]>([]);
  
  useEffect(() => {
    generateRandomAffirmation();
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("favoriteAffirmations");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  
  const generateRandomAffirmation = () => {
    setFadeIn(false);
    
    setTimeout(() => {
      const randomAffirmation = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
      setCurrentAffirmation(randomAffirmation);
      setFadeIn(true);
    }, 300);
  };
  
  const toggleFavorite = (affirmation: Affirmation) => {
    const isFavorite = favorites.some(fav => fav.text === affirmation.text);
    
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.text !== affirmation.text);
    } else {
      updatedFavorites = [...favorites, affirmation];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteAffirmations", JSON.stringify(updatedFavorites));
  };
  
  const isCurrentAffirmationFavorite = () => {
    return currentAffirmation && favorites.some(fav => fav.text === currentAffirmation.text);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">ZenPlay</h1>
      
      <Card className="p-6 glass-card mb-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Positive Affirmations</h2>
        
        {currentAffirmation && (
          <div 
            className={`transition-opacity duration-300 ${fadeIn ? "opacity-100" : "opacity-0"}`}
          >
            <div className={`p-8 rounded-xl mb-4 bg-gradient-to-r ${CATEGORY_COLORS[currentAffirmation.category]}`}>
              <div className="text-center">
                <div className="text-4xl mb-4">{CATEGORY_EMOJIS[currentAffirmation.category]}</div>
                <p className="text-xl font-bold text-white">{currentAffirmation.text}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={generateRandomAffirmation} 
                className="flex-1"
              >
                New Affirmation
              </Button>
              <Button 
                onClick={() => toggleFavorite(currentAffirmation)} 
                variant="outline" 
                className="w-10 flex-shrink-0"
              >
                {isCurrentAffirmationFavorite() ? "❤️" : "🤍"}
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      {favorites.length > 0 && (
        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold mb-4">Your Favorite Affirmations</h2>
          
          <div className="space-y-3">
            {favorites.map((affirmation, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg bg-gradient-to-r ${CATEGORY_COLORS[affirmation.category]} bg-opacity-20`}
              >
                <div className="flex items-center gap-2">
                  <span>{CATEGORY_EMOJIS[affirmation.category]}</span>
                  <p className="flex-1 font-medium text-white">{affirmation.text}</p>
                  <button 
                    onClick={() => toggleFavorite(affirmation)}
                    className="text-lg"
                  >
                    ❤️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ZenPlay;
