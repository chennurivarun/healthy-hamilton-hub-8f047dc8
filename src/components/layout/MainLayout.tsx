
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MenuBar } from "@/components/ui/bottom-menu";
import { Home, MapPin, Library, Lightbulb, MessageSquare, Sun, Moon } from "lucide-react";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const features = {
    navigation: {
      type: "improved",
      description: "Bottom navigation bar with minimalist icons for improved mobile experience",
    },
    layout: {
      type: "improved",
      description: "Responsive layout with glassmorphism effects and black & white aesthetic",
    },
    darkMode: {
      type: "new",
      description: "Modern dark mode implementation with grayscale palette for reduced eye strain and better contrast",
    },
  };

  const menuItems = [
    {
      icon: (props) => <Home {...props} />,
      label: "Dashboard",
      href: "/"
    },
    {
      icon: (props) => <MapPin {...props} />,
      label: "Map View",
      href: "/map"
    },
    {
      icon: (props) => <Library {...props} />,
      label: "Resources",
      href: "/resources"
    },
    {
      icon: (props) => <Lightbulb {...props} />,
      label: "Insights",
      href: "/insights"
    },
    {
      icon: (props) => <MessageSquare {...props} />,
      label: "Chat",
      href: "/chat"
    },
    {
      icon: (props) => theme === "light" ? <Moon {...props} /> : <Sun {...props} />,
      label: "Theme"
    }
  ];

  const handleMenuItemClick = (index: number) => {
    if (index === menuItems.length - 1) {
      toggleTheme();
    } else {
      const item = menuItems[index];
      if (item.href) {
        navigate(item.href);
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background transition-colors duration-300 pb-32">
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          {Object.entries(features).map(([key, feature]) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <div className={cn(
                  "feature-tag flex items-center gap-1 group",
                  feature.type === "existing" && "feature-tag-existing",
                  feature.type === "improved" && "feature-tag-improved",
                  feature.type === "new" && "feature-tag-new"
                )}>
                  {key}
                  <Info className="w-3 h-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p>{feature.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <main className="container mx-auto px-4 pt-4">
          {children}
        </main>

        <div className="menu-bar-container">
          <Card className="nav-card p-2 border-0">
            <MenuBar items={menuItems} onItemClick={handleMenuItemClick} />
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MainLayout;
