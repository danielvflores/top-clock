import ClassicClock from '../components/ClassicClock';
import ModuleDropdown from '../components/ModuleDropdown';

interface MainLayoutProps {
  colorIndex: number;
  onModuleSelect: (value: string) => void;
}

export default function MainLayout({ colorIndex, onModuleSelect }: MainLayoutProps) {
  return (
    <div
      className="w-screen h-screen min-h-0 min-w-0 bg-[#23242a] flex flex-col items-center justify-center select-none relative"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties & { WebkitAppRegion: string }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        <ClassicClock 
          style={{
            fontSize: 'clamp(2rem, 10vw, 8rem)',
            textAlign: 'center',
            width: '100%',
            marginBottom: 'clamp(1rem, 3vw, 2.5rem)'
          }}
        />
        <ModuleDropdown 
          colorIndex={colorIndex} 
          onModuleSelect={onModuleSelect} 
        />
      </div>
    </div>
  );
}
