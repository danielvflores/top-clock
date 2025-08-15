import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StopwatchCore } from '../../core/stopwatch/StopwatchCore';
import type { ITimeEventEmitter } from '../../core/base/interfaces';

// Reutilizamos el MockEventEmitter
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
}

describe('StopwatchCore', () => {
  let stopwatch: StopwatchCore;
  let mockEventEmitter: MockEventEmitter;

  beforeEach(() => {
    mockEventEmitter = new MockEventEmitter();
    stopwatch = new StopwatchCore(mockEventEmitter);
    
    vi.useFakeTimers();
  });

  describe('Initialization', () => {
    it('should initialize with zero time', () => {
      expect(stopwatch.elapsed).toEqual({
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      });
      expect(stopwatch.laps).toEqual([]);
      expect(stopwatch.state).toBe('idle');
    });
  });

  describe('Basic Operations', () => {
    it('should start correctly', () => {
      const startCallback = vi.fn();
      mockEventEmitter.on('start', startCallback);

      stopwatch.start();

      expect(stopwatch.state).toBe('running');
      expect(startCallback).toHaveBeenCalledOnce();
    });

    it('should pause correctly', () => {
      const pauseCallback = vi.fn();
      mockEventEmitter.on('pause', pauseCallback);

      stopwatch.start();
      stopwatch.pause();

      expect(stopwatch.state).toBe('paused');
      expect(pauseCallback).toHaveBeenCalledOnce();
    });

    it('should stop correctly', () => {
      const stopCallback = vi.fn();
      mockEventEmitter.on('stop', stopCallback);

      stopwatch.start();
      stopwatch.stop();

      expect(stopwatch.state).toBe('finished');
      expect(stopCallback).toHaveBeenCalledOnce();
    });

    it('should reset correctly', () => {
      const resetCallback = vi.fn();
      mockEventEmitter.on('reset', resetCallback);

      stopwatch.start();
      vi.advanceTimersByTime(5000);
      stopwatch.addLap();
      stopwatch.reset();

      expect(stopwatch.state).toBe('idle');
      expect(stopwatch.elapsed).toEqual({
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      });
      expect(stopwatch.laps).toEqual([]);
      expect(resetCallback).toHaveBeenCalledOnce();
    });
  });

  describe('Time Tracking', () => {
    it('should track elapsed time', () => {
      stopwatch.start();
      vi.advanceTimersByTime(3000); // 3 segundos

      const elapsed = stopwatch.elapsed;
      expect(elapsed.seconds).toBeGreaterThanOrEqual(2);
      expect(elapsed.seconds).toBeLessThanOrEqual(4);
    });

    it('should emit tick events', () => {
      const tickCallback = vi.fn();
      mockEventEmitter.on('tick', tickCallback);

      stopwatch.start();
      vi.advanceTimersByTime(100);

      expect(tickCallback).toHaveBeenCalled();
    });
  });

  describe('Lap Functionality', () => {
    it('should add laps when running', () => {
      const lapCallback = vi.fn();
      mockEventEmitter.on('lap', lapCallback);

      stopwatch.start();
      vi.advanceTimersByTime(2000);
      
      const lap = stopwatch.addLap();

      expect(lap.lapNumber).toBe(1);
      expect(lap.id).toBeDefined();
      expect(lap.timestamp).toBeInstanceOf(Date);
      expect(stopwatch.laps).toHaveLength(1);
      expect(lapCallback).toHaveBeenCalledWith(lap);
    });

    it('should throw error when adding lap while not running', () => {
      expect(() => stopwatch.addLap()).toThrow('Cannot add lap when stopwatch is not running');
    });

    it('should calculate lap times correctly', () => {
      stopwatch.start();
      
      // Primera vuelta - 2 segundos
      vi.advanceTimersByTime(2000);
      const firstLap = stopwatch.addLap();
      
      // Segunda vuelta - 3 segundos adicionales
      vi.advanceTimersByTime(3000);
      const secondLap = stopwatch.addLap();

      expect(firstLap.lapTime.seconds).toBeGreaterThanOrEqual(1);
      expect(firstLap.lapTime.seconds).toBeLessThanOrEqual(3);
      
      expect(secondLap.lapTime.seconds).toBeGreaterThanOrEqual(2);
      expect(secondLap.lapTime.seconds).toBeLessThanOrEqual(4);
      
      expect(secondLap.totalTime.seconds).toBeGreaterThanOrEqual(4);
      expect(secondLap.totalTime.seconds).toBeLessThanOrEqual(6);
    });

    it('should maintain lap numbering correctly', () => {
      stopwatch.start();
      
      vi.advanceTimersByTime(1000);
      const lap1 = stopwatch.addLap();
      
      vi.advanceTimersByTime(1000);
      const lap2 = stopwatch.addLap();
      
      vi.advanceTimersByTime(1000);
      const lap3 = stopwatch.addLap();

      expect(lap1.lapNumber).toBe(1);
      expect(lap2.lapNumber).toBe(2);
      expect(lap3.lapNumber).toBe(3);
      expect(stopwatch.laps).toHaveLength(3);
    });
  });

  describe('Resume After Pause', () => {
    it('should resume correctly after pause', () => {
      stopwatch.start();
      vi.advanceTimersByTime(2000);
      stopwatch.pause();
      
      const pausedElapsed = stopwatch.elapsed;
      
      vi.advanceTimersByTime(1000); // Tiempo mientras está pausado
      stopwatch.start(); // Resume
      vi.advanceTimersByTime(1000);

      const finalElapsed = stopwatch.elapsed;
      expect(finalElapsed.seconds).toBeGreaterThan(pausedElapsed.seconds);
      expect(finalElapsed.seconds).toBeLessThanOrEqual(pausedElapsed.seconds + 2);
    });
  });
});
