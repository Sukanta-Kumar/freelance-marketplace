import React, { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';
import { Save, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user, userId, role, setUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSaving(true);
    try {
      const updated = await authApi.updateUser(userId, { fullName, email });
      setUser(updated);
      toast.success('Profile updated', {
        description: 'Your details were saved successfully.',
      });
    } catch (err) {
      toast.error('Failed to update profile', {
        description: getErrorMessage(err),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Profile Settings"
        description="Manage your identity and communication preferences across the marketplace."
        badge={<StatusBadge status={role || 'CLIENT'} size="sm" />}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <UserAvatar name={user?.fullName} email={user?.email} size="lg" />
            <div>
              <CardTitle>{user?.fullName || 'User Profile'}</CardTitle>
              <CardDescription className="text-xs">
                User ID #{userId} • Account Role: {role}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input
                id="profile-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-email">Email Address</Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="p-3 rounded-btn bg-muted/40 border border-border flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>Role permissions ({role}) are cryptographically signed in your JWT token.</span>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" isLoading={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
