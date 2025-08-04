import React from 'react';
import { useParams } from 'react-router-dom';
import { LiveArena } from '@/components/LiveArena';

export default function LiveFight() {
  const { fightId } = useParams<{ fightId: string }>();

  if (!fightId) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Fight Not Found</h1>
          <p className="text-muted-foreground">Invalid fight ID provided.</p>
        </div>
      </div>
    );
  }

  return <LiveArena fightId={fightId} />;
}