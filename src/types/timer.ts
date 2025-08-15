import type { Module, ModuleEvents, TimeDisplay, DatabaseEntity } from './common';

export interface Timer extends Module {
  type: 'timer';
  duration: TimeDisplay;
  remaining: TimeDisplay;
  autoRestart: boolean;
  soundOnFinish: boolean;
  notificationMessage?: string;
}

export interface TimerPreset extends DatabaseEntity {
  name: string;
  duration: TimeDisplay;
  soundOnFinish: boolean;
  notificationMessage?: string;
  color?: string;
  isDefault: boolean;
}

export interface TimerSession extends DatabaseEntity {
  timerId: string;
  startedAt: Date;
  finishedAt?: Date;
  duration: TimeDisplay;
  completed: boolean;
  pausedTime: number; // milliseconds paused
}

export interface TimerEvents extends ModuleEvents {
  onTimeUp?: () => void;
  onWarning?: (remainingTime: TimeDisplay) => void;
}

export type TimerState = 'idle' | 'running' | 'paused' | 'finished';

export interface CreateTimerRequest {
  duration: TimeDisplay;
  name?: string;
  autoRestart?: boolean;
  soundOnFinish?: boolean;
  notificationMessage?: string;
}

export interface UpdateTimerRequest {
  duration?: TimeDisplay;
  name?: string;
  autoRestart?: boolean;
  soundOnFinish?: boolean;
  notificationMessage?: string;
}
