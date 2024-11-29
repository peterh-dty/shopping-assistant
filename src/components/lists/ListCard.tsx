import { Edit2, Trash2, ShoppingBag } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ListItem {
  name: string;
  quantity: number;
  store?: string;
}

interface ListCardProps {
  title?: string;
  items?: ListItem[];
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export default function ListCard({
  title = "Shopping List",
  items = [
    { name: "Milk", quantity: 1, store: "Grocery Store" },
    { name: "Bread", quantity: 2 },
    { name: "Eggs", quantity: 12, store: "Supermarket" },
  ],
  onEdit = () => {},
  onDelete = () => {},
  className = "",
}: ListCardProps) {
  return (
    <Card className={cn("w-[350px] bg-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">
                {item.quantity}x {item.name}
              </span>
              {item.store && (
                <Badge variant="secondary" className="text-xs">
                  {item.store}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      {items.length > 3 && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            +{items.length - 3} more items
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
