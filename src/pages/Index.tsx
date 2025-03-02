import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Activity, Users, AlertTriangle, TrendingUp, Info, BarChart, MapIcon } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  // Make sure this is exported from "@/components/ui/tooltip" or Radix.
} from "@/components/ui/tooltip";
import { features } from "@/components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import {
  SearchField,
  SearchFieldInput,
  SearchFieldClear,
  SearchFieldGroup
} from "@/components/ui/searchfield";
import { Search, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapToken, setMapToken] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [searchQuery, setSearchQuery] = useState("");




  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for: "${searchQuery}"`,
      });
      setSearchQuery("");
    } else {
      toast({
        title: "Search error",
        description: "Please enter a search term",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setIsDarkMode(isDark);
          if (map.current) {
            map.current.setStyle(
              isDark
                ? "mapbox://styles/mapbox/dark-v11"
                : "mapbox://styles/mapbox/light-v11"
            );
          }
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("mapbox_token");
    if (storedToken) {
      setMapToken(storedToken);
      console.log("Mapbox token found in localStorage");
    } else {
      console.log("No mapbox token found in localStorage");
    }
  }, []);

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

  useEffect(() => {
    if (!mapToken || !mapContainer.current) return;
    if (map.current) return;

    try {
      mapboxgl.accessToken = mapToken;
      const mapStyle = isDarkMode
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11";

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [-79.8711, 43.2557], // Hamilton, Ontario coordinates
        zoom: 10,
        pitch: 40,
        interactive: false, // Disable interactions for preview
        attributionControl: false,
      });

      map.current.on("load", () => {
        if (!map.current) return;

        // Slow rotation animation for preview
        const rotateCamera = () => {
          if (!map.current) return;
          map.current.easeTo({
            bearing: map.current.getBearing() + 0.2,
            duration: 100,
            easing: (t) => t,
          });
          requestAnimationFrame(rotateCamera);
        };
        rotateCamera();

        // Add example health data
        map.current.addSource("health-data", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  name: "Downtown Hamilton",
                  healthScore: 85,
                },
                geometry: {
                  type: "Point",
                  coordinates: [-79.866, 43.256],
                },
              },
              {
                type: "Feature",
                properties: {
                  name: "East Hamilton",
                  healthScore: 72,
                },
                geometry: {
                  type: "Point",
                  coordinates: [-79.82, 43.24],
                },
              },
              {
                type: "Feature",
                properties: {
                  name: "West Hamilton",
                  healthScore: 91,
                },
                geometry: {
                  type: "Point",
                  coordinates: [-79.91, 43.26],
                },
              },
              {
                type: "Feature",
                properties: {
                  name: "Mountain Area",
                  healthScore: 78,
                },
                geometry: {
                  type: "Point",
                  coordinates: [-79.85, 43.21],
                },
              },
              {
                type: "Feature",
                properties: {
                  name: "Stoney Creek",
                  healthScore: 83,
                },
                geometry: {
                  type: "Point",
                  coordinates: [-79.77, 43.22],
                },
              },
            ],
          },
        });

        // Add layer with matching colors to the Map page
        map.current.addLayer({
          id: "health-circles",
          type: "circle",
          source: "health-data",
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "healthScore"],
              60,
              10,
              90,
              18,
            ],
            "circle-color": "#9b87f5",
            "circle-opacity": 0.7,
            "circle-stroke-width": 1,
            "circle-stroke-color": isDarkMode ? "#1A1F2C" : "#FFFFFF",
          },
        });
      });

      // Debug event for map errors
      map.current.on("error", (e) => {
        console.error("Mapbox error:", e.error);
      });
    } catch (error) {
      console.error("Error initializing preview map:", error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapToken, isDarkMode]);

  return (
    <MainLayout>
      <div className="space-y-8 pt-16">
        <div className=" flex flex-wrap justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-3xl  font-bold tracking-tight animate-fade-in">
              Hamilton Health Hub
            </h2>
            <p className="text-muted-foreground mt-2 animate-fade-in">
              Explore health metrics, resources, and community insights
            </p>
          </div>


          <div className="top-search-container">
            <SearchField
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              className="search-field-wrapper"
            >
              <SearchFieldGroup className="bg-transparent border-0 shadow-none px-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <SearchFieldInput
                  placeholder="Search..."
                  className="bg-transparent border-0 shadow-none outline-none"
                />
                <SearchFieldClear onPress={() => setSearchQuery("")}>
                  <X className="h-4 w-4" />
                </SearchFieldClear>
              </SearchFieldGroup>
            </SearchField>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 z-10">
          {metrics.map((metric, index) => (
            <Card
              key={metric.title}
              // Force overflow to be visible so the tooltip doesn't get clipped
              className={cn(
                "!overflow-visible p-6 relative group dashboard-card z-10 animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="absolute top-2 right-2 cursor-pointer">
                      <span
                        className={cn(
                          "feature-tag flex items-center gap-1",
                          metric.feature.type === "existing" && "feature-tag-existing",
                          metric.feature.type === "enhanced" && "feature-tag-improved",
                          metric.feature.type === "new" && "feature-tag-new"
                        )}
                      >
                        {metric.feature.type}
                        <Info className="w-3 h-3 info-icon" />
                      </span>
                    </div>
                  </TooltipTrigger>

                  {/* Render tooltip content in a Portal to escape parent boundaries */}

                  <TooltipContent
                    side="top"
                    align="center"
                    className="max-w-xl z-50"
                  >
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
                    <span
                      className={cn(
                        "text-sm",
                        metric.change.startsWith("+")
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 h-10 flex items-end justify-between">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[8%] bg-primary/20 rounded-sm"
                    style={{
                      height: `${20 + Math.random() * 80}%`,
                      opacity: i === 7 ? 1 : 0.5 + i * 0.07,
                    }}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card
            className={cn(
              "!overflow-visible col-span-2 h-96 relative animate-fade-in dashboard-card"
            )}
            style={{ animationDelay: "400ms" }}
          >
            <div className="absolute top-2 right-2 z-10">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <span className="feature-tag feature-tag-improved flex items-center gap-1">
                      {features.communityHealthMap.type}
                      <Info className="w-3 h-3 info-icon" />
                    </span>
                  </TooltipTrigger>


                  <TooltipContent
                    side="bottom"
                    align="end"
                    className="max-w-xs z-50"
                  >
                    <p>{features.communityHealthMap.description}</p>
                  </TooltipContent>

                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapIcon className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Community Health Map</h3>
              </div>
              <div className="h-[calc(100%-48px)] rounded-xl relative map-section">
                {mapToken ? (
                  <>
                    <div ref={mapContainer} className="home-map-container" />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/20" />
                    <Button
                      className="absolute bottom-4 right-4 z-10"
                      onClick={() => navigate("/map")}
                    >
                      View Full Map
                    </Button>
                  </>
                ) : (
                  <div className="h-full bg-secondary/30 flex items-center justify-center">
                    <div className="text-center max-w-xs mx-auto">
                      <p className="text-muted-foreground mb-4">
                        Enter your Mapbox API token in the Map section to enable
                        the interactive map
                      </p>
                      <Button onClick={() => navigate("/map")}>
                        Set Up Map
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card
            className={cn(
              "!overflow-visible h-96 relative animate-fade-in dashboard-card"
            )}
            style={{ animationDelay: "500ms" }}
          >
            <div className="absolute top-2 right-2 z-10">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <span className="feature-tag feature-tag-new flex items-center gap-1">
                      {features.predictiveAnalytics.type}
                      <Info className="w-3 h-3 info-icon" />
                    </span>
                  </TooltipTrigger>


                  <TooltipContent
                    side="bottom"
                    align="end"
                    className="max-w-xs z-50"
                  >
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
                {["Diabetes", "Mental Health", "Respiratory Issues", "Heart Disease"].map(
                  (item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground w-32">
                        {item}
                      </div>
                      <div className="flex-1 h-2 bg-secondary/50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${30 + Math.random() * 60}%`,
                            opacity: 0.8,
                            backgroundColor:
                              index === 0
                                ? "#ff6979"
                                : index === 1
                                  ? "#D6BCFA"
                                  : index === 2
                                    ? "#68D391"
                                    : "#9b87f5",
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
