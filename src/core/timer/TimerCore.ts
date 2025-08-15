import type { Timer } from '../../types/timer';
import type { TimeDisplay } from '../../types/common';
import { TimeModule } from '../base/TimeModule';
import type { ITimeEventEmitter, ITimeRepository } from '../base/interfaces';

export class TimerCore extends TimeModule {
  private _duration: TimeDisplay;
  private _remaining: TimeDisplay;
  private _intervalId: NodeJS.Timeout | null = null;
  private eventEmitter?: ITimeEventEmitter;
  private repository?: ITimeRepository<Timer>;
  
  constructor(
    duration: TimeDisplay,
    eventEmitter?: ITimeEventEmitter,
    repository?: ITimeRepository<Timer>
  ) {
    super();
    this._duration = { ...duration };
    this._remaining = { ...duration };
    this.eventEmitter = eventEmitter;
    this.repository = repository;
  }

  // Interface Segregation: métodos específicos del timer
  start(): void {
    if (this._state === 'running') return;
    
    this._state = 'running';
    this._startTime = this.getCurrentTime();
    this.eventEmitter?.emit('start');
    
    this._intervalId = setInterval(() => {
      this.tick();
    }, 10);
  }

  pause(): void {
    if (this._state !== 'running') return;
    
    this._state = 'paused';
    this._pausedTime += this.getCurrentTime() - this._startTime;
    this.clearInterval();
    
    // Emitir un tick final para actualizar la UI con el tiempo actual
    const elapsed = this._pausedTime;
    const totalDuration = this.timeDisplayToMs(this._duration);
    const remaining = Math.max(0, totalDuration - elapsed);
    this._remaining = this.msToTimeDisplay(remaining);
    this.eventEmitter?.emit('tick', this._remaining);
    
    this.eventEmitter?.emit('pause');
  }

  stop(): void {
    this._state = 'finished';
    this.clearInterval();
    this.eventEmitter?.emit('stop');
  }

  reset(): void {
    this._state = 'idle';
    this._remaining = { ...this._duration };
    this._pausedTime = 0;
    this.clearInterval();
    this.eventEmitter?.emit('reset');
  }

  // Open/Closed: fácil extensión sin modificación
  private tick(): void {
    const elapsed = this.getCurrentTime() - this._startTime + this._pausedTime;
    const totalDuration = this.timeDisplayToMs(this._duration);
    const remaining = Math.max(0, totalDuration - elapsed);
    
    this._remaining = this.msToTimeDisplay(remaining);
    this.eventEmitter?.emit('tick', this._remaining);
    
    if (remaining <= 0) {
      this.onTimeUp();
    }
  }

  private onTimeUp(): void {
    this.stop();
    this.eventEmitter?.emit('timeUp');
  }

  private clearInterval(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  private timeDisplayToMs(time: TimeDisplay): number {
    return (time.hours * 3600 + time.minutes * 60 + time.seconds) * 1000 + time.milliseconds;
  }

  private msToTimeDisplay(ms: number): TimeDisplay {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    
    return { hours, minutes, seconds, milliseconds };
  }

  get remaining(): TimeDisplay { return { ...this._remaining }; }
  get timerDuration(): TimeDisplay { return { ...this._duration }; }
}
