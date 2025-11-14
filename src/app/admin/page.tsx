'use client';

import { MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { collection } from 'firebase/firestore';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/PageHeader';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';

// Define the shape of an incident report from Firestore
interface IncidentReport {
  id: string;
  incidentType: string;
  status: 'New' | 'Acknowledged' | 'Resolved';
  userId: string;
  reportDateTime: string;
}

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  // Memoize the query to prevent re-renders
  const incidentReportsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'incidentReports');
  }, [firestore]);

  // Fetch the collection data
  const { data: incidents, isLoading } = useCollection<IncidentReport>(incidentReportsQuery);

  return (
    <>
      <PageHeader title="Incidents" description="Manage and respond to all reported incidents on campus." />
      
      <Card>
        <CardHeader>
          <CardTitle>Incident Reports</CardTitle>
          <CardDescription>
            A list of all incidents reported by students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Student ID</TableHead>
                <TableHead className="hidden md:table-cell">Reported</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading incidents...</TableCell>
                </TableRow>
              )}
              {!isLoading && incidents?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No incidents reported yet.</TableCell>
                </TableRow>
              )}
              {incidents?.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.incidentType}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={incident.status === 'New' ? 'destructive' : incident.status === 'Acknowledged' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {incident.status?.toLowerCase() || 'new'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {incident.userId}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDistanceToNow(new Date(incident.reportDateTime), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Acknowledge</DropdownMenuItem>
                        <DropdownMenuItem>Resolve</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
