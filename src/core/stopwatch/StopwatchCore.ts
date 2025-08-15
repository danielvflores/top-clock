import type { Stopwatch, StopwatchLap } from '../../types/stopwatch';
import type { TimeDisplay } from '../../types/common';
import { TimeModule } from '../base/TimeModule';
import type { ITimeEventEmitter, ITimeRepository } from '../base/interfaces';

export class StopwatchCore extends TimeModule {
  private _elapsed: TimeDisplay = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
  private _laps: StopwatchLap[] = [];
  private _intervalId: NodeJS.Timeout | null = null;
  private eventEmitter?: ITimeEventEmitter;
  private repository?: ITimeRepository<Stopwatch>;
  
  constructor(
    eventEmitter?: ITimeEventEmitter,
    repository?: ITimeRepository<Stopwatch>
  ) {
    super();
    this.eventEmitter = eventEmitter;
    this.repository = repository;
  }

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
    const totalElapsed = this._pausedTime;
    this._elapsed = this.msToTimeDisplay(totalElapsed);
    this.eventEmitter?.emit('tick', this._elapsed);
    
    this.eventEmitter?.emit('pause');
  }

  stop(): void {
    this._state = 'finished';
    this.clearInterval();
    this.eventEmitter?.emit('stop');
  }

  reset(): void {
    this._state = 'idle';
    this._elapsed = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    this._laps = [];
    this._pausedTime = 0;
    this.clearInterval();
    this.eventEmitter?.emit('reset');
  }

  addLap(): StopwatchLap {
    if (this._state !== 'running') {
      throw new Error('Cannot add lap when stopwatch is not running');
    }

    const currentTime = { ...this._elapsed };
    const lapTime = this.calculateLapTime();
    
    const lap: StopwatchLap = {
      id: crypto.randomUUID(),
      lapNumber: this._laps.length + 1,
      lapTime,
      totalTime: currentTime,
      timestamp: new Date()
    };

    this._laps.push(lap);
    this.eventEmitter?.emit('lap', lap);
    
    return lap;
  }

  private tick(): void {
    const totalElapsed = this.getCurrentTime() - this._startTime + this._pausedTime;
    this._elapsed = this.msToTimeDisplay(totalElapsed);
    this.eventEmitter?.emit('tick', this._elapsed);
  }

  private calculateLapTime(): TimeDisplay {
    if (this._laps.length === 0) {
      return { ...this._elapsed };
    }

    const lastLap = this._laps[this._laps.length - 1];
    const currentMs = this.timeDisplayToMs(this._elapsed);
    const lastLapMs = this.timeDisplayToMs(lastLap.totalTime);
    
    return this.msToTimeDisplay(currentMs - lastLapMs);
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

  get elapsed(): TimeDisplay { return { ...this._elapsed }; }
  get laps(): StopwatchLap[] { return [...this._laps]; }
}
