import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { registerSchema, RegisterFormValues } from '../schemas/authSchemas';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getErrorMessage } from '@/lib/errors';
import { cn } from '@/lib/cn';

export function RegisterForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      role: 'CLIENT',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await authApi.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      setAuth(response.token, {
        id: response.id || Date.now(),
        fullName: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        role: values.role,
      });

      toast.success('Account created successfully');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error('Registration failed', {
        description: getErrorMessage(err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Role Picker: Flat, high-information density cards */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Account type</Label>
        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          <button
            type="button"
            onClick={() => setValue('role', 'CLIENT', { shouldValidate: true })}
            className={cn(
              'p-3 rounded-lg border text-left transition-colors cursor-pointer',
              selectedRole === 'CLIENT'
                ? 'border-ink bg-subtle text-ink font-medium ring-1 ring-ink'
                : 'border-border bg-surface text-muted-foreground hover:border-border/80 hover:bg-subtle/50'
            )}
          >
            <div className="text-sm font-semibold text-ink">Client</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Post projects and release milestone escrow payments
            </div>
          </button>

          <button
            type="button"
            onClick={() => setValue('role', 'FREELANCER', { shouldValidate: true })}
            className={cn(
              'p-3 rounded-lg border text-left transition-colors cursor-pointer',
              selectedRole === 'FREELANCER'
                ? 'border-ink bg-subtle text-ink font-medium ring-1 ring-ink'
                : 'border-border bg-surface text-muted-foreground hover:border-border/80 hover:bg-subtle/50'
            )}
          >
            <div className="text-sm font-semibold text-ink">Freelancer</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Submit bids, execute contracts, and receive payouts
            </div>
          </button>
        </div>
        {errors.role && (
          <p className="text-[11px] text-destructive">{errors.role.message}</p>
        )}
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <Label htmlFor="firstName" className="text-xs font-medium">First name</Label>
          <Input
            id="firstName"
            placeholder="Vikram"
            error={!!errors.firstName}
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="text-[11px] text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="lastName" className="text-xs font-medium">Last name</Label>
          <Input
            id="lastName"
            placeholder="Malhotra"
            error={!!errors.lastName}
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="text-[11px] text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Label htmlFor="reg-email" className="text-xs font-medium">Email address</Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="vikram@company.com"
          error={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-[11px] text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <Label htmlFor="reg-password" className="text-xs font-medium">Password (min. 6 characters)</Label>
        <Input
          id="reg-password"
          type="password"
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
        Create {selectedRole === 'CLIENT' ? 'client' : 'freelancer'} account
      </Button>
    </form>
  );
}
