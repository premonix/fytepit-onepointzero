import { SidebarLayout } from '@/components/SidebarLayout';
import { LiveTournamentViewer } from '@/components/LiveTournamentViewer';

export default function Tournaments() {
  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Live Tournaments</h1>
            <p className="text-muted-foreground">Watch active tournaments and upcoming events</p>
          </div>
          <LiveTournamentViewer />
        </div>
      </div>
    </SidebarLayout>
  );
}