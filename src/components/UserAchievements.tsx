import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAchievements, useUserAchievements, useAchievementProgress } from '@/hooks/useAchievements';
import { Trophy, Star, Target, Zap, Shield, Award, Crown, Medal } from 'lucide-react';

const categoryIcons = {
  'general': Trophy,
  'combat': Zap,
  'social': Star,
  'financial': Target,
  'collection': Shield,
  'special': Crown,
};

const categoryColors = {
  'general': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'combat': 'bg-red-500/20 text-red-400 border-red-500/30',
  'social': 'bg-green-500/20 text-green-400 border-green-500/30',
  'financial': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'collection': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'special': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export function UserAchievements() {
  const { data: achievements, isLoading: achievementsLoading } = useAchievements();
  const { data: userAchievements, isLoading: userLoading } = useUserAchievements();
  const progressData = useAchievementProgress();

  if (achievementsLoading || userLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  const earnedCount = userAchievements?.length || 0;
  const totalCount = achievements?.length || 0;
  const completionRate = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {earnedCount} of {totalCount} achievements earned
            </span>
            <span className="text-sm font-medium">
              {completionRate.toFixed(1)}%
            </span>
          </div>
          <Progress value={completionRate} className="h-2" />
          
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{earnedCount}</div>
              <div className="text-xs text-muted-foreground">Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {userAchievements?.reduce((sum, ua) => sum + ua.achievement.points, 0) || 0}
              </div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {totalCount - earnedCount}
              </div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {progressData.map((item, index) => {
          const IconComponent = categoryIcons[item.achievement.category as keyof typeof categoryIcons] || Award;
          const categoryColor = categoryColors[item.achievement.category as keyof typeof categoryColors] || categoryColors.general;
          
          return (
            <motion.div
              key={item.achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                item.isEarned 
                  ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-orange-500/5' 
                  : 'border-muted hover:border-muted-foreground/20'
              }`}>
                {item.isEarned && (
                  <div className="absolute top-2 right-2">
                    <Medal className="h-4 w-4 text-yellow-500" />
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border ${categoryColor}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold">
                        {item.achievement.name}
                      </CardTitle>
                      <Badge 
                        variant="outline" 
                        className="text-xs mt-1"
                      >
                        {item.achievement.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {item.achievement.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary">
                      {item.achievement.points} points
                    </span>
                    {item.isEarned && (
                      <span className="text-xs text-yellow-500 font-medium">
                        Earned {new Date(item.earnedAt!).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  {!item.isEarned && (
                    <div className="pt-2 border-t border-muted">
                      <div className="text-xs text-muted-foreground mb-1">
                        Progress needed
                      </div>
                      <div className="text-xs text-foreground">
                        {JSON.stringify(item.achievement.requirements).replace(/[{}]/g, '').replace(/"/g, '')}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}