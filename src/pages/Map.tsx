
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { MapPin, Layers, Filter, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { features } from "@/components/layout/MainLayout";

const Map = () => {
  return (
    <MainLayout>
      <div className="space-y-8 pt-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight animate-fade-in">
            Community Health Map
          </h2>
          <p className="text-muted-foreground mt-2 animate-fade-in">
            Explore health metrics across Hamilton neighborhoods
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
          <Card className={cn(
            "relative h-[600px] animate-fade-in",
            "glass"
          )}>
            <div className="absolute top-2 right-2">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
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
            <div className="absolute top-4 right-12 z-10 flex gap-2">
              <Button variant="ghost" size="icon">
                <Layers className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <MapPin className="h-12 w-12" />
                <p>Interactive map coming soon</p>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className={cn(
              "p-6 animate-fade-in relative",
              "glass"
            )}>
              <div className="absolute top-2 right-2">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <span className="feature-tag feature-tag-existing flex items-center gap-1">
                        {features.dashboardOverview.type}
                        <Info className="w-3 h-3 info-icon" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p>{features.dashboardOverview.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <h3 className="font-semibold mb-4">Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-300 dark:bg-gray-600" />
                  <span>High Health Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-500 dark:bg-gray-400" />
                  <span>Medium Health Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-700 dark:bg-gray-200" />
                  <span>Low Health Score</span>
                </div>
              </div>
            </Card>

            <Card className={cn(
              "p-6 animate-fade-in relative",
              "glass"
            )}>
              <div className="absolute top-2 right-2">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <span className="feature-tag feature-tag-new flex items-center gap-1">
                        {features.predictiveAnalytics.type}
                        <Info className="w-3 h-3 info-icon" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p>{features.predictiveAnalytics.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <h3 className="font-semibold mb-4">Filters</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Health Indicators</label>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <input type="checkbox" className="mr-2" /> Diabetes Rate
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <input type="checkbox" className="mr-2" /> Mental Health
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <input type="checkbox" className="mr-2" /> Air Quality
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Map;
