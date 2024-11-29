import { useState } from "react";
import { cn } from "@/lib/utils";
import CreateListButton from "./CreateListButton";
import ListCard from "./ListCard";

interface ShoppingList {
  id: string;
  title: string;
  items: {
    name: string;
    quantity: number;
    store?: string;
  }[];
}

interface ShoppingListsProps {
  lists?: ShoppingList[];
  onCreateList?: () => void;
  onEditList?: (id: string) => void;
  onDeleteList?: (id: string) => void;
  className?: string;
}

export default function ShoppingLists({
  lists = [
    {
      id: "1",
      title: "Grocery Shopping",
      items: [
        { name: "Milk", quantity: 1, store: "Grocery Store" },
        { name: "Bread", quantity: 2 },
        { name: "Eggs", quantity: 12, store: "Supermarket" },
      ],
    },
    {
      id: "2",
      title: "Hardware Store",
      items: [
        { name: "Screwdriver", quantity: 1, store: "Hardware Store" },
        { name: "Nails", quantity: 20 },
        { name: "Paint", quantity: 1, store: "Home Depot" },
      ],
    },
  ],
  onCreateList = () => {},
  onEditList = () => {},
  onDeleteList = () => {},
  className = "",
}: ShoppingListsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={cn("bg-background min-h-screen p-4 pb-20", className)}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Shopping Lists
            </h1>
            <p className="text-muted-foreground">
              Create and manage your shopping lists
            </p>
          </div>
          <CreateListButton onCreateList={onCreateList} />
        </div>

        {/* Lists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <ListCard
              key={list.id}
              title={list.title}
              items={list.items}
              onEdit={() => onEditList(list.id)}
              onDelete={() => onDeleteList(list.id)}
            />
          ))}
          {lists.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No shopping lists yet. Create your first list to get started!
              </p>
              <CreateListButton onCreateList={onCreateList} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
