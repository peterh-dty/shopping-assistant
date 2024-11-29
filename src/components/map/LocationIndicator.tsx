import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

interface LocationIndicatorProps {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  timestamp?: string;
  className?: string;
  onClick?: () => void;
}

export default function LocationIndicator({
  latitude = 0,
  longitude = 0,
  accuracy = 10,
  timestamp = new Date().toLocaleString(),
  className = "",
  onClick = () => {},
}: LocationIndicatorProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "w-8 h-8 rounded-full bg-blue-500 text-white",
            "flex items-center justify-center hover:scale-110 transition-transform",
            "shadow-lg hover:shadow-xl animate-pulse",
            className,
          )}
        >
          <MapPin className="h-4 w-4" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Your Location</h4>
            <Badge variant="secondary" className="text-xs">
              ±{accuracy}m
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Lat: {latitude.toFixed(6)}
              <br />
              Long: {longitude.toFixed(6)}
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated: {timestamp}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
