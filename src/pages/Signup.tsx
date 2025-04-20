
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import Login from "./Login";

export default function Signup() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-neuroPurple/30 via-neuroBlue/20 to-neuroTeal/30">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-neuroPurple/10 via-transparent to-neuroTeal/10 backdrop-blur-[2px]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
        }} />
      </div>
      
      <div className="container relative max-w-md px-4 py-8 z-10">
        <div className="text-center mb-8 space-y-3">
          <h1 className="font-nunito text-4xl font-bold bg-gradient-to-r from-neuroPurple to-neuroTeal bg-clip-text text-transparent">
            NeuroNest
          </h1>
          <p className="text-muted-foreground font-light text-lg">
            Your digital mind sanctuary
          </p>
        </div>
        
        <Login />
      </div>
    </div>
  );
}
