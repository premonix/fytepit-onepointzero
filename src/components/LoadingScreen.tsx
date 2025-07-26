import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [stage, setStage] = useState(0);
  const { playUI } = useSound();

  useEffect(() => {
    const timer1 = setTimeout(() => {
      playUI('loading');
      setStage(1);
    }, 500);

    const timer2 = setTimeout(() => {
      setStage(2);
    }, 1500);

    const timer3 = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete, playUI]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Arena Core Ring */}
      <div className="relative">
        <motion.div
          className="w-32 h-32 rounded-full border-4"
          initial={{ scale: 0, borderColor: 'rgb(239, 68, 68)' }}
          animate={{
            scale: stage >= 1 ? 1 : 0,
            borderColor: stage >= 1 
              ? ['rgb(239, 68, 68)', 'rgb(20, 184, 166)', 'rgb(52, 211, 153)']
              : 'rgb(239, 68, 68)'
          }}
          transition={{
            scale: { duration: 0.8, ease: "easeOut" },
            borderColor: { duration: 2, repeat: Infinity }
          }}
        />
        
        {/* Glitch lines */}
        {stage >= 1 && (
          <>
            <motion.div
              className="absolute inset-0 border-2 border-primary rounded-full"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0, 0.7, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 border-2 border-accent rounded-full"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 1.4, 1], opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </div>

      {/* The Pit Awakens text */}
      {stage >= 2 && (
        <motion.div
          className="absolute bottom-1/3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-2xl font-bold text-white tracking-wider">
            The Pit awakens...
          </div>
        </motion.div>
      )}

      {/* Heat crack effect */}
      {stage >= 2 && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1 }}
        />
      )}
    </motion.div>
  );
};