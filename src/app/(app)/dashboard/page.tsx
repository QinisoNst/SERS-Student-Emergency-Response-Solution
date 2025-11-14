'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowRight, Frown, HeartPulse, ShieldAlert, Siren, Flame } from 'lucide-react';
import { collection, query, where } from 'firebase/firestore';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/PageHeader';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';

const incidentTypes = [
  { name: 'Fire', icon: Flame, color: 'text-red-500', phoneNumber: '10177' },
  { name: 'Medical', icon: HeartPulse, color: 'text-blue-500', phoneNumber: '10177' },
  { name: 'GBV', icon: ShieldAlert, color: 'text-purple-500', phoneNumber: '0800 428 428' },
  { name: 'Bullying', icon: Frown, color: 'text-yellow-500', phoneNumber: '0800 055 555' },
  { name: 'Crime', icon: Siren, color: 'text-orange-500', phoneNumber: '10111' },
];

interface IncidentReport {
  id: string;
  incidentType: string;
  locationDetails: string;
  status: 'New' | 'Acknowledged' | 'Resolved';
}

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userIncidentsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'incidentReports'),
      where('userId', '==', user.uid)
    );
  }, [firestore, user]);

  const { data: userIncidents, isLoading } = useCollection<IncidentReport>(userIncidentsQuery);

  const recentUserIncidents = userIncidents?.slice(0, 3) || [];

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <PageHeader title="Dashboard" description="Welcome back. Stay safe on campus." />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-primary text-primary-foreground border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold">Emergency?</CardTitle>
            <AlertTriangle className="h-6 w-6" />
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you are in immediate danger, please contact emergency services first. Then, report the incident here to alert campus staff.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/report">
                Report an Incident <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Your Recent Reports</CardTitle>
              <CardDescription>
                Status of your most recently filed incident reports.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="#">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Loading your reports...</TableCell>
                  </TableRow>
                )}
                {!isLoading && recentUserIncidents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">You have not reported any incidents.</TableCell>
                  </TableRow>
                )}
                {!isLoading && recentUserIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>
                      <div className="font-medium">{incident.incidentType}</div>
                    </TableCell>
                    <TableCell>{incident.locationDetails}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={incident.status === 'New' ? 'destructive' : incident.status === 'Acknowledged' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {incident.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Know What to Report</CardTitle>
            <CardDescription>
              Familiarize yourself with the types of incidents you can report.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {incidentTypes.map((type) => (
              <div key={type.name} className="flex items-center justify-between gap-4 p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <type.icon className={`h-6 w-6 ${type.color}`} />
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {type.name}
                    </p>
                  </div>
                </div>
                <a href={`tel:${type.phoneNumber}`} className="text-sm font-mono text-muted-foreground hover:text-foreground">
                    {type.phoneNumber}
                </a>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
