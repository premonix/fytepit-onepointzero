import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSound } from '@/hooks/useSound';

interface RealmSectionProps {
  realm: {
    id: string;
    name: string;
    description: string;
    lore: string;
    backgroundImage: string;
    fighterSilhouette: string;
    primaryColor: string;
    accentColor: string;
  };
  index: number;
}

export const RealmSection = ({ realm, index }: RealmSectionProps) => {
  const [showLore, setShowLore] = useState(false);
  const { playUI, selectRealm } = useSound();

  const handleLoreClick = () => {
    playUI('click', realm.id);
    selectRealm(realm.id);
    setShowLore(true);
  };

  const handleCloseLore = () => {
    playUI('click');
    setShowLore(false);
  };

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${realm.backgroundImage})`,
          filter: 'brightness(0.3) contrast(1.2)'
        }}
      />
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${realm.primaryColor}20, ${realm.accentColor}20)`
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          className="text-center lg:text-left"
          initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ color: realm.primaryColor }}
          >
            {realm.name}
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-lg">
            {realm.description}
          </p>
          
          {/* Sigil Star Button */}
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={handleLoreClick}
              className="bg-transparent border-2 rounded-full p-4 hover:bg-white/10"
              style={{ borderColor: realm.accentColor }}
            >
              <Star className="w-8 h-8" style={{ color: realm.accentColor }} />
            </Button>
          </motion.div>
          <p className="text-sm text-gray-400 mt-2">
            Click the sigil to reveal the lore
          </p>
        </motion.div>

        {/* Fighter Silhouette */}
        <motion.div
          className="relative"
          initial={{ x: index % 2 === 0 ? 100 : -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="relative w-full h-96 flex items-center justify-center">
            <motion.div
              className="w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-lg backdrop-blur-sm border border-white/30"
              whileHover={{ scale: 1.05 }}
              style={{ 
                boxShadow: `0 0 50px ${realm.accentColor}40`
              }}
            >
              <img
                src={realm.fighterSilhouette}
                alt={`${realm.name} fighter`}
                className="w-full h-full object-cover rounded-lg"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Lore Modal */}
      <AnimatePresence>
        {showLore && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseLore}
          >
            <motion.div
              className="relative max-w-4xl w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-8 bg-black/90 border-2" style={{ borderColor: realm.primaryColor }}>
                <Button
                  onClick={handleCloseLore}
                  className="absolute top-4 right-4 bg-transparent hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </Button>
                
                <h3 
                  className="text-3xl font-bold mb-6 text-center"
                  style={{ color: realm.primaryColor }}
                >
                  {realm.name} Chronicles
                </h3>
                
                <div className="text-lg leading-relaxed text-gray-300 max-h-96 overflow-y-auto">
                  {realm.lore.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};