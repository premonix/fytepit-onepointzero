import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { FighterCard } from '@/components/FighterCard';
import { fighters } from '@/data/fighters';
import { useSound } from '@/hooks/useSound';

export const FighterSelectionSection = () => {
  const [selectedFighters, setSelectedFighters] = useState<string[]>([]);
  const { playUI } = useSound();

  const handleFighterSelect = (fighterId: string) => {
    playUI('click');
    setSelectedFighters(prev => 
      prev.includes(fighterId) 
        ? prev.filter(id => id !== fighterId)
        : prev.length < 2 
          ? [...prev, fighterId]
          : [prev[1], fighterId]
    );
  };

  const handleStartBattle = () => {
    playUI('click');
    // Future: Start battle functionality
  };

  return (
    <section id="fighter-selection" className="relative py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            SELECT YOUR CHAMPIONS
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Choose two fighters from across the three realms. Watch them battle for supremacy in the arena.
          </p>
          {selectedFighters.length > 0 && (
            <p className="text-lg text-primary">
              {selectedFighters.length}/2 fighters selected
            </p>
          )}
        </motion.div>

        {/* Fighter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {fighters.slice(0, 12).map((fighter, index) => (
            <motion.div
              key={fighter.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div
                onClick={() => handleFighterSelect(fighter.id)}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedFighters.includes(fighter.id) ? 'ring-2 ring-primary' : ''
                }`}
              >
                <FighterCard 
                  fighter={fighter} 
                  showActions={false}
                />
                {selectedFighters.includes(fighter.id) && (
                  <Badge className="absolute top-2 left-2 bg-primary z-10">
                    Fighter {selectedFighters.indexOf(fighter.id) + 1}
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Battle Button */}
        {selectedFighters.length === 2 && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              onClick={handleStartBattle}
              className="bg-gradient-primary hover:opacity-90 text-white px-12 py-6 text-xl font-bold"
              onMouseEnter={() => playUI('hover')}
            >
              <Play className="w-6 h-6 mr-3" />
              START BATTLE
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};