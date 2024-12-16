import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler } from '@/lib/utils/error-handler';
import { getUserIdFromRequest } from '@/lib/utils/auth';
import connectDB from '@/lib/db';
import Task from '@/lib/models/task.model';

export const GET = asyncHandler(async (req: NextRequest) => {
  await connectDB();
  const userId = getUserIdFromRequest(req);
  const now = new Date();

  const stats = await Task.aggregate([
    // Match user's tasks
    { $match: { userId: userId } },
    
    // Calculate basic stats
    {
      $facet: {
        // Task counts
        counts: [
          {
            $group: {
              _id: null,
              totalTasks: { $sum: 1 },
              completedTasks: {
                $sum: { $cond: [{ $eq: ['$status', 'finished'] }, 1, 0] }
              },
              pendingTasks: {
                $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
              }
            }
          }
        ],
        
        // Time calculations for completed tasks
        completedTimeStats: [
          { $match: { status: 'finished' } },
          {
            $group: {
              _id: null,
              totalCompletionTime: {
                $sum: { 
                  $divide: [
                    { $subtract: ['$actualEndTime', '$startTime'] },
                    3600000 // Convert to hours
                  ]
                }
              },
              taskCount: { $sum: 1 }
            }
          }
        ],
        
        // Time calculations for pending tasks by priority
        pendingTimeStats: [
          { $match: { status: 'pending' } },
          {
            $group: {
              _id: '$priority',
              elapsedTime: {
                $sum: {
                  $divide: [
                    { $subtract: [now, '$startTime'] },
                    3600000
                  ]
                }
              },
              remainingTime: {
                $sum: {
                  $max: [
                    {
                      $divide: [
                        { $subtract: ['$endTime', now] },
                        3600000
                      ]
                    },
                    0
                  ]
                }
              }
            }
          }
        ]
      }
    }
  ]);

  const [aggregatedStats] = stats;
  const [countStats] = aggregatedStats.counts;
  const [completedStats] = aggregatedStats.completedTimeStats;

  const priorityStats = aggregatedStats.pendingTimeStats.reduce((acc: any, stat) => {
    acc[stat._id] = {
      elapsed: parseFloat(stat.elapsedTime.toFixed(2)),
      remaining: parseFloat(stat.remainingTime.toFixed(2))
    };
    return acc;
  }, {});

  return NextResponse.json({
    totalTasks: countStats?.totalTasks || 0,
    completedTasks: countStats?.completedTasks || 0,
    pendingTasks: countStats?.pendingTasks || 0,
    completionRate: countStats ? 
      (countStats.completedTasks / countStats.totalTasks * 100).toFixed(2) : 0,
    timeStats: {
      averageCompletionTime: completedStats ? 
        (completedStats.totalCompletionTime / completedStats.taskCount).toFixed(2) : 0,
      totalElapsedTime: Object.values(priorityStats)
        .reduce((sum: number, stat: any) => sum + stat.elapsed, 0),
      remainingEstimatedTime: Object.values(priorityStats)
        .reduce((sum: number, stat: any) => sum + stat.remaining, 0)
    },
    priorityStats
  });
});