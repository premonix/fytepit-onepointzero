-- Populate fighters table with initial data from the static fighters data
INSERT INTO public.fighters (id, name, world, image, attack, defense, speed, health, description, backstory, special_move, abilities) VALUES
-- Dark Arena World
('pandarok', 'Pandarok', 'dark-arena', '/src/assets/pandarok.jpg', 95, 75, 60, 100, 'A fierce panda warrior from the shadows', 'Once a peaceful guardian of bamboo forests, Pandarok was corrupted by dark magic and now seeks redemption through combat.', 'Shadow Claw Strike', ARRAY['Shadow Manipulation', 'Berserker Rage', 'Iron Will']),
('gorehound', 'Gorehound', 'dark-arena', '/src/assets/gorehound.jpg', 85, 70, 80, 90, 'A relentless beast hunter', 'Born in the depths of the underworld, Gorehound hunts for sport and survival.', 'Blood Frenzy', ARRAY['Enhanced Speed', 'Pack Leader', 'Bloodlust']),
('vyre-emberchant', 'Vyre Emberchant', 'dark-arena', '/src/assets/vyre-emberchant.jpg', 90, 80, 70, 95, 'Master of fire and shadow', 'A sorcerer who commands both flame and darkness in equal measure.', 'Ember Storm', ARRAY['Fire Magic', 'Shadow Magic', 'Spell Weaving']),
('caerith-cursed', 'Caerith Cursed', 'dark-arena', '/src/assets/caerith-cursed.jpg', 100, 65, 75, 85, 'A warrior bearing an ancient curse', 'Cursed to fight eternally, Caerith seeks to break his bonds through victory.', 'Cursed Blade', ARRAY['Curse Magic', 'Undying Will', 'Soul Strike']),

-- Sci-Fi AI World  
('axiom-v3', 'Axiom-V3', 'sci-fi-ai', '/src/assets/axiom-v3.jpg', 85, 90, 85, 100, 'Advanced combat AI', 'Third generation military AI designed for tactical superiority.', 'Logic Bomb', ARRAY['Tactical Analysis', 'Adaptive Learning', 'System Override']),
('circuitra', 'Circuitra', 'sci-fi-ai', '/src/assets/circuitra.jpg', 80, 85, 95, 80, 'Lightning-fast data processor', 'Built for speed and precision in digital warfare.', 'Data Surge', ARRAY['Lightning Speed', 'Data Manipulation', 'Network Control']),
('el-data-supremo', 'El Data Supremo', 'sci-fi-ai', '/src/assets/el-data-supremo.jpg', 95, 80, 70, 95, 'Supreme data overlord', 'The ultimate AI that controls vast networks of information.', 'Data Overload', ARRAY['Information Control', 'Mind Hack', 'System Domination']),
('empire-exe', 'Empire.exe', 'sci-fi-ai', '/src/assets/empire-exe.jpg', 90, 95, 60, 100, 'Military command system', 'Strategic AI designed to command digital armies.', 'Command Protocol', ARRAY['Strategic Command', 'Army Control', 'Battle Coordination']),

-- Fantasy Tech World
('helix-stride', 'Helix Stride', 'fantasy-tech', '/src/assets/helix-stride.jpg', 75, 80, 100, 85, 'Swift techno-mage', 'Combines ancient magic with cutting-edge technology.', 'Spiral Strike', ARRAY['Techno-Magic', 'Super Speed', 'Energy Manipulation']),
('nova-shard', 'Nova Shard', 'fantasy-tech', '/src/assets/nova-shard.jpg', 100, 70, 80, 90, 'Crystalline energy warrior', 'A being of pure energy encased in crystal armor.', 'Star Burst', ARRAY['Energy Projection', 'Crystal Armor', 'Light Control']),
('pulsesync', 'PulseSync', 'fantasy-tech', '/src/assets/pulsesync.jpg', 80, 85, 90, 85, 'Rhythm-based fighter', 'Fights to the beat of technological harmony.', 'Sync Wave', ARRAY['Rhythm Combat', 'Sound Manipulation', 'Harmonic Resonance']),
('seraphyx', 'Seraphyx', 'fantasy-tech', '/src/assets/seraphyx.jpg', 90, 90, 75, 95, 'Angelic tech hybrid', 'Divine being enhanced with advanced technology.', 'Divine Protocol', ARRAY['Divine Power', 'Tech Enhancement', 'Holy Light']);

-- Update the SelectContent to ensure proper visibility