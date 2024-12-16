export interface JWTPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  timeStats: {
    totalElapsedTime: number;
    remainingEstimatedTime: number;
    averageCompletionTime: number;
  };
  priorityStats: {
    [key: number]: {
      elapsed: number;
      remaining: number;
    };
  };
}