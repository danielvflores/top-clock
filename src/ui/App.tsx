import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import ColorPicker from './components/ColorPicker';
import TimerComponent from './components/TimerComponent';
import StopwatchComponent from './components/StopwatchComponent';
import { BUTTON_COLORS } from './constants/colors';

type ViewMode = 'clock' | 'timer' | 'stopwatch';

function App() {
  const [colorIdx, setColorIdx] = useState(1);
  const [currentView, setCurrentView] = useState<ViewMode>('clock');

  const handleModuleSelect = (value: string) => {
    if (value === 'timer') {
      setCurrentView('timer');
    } else if (value === 'stopwatch') {
      setCurrentView('stopwatch');
    }
  };

  const handleColorChange = (index: number) => {
    setColorIdx(index);
  };

  const handleBackToClock = () => {
    setCurrentView('clock');
  };

  if (currentView === 'timer') {
    return (
      <>
        <TimerComponent 
          colorIndex={colorIdx}
          onBack={handleBackToClock}
        />
        <ColorPicker 
          colors={BUTTON_COLORS}
          selectedIndex={colorIdx}
          onColorChange={handleColorChange}
        />
      </>
    );
  }

  if (currentView === 'stopwatch') {
    return (
      <>
        <StopwatchComponent 
          colorIndex={colorIdx}
          onBack={handleBackToClock}
        />
        <ColorPicker 
          colors={BUTTON_COLORS}
          selectedIndex={colorIdx}
          onColorChange={handleColorChange}
        />
      </>
    );
  }

  return (
    <>
      <MainLayout 
        colorIndex={colorIdx}
        onModuleSelect={handleModuleSelect}
      />
      <ColorPicker 
        colors={BUTTON_COLORS}
        selectedIndex={colorIdx}
        onColorChange={handleColorChange}
      />
    </>
  );
}

export default App;
