import { useState, useEffect } from "react";
import { MapPin, Bell, RotateCcw, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { settingsService, type Settings } from "@/lib/services/settings";
import { useToast } from "@/components/ui/use-toast";

interface SettingsDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export default function SettingsDrawer({
  open = false,
  onOpenChange = () => {},
  className = "",
}: SettingsDrawerProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(
    settingsService.getSettings(),
  );

  useEffect(() => {
    setSettings(settingsService.getSettings());
  }, []);

  const handleSettingChange = <K extends keyof Settings>(
    key: K,
    value: Settings[K],
  ) => {
    const updated = settingsService.updateSettings({ [key]: value });
    setSettings(updated);
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved.",
    });
  };

  const handleNotificationChange = (
    key: keyof Settings["notifications"],
    value: boolean,
  ) => {
    const updated = settingsService.updateSettings({
      notifications: { ...settings.notifications, [key]: value },
    });
    setSettings(updated);
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleReset = () => {
    const reset = settingsService.resetSettings();
    setSettings(reset);
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults.",
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>
            Manage your app preferences and notifications
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Settings
              </CardTitle>
              <CardDescription>
                Configure how the app uses your location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="location-sharing"
                  className="flex flex-col gap-1"
                >
                  <span>Location Sharing</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Allow app to access your location
                  </span>
                </Label>
                <Switch
                  id="location-sharing"
                  checked={settings.locationSharing}
                  onCheckedChange={(checked) =>
                    handleSettingChange("locationSharing", checked)
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="location-accuracy">Location Accuracy</Label>
                <Select
                  value={settings.locationAccuracy}
                  onValueChange={(value) =>
                    handleSettingChange(
                      "locationAccuracy",
                      value as Settings["locationAccuracy"],
                    )
                  }
                >
                  <SelectTrigger id="location-accuracy">
                    <SelectValue placeholder="Select accuracy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Accuracy</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="low">Low Power</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Search Radius: {settings.searchRadius}m
                </Label>
                <Slider
                  value={[settings.searchRadius]}
                  min={50}
                  max={500}
                  step={50}
                  onValueChange={([value]) =>
                    handleSettingChange("searchRadius", value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-stores" className="flex flex-col gap-1">
                  <span>New Stores Nearby</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Get notified when new stores open in your area
                  </span>
                </Label>
                <Switch
                  id="notify-stores"
                  checked={settings.notifications.newStores}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("newStores", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notify-items" className="flex flex-col gap-1">
                  <span>Item Availability</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Get notified when items from your lists become available
                  </span>
                </Label>
                <Switch
                  id="notify-items"
                  checked={settings.notifications.itemAvailability}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("itemAvailability", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notify-prices" className="flex flex-col gap-1">
                  <span>Price Alerts</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Get notified about price changes for items in your lists
                  </span>
                </Label>
                <Switch
                  id="notify-prices"
                  checked={settings.notifications.priceAlerts}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("priceAlerts", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DrawerFooter>
          <Button variant="destructive" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Settings
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
