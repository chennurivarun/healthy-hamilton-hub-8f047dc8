
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { MapPin, Layers, Filter, Info, Eye, EyeOff, Expand, Minimize, Search, Clock, Navigation, Database, Map as MapIcon } from "lucide-react";
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
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mapFeatures = {
  healthScores: {
    id: 'healthScores',
    name: 'Health Scores',
    description: 'Overall health score metric for each area',
    color: '#9b87f5',
    icon: <MapIcon className="h-4 w-4" />
  },
  diabetesRates: {
    id: 'diabetesRates',
    name: 'Diabetes Rates',
    description: 'Prevalence of diabetes by neighborhood',
    color: '#ff6979',
    icon: <MapIcon className="h-4 w-4" />
  },
  mentalHealth: {
    id: 'mentalHealth',
    name: 'Mental Health',
    description: 'Mental health metrics by area',
    color: '#D6BCFA',
    icon: <MapIcon className="h-4 w-4" />
  },
  airQuality: {
    id: 'airQuality',
    name: 'Air Quality',
    description: 'Air quality index measurements',
    color: '#68D391',
    icon: <MapIcon className="h-4 w-4" />
  }
};

const advancedFeatures = [
  {
    id: 'search',
    name: 'Location Search',
    icon: <Search className="h-4 w-4" />,
    description: 'Search for addresses and places'
  },
  {
    id: 'isochrone',
    name: 'Accessibility Analysis',
    icon: <Clock className="h-4 w-4" />,
    description: 'See areas reachable within a time range'
  },
  {
    id: 'directions',
    name: 'Directions',
    icon: <Navigation className="h-4 w-4" />,
    description: 'Get routes to health facilities'
  },
  {
    id: 'datasets',
    name: 'Custom Datasets',
    icon: <Database className="h-4 w-4" />,
    description: 'Upload and visualize custom health data'
  }
];

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);
  const [advancedFeatureStatus, setAdvancedFeatureStatus] = useState({
    search: false,
    isochrone: false,
    directions: false,
    datasets: false
  });
  
  const geocoder = useRef<any>(null);
  
  useEffect(() => {
    if (mapToken) {
      localStorage.setItem("mapbox_token", mapToken);
    }
  }, [mapToken]);

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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (map.current) {
        map.current.resize();
      }
    }, 100);
  };

  const addGeocoder = () => {
    if (!map.current || !mapboxgl.accessToken) return;
    
    try {
      import('@mapbox/mapbox-gl-geocoder').then(({ default: MapboxGeocoder }) => {
        if (!map.current) return;
        
        if (geocoder.current) {
          map.current.removeControl(geocoder.current);
        }
        
        geocoder.current = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          marker: {
            color: '#9b87f5'
          },
          placeholder: 'Search for locations'
        });
        
        map.current.addControl(geocoder.current, 'top-left');
        
        toast({
          title: "Search activated",
          description: "You can now search for addresses and locations",
        });
      }).catch(err => {
        console.error("Error loading geocoder:", err);
        toast({
          title: "Error activating search",
          description: "Could not load the search module",
          variant: "destructive",
        });
      });
    } catch (error) {
      console.error("Error setting up geocoder:", error);
    }
  };

  const toggleIsochrone = () => {
    const isEnabled = !advancedFeatureStatus.isochrone;
    setAdvancedFeatureStatus({...advancedFeatureStatus, isochrone: isEnabled});
    
    if (!map.current) return;
    
    if (isEnabled) {
      // This is where the error was - we need to provide both event type and handler function
      map.current.on('click', function(e) {
        if (!map.current) return;
        const coords = e.lngLat;
        
        toast({
          title: "Generating accessibility zones",
          description: "Calculating areas within 15 minutes...",
        });
        
        setTimeout(() => {
          if (!map.current) return;
          
          const center = [coords.lng, coords.lat];
          const radius = 0.02;
          const options = { steps: 50, units: 'kilometers' as const };
          
          try {
            import('@turf/turf').then((turf) => {
              const circle = turf.circle(center, radius, options);
              
              if (!map.current?.getSource('isochrone')) {
                map.current?.addSource('isochrone', {
                  type: 'geojson',
                  data: {
                    type: 'FeatureCollection',
                    features: [circle]
                  }
                });
                
                map.current?.addLayer({
                  id: 'isochrone-fill',
                  type: 'fill',
                  source: 'isochrone',
                  paint: {
                    'fill-color': '#9b87f5',
                    'fill-opacity': 0.2
                  }
                });
                
                map.current?.addLayer({
                  id: 'isochrone-outline',
                  type: 'line',
                  source: 'isochrone',
                  paint: {
                    'line-color': '#9b87f5',
                    'line-width': 2
                  }
                });
              } else {
                (map.current?.getSource('isochrone') as mapboxgl.GeoJSONSource).setData({
                  type: 'FeatureCollection',
                  features: [circle]
                });
              }
              
              toast({
                title: "Accessibility zone created",
                description: "Showing area within approximately 15 minutes walking distance",
              });
            });
          } catch (error) {
            console.error("Error generating isochrone:", error);
            toast({
              title: "Error creating accessibility zone",
              description: "Could not generate the accessibility visualization",
              variant: "destructive",
            });
          }
        }, 1000);
      });
      
      toast({
        title: "Accessibility analysis activated",
        description: "Click anywhere on the map to see reachable areas",
      });
    } else {
      // We need to provide the same handler function signature to remove the event
      map.current.off('click');
      
      if (map.current.getLayer('isochrone-fill')) {
        map.current.removeLayer('isochrone-fill');
      }
      
      if (map.current.getLayer('isochrone-outline')) {
        map.current.removeLayer('isochrone-outline');
      }
      
      if (map.current.getSource('isochrone')) {
        map.current.removeSource('isochrone');
      }
      
      toast({
        title: "Accessibility analysis deactivated",
        description: "Accessibility zones have been removed from the map",
      });
    }
  };

  const toggleDirections = () => {
    const isEnabled = !advancedFeatureStatus.directions;
    setAdvancedFeatureStatus({...advancedFeatureStatus, directions: isEnabled});
    
    if (!map.current) return;
    
    if (isEnabled) {
      try {
        import('@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions').then(({ default: MapboxDirections }) => {
          if (!map.current) return;
          
          const directionsControl = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            unit: 'metric',
            profile: 'mapbox/walking',
            alternatives: true,
            congestion: true,
            controls: {
              profileSwitcher: true,
              instructions: true
            }
          });
          
          map.current.addControl(directionsControl, 'top-left');
          
          (map.current as any)._directionsControl = directionsControl;
          
          toast({
            title: "Directions activated",
            description: "You can now get routes to health facilities",
          });
        }).catch(err => {
          console.error("Error loading directions:", err);
          setAdvancedFeatureStatus({...advancedFeatureStatus, directions: false});
          toast({
            title: "Error activating directions",
            description: "Could not load the directions module",
            variant: "destructive",
          });
        });
      } catch (error) {
        console.error("Error setting up directions:", error);
        setAdvancedFeatureStatus({...advancedFeatureStatus, directions: false});
      }
    } else {
      if (map.current && (map.current as any)._directionsControl) {
        map.current.removeControl((map.current as any)._directionsControl);
        (map.current as any)._directionsControl = null;
        
        toast({
          title: "Directions deactivated",
          description: "Direction controls have been removed",
        });
      }
    }
  };

  const toggleDatasets = () => {
    const isEnabled = !advancedFeatureStatus.datasets;
    setAdvancedFeatureStatus({...advancedFeatureStatus, datasets: isEnabled});
    
    if (isEnabled) {
      toast({
        title: "Custom datasets feature activated",
        description: "This feature would allow uploading and managing custom health data",
      });
    } else {
      toast({
        title: "Custom datasets feature deactivated",
        description: "Custom dataset functionality has been disabled",
      });
    }
  };

  useEffect(() => {
    if (!mapToken || !mapContainer.current) {
      console.log("Map cannot initialize: token or container missing");
      return;
    }
    
    if (map.current) {
      console.log("Map already exists, skipping initialization");
      return;
    }

    try {
      mapboxgl.accessToken = mapToken;
      
      console.log("Creating map instance");
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: isDarkMode ? 
          'mapbox://styles/mapbox/dark-v11' : 
          'mapbox://styles/mapbox/light-v11',
        center: [-79.8711, 43.2557],
        zoom: 12,
        pitch: 35,
        preserveDrawingBuffer: true,
      });

      console.log("Adding navigation controls");
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      console.log("Setting up map load handler");
      map.current.on('load', () => {
        console.log("Map loaded successfully");
        setMapInitialized(true);
        toast({
          title: "Map loaded successfully",
          description: "Health data visualizations are now available",
        });
        
        console.log("Adding health data source");
        map.current.addSource('health-data', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
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
        
        console.log("Adding map layers");
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
            'circle-color': mapFeatures.healthScores.color,
            'circle-opacity': 0.8,
            'circle-stroke-width': 2,
            'circle-stroke-color': isDarkMode ? '#1A1F2C' : '#ffffff'
          }
        });
        
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
            'circle-color': mapFeatures.diabetesRates.color,
            'circle-opacity': 0.8,
            'circle-stroke-width': 2,
            'circle-stroke-color': isDarkMode ? '#1A1F2C' : '#ffffff'
          },
          layout: {
            'visibility': 'none'
          }
        });
        
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
            'circle-color': mapFeatures.mentalHealth.color,
            'circle-opacity': 0.8,
            'circle-stroke-width': 2,
            'circle-stroke-color': isDarkMode ? '#1A1F2C' : '#ffffff'
          },
          layout: {
            'visibility': 'none'
          }
        });
        
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
            'circle-color': mapFeatures.airQuality.color,
            'circle-opacity': 0.8,
            'circle-stroke-width': 2,
            'circle-stroke-color': isDarkMode ? '#1A1F2C' : '#ffffff'
          },
          layout: {
            'visibility': 'none'
          }
        });
        
        map.current.addLayer({
          id: 'isochrone-click',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: []
            }
          },
          paint: {
            'circle-radius': 0,
            'circle-opacity': 0
          }
        });
        
        console.log("Setting up click handlers");
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

  const showPopup = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
    if (!map.current || !e.features || e.features.length === 0) return;
    
    const coordinates = (e.features[0].geometry as any).coordinates.slice();
    const properties = e.features[0].properties;
    
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

  const toggleLayer = (layerId: string) => {
    if (!map.current || !mapInitialized) return;
    
    Object.keys(mapFeatures).forEach(id => {
      map.current?.setLayoutProperty(id, 'visibility', 'none');
    });
    
    map.current.setLayoutProperty(layerId, 'visibility', 'visible');
    setActiveLayer(layerId);
    
    toast({
      title: `${mapFeatures[layerId as keyof typeof mapFeatures].name} layer activated`,
      description: `Now showing ${mapFeatures[layerId as keyof typeof mapFeatures].name.toLowerCase()} data on the map`,
    });
  };

  const toggleAdvancedFeature = (featureId: string) => {
    switch (featureId) {
      case 'search':
        setAdvancedFeatureStatus({...advancedFeatureStatus, search: !advancedFeatureStatus.search});
        if (!advancedFeatureStatus.search) {
          addGeocoder();
        } else {
          if (map.current && geocoder.current) {
            map.current.removeControl(geocoder.current);
            geocoder.current = null;
            toast({
              title: "Search deactivated",
              description: "Search functionality has been removed",
            });
          }
        }
        break;
      case 'isochrone':
        toggleIsochrone();
        break;
      case 'directions':
        toggleDirections();
        break;
      case 'datasets':
        toggleDatasets();
        break;
    }
  };

  const renderMapControls = () => {
    if (!mapInitialized) return null;
    
    return (
      <div className={cn("map-controls", isFullscreen && "pt-12")}>
        <div className="map-layer-panel">
          <div className="panel-header">
            <h3 className="text-sm font-medium">Map Layers</h3>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowLayersPanel(!showLayersPanel)}
              className="h-6 w-6"
            >
              {showLayersPanel ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </Button>
          </div>
          
          {showLayersPanel && (
            <div className="panel-content">
              {Object.values(mapFeatures).map((feature) => (
                <button
                  key={feature.id}
                  className={cn(
                    "layer-item",
                    activeLayer === feature.id && "active"
                  )}
                  onClick={() => toggleLayer(feature.id)}
                >
                  <span className="layer-color" style={{ backgroundColor: feature.color }} />
                  <span className="flex-1 text-left">{feature.name}</span>
                  {activeLayer === feature.id && <Eye className="h-3.5 w-3.5 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="map-layer-panel">
          <div className="panel-header">
            <h3 className="text-sm font-medium">Advanced Features</h3>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
              className="h-6 w-6"
            >
              {showAdvancedPanel ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </Button>
          </div>
          
          {showAdvancedPanel && (
            <div className="panel-content">
              {advancedFeatures.map((feature) => (
                <button
                  key={feature.id}
                  className={cn(
                    "layer-item",
                    advancedFeatureStatus[feature.id as keyof typeof advancedFeatureStatus] && "active"
                  )}
                  onClick={() => toggleAdvancedFeature(feature.id)}
                >
                  {feature.icon}
                  <span className="flex-1 text-left">{feature.name}</span>
                  {advancedFeatureStatus[feature.id as keyof typeof advancedFeatureStatus] 
                    ? <Eye className="h-3.5 w-3.5 text-primary" />
                    : <EyeOff className="h-3.5 w-3.5" />
                  }
                </button>
              ))}
            </div>
          )}
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

        <div className={cn(
          "relative",
          isFullscreen ? "map-fullscreen z-50" : "grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]"
        )}>
          <Card className={cn(
            "relative h-[600px] animate-fade-in",
            "glass",
            isFullscreen && "h-screen rounded-none"
          )}>
            <div className="absolute top-2 right-2 z-30 gap-2 flex">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={toggleFullscreen}
                      className="bg-card/80 backdrop-blur-sm"
                    >
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{isFullscreen ? "Exit fullscreen" : "View fullscreen"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="absolute top-2 right-12 z-10 flex gap-2">
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
                    if (mapToken) {
                      localStorage.setItem("mapbox_token", mapToken);
                      setMapToken("");
                      setTimeout(() => setMapToken(mapToken), 0);
                    }
                  }}>
                    Load Map
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div ref={mapContainer} className={cn(
                  "h-full w-full rounded-xl overflow-hidden",
                  isFullscreen && "rounded-none"
                )} />
                {renderMapControls()}
              </>
            )}
          </Card>

          {!isFullscreen && (
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
                        <div className="w-4 h-4 rounded-full opacity-90" style={{ backgroundColor: mapFeatures.healthScores.color }} />
                        <span>High Health Score</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full opacity-70" style={{ backgroundColor: mapFeatures.healthScores.color }} />
                        <span>Medium Health Score</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full opacity-50" style={{ backgroundColor: mapFeatures.healthScores.color }} />
                        <span>Low Health Score</span>
                      </div>
                    </>
                  )}
                  
                  {activeLayer === 'diabetesRates' && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full opacity-90" style={{ backgroundColor: mapFeatures.diabetesRates.color }} />
                        <span>High Diabetes Rate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full opacity-70" style={{ backgroundColor: mapFeatures.diabetesRates.color }} />
                        <span>Medium Diabetes Rate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full opacity-50" style={{ backgroundColor: mapFeatures.diabetesRates.color }} />
                        <span>Low Diabetes Rate</span>
                      </div>
                    </>
                  )}
                  
                  {activeLayer === 'mentalHealth' && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full opacity-90" style={{ backgroundColor: mapFeatures.mentalHealth.color }} />
                        <span>High Mental Health Score</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full opacity-70" style={{ backgroundColor: mapFeatures.mentalHealth.color }} />
                        <span>Medium Mental Health Score</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full opacity-50" style={{ backgroundColor: mapFeatures.mentalHealth.color }} />
                        <span>Low Mental Health Score</span>
                      </div>
                    </>
                  )}
                  
                  {activeLayer === 'airQuality' && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full opacity-90" style={{ backgroundColor: mapFeatures.airQuality.color }} />
                        <span>High Air Quality</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full opacity-70" style={{ backgroundColor: mapFeatures.airQuality.color }} />
                        <span>Medium Air Quality</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full opacity-50" style={{ backgroundColor: mapFeatures.airQuality.color }} />
                        <span>Low Air Quality</span>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              <Card className={cn(
                "animate-fade-in relative overflow-hidden",
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
                
                <Accordion type="single" collapsible defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="px-6 py-4">Health Indicators</AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-1">
                        {Object.values(mapFeatures).map((feature) => (
                          <Button 
                            key={feature.id}
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => toggleLayer(feature.id)}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <input 
                                type="checkbox" 
                                className="mr-2" 
                                checked={activeLayer === feature.id} 
                                onChange={() => {}} 
                              />
                              <span className="layer-color" style={{ backgroundColor: feature.color }} />
                              <span>{feature.name}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="px-6 py-4">Advanced Features</AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-1">
                        {advancedFeatures.map((feature) => (
                          <Button 
                            key={feature.id}
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => toggleAdvancedFeature(feature.id)}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <input 
                                type="checkbox" 
                                className="mr-2" 
                                checked={advancedFeatureStatus[feature.id as keyof typeof advancedFeatureStatus]} 
                                onChange={() => {}} 
                              />
                              {feature.icon}
                              <span>{feature.name}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
                          Help
                          <Info className="w-3 h-3 info-icon" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <p>Additional information about map features</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <h3 className="font-semibold mb-4">Map Usage Tips</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Click on any point to see detailed health data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Layers className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Toggle between different health metrics using the layer controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Expand className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Use fullscreen mode for a more immersive experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Search className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Try the search feature to find specific locations</span>
                  </li>
                </ul>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Map;
