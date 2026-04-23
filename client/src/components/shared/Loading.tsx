import React, { useEffect, useState } from 'react';
import{
  Loader2, 
  Circle, 
  Box, 
  Activity,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

// Types
type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'progress' | 'wave';
type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';
type LoadingTheme = 'indigo' | 'emerald' | 'rose' | 'amber' | 'violet';

interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  theme?: LoadingTheme;
  text?: string;
  progress?: number;
  fullScreen?: boolean;
  className?: string;
  showLogo?: boolean;
}

interface SkeletonProps {
  lines?: number;
  className?: string;
  animate?: boolean;
}

// Theme configurations
const themes = {
  indigo: {
    primary: 'text-indigo-600',
    secondary: 'text-indigo-200',
    bg: 'bg-indigo-600',
    bgLight: 'bg-indigo-100',
    gradient: 'from-indigo-500 to-violet-600',
    glow: 'shadow-indigo-500/50',
  },
  emerald: {
    primary: 'text-emerald-600',
    secondary: 'text-emerald-200',
    bg: 'bg-emerald-600',
    bgLight: 'bg-emerald-100',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/50',
  },
  rose: {
    primary: 'text-rose-600',
    secondary: 'text-rose-200',
    bg: 'bg-rose-600',
    bgLight: 'bg-rose-100',
    gradient: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/50',
  },
  amber: {
    primary: 'text-amber-600',
    secondary: 'text-amber-200',
    bg: 'bg-amber-600',
    bgLight: 'bg-amber-100',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/50',
  },
  violet: {
    primary: 'text-violet-600',
    secondary: 'text-violet-200',
    bg: 'bg-violet-600',
    bgLight: 'bg-violet-100',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/50',
  },
};

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

// Spinner Variant
const SpinnerLoader: React.FC<{ theme: LoadingTheme; size: LoadingSize }> = ({ theme, size }) => {
  const t = themes[theme];
  return (
    <div className="relative">
      <Loader2 className={`${sizes[size]} ${t.primary} animate-spin`} />
      <div className={`absolute inset-0 ${sizes[size]} ${t.secondary} opacity-30`}>
        <Loader2 className="w-full h-full" />
      </div>
    </div>
  );
};

// Dots Variant
const DotsLoader: React.FC<{ theme: LoadingTheme; size: LoadingSize }> = ({ theme, size }) => {
  const t = themes[theme];
  const dotSizes = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4', xl: 'w-5 h-5' };
  
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${dotSizes[size]} ${t.bg} rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};

// Pulse Variant
const PulseLoader: React.FC<{ theme: LoadingTheme; size: LoadingSize }> = ({ theme, size }) => {
  const t = themes[theme];
  return (
    <div className={`relative ${sizes[size]}`}>
      <div className={`absolute inset-0 ${t.bg} rounded-full animate-ping opacity-75`} />
      <div className={`relative w-full h-full ${t.bg} rounded-full animate-pulse shadow-lg ${t.glow}`} />
    </div>
  );
};

// Wave Variant
const WaveLoader: React.FC<{ theme: LoadingTheme; size: LoadingSize }> = ({ theme, size }) => {
  const t = themes[theme];
  const barHeights = { sm: 'h-4', md: 'h-6', lg: 'h-8', xl: 'h-10' };
  
  return (
    <div className="flex items-end gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-1.5 ${barHeights[size]} ${t.bg} rounded-full animate-[wave_1s_ease-in-out_infinite]`}
          style={{ 
            animationDelay: `${i * 0.1}s`,
            height: `${40 + Math.random() * 60}%`
          }}
        />
      ))}
    </div>
  );
};

// Progress Variant
const ProgressLoader: React.FC<{ theme: LoadingTheme; size: LoadingSize; progress: number }> = ({ 
  theme, 
  progress 
}) => {
  const t = themes[theme];
  const [displayProgress, setDisplayProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setDisplayProgress(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-64 space-y-3">
      <div className="flex justify-between text-sm font-medium">
        <span className={`${t.primary} flex items-center gap-2`}>
          <Activity className="w-4 h-4" />
          Loading...
        </span>
        <span className="text-slate-600">{Math.round(displayProgress)}%</span>
      </div>
      <div className={`h-2 w-full ${t.bgLight} rounded-full overflow-hidden`}>
        <div 
          className={`h-full ${t.bg} rounded-full transition-all duration-500 ease-out relative`}
          style={{ width: `${displayProgress}%` }}
        >
          <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
};

// Skeleton Component
export const Skeleton: React.FC<SkeletonProps> = ({ lines = 3, className = '', animate = true }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className={`h-4 bg-slate-200 rounded ${animate ? 'animate-pulse' : ''}`}
          style={{ 
            width: `${85 - (i % 3) * 15}%`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

// Card Skeleton
export const CardSkeleton: React.FC<{ theme?: LoadingTheme }> = ({ theme = 'indigo' }) => {
  const t = themes[theme];
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 space-y-4 animate-pulse">
      <div className={`h-48 ${t.bgLight} rounded-xl`} />
      <div className="h-6 bg-slate-200 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-5/6" />
      </div>
      <div className="flex gap-3 pt-2">
        <div className={`h-10 ${t.bgLight} rounded-lg flex-1`} />
        <div className="h-10 bg-slate-200 rounded-lg flex-1" />
      </div>
    </div>
  );
};

// Main Loading Component
export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  theme = 'indigo',
  text,
  progress = 0,
  fullScreen = false,
  className = '',
  showLogo = false,
}) => {
  const t = themes[theme];
  
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <SpinnerLoader theme={theme} size={size} />;
      case 'dots':
        return <DotsLoader theme={theme} size={size} />;
      case 'pulse':
        return <PulseLoader theme={theme} size={size} />;
      case 'wave':
        return <WaveLoader theme={theme} size={size} />;
      case 'progress':
        return <ProgressLoader theme={theme} size={size} progress={progress} />;
      case 'skeleton':
        return <Skeleton lines={4} />;
      default:
        return <SpinnerLoader theme={theme} size={size} />;
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {showLogo && (
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${t.gradient} shadow-xl ${t.glow} mb-2`}>
          <Box className="w-8 h-8 text-white animate-bounce" />
        </div>
      )}
      
      {renderLoader()}
      
      {text && (
        <p className={`${textSizes[size]} text-slate-600 font-medium animate-pulse text-center max-w-xs`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="bg-white p-12 rounded-3xl shadow-2xl border border-slate-100">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

// Full Page Loading with Steps
interface LoadingStep {
  label: string;
  status: 'pending' | 'loading' | 'completed';
}

interface FullPageLoadingProps {
  steps?: LoadingStep[];
  currentStep?: number;
  theme?: LoadingTheme;
  title?: string;
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  steps = [],
  currentStep = 0,
  theme = 'indigo',
  title = 'Loading your workspace',
}) => {
  const t = themes[theme];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md p-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-20 w-72 h-72 ${t.bgLight} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob`} />
          <div className={`absolute top-40 right-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000`} />
          <div className={`absolute -bottom-8 left-40 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000`} />
        </div>

        <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${t.gradient} shadow-lg ${t.glow} mb-4`}>
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
            <p className="text-slate-500">Please wait while we prepare everything</p>
          </div>

          {/* Progress Steps */}
          {steps.length > 0 && (
            <div className="space-y-4 mb-8">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                    index === currentStep ? 'bg-white shadow-md scale-105' : 
                    index < currentStep ? 'opacity-50' : 'opacity-30'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index < currentStep ? `${t.bg} text-white` :
                    index === currentStep ? `bg-white border-2 ${t.primary} ${t.primary.replace('text-', 'border-')}` :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : index === currentStep ? (
                      <Loader2 className={`w-5 h-5 ${t.primary} animate-spin`} />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${
                      index <= currentStep ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </p>
                    {index === currentStep && (
                      <p className="text-xs text-slate-500 mt-0.5">Processing...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Animation */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 ${t.bg} rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Button Loading State
interface ButtonLoadingProps {
  loading: boolean;
  children: React.ReactNode;
  theme?: LoadingTheme;
  className?: string;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({ 
  loading, 
  children, 
  theme = 'indigo',
  className = '' 
}) => {
  const t = themes[theme];
  
  return (
    <button 
      disabled={loading}
      className={`relative overflow-hidden ${className} ${loading ? 'cursor-not-allowed opacity-80' : ''}`}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit">
          <Loader2 className={`w-5 h-5 ${t.primary.replace('text-', 'text-white')} animate-spin`} />
        </span>
      )}
      <span className={`transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
    </button>
  );
};