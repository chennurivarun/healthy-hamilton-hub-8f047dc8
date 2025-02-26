
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Library, Phone, Globe, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Resources = () => {
  const resources = [
    {
      title: "Emergency Services",
      description: "24/7 Health Services & Crisis Lines",
      icon: Phone,
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
                "bg-white/60 backdrop-blur-lg border border-white/20 shadow-lg",
                "hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              )}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
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
