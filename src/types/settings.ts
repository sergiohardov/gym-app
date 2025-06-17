// Определяем тип настроек
export interface AppSettings {
  isFirstLaunch: boolean;
}

// Тип для значений настроек
export type SettingValue<T extends keyof AppSettings> = AppSettings[T];

// Возвращаемый тип хука
export interface UseAppSettingsReturn {
  settings: AppSettings;
  updateSetting: <T extends keyof AppSettings>(key: T, value: SettingValue<T>) => Promise<boolean>;
  isLoading: boolean;
}
