export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export type GeolocationCallback = (location: LocationData) => void;
export type GeolocationErrorCallback = (error: GeolocationError) => void;

class GeolocationService {
  private watchId: number | null = null;
  private defaultOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  async requestPermission(): Promise<boolean> {
    if (!("geolocation" in navigator)) {
      return false;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      return permission.state !== "denied";
    } catch (error) {
      return false;
    }
  }

  async getCurrentLocation(): Promise<LocationData> {
    if (!("geolocation" in navigator)) {
      throw new Error("Geolocation is not supported by this browser.");
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(this.formatPosition(position));
        },
        (error) => {
          reject(this.formatError(error));
        },
        this.defaultOptions,
      );
    });
  }

  startWatching(
    onUpdate: GeolocationCallback,
    onError?: GeolocationErrorCallback,
  ): void {
    if (!("geolocation" in navigator)) {
      if (onError) {
        onError({
          code: -1,
          message: "Geolocation is not supported by this browser.",
        });
      }
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        onUpdate(this.formatPosition(position));
      },
      (error) => {
        if (onError) {
          onError(this.formatError(error));
        }
      },
      this.defaultOptions,
    );
  }

  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  private formatPosition(position: GeolocationPosition): LocationData {
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date(position.timestamp).toISOString(),
    };
  }

  private formatError(error: GeolocationPositionError): GeolocationError {
    const messages: Record<number, string> = {
      1: "Location access denied. Please enable location services.",
      2: "Location unavailable. Please try again.",
      3: "Location request timed out. Please try again.",
    };

    return {
      code: error.code,
      message: messages[error.code] || "Unknown location error",
    };
  }
}

export const geolocationService = new GeolocationService();
