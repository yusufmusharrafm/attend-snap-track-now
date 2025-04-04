
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, School, QrCode } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const AdminStats = () => {
  const { students, departments, classes } = useData();
  
  const statsData = [
    {
      title: 'Total Students',
      value: students.length,
      description: 'Registered students',
      icon: <Users className="h-5 w-5 text-blue-500" />,
      change: '+12%',
      increasing: true
    },
    {
      title: 'Total Departments',
      value: departments.length,
      description: 'Active departments',
      icon: <School className="h-5 w-5 text-indigo-500" />,
      change: '+2',
      increasing: true
    },
    {
      title: 'Total Classes',
      value: classes?.length || 0,
      description: 'Ongoing classes',
      icon: <GraduationCap className="h-5 w-5 text-green-500" />,
      change: '+5',
      increasing: true
    },
    {
      title: 'QR Scans',
      value: '1,234',
      description: 'Last 30 days',
      icon: <QrCode className="h-5 w-5 text-orange-500" />,
      change: '+24%',
      increasing: true
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className="bg-muted/50 h-8 w-8 rounded-full flex items-center justify-center">
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
            <div className={`text-xs flex items-center mt-2 ${
              stat.increasing ? 'text-green-500' : 'text-red-500'
            }`}>
              {stat.increasing ? '↑' : '↓'} {stat.change} from last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
