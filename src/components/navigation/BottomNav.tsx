import { ListChecks, Map, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  className?: string;
  onSettingsClick?: () => void;
}

export default function BottomNav({
  className = "",
  onSettingsClick = () => {},
}: BottomNavProps) {
  const location = useLocation();

  const navItems = [
    {
      icon: ListChecks,
      label: "Lists",
      path: "/",
      onClick: undefined,
    },
    {
      icon: Map,
      label: "Map",
      path: "/map",
      onClick: undefined,
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      onClick: onSettingsClick,
    },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 h-16 bg-background border-t flex items-center justify-around px-4",
        className,
      )}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        const Component = item.onClick ? "button" : Link;
        const componentProps = item.onClick
          ? { onClick: item.onClick }
          : { to: item.path };

        return (
          <Component
            key={item.path}
            {...componentProps}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-full",
              "text-muted-foreground transition-colors",
              isActive && "text-primary",
            )}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Component>
        );
      })}
    </nav>
  );
}
