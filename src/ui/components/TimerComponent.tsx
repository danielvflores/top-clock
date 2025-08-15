import { useState } from 'react';
import { useTimer } from '../hooks/useTimer';
import DynamicButton from './DynamicButton';
import type { TimeDisplay } from '../../types/common';

interface TimerComponentProps {
  colorIndex: number;
  onBack: () => void;
}

export default function TimerComponent({ colorIndex, onBack }: TimerComponentProps) {
  const [duration, setDuration] = useState<TimeDisplay>({
    hours: 0,
    minutes: 5,
    seconds: 0,
    milliseconds: 0
  });
  
  const [isSettingTime, setIsSettingTime] = useState(true);

  const { remaining, state, start, pause, reset, isRunning, isPaused } = useTimer(duration, {
    onTimeUp: () => {
      alert('¡Tiempo terminado!');
    }
  });

  const formatTime = (time: TimeDisplay): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
  };

  const handleDurationChange = (field: keyof TimeDisplay, value: number) => {
    setDuration(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }));
  };

  const handleStart = () => {
    if (isSettingTime) {
      setIsSettingTime(false);
    }
    start();
  };

  const handleReset = () => {
    reset();
    setIsSettingTime(true);
  };

  if (isSettingTime) {
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

        <h2 className="text-white text-2xl mb-8">Configurar Temporizador</h2>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="text-center">
            <label className="text-white text-sm block mb-2">Horas</label>
            <input
              type="number"
              min="0"
              max="23"
              value={duration.hours}
              onChange={(e) => handleDurationChange('hours', parseInt(e.target.value) || 0)}
              className="w-16 p-2 text-center bg-gray-700 text-white rounded"
              style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties & { WebkitAppRegion: string }}
            />
          </div>
          <span className="text-white text-2xl">:</span>
          <div className="text-center">
            <label className="text-white text-sm block mb-2">Minutos</label>
            <input
              type="number"
              min="0"
              max="59"
              value={duration.minutes}
              onChange={(e) => handleDurationChange('minutes', parseInt(e.target.value) || 0)}
              className="w-16 p-2 text-center bg-gray-700 text-white rounded"
              style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties & { WebkitAppRegion: string }}
            />
          </div>
          <span className="text-white text-2xl">:</span>
          <div className="text-center">
            <label className="text-white text-sm block mb-2">Segundos</label>
            <input
              type="number"
              min="0"
              max="59"
              value={duration.seconds}
              onChange={(e) => handleDurationChange('seconds', parseInt(e.target.value) || 0)}
              className="w-16 p-2 text-center bg-gray-700 text-white rounded"
              style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties & { WebkitAppRegion: string }}
            />
          </div>
        </div>

        <DynamicButton
          variant="play"
          colorIndex={colorIndex}
          onClick={handleStart}
          disabled={duration.hours === 0 && duration.minutes === 0 && duration.seconds === 0}
          size="lg"
          ariaLabel="Iniciar temporizador"
        />
      </div>
    );
  }

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

      <div className="text-center">
        <h2 className="text-white text-lg mb-4">Temporizador</h2>
        <div 
          className="text-white font-mono mb-8"
          style={{
            fontSize: 'clamp(3rem, 12vw, 8rem)'
          }}
        >
          {formatTime(remaining)}
        </div>
        
        <div className="flex gap-4 justify-center">
          {state === 'idle' && (
            <DynamicButton
              variant="play"
              colorIndex={colorIndex}
              onClick={handleStart}
              size="lg"
              ariaLabel="Iniciar temporizador"
            />
          )}
          
          {isRunning && (
            <DynamicButton
              variant="pause"
              colorIndex={colorIndex}
              onClick={pause}
              size="lg"
              ariaLabel="Pausar temporizador"
            />
          )}
          
          {isPaused && (
            <DynamicButton
              variant="play"
              colorIndex={colorIndex}
              onClick={start}
              size="lg"
              ariaLabel="Continuar temporizador"
            />
          )}
          
          {(isRunning || isPaused) && (
            <DynamicButton
              variant="reset"
              colorIndex={colorIndex}
              onClick={handleReset}
              size="lg"
              ariaLabel="Reiniciar temporizador"
            />
          )}
          
          {state === 'finished' && (
            <DynamicButton
              variant="reset"
              colorIndex={colorIndex}
              onClick={handleReset}
              size="lg"
              ariaLabel="Nuevo temporizador"
            />
          )}
        </div>
      </div>
    </div>
  );
}
