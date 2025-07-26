import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, TrendingDown, DollarSign, Trophy, Target, Brain, Clock, Download, Search } from 'lucide-react';
import { fighters } from '@/data/fighters';

// Mock data for the Bloodbook
const liveMatches = [
  {
    id: 1,
    fighter1: fighters[0], // Velora
    fighter2: fighters[5], // Crushware
    odds: [63, 37],
    totalWagered: 428100,
    prediction: "Trait surge expected",
  },
  {
    id: 2,
    fighter1: fighters[10], // Thornhelm
    fighter2: fighters[15], // Nullbyte
    odds: [45, 55],
    totalWagered: 312500,
    prediction: "Nullbyte's streak pulls crowd confidence",
  }
];

const fighterEarnings = [
  { fighter: fighters[0], totalEarned: 1203000, wagerVolume: 3400000, ownerRewards: 321150 },
  { fighter: fighters[7], totalEarned: 970000, wagerVolume: 2900000, ownerRewards: 221000 },
  { fighter: fighters[12], totalEarned: 845000, wagerVolume: 2200000, ownerRewards: 198000 },
  { fighter: fighters[3], totalEarned: 756000, wagerVolume: 1800000, ownerRewards: 167000 },
  { fighter: fighters[8], totalEarned: 698000, wagerVolume: 1600000, ownerRewards: 145000 },
];

const userPayouts = [
  { user: "@PitMaster79", totalWinnings: 418000, roi: 221, notableBet: "Velora KO win" },
  { user: "0x9Fb...cB72", totalWinnings: 310500, roi: 310, notableBet: "Underdog parlay" },
  { user: "@RelicStaker", totalWinnings: 297100, roi: 192, notableBet: "Mythrendahl sweep" },
  { user: "@ShadowBettor", totalWinnings: 245000, roi: 156, notableBet: "Trait activation chain" },
];

const upsetWins = [
  { winner: "Frakta", loser: "Redline 09", odds: "6.8x", payout: "92% bet against" },
  { winner: "Myxa", loser: "Seraphyx", odds: "4.2x", payout: "87% crowd favorite lost" },
  { winner: "Skarn Hollow", loser: "Axiom V3", odds: "5.1x", payout: "Tech vs Dark upset" },
];

const fightHistory = [
  { id: 1, fighter1: "Blayze Coil", fighter2: "Circuitra", outcome: "Round 6 KO", wagered: 1200000, winner: "Blayze Coil" },
  { id: 2, fighter1: "Rend.exe", fighter2: "Logic Zero", outcome: "Shadow Blink trait", wagered: 890000, winner: "Rend.exe" },
  { id: 3, fighter1: "Velora", fighter2: "Thornhelm", outcome: "Decision", wagered: 1450000, winner: "Velora" },
  { id: 4, fighter1: "Gorehound", fighter2: "Vanta Maw", outcome: "Brutal Finish", wagered: 2100000, winner: "Gorehound" },
];

export default function Bloodbook() {
  const [selectedMatch, setSelectedMatch] = useState(0);
  const [betAmount, setBetAmount] = useState([1000]);
  const [selectedFighter, setSelectedFighter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("24h");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-rajdhani">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/20 via-black to-red-900/20 border-b border-red-500/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold font-orbitron text-red-400 mb-4 tracking-wider">
              THE BLOODBOOK
            </h1>
            <p className="text-xl text-red-300/80 italic">
              "In the Bloodbook, all stakes are etched in code. No lies. No second chances."
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Live Wager Feed */}
        <Card className="bg-card/50 border-red-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-orbitron text-red-400 flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Live Wager Feed
            </CardTitle>
            <p className="text-red-300/70">💥 Real-time odds. Fresh blood. Next to fall?</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {liveMatches.map((match, index) => (
                <div key={match.id} className="bg-gradient-to-br from-red-900/10 to-black border border-red-500/30 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                      <img src={match.fighter1.image} alt={match.fighter1.name} className="w-12 h-12 rounded-full border-2 border-red-400" />
                      <div>
                        <h3 className="font-bold text-lg">{match.fighter1.name}</h3>
                        <p className="text-red-400 text-sm">{match.fighter1.world}</p>
                      </div>
                    </div>
                    <div className="text-center text-red-300">VS</div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <h3 className="font-bold text-lg">{match.fighter2.name}</h3>
                        <p className="text-red-400 text-sm">{match.fighter2.world}</p>
                      </div>
                      <img src={match.fighter2.image} alt={match.fighter2.name} className="w-12 h-12 rounded-full border-2 border-red-400" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>{match.odds[0]}% {match.fighter1.name}</span>
                      <span>{match.odds[1]}% {match.fighter2.name}</span>
                    </div>
                    <div className="w-full bg-red-900/20 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${match.odds[0]}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-red-300/70">Total Wagered</p>
                      <p className="font-bold text-xl text-red-400">{formatCurrency(match.totalWagered)} $FYTE</p>
                    </div>
                    <Badge variant="outline" className="border-red-400 text-red-400">
                      {match.prediction}
                    </Badge>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 border border-red-400 text-white font-bold">
                    PLACE YOUR BET
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fighter Earnings Leaderboard */}
        <Card className="bg-card/50 border-red-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-orbitron text-red-400 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Fighter Earnings Leaderboard
            </CardTitle>
            <p className="text-red-300/70">"Champions don't just win fights. They win fortunes."</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-red-500/20">
                    <th className="text-left py-3 px-4 font-orbitron text-red-400">Fighter</th>
                    <th className="text-left py-3 px-4 font-orbitron text-red-400">Realm</th>
                    <th className="text-left py-3 px-4 font-orbitron text-red-400">Total Earned</th>
                    <th className="text-left py-3 px-4 font-orbitron text-red-400">Wager Volume</th>
                    <th className="text-left py-3 px-4 font-orbitron text-red-400">Owner Rewards</th>
                  </tr>
                </thead>
                <tbody>
                  {fighterEarnings.map((earning, index) => (
                    <tr key={earning.fighter.id} className="border-b border-red-500/10 hover:bg-red-900/10 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-red-400 font-bold text-lg">#{index + 1}</span>
                          <img src={earning.fighter.image} alt={earning.fighter.name} className="w-10 h-10 rounded-full border border-red-400" />
                          <span className="font-bold">{earning.fighter.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-red-300">{earning.fighter.world}</td>
                      <td className="py-4 px-4 font-bold text-red-400">{formatCurrency(earning.totalEarned)} $FYTE</td>
                      <td className="py-4 px-4">{(earning.wagerVolume / 1000000).toFixed(1)}M $FYTE</td>
                      <td className="py-4 px-4 text-green-400">{formatCurrency(earning.ownerRewards)} $FYTE</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Wager Trends & Bet Breakdown */}
        <Card className="bg-card/50 border-red-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-orbitron text-red-400 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Wager Trends & Bet Breakdown
            </CardTitle>
            <p className="text-red-300/70">"Track the flow. Follow the crowd. Or bet against the stream."</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="trends" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-red-900/20">
                <TabsTrigger value="trends" className="data-[state=active]:bg-red-600">🔥 Live Trends</TabsTrigger>
                <TabsTrigger value="upsets" className="data-[state=active]:bg-red-600">🎯 Underdog Wins</TabsTrigger>
                <TabsTrigger value="smart" className="data-[state=active]:bg-red-600">🧠 Smart Money</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trends" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fighterEarnings.slice(0, 3).map((fighter, index) => (
                    <div key={fighter.fighter.id} className="bg-gradient-to-br from-red-900/10 to-black border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={fighter.fighter.image} alt={fighter.fighter.name} className="w-8 h-8 rounded-full" />
                        <span className="font-bold">{fighter.fighter.name}</span>
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                      <p className="text-sm text-red-300/70 mb-2">Current Volume</p>
                      <p className="font-bold text-red-400">{(fighter.wagerVolume / 1000000).toFixed(1)}M $FYTE</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="upsets" className="mt-6">
                <div className="space-y-4">
                  {upsetWins.map((upset, index) => (
                    <div key={index} className="bg-gradient-to-r from-red-900/10 to-black border border-red-500/30 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-lg">{upset.winner} defeated {upset.loser}</p>
                          <p className="text-red-300/70">{upset.payout}</p>
                        </div>
                        <Badge variant="outline" className="border-green-400 text-green-400 text-xl font-bold">
                          {upset.odds}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="smart" className="mt-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-900/10 to-black border border-purple-500/30 rounded-lg p-4">
                    <p className="font-bold text-purple-400 mb-2">$THORNFANS wallet group</p>
                    <p className="text-sm mb-2">Placed 50,000 $FYTE on coordinated realm-specific bets</p>
                    <p className="text-green-400 font-bold">Net gain: +312%</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-900/10 to-black border border-blue-500/30 rounded-lg p-4">
                    <p className="font-bold text-blue-400 mb-2">@WhaleBettor</p>
                    <p className="text-sm mb-2">Consistently bets against crowd favorites</p>
                    <p className="text-green-400 font-bold">7-day ROI: +267%</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* User Payout Tracker */}
        <Card className="bg-card/50 border-red-500/20 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-orbitron text-red-400 flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  User Payout Tracker
                </CardTitle>
                <p className="text-red-300/70">"The Pit pays its champions. Even if they never throw a punch."</p>
              </div>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32 bg-red-900/20 border-red-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Top 24H</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="all-time">All-Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-red-500/20">
                    <th className="text-left py-3 px-4 font-orbitron text-red-400">User / Wallet</th>
                    <th className="text-left py-3 px-4 font-orbitron text-red-400">Total Winnings</th>
                    <th className="text-left py-3 px-4 font-orbitron text-red-400">ROI</th>
                    <th className="text-left py-3 px-4 font-orbitron text-red-400">Notable Bet</th>
                  </tr>
                </thead>
                <tbody>
                  {userPayouts.map((user, index) => (
                    <tr key={index} className="border-b border-red-500/10 hover:bg-red-900/10 transition-colors">
                      <td className="py-4 px-4 font-bold">{user.user}</td>
                      <td className="py-4 px-4 font-bold text-green-400">{formatCurrency(user.totalWinnings)} $FYTE</td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="border-green-400 text-green-400">
                          +{user.roi}%
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-red-300">{user.notableBet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Bloodbook Archive */}
        <Card className="bg-card/50 border-red-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-orbitron text-red-400 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Bloodbook Archive
            </CardTitle>
            <p className="text-red-300/70">"Every fight leaves a mark."</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-400" />
                <Input 
                  placeholder="Search fighters, realms, outcomes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-red-900/20 border-red-500/30 text-white placeholder:text-red-300/50"
                />
              </div>
              <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-900/20">
                <Download className="w-4 h-4 mr-2" />
                Export Ledger
              </Button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {fightHistory.map((fight) => (
                <div key={fight.id} className="bg-gradient-to-r from-red-900/10 to-black border border-red-500/30 rounded-lg p-4 hover:bg-red-900/20 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">{fight.fighter1} vs {fight.fighter2}</p>
                      <p className="text-red-400">{fight.outcome} • Winner: {fight.winner}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-400">{formatCurrency(fight.wagered)} $FYTE</p>
                      <p className="text-sm text-red-300/70">Total Wagered</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Footer */}
        <div className="text-center bg-gradient-to-r from-red-900/20 via-black to-red-900/20 border border-red-500/20 rounded-lg p-8">
          <h2 className="text-3xl font-orbitron text-red-400 mb-4">
            💼 Ready to place your mark in the Bloodbook?
          </h2>
          <p className="text-red-300/80 mb-6">
            Stake your $FYTE, back your warrior, and let the code decide your fate.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900">
              VIEW UPCOMING MATCHES
            </Button>
            <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-900/20">
              RETURN TO THE PIT
            </Button>
            <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-900/20">
              BUY FIGHTER SHARES
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}