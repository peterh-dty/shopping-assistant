import { LocationData } from "./geolocation";

export interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number;
  availableItems: {
    name: string;
    inStock: boolean;
    price?: number;
  }[];
}

// Simulated store data
const MOCK_STORES: Store[] = [
  {
    id: "1",
    name: "Grocery Store",
    address: "123 Main St",
    latitude: 40.7128,
    longitude: -74.006,
    distance: 50,
    availableItems: [
      { name: "Milk", inStock: true, price: 3.99 },
      { name: "Bread", inStock: true, price: 2.49 },
      { name: "Eggs", inStock: false },
    ],
  },
  {
    id: "2",
    name: "Supermarket",
    address: "456 Oak Ave",
    latitude: 40.7138,
    longitude: -74.007,
    distance: 75,
    availableItems: [
      { name: "Coffee", inStock: true, price: 8.99 },
      { name: "Tea", inStock: true, price: 4.99 },
      { name: "Sugar", inStock: true, price: 2.99 },
    ],
  },
];

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

class StoreService {
  async getNearbyStores(
    location: LocationData,
    radius: number = 100, // Default radius in meters
    items?: string[],
  ): Promise<Store[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Filter stores by distance and items
    return MOCK_STORES.map((store) => ({
      ...store,
      distance: Math.round(
        calculateDistance(
          location.latitude,
          location.longitude,
          store.latitude,
          store.longitude,
        ),
      ),
    })).filter((store) => {
      // Filter by distance
      if (store.distance > radius) return false;

      // Filter by items if specified
      if (items && items.length > 0) {
        return items.some((item) =>
          store.availableItems.some(
            (storeItem) =>
              storeItem.name.toLowerCase() === item.toLowerCase() &&
              storeItem.inStock,
          ),
        );
      }

      return true;
    });
  }

  async getStoreDetails(storeId: string): Promise<Store | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const store = MOCK_STORES.find((s) => s.id === storeId);
    return store || null;
  }
}

export const storeService = new StoreService();
