
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

  const chartFeatures = [
    {
      title: "Monthly Health Indicators",
      type: "improved",
      description: "Enhanced chart showing correlations between different health metrics with AI-powered trend analysis."
    },
    {
      title: "Community Health Score Trend",
      type: "new",
      description: "New predictive analytics chart showing community health score trends with AI forecasting."
    }
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
            <div className="absolute top-2 right-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="feature-tag feature-tag-improved flex items-center gap-1">
                      {chartFeatures[0].type}
                      <Info className="w-3 h-3" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <p>{chartFeatures[0].description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <h3 className="font-semibold mb-4">{chartFeatures[0].title}</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" strokeOpacity={0.2} />
                  <XAxis dataKey="month" stroke="currentColor" />
                  <YAxis stroke="currentColor" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: "rgba(10, 10, 10, 0.8)", border: "none", borderRadius: "8px", color: "#fff" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="diabetes" stroke="#888" strokeWidth={2} dot={{ fill: "#888" }} name="Diabetes Cases" />
                  <Line type="monotone" dataKey="mental" stroke="#555" strokeWidth={2} dot={{ fill: "#555" }} name="Mental Health Visits" />
                  <Line type="monotone" dataKey="air" stroke="#222" strokeWidth={2} dot={{ fill: "#222" }} name="Air Quality Index" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className={cn(
            "p-6 animate-fade-in relative",
            "glass"
          )}>
            <div className="absolute top-2 right-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="feature-tag feature-tag-new flex items-center gap-1">
                      {chartFeatures[1].type}
                      <Info className="w-3 h-3" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <p>{chartFeatures[1].description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <h3 className="font-semibold mb-4">{chartFeatures[1].title}</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" strokeOpacity={0.2} />
                  <XAxis dataKey="name" stroke="currentColor" />
                  <YAxis stroke="currentColor" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: "rgba(10, 10, 10, 0.8)", border: "none", borderRadius: "8px", color: "#fff" }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#555" fill="#555" fillOpacity={0.3} name="Health Score" />
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
