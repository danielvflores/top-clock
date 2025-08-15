import { useState, useRef, useEffect } from 'react';

interface ModuleDropdownProps {
  buttonColor: string;
  onModuleSelect: (value: string) => void;
}

interface MenuItem {
  value: string;
  label: string;
}

export default function ModuleDropdown({ buttonColor, onModuleSelect }: ModuleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    { value: 'timer', label: 'Temporizador' },
    { value: 'stopwatch', label: 'Cronómetro' },
  ];

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

  const handleSelect = (value: string) => {
    setIsOpen(false);
    onModuleSelect(value);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-center text-white rounded-full shadow focus:outline-none transition-colors hover:bg-gray-700"
        style={{
          width: 'clamp(2.5rem, 6vw, 4rem)',
          height: 'clamp(2.5rem, 6vw, 4rem)',
          fontSize: 'clamp(1.2rem, 3vw, 2rem)',
          background: buttonColor,
          WebkitAppRegion: 'no-drag',
        } as React.CSSProperties & { WebkitAppRegion: string }}
        onClick={() => setIsOpen(!isOpen)}
        title="Agregar módulo"
        aria-label="Agregar módulo"
      >
        <svg
          width="60%"
          height="60%"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="4" y="6" width="16" height="2.2" rx="1.1" fill="currentColor" />
          <rect x="4" y="11" width="16" height="2.2" rx="1.1" fill="currentColor" />
          <rect x="4" y="16" width="16" height="2.2" rx="1.1" fill="currentColor" />
        </svg>
      </button>
      {isOpen && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 mt-2 w-36 bg-[#23242a] rounded-lg shadow-lg py-2 z-50 border border-gray-700 animate-fade-in"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties & { WebkitAppRegion: string }}
        >
          {menuItems.map((item) => (
            <button
              key={item.value}
              className="w-full text-left px-4 py-2 text-white hover:bg-blue-600 first:rounded-t-lg last:rounded-b-lg"
              onClick={() => handleSelect(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
