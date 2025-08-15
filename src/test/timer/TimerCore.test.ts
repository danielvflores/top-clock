import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TimerCore } from '../../core/timer/TimerCore';
import type { TimeDisplay } from '../../types/common';
import type { ITimeEventEmitter } from '../../core/base/interfaces';

// Mock del EventEmitter
class MockEventEmitter implements ITimeEventEmitter {
  private events: Map<string, ((...args: unknown[]) => void)[]> = new Map();

  emit(event: string, ...args: unknown[]): void {
    const callbacks = this.events.get(event) || [];
    callbacks.forEach(callback => callback(...args));
  }

  on(event: string, callback: (...args: unknown[]) => void): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  off(event: string, callback: (...args: unknown[]) => void): void {
    const callbacks = this.events.get(event) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  getEventCount(event: string): number {
    return this.events.get(event)?.length || 0;
  }
}

describe('TimerCore', () => {
  let timer: TimerCore;
  let mockEventEmitter: MockEventEmitter;
  let mockDuration: TimeDisplay;

  beforeEach(() => {
    mockEventEmitter = new MockEventEmitter();
    mockDuration = { hours: 0, minutes: 5, seconds: 0, milliseconds: 0 };
    timer = new TimerCore(mockDuration, mockEventEmitter);
    
    // Mock de Date.now para tests determinísticos
    vi.useFakeTimers();
  });

  describe('Initialization', () => {
    it('should initialize with correct duration', () => {
      expect(timer.timerDuration).toEqual(mockDuration);
      expect(timer.remaining).toEqual(mockDuration);
      expect(timer.state).toBe('idle');
    });
  });

  describe('State Management', () => {
    it('should start timer correctly', () => {
      const startCallback = vi.fn();
      mockEventEmitter.on('start', startCallback);

      timer.start();

      expect(timer.state).toBe('running');
      expect(startCallback).toHaveBeenCalledOnce();
    });

    it('should not start if already running', () => {
      const startCallback = vi.fn();
      mockEventEmitter.on('start', startCallback);

      timer.start();
      timer.start(); // Second start

      expect(startCallback).toHaveBeenCalledOnce();
    });

    it('should pause timer correctly', () => {
      const pauseCallback = vi.fn();
      mockEventEmitter.on('pause', pauseCallback);

      timer.start();
      timer.pause();

      expect(timer.state).toBe('paused');
      expect(pauseCallback).toHaveBeenCalledOnce();
    });

    it('should not pause if not running', () => {
      const pauseCallback = vi.fn();
      mockEventEmitter.on('pause', pauseCallback);

      timer.pause(); // Pause without starting

      expect(timer.state).toBe('idle');
      expect(pauseCallback).not.toHaveBeenCalled();
    });

    it('should stop timer correctly', () => {
      const stopCallback = vi.fn();
      mockEventEmitter.on('stop', stopCallback);

      timer.start();
      timer.stop();

      expect(timer.state).toBe('finished');
      expect(stopCallback).toHaveBeenCalledOnce();
    });

    it('should reset timer correctly', () => {
      const resetCallback = vi.fn();
      mockEventEmitter.on('reset', resetCallback);

      timer.start();
      timer.reset();

      expect(timer.state).toBe('idle');
      expect(timer.remaining).toEqual(mockDuration);
      expect(resetCallback).toHaveBeenCalledOnce();
    });
  });

  describe('Timer Countdown', () => {
    it('should emit tick events while running', async () => {
      const tickCallback = vi.fn();
      mockEventEmitter.on('tick', tickCallback);

      timer.start();
      
      // Avanzar el tiempo 1 segundo
      vi.advanceTimersByTime(1000);

      expect(tickCallback).toHaveBeenCalled();
    });

    it('should emit timeUp when duration is reached', async () => {
      const timeUpCallback = vi.fn();
      const stopCallback = vi.fn();
      
      mockEventEmitter.on('timeUp', timeUpCallback);
      mockEventEmitter.on('stop', stopCallback);

      // Timer corto para testing
      const shortTimer = new TimerCore(
        { hours: 0, minutes: 0, seconds: 1, milliseconds: 0 },
        mockEventEmitter
      );

      shortTimer.start();
      
      // Avanzar el tiempo más allá de la duración
      vi.advanceTimersByTime(1100);

      expect(timeUpCallback).toHaveBeenCalledOnce();
      expect(stopCallback).toHaveBeenCalledOnce();
      expect(shortTimer.state).toBe('finished');
    });
  });

  describe('Time Calculations', () => {
    it('should calculate remaining time correctly', () => {
      const shortTimer = new TimerCore(
        { hours: 0, minutes: 0, seconds: 10, milliseconds: 0 },
        mockEventEmitter
      );

      shortTimer.start();
      vi.advanceTimersByTime(3000); // 3 segundos

      const remaining = shortTimer.remaining;
      expect(remaining.seconds).toBeLessThanOrEqual(7);
      expect(remaining.seconds).toBeGreaterThanOrEqual(6);
    });
  });
});
