import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
import { mockIncidents } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader title="Incidents" description="Manage and respond to all reported incidents on campus.">
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Incident
          </span>
        </Button>
      </PageHeader>
      
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
                <TableHead className="hidden md:table-cell">Student</TableHead>
                <TableHead className="hidden md:table-cell">Reported</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.type}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={incident.status === 'New' ? 'destructive' : incident.status === 'Acknowledged' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {incident.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {incident.student.name} ({incident.student.id})
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDistanceToNow(incident.reportedAt, { addSuffix: true })}
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
