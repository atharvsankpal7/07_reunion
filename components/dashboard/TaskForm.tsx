"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '@/lib/validations/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TaskFormProps {
  task?: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function TaskForm({ task, isOpen, onClose, onSubmit }: TaskFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: task || {
      status: 'pending',
      priority: 3
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Task title"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message as string}</p>
            )}
          </div>

          <div>
            <Input
              type="datetime-local"
              {...register('startTime')}
            />
            {errors.startTime && (
              <p className="text-sm text-red-500">{errors.startTime.message as string}</p>
            )}
          </div>

          <div>
            <Input
              type="datetime-local"
              {...register('endTime')}
            />
            {errors.endTime && (
              <p className="text-sm text-red-500">{errors.endTime.message as string}</p>
            )}
          </div>

          <div>
            <Select
              {...register('priority')}
              options={[
                { value: '1', label: 'Priority 1' },
                { value: '2', label: 'Priority 2' },
                { value: '3', label: 'Priority 3' },
                { value: '4', label: 'Priority 4' },
                { value: '5', label: 'Priority 5' },
              ]}
            />
            {errors.priority && (
              <p className="text-sm text-red-500">{errors.priority.message as string}</p>
            )}
          </div>

          <div>
            <Select
              {...register('status')}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'finished', label: 'Finished' },
              ]}
            />
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message as string}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}