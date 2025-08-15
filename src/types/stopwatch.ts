import type { Module, ModuleEvents, TimeDisplay } from './common';

export interface Stopwatch extends Module {
  type: 'stopwatch';
  elapsed: TimeDisplay;
  laps: StopwatchLap[];
  recordBest: boolean;
  saveSession: boolean;
}

export interface StopwatchLap {
  id: string;
  lapNumber: number;
  lapTime: TimeDisplay;
  totalTime: TimeDisplay;
  timestamp: Date;
  isBest?: boolean;
  isWorst?: boolean;
}

export interface StopwatchSession {
  id: string;
  name?: string;
  startedAt: Date;
  finishedAt?: Date;
  totalTime: TimeDisplay;
  laps: StopwatchLap[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StopwatchEvents extends ModuleEvents {
  onLap?: (lap: StopwatchLap) => void;
  onBestLap?: (lap: StopwatchLap) => void;
  onWorstLap?: (lap: StopwatchLap) => void;
}

export type StopwatchState = 'idle' | 'running' | 'paused' | 'finished';

export interface CreateStopwatchRequest {
  name?: string;
  recordBest?: boolean;
  saveSession?: boolean;
}

export interface StopwatchStats {
  totalSessions: number;
  totalTime: TimeDisplay;
  bestLap: StopwatchLap | null;
  worstLap: StopwatchLap | null;
  averageLapTime: TimeDisplay;
  averageSessionTime: TimeDisplay;
}
