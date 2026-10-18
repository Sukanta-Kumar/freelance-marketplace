import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginSchema, LoginFormValues } from '../schemas/authSchemas';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getErrorMessage } from '@/lib/errors';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(values);
      setAuth(response.token, {
        id: response.id || 1,
        fullName: response.fullName || 'User',
        email: response.email || values.email,
        role: response.role || 'CLIENT',
      });

      if (response.id) {
        try {
          const profile = await authApi.getUserById(response.id);
          setUser(profile);
        } catch {
          // Fall back gracefully
        }
      }

      toast.success('Signed in successfully');

      if (onSuccess) {
        onSuccess();
      } else {
        const targetRoute = response.role === 'ADMIN' ? '/admin' : '/dashboard';
        navigate(targetRoute, { replace: true });
      }
    } catch (err) {
      toast.error('Unable to sign in', {
        description: getErrorMessage(err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const autofill = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
  };

  return (
    <div className="space-y-5">
      {/* Demo Credentials Quick Switcher */}
      <div className="p-3 rounded-md bg-subtle border border-border">
        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Demo quick-fill
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => autofill('client@workcraft.io', 'password123')}
            className="text-xs px-2 py-1 rounded bg-surface hover:bg-muted border border-border text-ink font-mono transition-colors"
          >
            Client (Rahul)
          </button>
          <button
            type="button"
            onClick={() => autofill('priya@workcraft.io', 'password123')}
            className="text-xs px-2 py-1 rounded bg-surface hover:bg-muted border border-border text-ink font-mono transition-colors"
          >
            Freelancer (Priya)
          </button>
          <button
            type="button"
            onClick={() => autofill('admin@workcraft.io', 'password123')}
            className="text-xs px-2 py-1 rounded bg-surface hover:bg-muted border border-border text-ink font-mono transition-colors"
          >
            Admin
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
        <div className="space-y-1">
          <Label htmlFor="email" className="text-xs font-medium">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            error={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-[11px] text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-xs font-medium">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-[11px] text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
          size="lg"
          isLoading={isLoading}
        >
          Sign in to your account
        </Button>
      </form>
    </div>
  );
}
