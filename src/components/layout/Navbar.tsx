import { Menu, Sun, Moon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const location = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const getCurrentTab = () => {
    if (location.pathname === "/") return "dashboard";
    return location.pathname.slice(1);
  };

  const features = {
    themeToggle: {
      type: "improved",
      description: "Enhanced theme switching with smooth transitions and persistent state",
    },
    navigation: {
      type: "existing",
      description: "Main navigation system with tabs for easy access to different sections",
    },
    accessibility: {
      type: "new",
      description: "Improved accessibility features including enhanced contrast and clear visual indicators",
    },
  };

  return (
    <TooltipProvider>
      <header className="h-16 fixed top-0 left-0 right-0 z-50 glass border-b transition-colors duration-300">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="h-6 w-6 text-primary" />
            </Button>
            <h1 className="text-xl font-semibold text-primary">Hamilton Health Hub</h1>
          </div>
          
          <Tabs value={getCurrentTab()} className="hidden md:block">
            <TabsList className="grid grid-cols-5 w-[600px]">
              <TabsTrigger value="dashboard" asChild>
                <Link to="/">Dashboard</Link>
              </TabsTrigger>
              <TabsTrigger value="map" asChild>
                <Link to="/map">Map</Link>
              </TabsTrigger>
              <TabsTrigger value="resources" asChild>
                <Link to="/resources">Resources</Link>
              </TabsTrigger>
              <TabsTrigger value="insights" asChild>
                <Link to="/insights">Insights</Link>
              </TabsTrigger>
              <TabsTrigger value="chat" asChild>
                <Link to="/chat">Chat</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-4">
            {Object.entries(features).map(([key, feature]) => (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "feature-tag cursor-help flex items-center gap-1",
                    feature.type === "existing" && "feature-tag-existing",
                    feature.type === "improved" && "feature-tag-improved",
                    feature.type === "new" && "feature-tag-new"
                  )}>
                    {key}
                    <Info className="w-3 h-3" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p>{feature.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="transition-transform hover:scale-110"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default Navbar;
