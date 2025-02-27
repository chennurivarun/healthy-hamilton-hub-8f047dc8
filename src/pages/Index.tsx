
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Activity, Users, AlertTriangle, TrendingUp, Info, Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { features } from "@/components/layout/MainLayout";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  const metrics = [
    {
      title: "Diabetes Prevalence",
      value: "8.5%",
      change: "+0.3%",
      icon: Activity,
      feature: features.monthlyHealthIndicators,
    },
    {
      title: "Mental Health Visits",
      value: "2,847",
      change: "+12%",
      icon: Users,
      feature: features.healthInsights,
    },
    {
      title: "Air Quality Index",
      value: "Good",
      change: "Stable",
      icon: AlertTriangle,
      feature: features.monthlyHealthIndicators,
    },
    {
      title: "Employment Rate",
      value: "94%",
      change: "+2.1%",
      icon: TrendingUp,
      feature: features.employmentCenters,
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for: "${searchQuery}"`,
      });
      setSearchQuery("");
      setShowSearchInput(false);
    } else {
      toast({
        title: "Search error",
        description: "Please enter a search term",
        variant: "destructive",
      });
    }
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    if (!showSearchInput) {
      setTimeout(() => {
        const searchInput = document.getElementById("global-search-input");
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 pt-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight animate-fade-in">
            Hamilton Health Hub
          </h2>
          <p className="text-muted-foreground mt-2 animate-fade-in">
            Explore health metrics, resources, and community insights
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <Card 
              key={metric.title} 
              className={cn(
                "p-6 relative overflow-hidden group",
                "glass hover:shadow-xl transition-all duration-300 hover:scale-[1.02]",
                "animate-fade-in"
              )}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute top-2 right-2 cursor-pointer">
                      <span className={cn(
                        "feature-tag flex items-center gap-1 group-hover:bg-opacity-100 transition-all",
                        metric.feature.type === "existing" && "feature-tag-existing",
                        metric.feature.type === "enhanced" && "feature-tag-improved",
                        metric.feature.type === "new" && "feature-tag-new"
                      )}>
                        {metric.feature.type}
                        <Info className="w-3 h-3 info-icon" />
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>{metric.feature.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="flex items-center gap-4">
                <metric.icon className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">{metric.value}</h3>
                    <span className={cn(
                      "text-sm",
                      metric.change.startsWith("+") ? "text-accent" : "text-muted-foreground"
                    )}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className={cn(
          "h-96 relative overflow-hidden animate-fade-in",
          "glass rounded-xl"
        )} 
          style={{ animationDelay: "400ms" }}
        >
          <div className="absolute top-2 right-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="feature-tag feature-tag-improved flex items-center gap-1">
                    {features.communityHealthMap.type}
                    <Info className="w-3 h-3 info-icon" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p>{features.communityHealthMap.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Community Health Map</h3>
            <div className="h-full bg-muted/30 rounded-lg flex items-center justify-center">
              Map Preview (Coming Soon)
            </div>
          </div>
        </div>
      </div>

      {/* Global Search Button */}
      <div className="global-search-button" onClick={toggleSearchInput}>
        <Search className="h-6 w-6" />
      </div>

      {/* Search Modal */}
      {showSearchInput && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Search Hamilton Health Hub</h3>
            <div className="flex gap-2">
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search for health resources, metrics, etc."
                className="flex-1 bg-transparent border rounded-md px-3 py-2"
                autoFocus
              />
              <button 
                onClick={handleSearch}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => setShowSearchInput(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Index;
