import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateListButtonProps {
  onCreateList?: () => void;
  className?: string;
}

export default function CreateListButton({
  onCreateList = () => {},
  className = "",
}: CreateListButtonProps) {
  return (
    <Button
      onClick={onCreateList}
      className={`bg-primary text-primary-foreground hover:bg-primary/90 ${className}`}
      size="lg"
    >
      <Plus className="mr-2 h-5 w-5" />
      Create List
    </Button>
  );
}
