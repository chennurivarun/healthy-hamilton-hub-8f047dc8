
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Library, Phone, Globe, MessageSquare, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { features } from "@/components/layout/MainLayout";

const Resources = () => {
  const resources = [
    {
      title: "Emergency Services",
      description: "24/7 Health Services & Crisis Lines",
      icon: Phone,
      feature: features.resourcesDirectory,
      items: [
        "Hamilton Health Sciences - Emergency",
        "Mental Health Crisis Line",
        "Public Health Services",
      ],
    },
    {
      title: "Community Centers",
      description: "Local Health & Wellness Centers",
      icon: Library,
      feature: features.resourcesDirectory,
      items: [
        "YMCA Hamilton/Burlington",
        "Hamilton Community Food Centre",
        "Seniors Active Living Centre",
      ],
    },
    {
      title: "Online Resources",
      description: "Digital Health Tools & Information",
      icon: Globe,
      feature: features.healthInsights,
      items: [
        "Hamilton Health Portal",
        "Mental Health Resources",
        "COVID-19 Updates",
      ],
    },
    {
      title: "Support Groups",
      description: "Community Support Networks",
      icon: MessageSquare,
      feature: features.aiHealthAssistant,
      items: [
        "Diabetes Support Group",
        "Mental Health Alliance",
        "Family Care Network",
      ],
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8 pt-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight animate-fade-in">
            Community Resources
          </h2>
          <p className="text-muted-foreground mt-2 animate-fade-in">
            Access health services and community support
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {resources.map((resource, index) => (
            <Card
              key={resource.title}
              className={cn(
                "p-6 relative overflow-hidden group animate-fade-in",
                "dashboard-card"
              )}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="absolute top-2 right-2" z-10>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <span className={cn(
                        "feature-tag flex items-center gap-1",
                        resource.feature.type === "existing" && "feature-tag-existing",
                        resource.feature.type === "enhanced" && "feature-tag-improved",
                        resource.feature.type === "new" && "feature-tag-new"
                      )}>
                        {resource.feature.type}
                        <Info className="w-3 h-3 info-icon" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="end" className="max-w-xs z-50">
                      <p>{resource.feature.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <resource.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="font-semibold">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {resource.items.map((item) => (
                      <Button
                        key={item}
                        variant="ghost"
                        className="w-full justify-start text-left rounded-xl hover:bg-primary/5"
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Resources;
