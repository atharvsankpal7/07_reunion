"use client";

import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface TaskFiltersProps {
  onFilterChange: (type: string, value: string) => void;
  onSortChange: (field: string, order: string) => void;
  onClearFilters: () => void;
}

export function TaskFilters({ 
  onFilterChange, 
  onSortChange,
  onClearFilters 
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select
        onValueChange={(value) => onFilterChange('priority', value)}
        options={[
          { value: '', label: 'All Priorities' },
          { value: '1', label: 'Priority 1' },
          { value: '2', label: 'Priority 2' },
          { value: '3', label: 'Priority 3' },
          { value: '4', label: 'Priority 4' },
          { value: '5', label: 'Priority 5' },
        ]}
      />

      <Select
        onValueChange={(value) => onFilterChange('status', value)}
        options={[
          { value: '', label: 'All Status' },
          { value: 'pending', label: 'Pending' },
          { value: 'finished', label: 'Finished' },
        ]}
      />

      <Select
        onValueChange={(value) => {
          const [field, order] = value.split(':');
          onSortChange(field, order);
        }}
        options={[
          { value: '', label: 'Sort By' },
          { value: 'startTime:asc', label: 'Start Time (Asc)' },
          { value: 'startTime:desc', label: 'Start Time (Desc)' },
          { value: 'endTime:asc', label: 'End Time (Asc)' },
          { value: 'endTime:desc', label: 'End Time (Desc)' },
        ]}
      />

      <Button variant="outline" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
}