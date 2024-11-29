import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CreateListButtonProps {
  onCreateList?: () => void;
  className?: string;
}

export default function CreateListButton({
  onCreateList = () => {},
  className = "",
}: CreateListButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`bg-primary text-primary-foreground hover:bg-primary/90 ${className}`}
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Shopping List</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-muted-foreground">
            Create a new shopping list to start tracking items.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
