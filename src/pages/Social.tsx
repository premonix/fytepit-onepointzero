import { SidebarLayout } from '@/components/SidebarLayout';
import { SocialFeatures } from '@/components/SocialFeatures';

export default function Social() {
  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background p-6">
        <div className="max-w-7xl mx-auto">
          <SocialFeatures />
        </div>
      </div>
    </SidebarLayout>
  );
}