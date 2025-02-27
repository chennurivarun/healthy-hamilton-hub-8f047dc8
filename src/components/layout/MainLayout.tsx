
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
import { Home, MapPin, Library, Lightbulb, MessageSquare, Sun, Moon, Info } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const features = {
  dashboardOverview: {
    name: "Dashboard Overview",
    type: "existing",
    description: "Provides a high-level snapshot of key health metrics, enabling users to quickly assess overall community well-being."
  },
  communityHealthMap: {
    name: "Community Health Map",
    type: "enhanced",
    description: "Displays real-time, AI-driven overlays of local health data, helping users spot trends and emerging concerns in specific neighborhoods."
  },
  resourcesDirectory: {
    name: "Resources Directory",
    type: "existing",
    description: "Offers quick access to critical resources like emergency services, community centers, and online portals, saving time for users seeking help."
  },
  employmentCenters: {
    name: "Employment Centers",
    type: "new",
    description: "Highlights local employment centers, including job listings and transit information, providing economic and social support for the community."
  },
  healthInsights: {
    name: "Health Insights",
    type: "enhanced",
    description: "Incorporates AI analytics to show trends, predictive modeling, and correlations, enabling evidence-based decision-making."
  },
  monthlyHealthIndicators: {
    name: "Monthly Health Indicators",
    type: "existing",
    description: "Tracks metrics such as diabetes prevalence, mental health visits, and air quality, giving users a consistent reference point over time."
  },
  predictiveAnalytics: {
    name: "Predictive Analytics",
    type: "new",
    description: "Utilizes machine learning to forecast future health risks and resource demands, empowering proactive intervention strategies."
  },
  aiHealthAssistant: {
    name: "AI Health Assistant (Chat)",
    type: "enhanced",
    description: "Offers a conversational interface for scheduling appointments, answering health questions, and providing personalized recommendations."
  },
  darkModeToggle: {
    name: "Dark Mode Toggle",
    type: "new",
    description: "Allows users to switch to a low-light interface, reducing eye strain and enhancing readability in dark environments."
  },
  glassmorphicUIPanels: {
    name: "Glassmorphic UI Panels",
    type: "new",
    description: "Adds a modern, translucent design aesthetic that emphasizes content while maintaining a clean, minimalist look."
  },
  globalSearch: {
    name: "Global Search",
    type: "new",
    description: "Provides a unified search interface to quickly find health resources, metrics, and information across the entire platform."
  }
};

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

  // Feature labels to show in the top-right corner
  const featuresToShowInCorner = [
    features.darkModeToggle,
    features.glassmorphicUIPanels,
    features.globalSearch,
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background transition-colors duration-300 pb-32">
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          {featuresToShowInCorner.map((feature) => (
            <Tooltip key={feature.name}>
              <TooltipTrigger asChild>
                <div className={cn(
                  "feature-tag flex items-center gap-1 group",
                  feature.type === "existing" && "feature-tag-existing",
                  feature.type === "enhanced" && "feature-tag-improved",
                  feature.type === "new" && "feature-tag-new"
                )}>
                  {feature.name}
                  <Info className="w-3 h-3 info-icon" />
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
