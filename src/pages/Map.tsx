
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

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapToken, setMapToken] = useState<string>(() => {
    return localStorage.getItem("mapbox_token") || "";
  });
  const [showToken, setShowToken] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [activeLayer, setActiveLayer] = useState("healthScores");

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (mapToken) {
      localStorage.setItem("mapbox_token", mapToken);
    }
  }, [mapToken]);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapToken || !mapContainer.current || mapInitialized) return;

    try {
      mapboxgl.accessToken = mapToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-79.8711, 43.2557], // Hamilton, Ontario coordinates
        zoom: 12,
        pitch: 35,
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
        
        // Add health scores layer
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
            'circle-color': 'hsl(var(--primary))',
            'circle-opacity': 0.7,
            'circle-stroke-width': 2,
            'circle-stroke-color': 'hsl(var(--background))'
          }
        });
        
        // Add diabetes layer (initially hidden)
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
            'circle-color': 'hsl(0, 100%, 60%)', // Red for diabetes
            'circle-opacity': 0.7,
            'circle-stroke-width': 2,
            'circle-stroke-color': 'hsl(var(--background))'
          },
          layout: {
            'visibility': 'none'
          }
        });
        
        // Add mental health layer (initially hidden)
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
            'circle-color': 'hsl(270, 100%, 70%)', // Purple for mental health
            'circle-opacity': 0.7,
            'circle-stroke-width': 2,
            'circle-stroke-color': 'hsl(var(--background))'
          },
          layout: {
            'visibility': 'none'
          }
        });
        
        // Add air quality layer (initially hidden)
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
            'circle-color': 'hsl(120, 100%, 40%)', // Green for air quality
            'circle-opacity': 0.7,
            'circle-stroke-width': 2,
            'circle-stroke-color': 'hsl(var(--background))'
          },
          layout: {
            'visibility': 'none'
          }
        });
        
        // Add popups
        map.current.on('click', 'healthScores', (e) => {
          showPopup(e);
        });
        map.current.on('click', 'diabetesRates', (e) => {
          showPopup(e);
        });
        map.current.on('click', 'mentalHealth', (e) => {
          showPopup(e);
        });
        map.current.on('click', 'airQuality', (e) => {
          showPopup(e);
        });
        
        // Change cursor on hover
        map.current.on('mouseenter', 'healthScores', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'healthScores', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapInitialized(false);
      }
    };
  }, [mapToken, mapInitialized]);

  // Function to show popup with health data
  const showPopup = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
    if (!map.current || !e.features || e.features.length === 0) return;
    
    const coordinates = (e.features[0].geometry as any).coordinates.slice();
    const properties = e.features[0].properties;
    
    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.className = 'p-2 text-sm';
    popupContent.innerHTML = `
      <h3 class="font-bold text-base">${properties?.name}</h3>
      <div class="mt-2 space-y-1">
        <div>Health Score: <span class="font-medium">${properties?.healthScore}</span></div>
        <div>Diabetes Rate: <span class="font-medium">${properties?.diabetesRate}%</span></div>
        <div>Mental Health: <span class="font-medium">${properties?.mentalHealth}</span></div>
        <div>Air Quality: <span class="font-medium">${properties?.airQuality}</span></div>
      </div>
    `;
    
    // Create and display popup
    new mapboxgl.Popup()
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
      <div className="absolute top-16 right-6 z-10 bg-card/80 backdrop-blur-md p-4 rounded-xl border border-border/50 shadow-md">
        <h3 className="font-semibold mb-2">Map Layers</h3>
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
                    <Button variant="ghost" size="icon" onClick={() => renderFilters()}>
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
                  <Button onClick={() => setMapInitialized(false)}>
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
                      <div className="w-4 h-4 rounded-full opacity-70" style={{ backgroundColor: 'hsl(var(--primary))' }} />
                      <span>High Health Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-50" style={{ backgroundColor: 'hsl(var(--primary))' }} />
                      <span>Medium Health Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-30" style={{ backgroundColor: 'hsl(var(--primary))' }} />
                      <span>Low Health Score</span>
                    </div>
                  </>
                )}
                
                {activeLayer === 'diabetesRates' && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-70" style={{ backgroundColor: 'hsl(0, 100%, 60%)' }} />
                      <span>High Diabetes Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-50" style={{ backgroundColor: 'hsl(0, 100%, 60%)' }} />
                      <span>Medium Diabetes Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-30" style={{ backgroundColor: 'hsl(0, 100%, 60%)' }} />
                      <span>Low Diabetes Rate</span>
                    </div>
                  </>
                )}
                
                {activeLayer === 'mentalHealth' && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-70" style={{ backgroundColor: 'hsl(270, 100%, 70%)' }} />
                      <span>High Mental Health Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-50" style={{ backgroundColor: 'hsl(270, 100%, 70%)' }} />
                      <span>Medium Mental Health Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-30" style={{ backgroundColor: 'hsl(270, 100%, 70%)' }} />
                      <span>Low Mental Health Score</span>
                    </div>
                  </>
                )}
                
                {activeLayer === 'airQuality' && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-70" style={{ backgroundColor: 'hsl(120, 100%, 40%)' }} />
                      <span>High Air Quality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-50" style={{ backgroundColor: 'hsl(120, 100%, 40%)' }} />
                      <span>Medium Air Quality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full opacity-30" style={{ backgroundColor: 'hsl(120, 100%, 40%)' }} />
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
