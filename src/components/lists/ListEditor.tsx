import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Save, Trash2 } from "lucide-react";
import ItemForm from "./ItemForm";
import StoreRecommendations from "./StoreRecommendations";

interface ListItem {
  id: string;
  name: string;
  quantity: number;
  storePreference?: string;
}

interface ListEditorProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (list: { title: string; items: ListItem[] }) => void;
  defaultValues?: {
    title?: string;
    items?: ListItem[];
  };
  className?: string;
}

export default function ListEditor({
  open = true,
  onOpenChange = () => {},
  onSave = () => {},
  defaultValues = {
    title: "",
    items: [
      { id: "1", name: "Milk", quantity: 1, storePreference: "grocery" },
      { id: "2", name: "Bread", quantity: 2 },
      { id: "3", name: "Eggs", quantity: 12, storePreference: "supermarket" },
    ],
  },
  className = "",
}: ListEditorProps) {
  const [title, setTitle] = useState(defaultValues.title);
  const [items, setItems] = useState<ListItem[]>(defaultValues.items || []);
  const [showItemForm, setShowItemForm] = useState(false);

  const handleAddItem = (item: {
    name: string;
    quantity: number;
    storePreference?: string;
  }) => {
    setItems([...items, { id: Date.now().toString(), ...item }]);
    setShowItemForm(false);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    onSave({ title, items });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[600px] bg-background", className)}
      >
        <DialogHeader>
          <DialogTitle>Edit Shopping List</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* List Title */}
          <div className="space-y-2">
            <Label htmlFor="title">List Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter list title"
              className="w-full"
            />
          </div>

          {/* Items List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Items</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowItemForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                        {item.storePreference &&
                          ` • Store: ${item.storePreference}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No items added yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Store Recommendations */}
          {items.length > 0 && (
            <StoreRecommendations
              recommendations={[
                {
                  id: "1",
                  name: "Nearby Grocery",
                  distance: 50,
                  address: "123 Main St",
                  matchingItems: items.map((item) => ({
                    name: item.name,
                    inStock: Math.random() > 0.3,
                    price: parseFloat((Math.random() * 20).toFixed(2)),
                  })),
                },
              ]}
            />
          )}

          {/* Item Form Dialog */}
          <Dialog open={showItemForm} onOpenChange={setShowItemForm}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add Item</DialogTitle>
              </DialogHeader>
              <ItemForm onSubmit={handleAddItem} className="py-4" />
            </DialogContent>
          </Dialog>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={!title || items.length === 0}
          >
            <Save className="mr-2 h-4 w-4" />
            Save List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
