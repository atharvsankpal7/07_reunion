"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TaskFilters } from './TaskFilters';
import { Edit, Trash2 } from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  priority: number;
  status: 'pending' | 'finished';
}

interface TaskListProps {
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskList({ onEdit, onDelete }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    sortBy: '',
    sortOrder: ''
  });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    const params = new URLSearchParams();
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.status) params.append('status', filters.status);
    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);
    }

    const res = await fetch(`/api/tasks?${params}`);
    const data = await res.json();
    setTasks(data);
  };

  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleSortChange = (field: string, order: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: order
    }));
  };

  const clearFilters = () => {
    setFilters({
      priority: '',
      status: '',
      sortBy: '',
      sortOrder: ''
    });
  };

  return (
    <div>
      <TaskFilters
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onClearFilters={clearFilters}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task._id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>P{task.priority}</TableCell>
              <TableCell>
                <span className={`capitalize ${
                  task.status === 'finished' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {task.status}
                </span>
              </TableCell>
              <TableCell>{format(new Date(task.startTime), 'PPp')}</TableCell>
              <TableCell>{format(new Date(task.endTime), 'PPp')}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(task)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(task._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}