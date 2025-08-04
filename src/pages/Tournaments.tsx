import { SidebarLayout } from '@/components/SidebarLayout';
import { LiveTournamentViewer } from '@/components/LiveTournamentViewer';

export default function Tournaments() {
  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background p-6">
        <div className="max-w-7xl mx-auto">
          <LiveTournamentViewer />
        </div>
      </div>
    </SidebarLayout>
  );
}