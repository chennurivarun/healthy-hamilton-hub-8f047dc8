
import { useState } from "react";
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

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const features = {
    navigation: {
      type: "improved",
      description: "Enhanced navigation system with collapsible sidebar and modern animations for improved user experience",
    },
    layout: {
      type: "improved",
      description: "Responsive layout with glassmorphism effects and dark mode optimization for better visibility",
    },
    darkMode: {
      type: "new",
      description: "Modern dark mode implementation with carefully selected color palette for reduced eye strain and better contrast",
    },
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          {Object.entries(features).map(([key, feature]) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <div className={cn(
                  "feature-tag cursor-help flex items-center gap-1 group",
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
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar isOpen={isSidebarOpen} />
          <main className={cn(
            "flex-1 p-6 transition-all duration-300 overflow-auto",
            isSidebarOpen ? "md:ml-64" : "md:ml-20"
          )}>
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MainLayout;

