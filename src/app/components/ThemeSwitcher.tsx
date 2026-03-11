import { Moon, Sun, Cloud, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Theme = 'dark' | 'light' | 'lofi';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const themes: { type: Theme; icon: React.ReactNode; label: string; color: string; desc: string }[] = [
    { type: 'dark', icon: <Moon size={20} />, label: 'Midnight', color: '#818cf8', desc: 'Focus in the dark' },
    { type: 'light', icon: <Sun size={20} />, label: 'Daylight', color: '#4f46e5', desc: 'Bright and clear' },
    { type: 'lofi', icon: <Cloud size={20} />, label: 'Lofi Vibes', color: '#d97706', desc: 'Warm and cozy' },
  ];

  return (
    <div className="flex flex-col gap-6 py-2 px-2">
      <div className="flex items-center gap-3">
        <Sparkles size={16} className="text-white/30" />
        <span className="text-sm font-light tracking-wider opacity-60">Visual Themes</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {themes.map((theme) => {
          const isActive = currentTheme === theme.type;
          
          return (
            <motion.button
              key={theme.type}
              onClick={() => onThemeChange(theme.type)}
              className={`group relative flex items-center gap-4 p-4 rounded-3xl transition-all duration-500 overflow-hidden ${
                isActive
                  ? 'bg-white/10 border-white/20'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 opacity-60'
              } border`}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Highlight bar for active theme */}
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    layoutId="theme-highlight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"
                  />
                )}
              </AnimatePresence>
              
              <div 
                className={`p-3 rounded-2xl transition-all duration-500 ${isActive ? 'bg-white/10' : 'bg-white/5'}`}
                style={{ color: isActive ? theme.color : 'rgba(255, 255, 255, 0.4)' }}
              >
                <motion.div
                  animate={{ rotate: isActive ? [0, 15, -15, 0] : 0 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {theme.icon}
                </motion.div>
              </div>
              
              <div className="flex flex-col items-start flex-1">
                <span className={`text-[15px] font-medium transition-all duration-500 ${isActive ? 'text-white' : 'text-white/40'}`}>
                  {theme.label}
                </span>
                <span className="text-[10px] uppercase tracking-widest opacity-20 font-bold">
                  {theme.desc}
                </span>
              </div>

              {/* Status Circle */}
              <div 
                className={`w-4 h-4 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                  isActive ? 'border-white/40' : 'border-white/10'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="theme-dot"
                    className="w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
      
      {/* Footer Hint */}
      <div className="mt-2 text-[10px] text-center opacity-20 tracking-tighter uppercase font-medium">
        Ambient backgrounds update automatically
      </div>
    </div>
  );
}
