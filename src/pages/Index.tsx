
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Activity, Users, AlertTriangle, TrendingUp } from "lucide-react";

const Index = () => {
  const metrics = [
    {
      title: "Diabetes Prevalence",
      value: "8.5%",
      change: "+0.3%",
      icon: Activity,
      type: "existing"
    },
    {
      title: "Mental Health Visits",
      value: "2,847",
      change: "+12%",
      icon: Users,
      type: "improved"
    },
    {
      title: "Air Quality Index",
      value: "Good",
      change: "Stable",
      icon: AlertTriangle,
      type: "existing"
    },
    {
      title: "Employment Rate",
      value: "94%",
      change: "+2.1%",
      icon: TrendingUp,
      type: "new"
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8 pt-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight animate-fade-in">Welcome to Hamilton Health Hub</h2>
          <p className="text-muted-foreground mt-2 animate-fade-in">
            Explore health metrics, resources, and community insights
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <Card key={metric.title} className={cn(
              "p-6 glass card-hover animate-fade-in",
              "relative overflow-hidden group"
            )}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="absolute top-2 right-2">
                <span className={cn(
                  "feature-tag",
                  metric.type === "existing" && "feature-tag-existing",
                  metric.type === "improved" && "feature-tag-improved",
                  metric.type === "new" && "feature-tag-new"
                )}>
                  {metric.type}
                </span>
              </div>
              
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
                      metric.change.startsWith("+") ? "text-green-600" : "text-muted-foreground"
                    )}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="h-96 glass rounded-lg p-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <h3 className="text-lg font-semibold mb-4">Community Health Map</h3>
          <div className="h-full bg-muted/30 rounded-lg flex items-center justify-center">
            Map Preview (Coming Soon)
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
