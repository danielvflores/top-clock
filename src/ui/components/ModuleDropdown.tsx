import { useState, useRef, useEffect } from 'react';
import { BUTTON_COLORS } from '../constants/colors';
import type { ModuleType } from '../../types/common';

interface ModuleDropdownProps {
  colorIndex: number;
  onModuleSelect: (module: ModuleType) => void;
}

const menuItems = [
  { label: 'Reloj', value: 'clock' as ModuleType },
  { label: 'Cronómetro', value: 'stopwatch' as ModuleType },
  { label: 'Temporizador', value: 'timer' as ModuleType },
];

export default function ModuleDropdown({ colorIndex, onModuleSelect }: ModuleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonColor = BUTTON_COLORS[colorIndex];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors ${buttonColor.bg} ${buttonColor.hover}`}
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties & { WebkitAppRegion: string }}
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 ${buttonColor.bg} backdrop-blur-sm rounded-lg shadow-2xl border border-white/10 min-w-[140px] z-50`}>
          {menuItems.map((item) => (
            <button
              key={item.value}
              className={`w-full text-left px-4 py-2 text-white first:rounded-t-lg last:rounded-b-lg transition-all duration-200 ease-in-out transform ${buttonColor.hover} hover:scale-105 hover:translate-x-1`}
              style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties & { WebkitAppRegion: string }}
              onClick={() => {
                onModuleSelect(item.value);
                setIsOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
