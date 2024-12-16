"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export function RegisterForm() {
  const [error, setError] = useState('');
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error);
      
      // Store token in cookie
      document.cookie = `token=${json.token}; path=/`;
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          {...register('email')}
          className="w-full"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message as string}</p>
        )}
      </div>
      
      <div>
        <Input
          type="password"
          placeholder="Password"
          {...register('password')}
          className="w-full"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message as string}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      
      <Button type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
}