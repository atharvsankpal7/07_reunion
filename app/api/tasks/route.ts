import { NextRequest, NextResponse } from 'next/server';
import { taskSchema } from '@/lib/validations/task';
import { asyncHandler } from '@/lib/utils/error-handler';
import { getUserIdFromRequest } from '@/lib/utils/auth';
import connectDB from '@/lib/db';
import Task from '@/lib/models/task.model';

export const GET = asyncHandler(async (req: NextRequest) => {
  await connectDB();
  const userId = getUserIdFromRequest(req);
  
  const searchParams = req.nextUrl.searchParams;
  const priority = searchParams.get('priority');
  const status = searchParams.get('status');
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;

  const query: any = { userId };
  if (priority) query.priority = parseInt(priority);
  if (status) query.status = status;

  let sortOptions: any = {};
  if (sortBy === 'startTime' || sortBy === 'endTime') {
    sortOptions[sortBy] = sortOrder;
  }

  const tasks = await Task.find(query).sort(sortOptions);
  return NextResponse.json(tasks);
});

export const POST = asyncHandler(async (req: NextRequest) => {
  await connectDB();
  const userId = getUserIdFromRequest(req);
  
  const body = await req.json();
  const validatedData = taskSchema.parse(body);
  
  const task = await Task.create({
    ...validatedData,
    userId
  });
  
  return NextResponse.json(task, { status: 201 });
});