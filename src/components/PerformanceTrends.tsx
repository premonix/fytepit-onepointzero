import { fighters } from '@/data/fighters';
import { worlds } from '@/data/worlds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useState } from 'react';

export const PerformanceTrends = () => {
  const [selectedFighter, setSelectedFighter] = useState(fighters[0].id);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');

  const selectedFighterData = fighters.find(f => f.id === selectedFighter);

  // Mock performance data over time for line chart
  const generatePerformanceData = (fighter: typeof fighters[0]) => {
    const data = [];
    let currentWinRate = 0.3; // Starting win rate
    
    for (let i = 0; i < 12; i++) {
      const month = new Date(2024, i, 1).toLocaleDateString('en', { month: 'short' });
      const variation = (Math.random() - 0.5) * 0.1; // Random variation
      currentWinRate = Math.max(0, Math.min(1, currentWinRate + variation));
      
      data.push({
        month,
        winRate: Math.round(currentWinRate * 100),
        wins: Math.floor(Math.random() * 5) + 1,
        losses: Math.floor(Math.random() * 3),
      });
    }
    
    return data;
  };

  // World distribution data for pie chart
  const worldData = worlds.map(world => ({
    name: world.name,
    value: fighters.filter(f => f.world === world.id).length,
    fill: world.theme.primary
  }));

  // Top performers data for bar chart
  const topPerformersData = fighters
    .map(fighter => ({
      name: fighter.name.length > 8 ? fighter.name.substring(0, 8) + '...' : fighter.name,
      winRate: Math.round((fighter.wins / (fighter.wins + fighter.losses)) * 100),
      wins: fighter.wins,
      value: fighter.valuePerShare
    }))
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 8);

  const performanceData = selectedFighterData ? generatePerformanceData(selectedFighterData) : [];

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="winRate" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPerformersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="winRate" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={worldData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {worldData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'line':
        return `${selectedFighterData?.name} Performance Trend`;
      case 'bar':
        return 'Top Performers by Win Rate';
      case 'pie':
        return 'Fighter Distribution by World';
      default:
        return 'Performance Chart';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {getChartTitle()}
          </CardTitle>
          <div className="flex gap-2">
            {/* Chart Type Selector */}
            <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Line
                  </div>
                </SelectItem>
                <SelectItem value="bar">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Bar
                  </div>
                </SelectItem>
                <SelectItem value="pie">
                  <div className="flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4" />
                    Pie
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Fighter Selector (only for line chart) */}
            {chartType === 'line' && (
              <Select value={selectedFighter} onValueChange={setSelectedFighter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fighters.map(fighter => (
                    <SelectItem key={fighter.id} value={fighter.id}>
                      {fighter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};