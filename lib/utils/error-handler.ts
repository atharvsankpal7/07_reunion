export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const asyncHandler = (fn: Function) => async (...args: any[]) => {
  try {
    return await fn(...args);
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    
    console.error('Unexpected error:', error);
    throw new AppError(
      'An unexpected error occurred',
      500
    );
  }
};