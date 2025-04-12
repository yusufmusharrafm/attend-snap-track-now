
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
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DepartmentsTable = () => {
  const { departments, addDepartment, getDepartmentStudents } = useData();
  const { canManageDepartments } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newDepartmentCode, setNewDepartmentCode] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // Filter departments based on search query
  const filteredDepartments = searchQuery 
    ? departments.filter(dept => 
        dept.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : departments;
  
  const handleAddDepartment = () => {
    if (!canManageDepartments) {
      toast.error("You don't have permission to add departments");
      return;
    }

    if (!newDepartmentName.trim()) {
      toast.error('Department name cannot be empty');
      return;
    }
    
    if (!newDepartmentCode.trim()) {
      toast.error('Department code cannot be empty');
      return;
    }
    
    // Check if department already exists
    if (departments.some(dept => dept.name.toLowerCase() === newDepartmentName.toLowerCase())) {
      toast.error('Department with this name already exists');
      return;
    }
    
    // Check if department code already exists
    if (departments.some(dept => dept.code.toLowerCase() === newDepartmentCode.toLowerCase())) {
      toast.error('Department with this code already exists');
      return;
    }
    
    addDepartment({ 
      name: newDepartmentName.trim(),
      code: newDepartmentCode.trim()
    });
    
    setNewDepartmentName('');
    setNewDepartmentCode('');
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
        
        {canManageDepartments && (
          <Button onClick={() => setIsAdding(!isAdding)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        )}
      </div>
      
      {isAdding && canManageDepartments && (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 p-4 rounded-md border bg-muted/50">
          <Input
            placeholder="Department name"
            value={newDepartmentName}
            onChange={(e) => setNewDepartmentName(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Department code (e.g. CSE)"
            value={newDepartmentCode}
            onChange={(e) => setNewDepartmentCode(e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
            <Button onClick={handleAddDepartment} className="flex-1 md:flex-initial">Add</Button>
            <Button variant="ghost" onClick={() => setIsAdding(false)} className="flex-1 md:flex-initial">Cancel</Button>
          </div>
        </div>
      )}
      
      <Table>
        <TableCaption>List of all departments</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Department Name</TableHead>
            <TableHead>Code</TableHead>
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
                  <TableCell>{department.code}</TableCell>
                  <TableCell className="text-right">{studentCount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                    {canManageDepartments && (
                      <Button variant="ghost" size="sm">Edit</Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
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
