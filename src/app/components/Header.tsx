import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const motivationalQuotes = [
  "Focus on being productive instead of busy.",
  "The secret of getting ahead is getting started.",
  "Small progress is still progress.",
  "Stay focused and never give up.",
  "Your limitation is only your imagination.",
  "Great things never come from comfort zones.",
  "Success doesn't just find you. You have to go out and get it.",
  "Dream it. Wish it. Do it.",
  "The harder you work, the luckier you get.",
  "Don't stop when you're tired. Stop when you're done.",
];

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quote] = useState(() => 
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  return (
    <motion.div 
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ color: 'inherit' }}
    >
      <div className="text-3xl sm:text-5xl font-light tracking-wide flex items-center gap-1">
        <AnimatePresence mode="wait">
          <motion.span
            key={`${hours}-${minutes}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ color: 'inherit' }}
          >
            {formatTime(currentTime)}
          </motion.span>
        </AnimatePresence>
      </div>
      
      <motion.div 
        className="text-sm opacity-70 max-w-md text-center italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ color: 'inherit' }}
      >
        "{quote}"
      </motion.div>
      
      {/* Decorative underline */}
      <motion.div
        className="w-24 h-0.5 opacity-30"
        style={{ background: 'linear-gradient(to right, transparent, currentColor, transparent)' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
    </motion.div>
  );
}