
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { BarChart, LineChart, AreaChart, ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { features } from "@/components/layout/MainLayout";

const Insights = () => {
  const monthlyData = [
    { month: 'Jan', diabetes: 65, mental: 78, air: 82 },
    { month: 'Feb', diabetes: 59, mental: 85, air: 79 },
    { month: 'Mar', diabetes: 80, mental: 89, air: 88 },
    { month: 'Apr', diabetes: 81, mental: 88, air: 85 },
    { month: 'May', diabetes: 56, mental: 90, air: 91 },
    { month: 'Jun', diabetes: 55, mental: 85, air: 83 },
  ];

  const trendData = [
    { name: '2019', value: 45 },
    { name: '2020', value: 52 },
    { name: '2021', value: 58 },
    { name: '2022', value: 65 },
    { name: '2023', value: 72 },
  ];

  return (
    <MainLayout>
      <div className="space-y-8 pt-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight animate-fade-in">
            Health Insights
          </h2>
          <p className="text-muted-foreground mt-2 animate-fade-in">
            Analyze health trends and patterns
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className={cn(
            "p-6 animate-fade-in relative",
            "glass"
          )}>
            <div className="absolute top-2 right-2 z-10">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <span className="feature-tag feature-tag-improved flex items-center gap-1">
                      {features.monthlyHealthIndicators.type}
                      <Info className="w-3 h-3 info-icon" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="end" className="max-w-xs z-50">
                    <p>{features.monthlyHealthIndicators.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <h3 className="font-semibold mb-4">Monthly Health Indicators</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                  <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))", 
                      borderRadius: "8px", 
                      color: "hsl(var(--foreground))" 
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="diabetes" 
                    stroke="#ff6979" 
                    strokeWidth={2} 
                    dot={{ fill: "#ff6979" }} 
                    name="Diabetes Cases" 
                    activeDot={{ r: 6, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mental" 
                    stroke="#D6BCFA" 
                    strokeWidth={2} 
                    dot={{ fill: "#D6BCFA" }} 
                    name="Mental Health Visits"
                    activeDot={{ r: 6, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="air" 
                    stroke="#68D391" 
                    strokeWidth={2} 
                    dot={{ fill: "#68D391" }} 
                    name="Air Quality Index"
                    activeDot={{ r: 6, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className={cn(
            "p-6 animate-fade-in relative",
            "glass"
          )}>
            <div className="absolute top-2 right-2 z-10">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <span className="feature-tag feature-tag-new flex items-center gap-1">
                      {features.predictiveAnalytics.type}
                      <Info className="w-3 h-3 info-icon" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="end" className="max-w-xs z-50">
                    <p>{features.predictiveAnalytics.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <h3 className="font-semibold mb-4">Community Health Score Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))", 
                      borderRadius: "8px", 
                      color: "hsl(var(--foreground))" 
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#9b87f5" 
                    fill="#9b87f5" 
                    fillOpacity={0.3} 
                    name="Health Score" 
                    activeDot={{ r: 6, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Insights;
