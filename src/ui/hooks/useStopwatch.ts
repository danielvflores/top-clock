import { useState, useEffect, useCallback, useRef } from 'react';
import { StopwatchCore } from '../../core/stopwatch/StopwatchCore';
import type { StopwatchLap } from '../../types/stopwatch';
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

interface UseStopwatchOptions {
  onLap?: (lap: StopwatchLap) => void;
  onTick?: (elapsed: TimeDisplay) => void;
}

export function useStopwatch(options: UseStopwatchOptions = {}) {
  const [elapsed, setElapsed] = useState<TimeDisplay>({ 
    hours: 0, minutes: 0, seconds: 0, milliseconds: 0 
  });
  const [laps, setLaps] = useState<StopwatchLap[]>([]);
  const [state, setState] = useState<'idle' | 'running' | 'paused' | 'finished'>('idle');
  const stopwatchRef = useRef<StopwatchCore | null>(null);
  const eventEmitterRef = useRef<ReactEventEmitter>(new ReactEventEmitter());
  
  const onLapRef = useRef(options.onLap);
  const onTickRef = useRef(options.onTick);
  
  onLapRef.current = options.onLap;
  onTickRef.current = options.onTick;

  useEffect(() => {
    const eventEmitter = eventEmitterRef.current;
    
    const handleTick = (...args: unknown[]) => {
      const time = args[0] as TimeDisplay;
      setElapsed(time);
      onTickRef.current?.(time);
    };

    const handleLap = (...args: unknown[]) => {
      const lap = args[0] as StopwatchLap;
      setLaps(prev => [...prev, lap]);
      onLapRef.current?.(lap);
    };

    const handleStart = () => setState('running');
    const handlePause = () => setState('paused');
    const handleStop = () => setState('finished');
    const handleReset = () => {
      setState('idle');
      setElapsed({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
      setLaps([]);
    };

    eventEmitter.on('tick', handleTick);
    eventEmitter.on('lap', handleLap);
    eventEmitter.on('start', handleStart);
    eventEmitter.on('pause', handlePause);
    eventEmitter.on('stop', handleStop);
    eventEmitter.on('reset', handleReset);

    stopwatchRef.current = new StopwatchCore(eventEmitter);

    return () => {
      eventEmitter.off('tick', handleTick);
      eventEmitter.off('lap', handleLap);
      eventEmitter.off('start', handleStart);
      eventEmitter.off('pause', handlePause);
      eventEmitter.off('stop', handleStop);
      eventEmitter.off('reset', handleReset);
    };
  }, []);

  const start = useCallback(() => {
    stopwatchRef.current?.start();
  }, []);

  const pause = useCallback(() => {
    stopwatchRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    stopwatchRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    stopwatchRef.current?.reset();
  }, []);

  const addLap = useCallback(() => {
    try {
      if (stopwatchRef.current && state === 'running') {
        return stopwatchRef.current?.addLap();
      }
      return null;
    } catch (error) {
      console.error('Error adding lap:', error);
      return null;
    }
  }, [state]);

  return {
    elapsed,
    laps,
    state,
    start,
    pause,
    stop,
    reset,
    addLap,
    isRunning: state === 'running',
    isPaused: state === 'paused',
    isFinished: state === 'finished',
    isIdle: state === 'idle'
  };
}
