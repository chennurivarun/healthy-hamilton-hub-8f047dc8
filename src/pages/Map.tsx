
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { MapPin, Layers, Filter, Info, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { features } from "@/components/layout/MainLayout";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapToken, setMapToken] = useState<string>(() => {
    return localStorage.getItem("mapbox_token") || "";
  });
  const [showToken, setShowToken] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [activeLayer, setActiveLayer] = useState("healthScores");
  const [showFilters, setShowFilters] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains("dark")
  );

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (mapToken) {
      localStorage.setItem("mapbox_token", mapToken);
    }
  }, [mapToken]);

  // Track theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
          if (map.current) {
            map.current.setStyle(isDark ? 
              'mapbox://styles/mapbox/dark-v11' : 
              'mapbox://styles/mapbox/light-v11'
            );
          }
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapToken || !mapContainer.current) return;
    
    // Don't re-initialize if map already exists
    if (map.current) return;

    try {
      mapboxgl.accessToken = mapToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: isDarkMode ? 
          'mapbox://styles/mapbox/dark-v11' : 
          'mapbox://styles/mapbox/light-v11',
        center: [-79.8711, 43.2557], // Hamilton, Ontario coordinates
        zoom: 12,
        pitch: 35,
        preserveDrawingBuffer: true, // Helps with performance
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // When map loads, add data layers
      map.current.on('load', () => {
        setMapInitialized(true);
        toast({
          title: "Map loaded successfully",
          description: "Health data visualizations are now available",
        });
        
        // Add dummy health data for demonstration
        map.current.addSource('health-data', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              // Downtown Hamilton
              {
                type: 'Feature',
                properties: { 
                  name: 'Downtown Hamilton',
                  healthScore: 85,
                  diabetesRate: 12.3,
                  mentalHealth: 73.5,
                  airQuality: 68.9
                },
                geometry: {
                  type: 'Point',
                  coordinates: [-79.866, 43.256]
                }
              },
              // East Hamilton
              {
                type: 'Feature',
                properties: { 
                  name: 'East Hamilton',
                  healthScore: 72,
                  diabetesRate: 15.7,
                  mentalHealth: 68.2,
                  airQuality: 63.4
                },
                geometry: {
                  type: 'Point',
                  coordinates: [-79.82, 43.24]
                }
              },
              // West Hamilton
              {
                type: 'Feature',
                properties: { 
                  name: 'West Hamilton',
                  healthScore: 91,
                  diabetesRate: 8.9,
                  mentalHealth: 82.1,
                  airQuality: 79.5
                },
                geometry: {
                  type: 'Point',
                  coordinates: [-79.91, 43.26]
                }
              },
              // Mountain Area
              {
                type: 'Feature',
                properties: { 
                  name: 'Mountain Area',
                  healthScore: 78,
                  diabetesRate: 11.2,
                  mentalHealth: 75.8,
                  airQuality: 72.1
                },
                geometry: {
                  type: 'Point',
                  coordinates: [-79.85, 43.21]
                }
              },
              // Stoney Creek
              {
                type: 'Feature',
                properties: { 
                  name: 'Stoney Creek',
                  healthScore: 83,
                  diabetesRate: 10.5,
                  mentalHealth: 79.2,
                  airQuality: 77.3
                },
                geometry: {
                  type: 'Point',
                  coordinates: [-79.77, 43.22]
                }
              }
            ]
          }
        });
        
        // Add health scores layer with updated colors for dark mode
        map.current.addLayer({
          id: 'healthScores',
          type: 'circle',
          source: 'health-data',
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['get', 'healthScore'],
              60, 15,
              90, 25
            ],
            'circle-color': '#9b87f5', // Primary purple
            'circle-opacity': 0.8,
            'circle-stroke-width': 2,
            'circle-stroke-color': isDarkMode ? '#1A1F2C' : '#ffffff' // Theme-based outline
          }
        });
        
        // Add diabetes layer with updated colors for dark mode
        map.current.addLayer({
          id: 'diabetesRates',
          type: 'circle',
          source: 'health-data',
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['get', 'diabetesRate'],
              8, 15,
              16, 25
            ],
            'circle-color': '#ff6979', // Red for diabetes
            'circle-opacity': 0.8,
            'circle-stroke-width': 2,
            'circle-stroke-color': isDarkMode ? '#1A1F2C' : '#ffffff' // Theme-based outline
          },
          layout: {
            'visibility': 'none'
          }
        });
        
        // Add mental health layer with updated colors for dark mode
        map.current.addLayer({
          id: 'mentalHealth',
          type: 'circle',
          source: 'health-data',
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['get', 'mentalHealth'],
              60, 15,
              85, 25
            ],
            'circle-color': '#D6BCFA', // Light purple for mental health
            'circle-opacity': 0.8,
            'circle-stroke-width': 2,
            'circle-stroke-color': isDarkMode ? '#1A1F2C' : '#ffffff' // Theme-based outline
          },
          layout: {
            'visibility': 'none'
          }
        });
        
        // Add air quality layer with updated colors for dark mode
        map.current.addLayer({
          id: 'airQuality',
          type: 'circle',
          source: 'health-data',
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['get', 'airQuality'],
              60, 15,
              80, 25
            ],
            'circle-color': '#68D391', // Green for air quality
            'circle-opacity': 0.8,
            'circle-stroke-width': 2,
            'circle-stroke-color': isDarkMode ? '#1A1F2C' : '#ffffff' // Theme-based outline
          },
          layout: {
            'visibility': 'none'
          }
        });
        
        // Add popups with improved styling
        const setupClickHandlers = (layerId: string) => {
          map.current?.on('click', layerId, (e) => {
            showPopup(e);
          });
          
          map.current?.on('mouseenter', layerId, () => {
            if (map.current) map.current.getCanvas().style.cursor = 'pointer';
          });
          
          map.current?.on('mouseleave', layerId, () => {
            if (map.current) map.current.getCanvas().style.cursor = '';
          });
        };
        
        // Apply click handlers to all layers
        setupClickHandlers('healthScores');
        setupClickHandlers('diabetesRates');
        setupClickHandlers('mentalHealth');
        setupClickHandlers('airQuality');
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Error loading map",
        description: "Please check your Mapbox token and try again",
        variant: "destructive",
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapToken, isDarkMode]);

  // Function to show popup with health data
  const showPopup = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
    if (!map.current || !e.features || e.features.length === 0) return;
    
    const coordinates = (e.features[0].geometry as any).coordinates.slice();
    const properties = e.features[0].properties;
    
    // Create popup content with theme-sensitive styling
    const popupContent = document.createElement('div');
    popupContent.className = 'p-2 text-sm rounded-md';
    popupContent.innerHTML = `
      <h3 class="font-bold text-base text-[#9b87f5]">${properties?.name}</h3>
      <div class="mt-2 space-y-1">
        <div>Health Score: <span class="font-medium">${properties?.healthScore}</span></div>
        <div>Diabetes Rate: <span class="font-medium">${properties?.diabetesRate}%</span></div>
        <div>Mental Health: <span class="font-medium">${properties?.mentalHealth}</span></div>
        <div>Air Quality: <span class="font-medium">${properties?.airQuality}</span></div>
      </div>
    `;
    
    // Create and display popup with appropriate theme class
    new mapboxgl.Popup({
      className: isDarkMode ? 'dark-map-popup' : 'light-map-popup',
      closeButton: true,
      closeOnClick: true,
      maxWidth: '300px'
    })
      .setLngLat(coordinates)
      .setDOMContent(popupContent)
      .addTo(map.current);
  };

  // Handle layer toggling
  const toggleLayer = (layerId: string) => {
    if (!map.current || !mapInitialized) return;
    
    // Hide all layers first
    ['healthScores', 'diabetesRates', 'mentalHealth', 'airQuality'].forEach(id => {
      map.current?.setLayoutProperty(id, 'visibility', 'none');
    });
    
    // Show selected layer
    map.current.setLayoutProperty(layerId, 'visibility', 'visible');
    setActiveLayer(layerId);
  };

  // Function to render filters
  const renderFilters = () => {
    return (
      <div className="absolute bottom-6 right-6 z-10 bg-card/90 backdrop-blur-lg p-4 rounded-xl border border-border shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Map Layers</h3>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="h-6 w-6"
          >
            <Info className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        {showFilters && (
          <div className="space-y-2">
            <Button 
              variant={activeLayer === 'healthScores' ? "default" : "outline"} 
              size="sm" 
              className="w-full justify-start"
              onClick={() => toggleLayer('healthScores')}
            >
              Health Scores
            </Button>
            <Button 
              variant={activeLayer === 'diabetesRates' ? "default" : "outline"} 
              size="sm" 
              className="w-full justify-start"
              onClick={() => toggleLayer('diabetesRates')}
            >
              Diabetes Rates
            </Button>
            <Button 
              variant={activeLayer === 'mentalHealth' ? "default" : "outline"} 
              size="sm" 
              className="w-full justify-start"
              onClick={() => toggleLayer('mentalHealth')}
            >
              Mental Health
            </Button>
            <Button 
              variant={activeLayer === 'airQuality' ? "default" : "outline"} 
              size="sm" 
              className="w-full justify-start"
              onClick={() => toggleLayer('airQuality')}
            >
              Air Quality
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8 pt-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight animate-fade-in">
            Community Health Map
          </h2>
          <p className="text-muted-foreground mt-2 animate-fade-in">
            Explore health metrics across Hamilton neighborhoods
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
          <Card className={cn(
            "relative h-[600px] animate-fade-in",
            "glass"
          )}>
            <div className="absolute top-2 right-2 z-20">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
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
            <div className="absolute top-4 right-12 z-10 flex gap-2">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setShowFilters(!showFilters)}>
                      <Layers className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle map layers</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {!mapToken ? (
              <div className="h-full flex flex-col items-center justify-center p-6">
                <MapPin className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Enter your Mapbox API token</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  To use the interactive map, you need a Mapbox public token. 
                  Get one for free at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>.
                </p>
                <div className="flex items-center gap-2 w-full max-w-md">
                  <div className="relative flex-grow">
                    <Input
                      type={showToken ? "text" : "password"}
                      placeholder="Paste your Mapbox token here"
                      value={mapToken}
                      onChange={(e) => setMapToken(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowToken(!showToken)}
                    >
                      {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button onClick={() => { 
                    if (map.current) {
                      map.current.remove();
                      map.current = null;
                    }
                    setMapInitialized(false);
                  }}>
                    Load Map
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div ref={mapContainer} className="h-full w-full rounded-xl overflow-hidden" />
                {renderFilters()}
              </>
            )}
          </Card>

          <div className="space-y-4">
            <Card className={cn(
              "p-6 animate-fade-in relative",
              "glass"
            )}>
              <div className="absolute top-2 right-2">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <span className="feature-tag feature-tag-existing flex items-center gap-1">
                        {features.dashboardOverview.type}
                        <Info className="w-3 h-3 info-icon" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p>{features.dashboardOverview.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <h3 className="font-semibold mb-4">Legend</h3>
              <div className="space-y-2">
                {activeLayer === 'healthScores' && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-90" style={{ backgroundColor: '#9b87f5' }} />
                      <span>High Health Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-70" style={{ backgroundColor: '#9b87f5' }} />
                      <span>Medium Health Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-50" style={{ backgroundColor: '#9b87f5' }} />
                      <span>Low Health Score</span>
                    </div>
                  </>
                )}
                
                {activeLayer === 'diabetesRates' && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-90" style={{ backgroundColor: '#ff6979' }} />
                      <span>High Diabetes Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-70" style={{ backgroundColor: '#ff6979' }} />
                      <span>Medium Diabetes Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-50" style={{ backgroundColor: '#ff6979' }} />
                      <span>Low Diabetes Rate</span>
                    </div>
                  </>
                )}
                
                {activeLayer === 'mentalHealth' && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-90" style={{ backgroundColor: '#D6BCFA' }} />
                      <span>High Mental Health Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-70" style={{ backgroundColor: '#D6BCFA' }} />
                      <span>Medium Mental Health Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-50" style={{ backgroundColor: '#D6BCFA' }} />
                      <span>Low Mental Health Score</span>
                    </div>
                  </>
                )}
                
                {activeLayer === 'airQuality' && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-90" style={{ backgroundColor: '#68D391' }} />
                      <span>High Air Quality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-70" style={{ backgroundColor: '#68D391' }} />
                      <span>Medium Air Quality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-50" style={{ backgroundColor: '#68D391' }} />
                      <span>Low Air Quality</span>
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Card className={cn(
              "p-6 animate-fade-in relative",
              "glass"
            )}>
              <div className="absolute top-2 right-2">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
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
              <h3 className="font-semibold mb-4">Filters</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Health Indicators</label>
                  <div className="space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => toggleLayer('healthScores')}
                    >
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={activeLayer === 'healthScores'} 
                        onChange={() => {}} 
                      /> Overall Health
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => toggleLayer('diabetesRates')}
                    >
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={activeLayer === 'diabetesRates'} 
                        onChange={() => {}} 
                      /> Diabetes Rate
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => toggleLayer('mentalHealth')}
                    >
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={activeLayer === 'mentalHealth'} 
                        onChange={() => {}} 
                      /> Mental Health
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => toggleLayer('airQuality')}
                    >
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={activeLayer === 'airQuality'} 
                        onChange={() => {}} 
                      /> Air Quality
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Map;
