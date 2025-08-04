import { SidebarLayout } from '@/components/SidebarLayout';
import { SocialFeatures } from '@/components/SocialFeatures';

export default function Social() {
  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Arena Social</h1>
            <p className="text-muted-foreground">Connect with the community, share predictions, and follow your favorite fighters</p>
          </div>
          <SocialFeatures />
        </div>
      </div>
    </SidebarLayout>
  );
}