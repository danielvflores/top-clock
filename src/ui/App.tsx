import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import ColorPicker from './components/ColorPicker';
import { BUTTON_COLORS } from './constants/colors';

function App() {
  const [colorIdx, setColorIdx] = useState(1);

  const handleModuleSelect = (value: string) => {
    alert(`Seleccionaste: ${value}`);
  };

  const handleColorChange = (index: number) => {
    setColorIdx(index);
  };

  return (
    <>
      <MainLayout 
        buttonColor={BUTTON_COLORS[colorIdx].bg}
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
