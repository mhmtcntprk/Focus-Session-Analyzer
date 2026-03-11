import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ListTodo, Music2, Palette, X, ChevronLeft, Maximize, Minimize } from 'lucide-react';
import { TodoList } from './TodoList';
import { AmbientSounds } from './AmbientSounds';
import { ThemeSwitcher } from './ThemeSwitcher';

type Theme = 'dark' | 'light' | 'lofi';

interface RightSidebarProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const getThemeColors = (theme: Theme) => {
  switch (theme) {
    case 'lofi':
      return {
        tasks: '#e6521f',
        sounds: '#fb9e3a',
        theme: '#ea2f14',
      };
    case 'light':
      return {
        tasks: '#81a6c6',
        sounds: '#aacddc',
        theme: '#3d5a73',
      };
    case 'dark':
    default:
      return {
        tasks: '#9b81f8ff',
        sounds: '#c084fc',
        theme: '#8e51bcff',
      };
  }
};

type ActivePanel = 'tasks' | 'sounds' | 'theme' | null;

export function RightSidebar({ currentTheme, onThemeChange }: RightSidebarProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error("Error attempting to toggle full-screen:", err);
    }
  };

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const colors = getThemeColors(currentTheme);

  const menuItems = [
    {
      id: 'tasks' as const,
      icon: <ListTodo size={22} />,
      label: 'Tasks',
      component: <TodoList />,
      height: 'h-[520px]',
      color: colors.tasks,
    },
    {
      id: 'sounds' as const,
      icon: <Music2 size={22} />,
      label: 'Sounds',
      component: <AmbientSounds />,
      height: 'h-auto',
      color: colors.sounds,
    },
    {
      id: 'theme' as const,
      icon: <Palette size={22} />,
      label: 'Theme',
      component: <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />,
      height: 'h-auto',
      color: colors.theme,
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:bottom-auto lg:left-auto lg:right-8 lg:translate-x-0 lg:top-1/2 lg:-translate-y-1/2 z-50 flex lg:flex-col items-center lg:items-end gap-6 pointer-events-none">
      {/* Menu Stack */}
      <div className="flex flex-row lg:flex-col gap-4 lg:gap-6 items-center pointer-events-auto">
        {menuItems.map((item, index) => {
          const isActive = activePanel === item.id;
          
          return (
            <div key={item.id} className="relative flex items-center justify-end">
              {/* Panel */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={`absolute bottom-[calc(100%+20px)] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:right-[calc(100%+24px)] w-[85vw] sm:w-[380px] origin-bottom lg:origin-right ${item.height} bg-black/10 backdrop-blur-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[32px] overflow-hidden flex flex-col`}
                  >
                    {/* Panel Header */}
                    <div className="flex justify-between items-center p-6 pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10" style={{ color: item.color }}>
                          {item.icon}
                        </div>
                        <h3 className="text-xl font-medium tracking-tight text-white/90">{item.label}</h3>
                      </div>
                      <button 
                        onClick={() => setActivePanel(null)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    {/* Panel Content */}
                    <div className="p-6 pt-2 flex-1 overflow-y-auto custom-scrollbar text-white/80">
                      {item.component}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Side Button */}
              <motion.button
                onClick={() => togglePanel(item.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className={`group relative w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg border transition-all duration-300 z-50 ${
                  isActive 
                    ? 'bg-white border-white shadow-[0_0_30px_rgba(255,255,255,0.4)]' 
                    : 'bg-white/5 border-white/10 hover:bg-white/15 hover:border-white/20'
                }`}
                style={{
                  color: isActive ? '#111827' : item.color
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Tooltip on hover */}
                {!isActive && (
                  <div className="absolute bottom-full mb-3 lg:bottom-auto lg:mb-0 lg:right-full lg:mr-4 px-3 py-1 bg-black/40 backdrop-blur-md text-white/80 text-xs rounded-lg opacity-0 lg:group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden lg:block">
                    {item.label}
                  </div>
                )}
                
                {isActive ? <ChevronLeft size={24} className="animate-pulse -rotate-90 lg:rotate-0" /> : item.icon}
                
                {/* Dynamic pulse for background when not active */}
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-white/20"
                    animate={{ scale: [1, 1.4, 1], opacity: [0, 0.4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  />
                )}
              </motion.button>
            </div>
          );
        })}
        
        {/* Divider */}
        <div className="w-px h-6 lg:w-6 lg:h-px bg-white/20 rounded-full my-1 lg:my-2 hidden lg:block" />

        {/* Fullscreen Toggle Button */}
        <motion.button
          onClick={toggleFullscreen}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="group relative w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:border-white/20 hover:text-white transition-all duration-300 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Tooltip */}
          <div className="absolute bottom-full mb-3 lg:bottom-auto lg:mb-0 lg:right-full lg:mr-4 px-3 py-1 bg-black/40 backdrop-blur-md text-white/80 text-xs rounded-lg opacity-0 lg:group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden lg:block">
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </div>
          
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </motion.button>
      </div>
    </div>
  );
}
