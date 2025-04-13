
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for the charts
const weeklyData = [
  { name: "Mon", attendance: 85, absences: 15 },
  { name: "Tue", attendance: 90, absences: 10 },
  { name: "Wed", attendance: 82, absences: 18 },
  { name: "Thu", attendance: 88, absences: 12 },
  { name: "Fri", attendance: 75, absences: 25 },
];

const monthlyData = [
  { name: "Week 1", attendance: 88, absences: 12 },
  { name: "Week 2", attendance: 85, absences: 15 },
  { name: "Week 3", attendance: 90, absences: 10 },
  { name: "Week 4", attendance: 92, absences: 8 },
];

const departmentData = [
  { name: "Computer Science", value: 92 },
  { name: "Electrical Engineering", value: 85 },
  { name: "Mechanical Engineering", value: 78 },
  { name: "Civil Engineering", value: 88 },
  { name: "Physics", value: 82 },
];

const AttendanceAnalytics = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill={fill} className="text-base font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#999" className="text-sm">
          {`${value}% (${(percent * 100).toFixed(2)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Summary</CardTitle>
              <CardDescription>Attendance data for the current week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendance" name="Present (%)" fill="#10b981" />
                    <Bar dataKey="absences" name="Absent (%)" fill="#f43f5e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Trends</CardTitle>
              <CardDescription>Attendance trends for the current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="attendance" name="Present (%)" stroke="#10b981" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="absences" name="Absent (%)" stroke="#f43f5e" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Department</CardTitle>
              <CardDescription>Attendance percentages across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceAnalytics;
