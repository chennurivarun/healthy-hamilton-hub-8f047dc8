
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MainLayoutProps {
  children: React.ReactNode;
}

interface Feature {
  type: "existing" | "improved" | "new";
  title: string;
  description: string;
  details: string;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  // Get initial theme from system preference
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const features: Record<string, Feature> = {
    navigation: {
      type: "improved",
      title: "Enhanced Navigation",
      description: "Modern navigation system with collapsible sidebar",
      details: "Our enhanced navigation system features a collapsible sidebar, smooth transitions, and improved mobile responsiveness. The system adapts to your viewing preferences and provides quick access to all major sections.",
    },
    layout: {
      type: "improved",
      title: "Responsive Layout",
      description: "Glassmorphic UI with dark mode optimization",
      details: "The responsive layout system uses modern glassmorphism effects combined with carefully selected color palettes that work beautifully in both light and dark modes. All components are optimized for accessibility and visual appeal.",
    },
    darkMode: {
      type: "new",
      title: "Smart Dark Mode",
      description: "Context-aware theme switching with smooth transitions",
      details: "Our new dark mode implementation automatically detects system preferences while allowing manual control. It features smooth transitions and ensures optimal contrast ratios for improved readability and reduced eye strain.",
    },
  };

  return (
    <div className="min-h-screen bg-background transition-all duration-300 ease-in-out">
      <div className="fixed top-4 right-4 z-50 flex gap-2 animate-fade-in">
        {Object.entries(features).map(([key, feature]) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setSelectedFeature(feature)}
                className={cn(
                  "feature-tag cursor-help flex items-center gap-1 group transition-all duration-300 hover:scale-105",
                  feature.type === "existing" && "feature-tag-existing",
                  feature.type === "improved" && "feature-tag-improved",
                  feature.type === "new" && "feature-tag-new"
                )}
              >
                {key}
                <Info className="w-3 h-3 transition-opacity opacity-50 group-hover:opacity-100" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p>{feature.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Feature Details Dialog */}
      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="sm:max-w-[425px] glass dark:neo-blur">
          <DialogHeader>
            <DialogTitle className={cn(
              "flex items-center gap-2",
              selectedFeature?.type === "existing" && "text-blue-600 dark:text-blue-400",
              selectedFeature?.type === "improved" && "text-green-600 dark:text-green-400",
              selectedFeature?.type === "new" && "text-purple-600 dark:text-purple-400"
            )}>
              {selectedFeature?.title}
              <span className={cn(
                "text-xs font-normal py-0.5 px-2 rounded-full",
                selectedFeature?.type === "existing" && "bg-blue-100 text-blue-700 dark:bg-blue-500/20",
                selectedFeature?.type === "improved" && "bg-green-100 text-green-700 dark:bg-green-500/20",
                selectedFeature?.type === "new" && "bg-purple-100 text-purple-700 dark:bg-purple-500/20"
              )}>
                {selectedFeature?.type}
              </span>
            </DialogTitle>
            <DialogDescription className="pt-2">{selectedFeature?.details}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={cn(
          "flex-1 p-6 transition-all duration-300 ease-in-out overflow-auto",
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
