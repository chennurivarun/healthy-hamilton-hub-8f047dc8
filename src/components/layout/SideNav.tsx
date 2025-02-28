import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Home, MapPin, Library, Lightbulb, MessageSquare, Sun, Moon } from "lucide-react";

// Add this to your global CSS or component styles
const navStyles = `
  /* Ensure icons are visible without hover */
  .side-nav-item {
    @apply flex items-center justify-center w-10 h-10 rounded-md;
    @apply transition-all duration-300;
  }
  
  .side-nav-item svg {
    @apply h-5 w-5 text-primary !opacity-100;
    /* This ensures the icons are always visible */
  }
  
  .side-nav-item:hover {
    @apply bg-primary/10;
  }
  
  .side-nav-item.active {
    @apply bg-primary/20;
  }
`;

const SideNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    
    // Check stored theme preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme as "light" | "dark");
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      // Set dark mode by default
      document.documentElement.classList.add("dark");
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
    
    // Create style element for nav styles
    const styleEl = document.createElement('style');
    styleEl.textContent = navStyles;
    document.head.appendChild(styleEl);
    
    return () => {
      // Clean up
      styleEl.remove();
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  };

  const navigation = [
    { name: "Dashboard", icon: Home, href: "/" },
    { name: "Map View", icon: MapPin, href: "/map" },
    { name: "Resources", icon: Library, href: "/resources" },
    { name: "Insights", icon: Lightbulb, href: "/insights" },
    { name: "Chat", icon: MessageSquare, href: "/chat" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <TooltipProvider>
      <div className="side-nav">
        <div className="flex flex-col items-center h-full py-6">
          <div className="flex-1 flex flex-col items-center space-y-4">
            {navigation.map((item) => (
              <Tooltip key={item.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate(item.href)}
                    className={cn(
                      "side-nav-item",
                      isActive(item.href) && "active"
                    )}
                    aria-label={item.name}
                    style={{ opacity: 1 }} // Force opacity
                  >
                    <item.icon style={{ opacity: 1 }} /> {/* Force opacity */}
                    {isActive(item.href) && (
                      <span className="absolute left-0 w-1 h-8 bg-primary rounded-r-md"></span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="side-nav-tooltip">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          
          <div className="mt-auto">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleTheme}
                  className="side-nav-item"
                  aria-label="Toggle theme"
                  style={{ opacity: 1 }} // Force opacity
                >
                  {theme === "light" ? (
                    <Moon style={{ opacity: 1 }} /> // Force opacity
                  ) : (
                    <Sun style={{ opacity: 1 }} /> // Force opacity
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="side-nav-tooltip">
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SideNav;