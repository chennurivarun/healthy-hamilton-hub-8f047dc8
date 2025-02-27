
import { useState } from "react";
import { cn } from "@/lib/utils";
import BottomNav from "./BottomNav";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background transition-colors duration-300 pb-24">
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
        <BottomNav />
      </div>
    </TooltipProvider>
  );
};

export default MainLayout;
