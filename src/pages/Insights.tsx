
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { BarChart, LineChart, AreaChart, ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

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
            "p-6 animate-fade-in",
            "bg-white/60 backdrop-blur-lg border border-white/20 shadow-lg"
          )}>
            <h3 className="font-semibold mb-4">Monthly Health Indicators</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="diabetes" stroke="#8884d8" name="Diabetes Cases" />
                  <Line type="monotone" dataKey="mental" stroke="#82ca9d" name="Mental Health Visits" />
                  <Line type="monotone" dataKey="air" stroke="#ffc658" name="Air Quality Index" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className={cn(
            "p-6 animate-fade-in",
            "bg-white/60 backdrop-blur-lg border border-white/20 shadow-lg"
          )}>
            <h3 className="font-semibold mb-4">Community Health Score Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" name="Health Score" />
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
