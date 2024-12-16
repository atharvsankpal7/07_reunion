"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { TaskStats as TaskStatsType } from '@/types';

export function TaskStats() {
  const [stats, setStats] = useState<TaskStatsType | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/api/tasks/stats');
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return null;

  const priorityData = Object.entries(stats.priorityStats).map(([priority, times]) => ({
    priority: `P${priority}`,
    elapsed: times.elapsed,
    remaining: times.remaining
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Total Tasks</h3>
        <p className="text-3xl font-bold">{stats.totalTasks}</p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Completion Rate</h3>
        <p className="text-3xl font-bold">{stats.completionRate}%</p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Average Completion Time</h3>
        <p className="text-3xl font-bold">{stats.timeStats.averageCompletionTime}h</p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Remaining Time</h3>
        <p className="text-3xl font-bold">{stats.timeStats.remainingEstimatedTime}h</p>
      </Card>

      <Card className="p-4 md:col-span-2 lg:col-span-4">
        <h3 className="text-lg font-semibold mb-4">Time by Priority</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="elapsed" name="Elapsed Time (h)" fill="hsl(var(--chart-1))" />
              <Bar dataKey="remaining" name="Remaining Time (h)" fill="hsl(var(--chart-2))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}