import React, { useState } from 'react';

interface ColorOption {
  value: string;
  label: string;
  color: string;
}

interface ShowColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  options: ColorOption[];
  title?: string;
  selected?: string;
}

export default function ShowColorPicker({ isOpen, onClose, onSelect, options, title = 'Selecciona el color', selected }: ShowColorPickerProps) {
  const [current, setCurrent] = useState(selected || options[0].value);
  React.useEffect(() => { setCurrent(selected || options[0].value); }, [selected, options]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-[#23242a] p-6 rounded-xl shadow-xl min-w-[250px] flex flex-col items-center">
        <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
        <div className="flex gap-4 mb-6">
          {options.map(opt => (
            <button
              key={opt.value}
              className={`w-10 h-10 rounded-full border-4 transition-all ${current === opt.value ? 'border-white scale-110' : 'border-gray-600'}`}
              style={{ background: opt.color }}
              onClick={() => setCurrent(opt.value)}
              aria-label={opt.label}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={!current}
            onClick={() => current && onSelect(current)}
          >
            Confirmar
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
