
import { cn } from "@/lib/utils";
import { Home, MapPin, Library, Lightbulb, MessageSquare, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BottomNav = () => {
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

  const navigation = [
    { name: "Dashboard", icon: Home, href: "/" },
    { name: "Map View", icon: MapPin, href: "/map" },
    { name: "Resources", icon: Library, href: "/resources" },
    { name: "Insights", icon: Lightbulb, href: "/insights" },
    { name: "Chat", icon: MessageSquare, href: "/chat" },
  ];

  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-0 left-0 right-0 z-50 glass">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center justify-around w-full">
            {navigation.map((item) => (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg transition-all",
                      isActivePath(item.href)
                        ? "text-primary"
                        : "text-muted-foreground",
                      "hover:bg-secondary"
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs mt-1">{item.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="mb-1">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleTheme}
                  className="flex flex-col items-center justify-center p-2 rounded-lg transition-all text-muted-foreground hover:bg-secondary"
                >
                  {theme === "light" ? (
                    <Moon className="h-6 w-6" />
                  ) : (
                    <Sun className="h-6 w-6" />
                  )}
                  <span className="text-xs mt-1">Theme</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="mb-1">
                <p>Toggle dark mode</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BottomNav;
