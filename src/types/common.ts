export type ModuleState = 'idle' | 'running' | 'paused' | 'finished';

export type ModuleType = 'clock' | 'timer' | 'stopwatch';

export interface TimeDisplay {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export interface Module {
  id: string;
  type: ModuleType;
  name: string;
  state: ModuleState;
  timeDisplay: TimeDisplay;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModuleEvents {
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onReset?: () => void;
  onFinish?: () => void;
  onTick?: (time: TimeDisplay) => void;
}

export interface AppSettings {
  id: number;
  colorTheme: number;
  soundEnabled: boolean;
  alwaysOnTop: boolean;
  notifications: boolean;
  autoStart: boolean;
  theme: 'dark' | 'light';
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseEntity {
  id: string | number;
  createdAt: Date;
  updatedAt: Date;
}

export type SoundType = 'tick' | 'alarm' | 'notification' | 'finish';
