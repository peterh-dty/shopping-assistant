import { Store } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

interface StoreMarkerProps {
  name?: string;
  address?: string;
  availableItems?: {
    name: string;
    inStock: boolean;
  }[];
  distance?: number;
  className?: string;
  onClick?: () => void;
}

export default function StoreMarker({
  name = "Sample Store",
  address = "123 Main St",
  availableItems = [
    { name: "Milk", inStock: true },
    { name: "Bread", inStock: true },
    { name: "Eggs", inStock: false },
  ],
  distance = 50,
  className = "",
  onClick = () => {},
}: StoreMarkerProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "w-8 h-8 rounded-full bg-primary text-primary-foreground",
            "flex items-center justify-center hover:scale-110 transition-transform",
            "shadow-lg hover:shadow-xl",
            className,
          )}
        >
          <Store className="h-4 w-4" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">{name}</h4>
            <Badge variant="secondary" className="text-xs">
              {distance}m away
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{address}</p>
          <div className="pt-2">
            <h5 className="text-xs font-medium mb-1">Available Items:</h5>
            <div className="space-y-1">
              {availableItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs"
                >
                  <span>{item.name}</span>
                  <Badge
                    variant={item.inStock ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {item.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
