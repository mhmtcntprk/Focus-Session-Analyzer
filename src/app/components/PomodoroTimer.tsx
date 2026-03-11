import { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Theme = 'dark' | 'light' | 'lofi';

interface PomodoroTimerProps {
  theme?: Theme;
}

const POMODORO_TIME = 25 * 60; // 25 minutes in seconds

const getThemeColors = (theme: Theme) => {
  switch (theme) {
    case 'lofi':
      return {
        glow: '#e6521f',
        gradientStart: '#fb9e3a',
        gradientMid: '#e6521f',
        gradientEnd: '#ea2f14',
      };
    case 'light':
      return {
        glow: '#81a6c6',
        gradientStart: '#d2c4b4',
        gradientMid: '#aacddc',
        gradientEnd: '#81a6c6',
      };
    case 'dark':
    default:
      return {
        glow: '#818cf8',
        gradientStart: '#818cf8',
        gradientMid: '#a78bfa',
        gradientEnd: '#c084fc',
      };
  }
};

export function PomodoroTimer({ theme = 'dark' }: PomodoroTimerProps) {
  const colors = getThemeColors(theme);
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setTimeLeft(POMODORO_TIME);
    setIsRunning(false);
    setKey(prev => prev + 1); // Force re-render of circle animation
  };

  const progress = ((POMODORO_TIME - timeLeft) / POMODORO_TIME) * 360;
  const radius = 150;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center gap-12">
      {/* Circular Timer */}
      <motion.div 
        className="relative w-full aspect-square max-w-[320px] sm:max-w-[384px] flex items-center justify-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: isRunning ? 1.05 : 1, 
          opacity: 1,
          y: isRunning ? [0, -10, 0] : 0,
        }}
        transition={{ 
          scale: { duration: 0.8, ease: "easeOut" },
          opacity: { duration: 1, ease: "easeOut" },
          y: isRunning ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.5 }
        }}
      >
        {/* Deep background glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-[100px]"
          animate={{
            scale: isRunning ? [1, 1.3, 1] : 1,
            opacity: isRunning ? [0.1, 0.4, 0.1] : 0.1,
            rotate: isRunning ? [0, 90, 180, 270, 360] : 0,
          }}
          transition={{
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          }}
          style={{ 
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)` 
          }}
        />

        {/* SVG Timer Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 384 384">
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.gradientStart} />
              <stop offset="50%" stopColor={colors.gradientMid} />
              <stop offset="100%" stopColor={colors.gradientEnd} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Background Ring */}
          <circle
            cx="192"
            cy="192"
            r={radius}
            fill="none"
            stroke="white"
            strokeOpacity="0.05"
            strokeWidth="4"
          />
          
          {/* Progress Circle */}
          <motion.circle
            key={key}
            cx="192"
            cy="192"
            r={radius}
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ 
              strokeDashoffset: circumference * (1 - progress / 360),
            }}
            transition={{ 
              duration: 1, 
              ease: "easeInOut" 
            }}
          />
        </svg>

        {/* Timer Display */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <motion.div
            animate={{ 
              scale: isRunning ? 1.05 : 1,
              textShadow: isRunning ? `0 0 20px ${colors.glow}44` : 'none'
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-7xl sm:text-[100px] font-light tracking-tight leading-none tabular-nums"
            style={{ color: 'inherit' }}
          >
            {formatTime(timeLeft)}
          </motion.div>
          
          <motion.p 
            className="text-sm font-medium tracking-[0.2em] uppercase opacity-40 mt-4"
            animate={{ opacity: isRunning ? [0.4, 0.8, 0.4] : 0.4 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Focus Session
          </motion.p>
        </div>
      </motion.div>

      {/* Controls Container */}
      <div className="flex items-center gap-4 sm:gap-6 relative z-20 mt-4 sm:mt-0">
        <motion.button
          onClick={() => setIsRunning(!isRunning)}
          className="relative px-8 sm:px-12 py-3 sm:py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden group shadow-2xl transition-all duration-300 hover:border-white/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated Background on Hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(to right, ${colors.gradientStart}22, ${colors.gradientMid}22, ${colors.gradientEnd}22)` }}
          />
          
          <div className="relative flex items-center gap-3">
            {isRunning ? (
              <Pause size={24} style={{ color: colors.glow, fill: `${colors.glow}33` }} />
            ) : (
              <Play size={24} style={{ color: colors.glow, fill: `${colors.glow}33` }} />
            )}
            <span className="text-lg font-medium opacity-90">{isRunning ? 'Pause' : 'Start Focus'}</span>
          </div>
        </motion.button>
        
        <motion.button
          onClick={handleReset}
          className="p-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all duration-500 text-white/60 hover:text-white"
          whileHover={{ scale: 1.1, rotate: -180 }}
          whileTap={{ scale: 0.9 }}
        >
          <RotateCcw size={22} />
        </motion.button>
      </div>
    </div>
  );
}
