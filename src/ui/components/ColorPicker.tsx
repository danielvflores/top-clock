import { useState, useRef, useEffect } from 'react';

interface ButtonColor {
  name: string;
  bg: string;
  hover: string;
}

interface ColorPickerProps {
  colors: ButtonColor[];
  selectedIndex: number;
  onColorChange: (index: number) => void;
}

interface ColorOption {
  value: string;
  label: string;
  color: string;
}

export default function ColorPicker({ colors, selectedIndex, onColorChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const colorOptions: ColorOption[] = colors.map((color, index) => ({
    value: index.toString(),
    label: color.name,
    color: color.bg,
  }));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleColorSelect = (index: number) => {
    if (selectedIndex !== index) {
      onColorChange(index);
    }
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="fixed top-4 right-4 z-[9999]"
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties & { WebkitAppRegion: string }}
    >
      <button
        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 bg-opacity-60 hover:bg-opacity-90 text-white text-lg shadow focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        title="Cambiar color del botón"
        aria-label="Cambiar color del botón"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="2" fill={colors[selectedIndex].bg} />
        </svg>
      </button>
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-36 bg-[#23242a] rounded-lg shadow-lg py-2 border border-gray-700 animate-fade-in flex flex-col gap-1 z-[9999]"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties & { WebkitAppRegion: string }}
        >
          {colorOptions.map((opt, idx) => (
            <button
              key={opt.value}
              className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition-colors w-full ${selectedIndex === idx ? 'bg-gray-700' : ''}`}
              onClick={() => handleColorSelect(idx)}
              style={{ color: '#fff', textAlign: 'left' }}
              tabIndex={0}
            >
              <span 
                className="w-4 h-4 rounded-full border-2 mr-2" 
                style={{ 
                  background: opt.color, 
                  borderColor: selectedIndex === idx ? '#fff' : '#888' 
                }} 
              />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
