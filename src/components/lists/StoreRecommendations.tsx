import { Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StoreRecommendation {
  id: string;
  name: string;
  distance: number;
  address: string;
  matchingItems: {
    name: string;
    inStock: boolean;
    price?: number;
  }[];
}

interface StoreRecommendationsProps {
  recommendations?: StoreRecommendation[];
  onStoreSelect?: (storeId: string) => void;
  className?: string;
}

export default function StoreRecommendations({
  recommendations = [
    {
      id: "1",
      name: "Grocery Store",
      distance: 50,
      address: "123 Main St",
      matchingItems: [
        { name: "Milk", inStock: true, price: 3.99 },
        { name: "Bread", inStock: true, price: 2.49 },
        { name: "Eggs", inStock: false },
      ],
    },
    {
      id: "2",
      name: "Supermarket",
      distance: 75,
      address: "456 Oak Ave",
      matchingItems: [
        { name: "Coffee", inStock: true, price: 8.99 },
        { name: "Tea", inStock: true, price: 4.99 },
        { name: "Sugar", inStock: true, price: 2.99 },
      ],
    },
  ],
  onStoreSelect = () => {},
  className = "",
}: StoreRecommendationsProps) {
  return (
    <Card className={cn("w-full bg-background", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Store className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Nearby Stores</h3>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[150px] pr-4">
          <div className="space-y-4">
            {recommendations.map((store) => (
              <button
                key={store.id}
                className={cn(
                  "w-full text-left p-3 rounded-lg",
                  "bg-secondary/50 hover:bg-secondary",
                  "transition-colors duration-200",
                )}
                onClick={() => onStoreSelect(store.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm">{store.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {store.address}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {store.distance}m away
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {store.matchingItems.map((item, index) => (
                    <Badge
                      key={index}
                      variant={item.inStock ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {item.name}
                      {item.price && ` - $${item.price.toFixed(2)}`}
                    </Badge>
                  ))}
                </div>
              </button>
            ))}
            {recommendations.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No stores found nearby with matching items
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
