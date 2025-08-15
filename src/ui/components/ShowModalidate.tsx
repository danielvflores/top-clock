import { useState } from 'react';

interface ShowModalidateProps {
	isOpen: boolean;
	onClose: () => void;
	onSelect: (value: string) => void;
}

const options = [
	{ value: '', label: 'Selecciona un módulo...' },
	{ value: 'timer', label: 'Temporizador' },
	{ value: 'stopwatch', label: 'Cronómetro' },
];

export default function ShowModalidate({ isOpen, onClose, onSelect }: ShowModalidateProps) {
	const [selected, setSelected] = useState('');

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
			<div className="bg-[#23242a] p-6 rounded-xl shadow-xl min-w-[250px] flex flex-col items-center">
				<h2 className="text-lg font-semibold text-white mb-4">Agregar módulo</h2>
				<select
					className="w-full p-2 rounded mb-4 text-black"
					value={selected}
					onChange={e => setSelected(e.target.value)}
				>
					{options.map(opt => (
						<option key={opt.value} value={opt.value}>{opt.label}</option>
					))}
				</select>
				<div className="flex gap-2">
					<button
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
						disabled={!selected}
						onClick={() => selected && onSelect(selected)}
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
