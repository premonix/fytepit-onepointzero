import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSound } from '@/hooks/useSound';

const futureRealms = [
  {
    id: 'shatter-point',
    name: 'The Shatter Point',
    description: 'Chaotic realm entry for rogue zones',
    position: 'top-left'
  },
  {
    id: 'frostline-rift',
    name: 'The Frostline Rift',
    description: 'Frozen combat plains with biomech beasts',
    position: 'top-right'
  },
  {
    id: 'echo-span',
    name: 'The Echo Span',
    description: 'Time-looped warriors and multiversal anomalies',
    position: 'bottom-left'
  },
  {
    id: 'ember-arc',
    name: 'The Ember Arc',
    description: 'Fire-forged tech realm with mechdragons',
    position: 'bottom-right'
  }
];

export const PortalSection = () => {
  const { playUI } = useSound();

  const handlePortalClick = () => {
    playUI('click');
    // Future: Open wishlist/subscribe modal
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, #ff444440 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, #00aaff40 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, #00ffaa40 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, #ff444440 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          The Arena Expands...
        </motion.h2>

        <motion.p
          className="text-xl text-gray-400 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Four dormant anchor points await activation for new realms, tournaments, and cross-world events
        </motion.p>

        {/* Portal Grid */}
        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {futureRealms.map((realm, index) => (
            <motion.div
              key={realm.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              onClick={handlePortalClick}
            >
              <div className="relative h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                {/* Portal effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-conic from-primary via-accent to-primary opacity-20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Mist overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Lock icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="bg-black/70 rounded-full p-4 backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Lock className="w-8 h-8 text-gray-400" />
                  </motion.div>
                </div>

                {/* Sparks effect */}
                <motion.div
                  className="absolute top-2 right-2 opacity-60"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                </motion.div>
              </div>
              
              {/* Portal info */}
              <div className="mt-4 text-center">
                <h3 className="text-lg font-bold text-white mb-1">{realm.name}</h3>
                <p className="text-sm text-gray-400">{realm.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={handlePortalClick}
            className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 text-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Unlock Future Zones
          </Button>
        </motion.div>
      </div>
    </section>
  );
};