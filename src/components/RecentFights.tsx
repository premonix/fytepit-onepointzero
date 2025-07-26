import { recentFights } from '@/data/recentFights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Trophy, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const RecentFights = () => {
  const getMethodVariant = (method: string) => {
    switch (method) {
      case 'KO':
      case 'TKO':
        return 'destructive';
      case 'Submission':
        return 'secondary';
      case 'Special Move':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Fights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {recentFights.slice(0, 10).map((fight) => (
            <div
              key={fight.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Fighter 1 */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={fight.fighter1.image} alt={fight.fighter1.name} />
                    <AvatarFallback>{fight.fighter1.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className={`text-sm font-medium ${
                    fight.winner.id === fight.fighter1.id ? 'text-green-600' : 'text-muted-foreground'
                  }`}>
                    {fight.fighter1.name}
                  </span>
                </div>

                <span className="text-muted-foreground">vs</span>

                {/* Fighter 2 */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={fight.fighter2.image} alt={fight.fighter2.name} />
                    <AvatarFallback>{fight.fighter2.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className={`text-sm font-medium ${
                    fight.winner.id === fight.fighter2.id ? 'text-green-600' : 'text-muted-foreground'
                  }`}>
                    {fight.fighter2.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs font-medium">{fight.winner.name}</span>
                  </div>
                  <Badge variant={getMethodVariant(fight.method)} className="text-xs">
                    {fight.method}
                  </Badge>
                </div>
                
                <div className="flex flex-col items-end text-xs text-muted-foreground">
                  <span>R{fight.round} - {fight.duration}</span>
                  <span>{formatDistanceToNow(new Date(fight.timestamp), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};