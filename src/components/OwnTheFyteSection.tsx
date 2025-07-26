import { motion } from 'framer-motion';
import { Sword, Brain, Dna, TrendingUp, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSound } from '@/hooks/useSound';

const features = [
  {
    icon: Sword,
    title: 'Fighter Ownership',
    description: 'Stake your warrior. Claim a share of the champion.',
    visual: 'Digital fighter card with hologram effect',
    gradient: 'from-red-500 to-orange-500'
  },
  {
    icon: Brain,
    title: 'AI Betting Engine',
    description: 'Bet smart. Bet fast. Bet with code.',
    visual: 'Glitched arena with smart odds changing',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Dna,
    title: 'Fighter Evolution',
    description: 'Train, upgrade, dominate. Your fighter evolves.',
    visual: 'Upgrade chip fusing into avatar skull',
    gradient: 'from-purple-500 to-pink-500'
  }
];

export const OwnTheFyteSection = () => {
  const { playUI } = useSound();

  const handleJoinDAO = () => {
    playUI('click');
    // Future: Open DAO joining flow
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, #ff4444 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, #00aaff 0%, transparent 50%)',
              'radial-gradient(circle at 0% 100%, #ff4444 0%, transparent 50%)',
              'radial-gradient(circle at 100% 0%, #00aaff 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            OWN THE FYTE
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Enter the next generation of combat entertainment. Own, bet, and evolve in the ultimate arena ecosystem.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="bg-black/50 border-gray-800 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                <CardContent className="p-8 text-center relative">
                  {/* Background gradient */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-white mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-6">
                      {feature.description}
                    </p>

                    <div className="text-sm text-gray-500 italic">
                      {feature.visual}
                    </div>
                  </div>

                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 border-2 border-transparent rounded-lg"
                    whileHover={{ borderColor: 'rgb(var(--primary))' }}
                    transition={{ duration: 0.3 }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={handleJoinDAO}
            className="bg-gradient-primary hover:opacity-90 text-white px-12 py-6 text-xl font-bold"
            onMouseEnter={() => playUI('hover')}
          >
            <Users className="w-6 h-6 mr-3" />
            Join the Arena DAO
          </Button>
          
          <div className="flex items-center justify-center gap-8 mt-8 text-gray-500">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>Own Warriors</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span>Smart Betting</span>
            </div>
            <div className="flex items-center gap-2">
              <Dna className="w-5 h-5" />
              <span>Evolution System</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};