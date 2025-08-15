import { useEffect, useState } from 'react';
import { format } from 'date-fns';

import React from 'react';

interface ClassicClockProps {
  style?: React.CSSProperties;
}

export default function ClassicClock({ style }: ClassicClockProps) {
  const [time, setTime] = useState<string>(format(new Date(), 'HH:mm:ss'));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center" style={style}>
      <span className="text-5xl font-mono text-white drop-shadow-lg select-none">
        {time}
      </span>
      <span className="text-xs text-gray-400 mt-1 select-none">Hora exacta local</span>
    </div>
  );
}
