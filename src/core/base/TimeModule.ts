// Base abstract para todos los time modules
export abstract class TimeModule {
  protected _state: 'idle' | 'running' | 'paused' | 'finished' = 'idle';
  protected _startTime: number = 0;
  protected _pausedTime: number = 0;
  
  abstract start(): void;
  abstract pause(): void;
  abstract stop(): void;
  abstract reset(): void;
  
  get state() { return this._state; }
  
  protected getCurrentTime(): number {
    return Date.now();
  }
}
