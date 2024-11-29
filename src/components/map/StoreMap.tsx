import { useState, useCallback, useEffect } from "react";
import Map, { Marker, NavigationControl, GeolocateControl } from "react-map-gl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Crosshair } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import LocationIndicator from "./LocationIndicator";
import StoreMarker from "./StoreMarker";
import {
  geolocationService,
  type LocationData,
} from "@/lib/services/geolocation";
import "mapbox-gl/dist/mapbox-gl.css";

interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number;
  availableItems: {
    name: string;
    inStock: boolean;
  }[];
}

interface StoreMapProps {
  stores?: Store[];
  userLocation?: LocationData;
  onStoreClick?: (storeId: string) => void;
  onLocationUpdate?: (location: LocationData) => void;
  className?: string;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  console.error(
    "Mapbox token is not configured. Please add VITE_MAPBOX_TOKEN to your .env file.",
  );
}

const DEFAULT_LOCATION: LocationData = {
  latitude: 40.7128,
  longitude: -74.006,
  accuracy: 0,
  timestamp: new Date().toISOString(),
};

export default function StoreMap({
  stores = [
    {
      id: "1",
      name: "Grocery Store",
      address: "123 Main St",
      latitude: 40.7128,
      longitude: -74.006,
      distance: 50,
      availableItems: [
        { name: "Milk", inStock: true },
        { name: "Bread", inStock: true },
        { name: "Eggs", inStock: false },
      ],
    },
  ],
  userLocation = DEFAULT_LOCATION,
  onStoreClick = () => {},
  onLocationUpdate = () => {},
  className = "",
}: StoreMapProps) {
  const { toast } = useToast();
  const [viewState, setViewState] = useState({
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    zoom: 14,
  });
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    const setupGeolocation = async () => {
      const hasPermission = await geolocationService.requestPermission();

      if (hasPermission) {
        try {
          const location = await geolocationService.getCurrentLocation();
          handleLocationUpdate(location);
          startWatchingLocation();
        } catch (error: any) {
          toast({
            title: "Location Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Location Access Required",
          description: "Please enable location services to use all features.",
          variant: "destructive",
        });
      }
    };

    setupGeolocation();

    return () => {
      if (isWatching) {
        geolocationService.stopWatching();
      }
    };
  }, []);

  const startWatchingLocation = () => {
    if (!isWatching) {
      geolocationService.startWatching(handleLocationUpdate, (error) => {
        toast({
          title: "Location Error",
          description: error.message,
          variant: "destructive",
        });
      });
      setIsWatching(true);
    }
  };

  const handleLocationUpdate = useCallback(
    (location: LocationData) => {
      setViewState((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      }));
      onLocationUpdate(location);
    },
    [onLocationUpdate],
  );

  const handleManualLocationUpdate = useCallback(async () => {
    try {
      const location = await geolocationService.getCurrentLocation();
      handleLocationUpdate(location);
    } catch (error: any) {
      toast({
        title: "Location Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [handleLocationUpdate]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-secondary/10 text-muted-foreground">
        Mapbox token not configured
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[calc(100vh-4rem)]",
        className,
      )}
    >
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl
          position="top-right"
          trackUserLocation
          onGeolocate={(e) => {
            const location: LocationData = {
              latitude: e.coords.latitude,
              longitude: e.coords.longitude,
              accuracy: e.coords.accuracy,
              timestamp: new Date().toISOString(),
            };
            handleLocationUpdate(location);
          }}
        />

        <Marker
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
        >
          <LocationIndicator {...userLocation} />
        </Marker>

        {stores.map((store) => (
          <Marker
            key={store.id}
            latitude={store.latitude}
            longitude={store.longitude}
          >
            <StoreMarker
              name={store.name}
              address={store.address}
              availableItems={store.availableItems}
              distance={store.distance}
              onClick={() => onStoreClick(store.id)}
            />
          </Marker>
        ))}
      </Map>

      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 h-10 w-10"
        onClick={handleManualLocationUpdate}
      >
        <Crosshair className="h-4 w-4" />
      </Button>
    </div>
  );
}
