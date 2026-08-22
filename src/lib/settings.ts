/* Shared app settings (notifications + privacy) with localStorage fallback.
 * Signed-in users persist to profiles.settings jsonb; signed-out visitors persist locally. */

export interface AppSettings {
  notif_nearby: boolean;
  notif_availability: boolean;
  notif_saved: boolean;
  notif_community: boolean;
  notif_product: boolean;
  privacy_location: boolean;
  privacy_profile_public: boolean;
  privacy_data: boolean;
}

export const defaultSettings: AppSettings = {
  notif_nearby: true,
  notif_availability: true,
  notif_saved: true,
  notif_community: false,
  notif_product: true,
  privacy_location: true,
  privacy_profile_public: false,
  privacy_data: true,
};

const KEY = "evchargehub-settings";

export function loadLocalSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveLocalSettings(s: AppSettings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export const FEEDBACK_CATEGORIES = [
  "Bug Report",
  "Charging Station Issue",
  "Incorrect Information",
  "Feature Request",
  "General Feedback",
  "Other",
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];
