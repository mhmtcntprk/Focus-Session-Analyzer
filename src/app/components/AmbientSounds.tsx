import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Coffee, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SoundType = 'rain' | 'cafe' | 'whitenoise';

interface Sound {
  type: SoundType;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  color: string;
}

export function AmbientSounds() {
  const [sounds, setSounds] = useState<Sound[]>([
    { type: 'rain', label: 'Rain', icon: <CloudRain size={20} />, active: false, color: '#60a5fa' },
    { type: 'cafe', label: 'Cafe', icon: <Coffee size={20} />, active: false, color: '#fb923c' },
    { type: 'whitenoise', label: 'White Noise', icon: <Wind size={20} />, active: false, color: '#f8fafc' },
  ]);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<SoundType, OscillatorNode>>(new Map());
  const gainsRef = useRef<Map<SoundType, GainNode>>(new Map());

  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => osc.stop());
      audioContextRef.current?.close();
    };
  }, []);

  const toggleSound = (type: SoundType) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const soundIndex = sounds.findIndex(s => s.type === type);
    const sound = sounds[soundIndex];
    const ctx = audioContextRef.current;

    if (sound.active) {
      const oscillator = oscillatorsRef.current.get(type);
      const gain = gainsRef.current.get(type);
      if (oscillator && gain) {
        oscillator.stop();
        oscillatorsRef.current.delete(type);
        gainsRef.current.delete(type);
      }
    } else {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      if (type === 'rain') {
        oscillator.type = 'sine';
        oscillator.frequency.value = 120;
      } else if (type === 'cafe') {
        oscillator.type = 'triangle';
        oscillator.frequency.value = 180;
      } else if (type === 'whitenoise') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 240;
      }

      gainNode.gain.value = isMuted ? 0 : volume / 100 * 0.05;

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start();

      oscillatorsRef.current.set(type, oscillator);
      gainsRef.current.set(type, gainNode);
    }

    setSounds(prev => prev.map(s => s.type === type ? { ...s, active: !s.active } : s));
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (!isMuted) {
      gainsRef.current.forEach((gain) => {
        gain.gain.value = newVolume / 100 * 0.05;
      });
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    gainsRef.current.forEach((gain) => {
      gain.gain.value = newMutedState ? 0 : volume / 100 * 0.05;
    });
  };

  return (
    <div className="flex flex-col gap-8 py-2">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={toggleMute}
            className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-white/70 hover:text-white shadow-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </motion.button>
          <span className="text-sm font-light tracking-wider opacity-60">Focus Sounds</span>
        </div>
        <span className="text-xs font-medium tracking-widest opacity-30 uppercase">{volume}%</span>
      </div>

      {/* Sound Cards */}
      <div className="grid grid-cols-1 gap-3 px-2">
        {sounds.map((sound) => (
          <motion.button
            key={sound.type}
            onClick={() => toggleSound(sound.type)}
            className={`relative flex items-center gap-4 p-4 rounded-3xl transition-all duration-500 overflow-hidden ${
              sound.active
                ? 'bg-white/10 border-white/20'
                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 opacity-60'
            } border`}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated Glow on Active */}
            <AnimatePresence>
              {sound.active && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="absolute left-0 top-0 w-1 h-full"
                  style={{ backgroundColor: sound.color }}
                />
              )}
            </AnimatePresence>
            
            <div 
              className={`p-3 rounded-2xl transition-all duration-500 ${sound.active ? 'bg-white/10' : 'bg-white/5'}`}
              style={{ color: sound.active ? sound.color : 'rgba(255, 255, 255, 0.4)' }}
            >
              {sound.icon}
            </div>
            
            <div className="flex flex-col items-start">
              <span className={`text-[15px] font-medium transition-all duration-500 ${sound.active ? 'text-white' : 'text-white/40'}`}>
                {sound.label}
              </span>
              <span className="text-[10px] uppercase tracking-widest opacity-20 font-bold">
                {sound.active ? 'Playing' : 'Stopped'}
              </span>
            </div>

            {/* Pulsing indicator when active */}
            {sound.active && (
              <motion.div
                className="ml-auto w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: sound.color }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Custom Volume Slider Container */}
      <div className="px-2 pt-2">
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="w-full volume-slider cursor-pointer"
          style={{
            background: `linear-gradient(to right, #818cf8 ${volume}%, rgba(255, 255, 255, 0.05) ${volume}%)`,
          }}
        />
      </div>
    </div>
  );
}
