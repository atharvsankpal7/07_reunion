import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations/auth';
import { asyncHandler } from '@/lib/utils/error-handler';
import { signToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db';
import User from '@/lib/models/user.model';

export const POST = asyncHandler(async (req: NextRequest) => {
  await connectDB();
  
  const body = await req.json();
  const validatedData = registerSchema.parse(body);
  
  const existingUser = await User.findOne({ email: validatedData.email });
  if (existingUser) {
    return NextResponse.json(
      { error: 'Email already registered' },
      { status: 400 }
    );
  }
  
  const user = await User.create(validatedData);
  
  const token = signToken({
    userId: user._id.toString(),
    email: user.email
  });
  
  return NextResponse.json({
    token,
    user: {
      id: user._id,
      email: user.email
    }
  })
});