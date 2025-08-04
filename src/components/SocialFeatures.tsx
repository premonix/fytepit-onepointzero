import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Share2, 
  Heart, 
  MessageCircle, 
  Users, 
  Star,
  TrendingUp,
  Trophy
} from 'lucide-react';

interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  type: 'fight_share' | 'fighter_follow' | 'achievement' | 'prediction';
  metadata: any;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_profile: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
  is_liked?: boolean;
}

interface FighterFollowing {
  fighter_id: string;
  fighter_name: string;
  fighter_image: string;
  win_rate: number;
  total_fights: number;
}

export function SocialFeatures() {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [followedFighters, setFollowedFighters] = useState<FighterFollowing[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSocialData();
    }
  }, [user]);

  const fetchSocialData = async () => {
    try {
      // This would be implemented with proper social tables
      // For now, we'll simulate the data structure
      const mockPosts: SocialPost[] = [
        {
          id: '1',
          user_id: 'user1',
          content: 'Just watched an epic fight between Axiom V3 and Gorehound! 🔥',
          type: 'fight_share',
          metadata: { fight_id: 'fight123' },
          likes_count: 15,
          comments_count: 3,
          created_at: new Date().toISOString(),
          user_profile: {
            username: 'fightfan123',
            display_name: 'Fight Fan',
            avatar_url: ''
          },
          is_liked: false
        },
        {
          id: '2',
          user_id: 'user2',
          content: 'Predicting Seraphyx will dominate the upcoming tournament! 🏆',
          type: 'prediction',
          metadata: { fighter_id: 'seraphyx' },
          likes_count: 8,
          comments_count: 1,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          user_profile: {
            username: 'oracle_warrior',
            display_name: 'Oracle Warrior',
            avatar_url: ''
          },
          is_liked: true
        }
      ];

      const mockFollowing: FighterFollowing[] = [
        {
          fighter_id: 'axiom-v3',
          fighter_name: 'Axiom V3',
          fighter_image: '/src/assets/axiom-v3.jpg',
          win_rate: 0.85,
          total_fights: 12
        },
        {
          fighter_id: 'seraphyx',
          fighter_name: 'Seraphyx',
          fighter_image: '/src/assets/seraphyx.jpg',
          win_rate: 0.92,
          total_fights: 8
        }
      ];

      setSocialPosts(mockPosts);
      setFollowedFighters(mockFollowing);
    } catch (error) {
      console.error('Error fetching social data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load social content.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    // Toggle like status
    setSocialPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: !post.is_liked,
              likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      )
    );
  };

  const handleShare = (post: SocialPost) => {
    if (navigator.share) {
      navigator.share({
        title: 'FYTEPIT - Fight Share',
        text: post.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${post.content}\n\n${window.location.href}`);
      toast({
        title: "Copied to clipboard",
        description: "Post link copied to clipboard!",
      });
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    const mockPost: SocialPost = {
      id: Date.now().toString(),
      user_id: user?.id || '',
      content: newPost,
      type: 'prediction',
      metadata: {},
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      user_profile: {
        username: 'you',
        display_name: 'You',
        avatar_url: ''
      },
      is_liked: false
    };

    setSocialPosts([mockPost, ...socialPosts]);
    setNewPost('');
    
    toast({
      title: "Post created",
      description: "Your post has been shared with the community!",
    });
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'fight_share':
        return <Trophy className="w-4 h-4" />;
      case 'prediction':
        return <TrendingUp className="w-4 h-4" />;
      case 'achievement':
        return <Star className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading social content...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Share Your Thoughts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="What's happening in the arena?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createPost()}
              />
              <Button onClick={createPost} disabled={!newPost.trim()}>
                Post
              </Button>
            </CardContent>
          </Card>

          {/* Social Feed */}
          <div className="space-y-4">
            {socialPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={post.user_profile.avatar_url} />
                      <AvatarFallback>
                        {post.user_profile.display_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{post.user_profile.display_name}</span>
                        <span className="text-sm text-muted-foreground">
                          @{post.user_profile.username}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {getPostIcon(post.type)}
                          {post.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(post.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <p className="text-sm">{post.content}</p>
                      
                      <div className="flex items-center gap-4 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={post.is_liked ? 'text-red-500' : ''}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${post.is_liked ? 'fill-current' : ''}`} />
                          {post.likes_count}
                        </Button>
                        
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.comments_count}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleShare(post)}
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Followed Fighters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Following
              </CardTitle>
              <CardDescription>
                Fighters you're tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {followedFighters.map((fighter) => (
                <div key={fighter.fighter_id} className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={fighter.fighter_image} />
                    <AvatarFallback>{fighter.fighter_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{fighter.fighter_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(fighter.win_rate * 100)}% win rate • {fighter.total_fights} fights
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Trending */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Trending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">#SerraphyxDominance</span>
                <p className="text-muted-foreground text-xs">142 posts</p>
              </div>
              <div className="text-sm">
                <span className="font-medium">#DarkArenaTournament</span>
                <p className="text-muted-foreground text-xs">89 posts</p>
              </div>
              <div className="text-sm">
                <span className="font-medium">#AxiomUpset</span>
                <p className="text-muted-foreground text-xs">67 posts</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}