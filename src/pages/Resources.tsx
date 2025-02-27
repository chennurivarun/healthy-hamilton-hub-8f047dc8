
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

const Resources = () => {
  const resources = [
    {
      title: "Emergency Services",
      description: "24/7 Health Services & Crisis Lines",
      icon: Phone,
      type: "existing",
      tooltipContent: "Directory of emergency health services and crisis hotlines in Hamilton.",
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
      type: "existing",
      tooltipContent: "Local community centers offering health and wellness programs.",
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
      type: "improved",
      tooltipContent: "Enhanced digital resources with personalized health recommendations.",
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
      type: "new",
      tooltipContent: "Newly added support networks to connect with others facing similar health challenges.",
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
                "glass hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              )}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="absolute top-2 right-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={cn(
                        "feature-tag flex items-center gap-1",
                        resource.type === "existing" && "feature-tag-existing",
                        resource.type === "improved" && "feature-tag-improved",
                        resource.type === "new" && "feature-tag-new"
                      )}>
                        {resource.type}
                        <Info className="w-3 h-3" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p>{resource.tooltipContent}</p>
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
                        className="w-full justify-start text-left"
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
