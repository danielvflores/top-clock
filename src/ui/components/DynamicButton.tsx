import type { ReactNode } from 'react';
import { BUTTON_COLORS } from '../constants/colors';

interface DynamicButtonProps {
  variant: 'play' | 'pause' | 'stop' | 'reset' | 'lap' | 'primary';
  colorIndex: number;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
  ariaLabel?: string;
  className?: string;
}

const PlayIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const StopIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" />
  </svg>
);

const ResetIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const LapIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
);

export default function DynamicButton({
  variant,
  colorIndex,
  onClick,
  disabled = false,
  size = 'md',
  children,
  ariaLabel,
  className = ''
}: DynamicButtonProps) {
  const colors = BUTTON_COLORS[colorIndex];
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const getVariantStyles = () => {
    return {
      backgroundColor: colors.bg,
      color: 'white',
      hoverColor: colors.hover,
      shadow: 'shadow-lg',
      transform: 'hover:scale-105 active:scale-95'
    };
  };

  const renderIcon = () => {
    const iconSize = iconSizes[size];
    switch (variant) {
      case 'play':
        return <PlayIcon size={iconSize} />;
      case 'pause':
        return <PauseIcon size={iconSize} />;
      case 'stop':
        return <StopIcon size={iconSize} />;
      case 'reset':
        return <ResetIcon size={iconSize} />;
      case 'lap':
        return <LapIcon size={iconSize} />;
      default:
        return null;
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        ${sizeClasses[size]}
        rounded-lg font-medium
        transition-all duration-200 ease-in-out
        ${variantStyles.shadow}
        ${variantStyles.transform}
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
        relative overflow-hidden
        group
        ${className}
      `}
      style={{
        backgroundColor: disabled ? '#6b7280' : variantStyles.backgroundColor,
        color: variantStyles.color,
        WebkitAppRegion: 'no-drag',
        minWidth: size === 'lg' ? '60px' : size === 'md' ? '50px' : '40px',
        minHeight: size === 'lg' ? '60px' : size === 'md' ? '50px' : '40px'
      } as React.CSSProperties & { WebkitAppRegion: string }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = variantStyles.hoverColor;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = variantStyles.backgroundColor;
        }
      }}
    >
      <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150 rounded-lg" />
      
      <div className="flex items-center gap-2 relative z-10">
        {renderIcon()}
        {children}
      </div>
    </button>
  );
}
