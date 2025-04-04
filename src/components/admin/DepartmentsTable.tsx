
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

const DepartmentsTable = () => {
  const { departments, addDepartment, getDepartmentStudents } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // Filter departments based on search query
  const filteredDepartments = searchQuery 
    ? departments.filter(dept => 
        dept.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : departments;
  
  const handleAddDepartment = () => {
    if (!newDepartmentName.trim()) {
      toast.error('Department name cannot be empty');
      return;
    }
    
    // Check if department already exists
    if (departments.some(dept => dept.name.toLowerCase() === newDepartmentName.toLowerCase())) {
      toast.error('Department with this name already exists');
      return;
    }
    
    addDepartment({ name: newDepartmentName.trim() });
    setNewDepartmentName('');
    setIsAdding(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search departments..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>
      
      {isAdding && (
        <div className="flex items-center gap-2 p-4 rounded-md border bg-muted/50">
          <Input
            placeholder="Department name"
            value={newDepartmentName}
            onChange={(e) => setNewDepartmentName(e.target.value)}
          />
          <Button onClick={handleAddDepartment}>Add</Button>
          <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
        </div>
      )}
      
      <Table>
        <TableCaption>List of all departments</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Department Name</TableHead>
            <TableHead className="text-right">Students</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map(department => {
              const studentCount = getDepartmentStudents(department.id).length;
              
              return (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell className="text-right">{studentCount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                {searchQuery ? 'No departments found matching your search' : 'No departments added yet'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DepartmentsTable;
