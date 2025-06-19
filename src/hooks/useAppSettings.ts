import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppSettings, SettingValue, UseAppSettingsReturn } from "@/types/settings";
import { DEFAULT_SETTINGS } from "@/constants/Settings";

const SETTINGS_KEY = "@app_settings";

export const useAppSettings = (): UseAppSettingsReturn => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored) as Partial<AppSettings>;
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.error("Ошибка загрузки настроек:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async <T extends keyof AppSettings>(key: T, value: SettingValue<T>): Promise<boolean> => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      return true;
    } catch (error) {
      console.error("Ошибка сохранения настроек:", error);
      setSettings(settings);
      return false;
    }
  };

  return {
    settings,
    updateSetting,
    isLoading,
  };
};
