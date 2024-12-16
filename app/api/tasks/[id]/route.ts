import { NextRequest, NextResponse } from 'next/server';
import { taskSchema } from '@/lib/validations/task';
import { asyncHandler } from '@/lib/utils/error-handler';
import { getUserIdFromRequest } from '@/lib/utils/auth';
import { AppError } from '@/lib/utils/error-handler';
import connectDB from '@/lib/db';
import Task from '@/lib/models/task.model';

export const GET = asyncHandler(async (req: NextRequest, 
  { params }: { params: { id: string } }) => {
  await connectDB();
  const userId = getUserIdFromRequest(req);
  
  const task = await Task.findOne({
    _id: params.id,
    userId
  });
  
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  
  return NextResponse.json(task);
});

export const PUT = asyncHandler(async (req: NextRequest,
  { params }: { params: { id: string } }) => {
  await connectDB();
  const userId = getUserIdFromRequest(req);
  
  const body = await req.json();
  const validatedData = taskSchema.parse(body);
  
  // If marking as finished, set actualEndTime
  if (validatedData.status === 'finished') {
    validatedData.actualEndTime = new Date();
  }
  
  const task = await Task.findOneAndUpdate(
    { _id: params.id, userId },
    validatedData,
    { new: true }
  );
  
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  
  return NextResponse.json(task);
});

export const DELETE = asyncHandler(async (req: NextRequest,
  { params }: { params: { id: string } }) => {
  await connectDB();
  const userId = getUserIdFromRequest(req);
  
  const task = await Task.findOneAndDelete({
    _id: params.id,
    userId
  });
  
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  
  return NextResponse.json({ message: 'Task deleted successfully' });
});