
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Activity, Users, AlertTriangle, TrendingUp, Info, LineChart, BarChart } from "lucide-react";
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <Card 
              key={metric.title} 
              className={cn(
                "p-6 relative overflow-hidden group",
                "dashboard-card",
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
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <metric.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">{metric.value}</h3>
                    <span className={cn(
                      "text-sm",
                      metric.change.startsWith("+") ? "text-primary" : "text-muted-foreground"
                    )}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Stylized minimal chart */}
              <div className="mt-4 h-10 flex items-end justify-between">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-[8%] bg-primary/20 rounded-sm" 
                    style={{ 
                      height: `${20 + Math.random() * 80}%`,
                      opacity: i === 7 ? 1 : 0.5 + (i * 0.07)
                    }}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className={cn(
            "col-span-2 h-96 relative overflow-hidden animate-fade-in",
            "dashboard-card"
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
              <div className="flex items-center gap-2 mb-4">
                <LineChart className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Community Health Map</h3>
              </div>
              <div className="h-[calc(100%-48px)] rounded-xl bg-secondary/30 flex items-center justify-center overflow-hidden map-container">
                <div className="text-muted-foreground">Map Preview (Coming Soon)</div>
              </div>
            </div>
          </Card>

          <Card className={cn(
            "h-96 relative overflow-hidden animate-fade-in",
            "dashboard-card"
          )} 
            style={{ animationDelay: "500ms" }}
          >
            <div className="absolute top-2 right-2">
              <TooltipProvider>
                <Tooltip>
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
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Health Trends</h3>
              </div>
              <div className="space-y-4">
                {["Diabetes", "Mental Health", "Respiratory Issues", "Heart Disease"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground w-32">{item}</div>
                    <div className="flex-1 h-2 bg-secondary/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ 
                          width: `${30 + Math.random() * 60}%`,
                          opacity: 0.7 + (index * 0.1)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
