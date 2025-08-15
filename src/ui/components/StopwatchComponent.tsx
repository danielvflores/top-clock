import { useStopwatch } from '../hooks/useStopwatch';
import DynamicButton from './DynamicButton';
import type { StopwatchLap } from '../../types/stopwatch';

interface StopwatchComponentProps {
  colorIndex: number;
  onBack: () => void;
}

export default function StopwatchComponent({ colorIndex, onBack }: StopwatchComponentProps) {
  const { elapsed, laps, state, start, pause, reset, addLap, isRunning, isPaused } = useStopwatch({
    onLap: (lap: StopwatchLap) => {
      console.log('Nueva vuelta:', lap);
    }
  });

  const handleAddLap = () => {
    if (state === 'running' && isRunning) {
      addLap();
    }
  };

  const handlePause = () => {
    pause();
  };

  const formatTime = (time: typeof elapsed, showMs = true): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const padMs = (n: number) => Math.floor(n / 10).toString().padStart(2, '0');
    
    if (showMs) {
      return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}.${padMs(time.milliseconds)}`;
    }
    return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
  };

  const getBestLapTime = () => {
    if (laps.length === 0) return null;
    return laps.reduce((best, lap) => {
      const bestMs = (best.lapTime.hours * 3600 + best.lapTime.minutes * 60 + best.lapTime.seconds) * 1000 + best.lapTime.milliseconds;
      const currentMs = (lap.lapTime.hours * 3600 + lap.lapTime.minutes * 60 + lap.lapTime.seconds) * 1000 + lap.lapTime.milliseconds;
      return currentMs < bestMs ? lap : best;
    });
  };

  const bestLap = getBestLapTime();

  return (
    <div 
      className="w-screen h-screen min-h-0 min-w-0 bg-[#23242a] flex flex-col items-center justify-center select-none relative"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties & { WebkitAppRegion: string }}
    >
      <button
        onClick={onBack}
        className="absolute top-4 left-4 text-white text-sm hover:text-blue-400"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties & { WebkitAppRegion: string }}
      >
        ← Atrás
      </button>

      <div className="flex flex-col items-center w-full h-full">
        <h2 className="text-white text-lg mb-4 mt-12">Cronómetro</h2>
        
        <div 
          className="text-white font-mono mb-6"
          style={{
            fontSize: 'clamp(2.5rem, 10vw, 6rem)'
          }}
        >
          {formatTime(elapsed)}
        </div>

        <div 
          className="flex flex-wrap gap-4 justify-center mb-6"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties & { WebkitAppRegion: string }}
        >
          {state === 'idle' && (
            <DynamicButton
              variant="play"
              onClick={start}
              colorIndex={colorIndex}
              className="w-16 h-16 text-lg"
            />
          )}
          
          {isRunning && state === 'running' && (
            <>
              <DynamicButton
                variant="lap"
                onClick={handleAddLap}
                colorIndex={colorIndex}
                className="w-16 h-16 text-lg"
              />
              <DynamicButton
                variant="pause"
                onClick={handlePause}
                colorIndex={colorIndex}
                className="w-16 h-16 text-lg"
              />
            </>
          )}
          
          {isPaused && (
            <>
              <DynamicButton
                variant="play"
                onClick={start}
                colorIndex={colorIndex}
                className="w-16 h-16 text-lg"
              />
              <DynamicButton
                variant="reset"
                onClick={reset}
                colorIndex={colorIndex}
                className="w-16 h-16 text-lg"
              />
            </>
          )}
          
          {(state === 'finished') && (
            <DynamicButton
              variant="reset"
              onClick={reset}
              colorIndex={colorIndex}
              className="w-16 h-16 text-lg"
            />
          )}
        </div>

        {laps.length > 0 && (
          <div 
            className="w-full max-w-md bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto custom-scrollbar"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties & { WebkitAppRegion: string }}
          >
            <h3 className="text-white text-sm font-semibold mb-3">Vueltas</h3>
            <div className="space-y-2">
              {laps.slice().reverse().map((lap) => (
                <div
                  key={lap.id}
                  className={`flex justify-between items-center p-2 rounded ${
                    bestLap?.id === lap.id ? 'bg-green-900' : 'bg-gray-700'
                  }`}
                >
                  <span className="text-white text-sm">
                    #{lap.lapNumber}
                  </span>
                  <div className="text-right">
                    <div className={`text-sm font-mono ${
                      bestLap?.id === lap.id ? 'text-green-300' : 'text-white'
                    }`}>
                      {formatTime(lap.lapTime)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatTime(lap.totalTime, false)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
