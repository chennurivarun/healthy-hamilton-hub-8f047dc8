
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Activity, Users, AlertTriangle, TrendingUp, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { features } from "@/components/layout/MainLayout";

const Index = () => {
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
                        <Info className="w-3 h-3" />
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
                    <Info className="w-3 h-3" />
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
    </MainLayout>
  );
};

export default Index;
