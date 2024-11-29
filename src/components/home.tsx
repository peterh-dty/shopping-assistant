import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { cn } from "@/lib/utils";
import BottomNav from "./navigation/BottomNav";
import ShoppingLists from "./lists/ShoppingLists";
import StoreMap from "./map/StoreMap";
import ListEditor from "./lists/ListEditor";
import SettingsPage from "./settings/SettingsPage";
import { type Store, storeService } from "@/lib/services/stores";
import { type LocationData } from "@/lib/services/geolocation";
import { settingsService } from "@/lib/services/settings";
import { useToast } from "@/components/ui/use-toast";

interface ShoppingList {
  id: string;
  title: string;
  items: {
    name: string;
    quantity: number;
    store?: string;
  }[];
}

export default function Home() {
  const { toast } = useToast();
  const [lists, setLists] = useState<ShoppingList[]>([
    {
      id: "1",
      title: "Grocery Shopping",
      items: [
        { name: "Milk", quantity: 1, store: "Grocery Store" },
        { name: "Bread", quantity: 2 },
        { name: "Eggs", quantity: 12, store: "Supermarket" },
      ],
    },
  ]);

  const [showListEditor, setShowListEditor] = useState(false);
  const [editingList, setEditingList] = useState<ShoppingList | null>(null);
  const [nearbyStores, setNearbyStores] = useState<Store[]>([]);
  const [userLocation, setUserLocation] = useState<LocationData>({
    latitude: 40.7128,
    longitude: -74.006,
    accuracy: 0,
    timestamp: new Date().toISOString(),
  });

  // Fetch nearby stores when location changes
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const settings = settingsService.getSettings();
        if (!settings.locationSharing) return;

        // Get all unique item names from all lists
        const allItems = Array.from(
          new Set(lists.flatMap((list) => list.items.map((item) => item.name))),
        );

        const stores = await storeService.getNearbyStores(
          userLocation,
          settings.searchRadius,
          allItems,
        );
        setNearbyStores(stores);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch nearby stores",
          variant: "destructive",
        });
      }
    };

    fetchStores();
  }, [userLocation, lists, toast]);

  const handleCreateList = () => {
    setEditingList(null);
    setShowListEditor(true);
  };

  const handleEditList = (id: string) => {
    const list = lists.find((l) => l.id === id);
    if (list) {
      setEditingList(list);
      setShowListEditor(true);
    }
  };

  const handleDeleteList = (id: string) => {
    setLists(lists.filter((list) => list.id !== id));
  };

  const handleSaveList = (list: { title: string; items: any[] }) => {
    if (editingList) {
      setLists(
        lists.map((l) =>
          l.id === editingList.id
            ? { ...l, title: list.title, items: list.items }
            : l,
        ),
      );
    } else {
      setLists([
        ...lists,
        {
          id: Date.now().toString(),
          title: list.title,
          items: list.items,
        },
      ]);
    }
    setShowListEditor(false);
    setEditingList(null);
  };

  const handleLocationUpdate = (location: LocationData) => {
    const settings = settingsService.getSettings();
    if (settings.locationSharing) {
      setUserLocation(location);
    }
  };

  return (
    <div className="w-screen h-screen bg-background overflow-hidden">
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <Routes>
          <Route
            path="/"
            element={
              <ShoppingLists
                lists={lists}
                onCreateList={handleCreateList}
                onEditList={handleEditList}
                onDeleteList={handleDeleteList}
              />
            }
          />
          <Route
            path="/map"
            element={
              <StoreMap
                stores={nearbyStores}
                userLocation={userLocation}
                onLocationUpdate={handleLocationUpdate}
              />
            }
          />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>

      <ListEditor
        open={showListEditor}
        onOpenChange={setShowListEditor}
        onSave={handleSaveList}
        defaultValues={{
          title: editingList?.title || "",
          items: editingList?.items || [],
        }}
      />

      <BottomNav />
    </div>
  );
}
