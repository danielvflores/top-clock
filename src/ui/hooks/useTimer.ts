import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerCore } from '../../core/timer/TimerCore';
import type { TimeDisplay } from '../../types/common';
import type { ITimeEventEmitter } from '../../core/base/interfaces';

class ReactEventEmitter implements ITimeEventEmitter {
  private listeners: Map<string, Set<(...args: unknown[]) => void>> = new Map();

  emit(event: string, ...args: unknown[]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(...args));
    }
  }

  on(event: string, callback: (...args: unknown[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (...args: unknown[]) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }
}

interface UseTimerOptions {
  onTimeUp?: () => void;
  onTick?: (remaining: TimeDisplay) => void;
}

export function useTimer(initialDuration: TimeDisplay, options: UseTimerOptions = {}) {
  const [remaining, setRemaining] = useState<TimeDisplay>(initialDuration);
  const [state, setState] = useState<'idle' | 'running' | 'paused' | 'finished'>('idle');
  const timerRef = useRef<TimerCore | null>(null);
  const eventEmitterRef = useRef<ReactEventEmitter>(new ReactEventEmitter());
  
  const onTimeUpRef = useRef(options.onTimeUp);
  const onTickRef = useRef(options.onTick);
  
  onTimeUpRef.current = options.onTimeUp;
  onTickRef.current = options.onTick;

  useEffect(() => {
    const eventEmitter = eventEmitterRef.current;
    
    const handleTick = (...args: unknown[]) => {
      const time = args[0] as TimeDisplay;
      setRemaining(time);
      onTickRef.current?.(time);
    };

    const handleStart = () => setState('running');
    const handlePause = () => setState('paused');
    const handleStop = () => setState('finished');
    const handleReset = () => {
      setState('idle');
      setRemaining(initialDuration);
    };
    const handleTimeUp = () => {
      setState('finished');
      onTimeUpRef.current?.();
    };

    eventEmitter.on('tick', handleTick);
    eventEmitter.on('start', handleStart);
    eventEmitter.on('pause', handlePause);
    eventEmitter.on('stop', handleStop);
    eventEmitter.on('reset', handleReset);
    eventEmitter.on('timeUp', handleTimeUp);

    timerRef.current = new TimerCore(initialDuration, eventEmitter);

    return () => {
      eventEmitter.off('tick', handleTick);
      eventEmitter.off('start', handleStart);
      eventEmitter.off('pause', handlePause);
      eventEmitter.off('stop', handleStop);
      eventEmitter.off('reset', handleReset);
      eventEmitter.off('timeUp', handleTimeUp);
    };
  }, [initialDuration]);

  const start = useCallback(() => {
    timerRef.current?.start();
  }, []);

  const pause = useCallback(() => {
    timerRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    timerRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    timerRef.current?.reset();
  }, []);

  return {
    remaining,
    state,
    start,
    pause,
    stop,
    reset,
    isRunning: state === 'running',
    isPaused: state === 'paused',
    isFinished: state === 'finished',
    isIdle: state === 'idle'
  };
}
