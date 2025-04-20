
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Puzzle, MessageSquare, Music } from "lucide-react";
import { BarChart } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState("/");

  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location]);

  const navItems = [
    { path: "/", icon: Home, label: "Nest" },
    { path: "/toolkit", icon: Puzzle, label: "Toolkit" },
    { path: "/neurobot", icon: MessageSquare, label: "NeuroBot" },
    { path: "/mind-graph", icon: BarChart, label: "Graph" },
    { path: "/energy-lab", icon: Music, label: "Energy" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-2xl border-t">
      <div className="container flex justify-around p-1">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${activeRoute === item.path ? "active" : ""}`}
          >
            <item.icon size={24} className={activeRoute === item.path ? "text-neuroPurple" : ""} />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
