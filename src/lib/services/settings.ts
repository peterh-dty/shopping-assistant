interface Settings {
  locationSharing: boolean;
  locationAccuracy: "high" | "balanced" | "low";
  notifications: {
    newStores: boolean;
    itemAvailability: boolean;
    priceAlerts: boolean;
  };
  searchRadius: number; // in meters
}

const DEFAULT_SETTINGS: Settings = {
  locationSharing: true,
  locationAccuracy: "balanced",
  notifications: {
    newStores: true,
    itemAvailability: true,
    priceAlerts: false,
  },
  searchRadius: 100,
};

class SettingsService {
  private storageKey = "shopping-list-settings";

  getSettings(): Settings {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return DEFAULT_SETTINGS;

    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  updateSettings(settings: Partial<Settings>): Settings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    return updated;
  }

  resetSettings(): Settings {
    localStorage.setItem(this.storageKey, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
}

export const settingsService = new SettingsService();
export type { Settings };
