import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { AlertTriangle, Eye, CheckCircle, X, MessageSquare } from 'lucide-react';

interface UserReport {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reported_content_type: string;
  reported_content_id: string | null;
  reason: string;
  description: string | null;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
}

export function ContentModeration() {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<UserReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'view' | 'resolve'>('view');
  const [resolution, setResolution] = useState<'resolved' | 'dismissed'>('resolved');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, statusFilter]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    setFilteredReports(filtered);
  };

  const openDialog = (type: 'view' | 'resolve', report: UserReport) => {
    setSelectedReport(report);
    setDialogType(type);
    setResolutionNotes('');
    setResolution('resolved');
    setIsDialogOpen(true);
  };

  const handleResolveReport = async () => {
    if (!selectedReport || !user) return;

    try {
      const { error } = await supabase
        .from('user_reports')
        .update({
          status: resolution,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          resolution_notes: resolutionNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedReport.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Report ${resolution} successfully.`,
      });

      setIsDialogOpen(false);
      setSelectedReport(null);
      setResolutionNotes('');
      await fetchReports();
    } catch (error) {
      console.error('Error resolving report:', error);
      toast({
        title: "Error",
        description: "Failed to resolve report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'destructive';
      case 'reviewed': return 'default';
      case 'resolved': return 'default';
      case 'dismissed': return 'secondary';
      default: return 'outline';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return '👤';
      case 'fighter': return '⚔️';
      case 'comment': return '💬';
      default: return '📝';
    }
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Content Moderation
          {pendingCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {pendingCount} pending
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Review and moderate user reports ({filteredReports.length} reports)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchReports} disabled={isLoading} variant="outline">
              Refresh
            </Button>
          </div>

          {/* Reports Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Content Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading reports...
                    </TableCell>
                  </TableRow>
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No reports found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">Report #{report.id.slice(0, 8)}</div>
                          <div className="text-sm text-muted-foreground">
                            {report.description ? 
                              (report.description.length > 50 ? 
                                `${report.description.slice(0, 50)}...` : 
                                report.description
                              ) : 
                              'No description provided'
                            }
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{getContentTypeIcon(report.reported_content_type)}</span>
                          <span className="capitalize">{report.reported_content_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.reason}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(report.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDialog('view', report)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {report.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDialog('resolve', report)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Report Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {dialogType === 'view' ? 'Report Details' : 'Resolve Report'}
              </DialogTitle>
              <DialogDescription>
                {dialogType === 'view' ? 
                  'View detailed information about this report' :
                  'Mark this report as resolved or dismissed'
                }
              </DialogDescription>
            </DialogHeader>

            {selectedReport && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Report ID</Label>
                    <p className="text-sm">{selectedReport.id}</p>
                  </div>
                  <div>
                    <Label>Content Type</Label>
                    <p className="text-sm capitalize">
                      {getContentTypeIcon(selectedReport.reported_content_type)} {selectedReport.reported_content_type}
                    </p>
                  </div>
                  <div>
                    <Label>Reason</Label>
                    <p className="text-sm">{selectedReport.reason}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={getStatusBadgeVariant(selectedReport.status)}>
                      {selectedReport.status}
                    </Badge>
                  </div>
                </div>

                {selectedReport.description && (
                  <div>
                    <Label>Description</Label>
                    <p className="text-sm bg-muted p-3 rounded">
                      {selectedReport.description}
                    </p>
                  </div>
                )}

                {selectedReport.resolution_notes && (
                  <div>
                    <Label>Resolution Notes</Label>
                    <p className="text-sm bg-muted p-3 rounded">
                      {selectedReport.resolution_notes}
                    </p>
                  </div>
                )}

                <div>
                  <Label>Reported At</Label>
                  <p className="text-sm">{new Date(selectedReport.created_at).toLocaleString()}</p>
                </div>

                {dialogType === 'resolve' && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <Label>Resolution</Label>
                      <Select value={resolution} onValueChange={(value: 'resolved' | 'dismissed') => setResolution(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="dismissed">Dismissed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Resolution Notes</Label>
                      <Textarea
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        placeholder="Add notes about how this report was handled..."
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {dialogType === 'view' ? 'Close' : 'Cancel'}
              </Button>
              {dialogType === 'resolve' && (
                <Button onClick={handleResolveReport}>
                  {resolution === 'resolved' ? 'Resolve Report' : 'Dismiss Report'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}