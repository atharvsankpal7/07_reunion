import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations/auth';
import { asyncHandler } from '@/lib/utils/error-handler';
import { signToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db';
import User from '@/lib/models/user.model';

export const POST = asyncHandler(async (req: NextRequest) => {
  await connectDB();
  
  const body = await req.json();
  const validatedData = loginSchema.parse(body);
  
  const user = await User.findOne({ email: validatedData.email });
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
  
  const isValidPassword = await user.comparePassword(validatedData.password);
  if (!isValidPassword) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
  
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
  });
});