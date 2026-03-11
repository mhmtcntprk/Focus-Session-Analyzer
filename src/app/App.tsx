import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PomodoroTimer } from './components/PomodoroTimer';
import { RightSidebar } from './components/RightSidebar';
import { motion, AnimatePresence } from 'motion/react';

type Theme = 'dark' | 'light' | 'lofi';

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          background: 'radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%)',
          color: '#f8fafc',
          accent: '#818cf8',
          glass: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.1)',
        };
      case 'light':
        return {
          background: 'radial-gradient(circle at center, #fdfbf7 0%, #ecdcca 100%)',
          color: '#3d5a73', // Darker blue for readable text
          accent: '#81a6c6',
          glass: 'rgba(255, 255, 255, 0.7)', // Better glass effect
          border: '#d2c4b4',
        };
      case 'lofi':
        return {
          background: 'radial-gradient(circle at center, #fef3e2 0%, #e8d5c4 100%)',
          color: '#ea2f14',
          accent: '#e6521f',
          glass: '#fcef91',
          border: '#fb9e3a',
        };
    }
  };

  const themeStyles = getThemeStyles();

  if (!mounted) return null;

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-8 transition-colors duration-1000 ease-in-out relative overflow-hidden"
      style={{
        background: themeStyles.background,
        color: themeStyles.color,
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20"
          style={{ background: themeStyles.accent }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[150px] opacity-15"
          style={{ background: '#c084fc' }}
        />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-6 left-0 right-0 sm:left-auto sm:top-8 sm:right-8 z-40 px-4 sm:px-0"
      >
        <Header />
      </motion.div>

      {/* Main Content: Focused Timer */}
      <main className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Main pulsing glow */}
          <div 
            className="absolute inset-0 blur-[120px] opacity-30 rounded-full animate-pulse pointer-events-none"
            style={{ background: themeStyles.accent }}
          />
          <PomodoroTimer theme={theme} />
        </motion.div>
      </main>

      {/* Right Sidebar - Circular Buttons and Expanding Panels */}
      <RightSidebar currentTheme={theme} onThemeChange={setTheme} />

      {/* Custom Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${themeStyles.border};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${themeStyles.accent}44;
        }

        .volume-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 2px;
          outline: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          border: 2px solid ${themeStyles.accent};
        }

        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          border: 2px solid ${themeStyles.accent};
        }
      `}</style>
    </div>
  );
}
