import { Plus, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItemFormProps {
  onSubmit?: (item: {
    name: string;
    quantity: number;
    storePreference?: string;
  }) => void;
  className?: string;
  defaultValues?: {
    name?: string;
    quantity?: number;
    storePreference?: string;
  };
}

export default function ItemForm({
  onSubmit = () => {},
  className = "",
  defaultValues = {
    name: "",
    quantity: 1,
    storePreference: "",
  },
}: ItemFormProps) {
  return (
    <form
      className={cn("space-y-4 bg-background p-4 rounded-lg", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit({
          name: formData.get("name") as string,
          quantity: Number(formData.get("quantity")),
          storePreference: formData.get("storePreference") as string,
        });
      }}
    >
      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter product name"
          defaultValue={defaultValues.name}
          required
        />
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          defaultValue={defaultValues.quantity}
          required
        />
      </div>

      {/* Store Preference */}
      <div className="space-y-2">
        <Label htmlFor="storePreference">Preferred Store (Optional)</Label>
        <Select
          name="storePreference"
          defaultValue={defaultValues.storePreference}
        >
          <SelectTrigger id="storePreference">
            <SelectValue placeholder="Select a store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grocery">Grocery Store</SelectItem>
            <SelectItem value="supermarket">Supermarket</SelectItem>
            <SelectItem value="convenience">Convenience Store</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </form>
  );
}
