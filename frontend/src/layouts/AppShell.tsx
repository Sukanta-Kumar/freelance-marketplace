import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileCheck2,
  Compass,
  FolderKanban,
  Users,
  User,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/cn';
import { toast } from 'sonner';

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login', { replace: true });
  };

  const navItems = (() => {
    if (role === 'CLIENT') {
      return [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'My Projects', path: '/projects', icon: Briefcase },
        { label: 'Post Project', path: '/projects/new', icon: PlusCircle },
        { label: 'Contracts', path: '/contracts', icon: FileCheck2 },
      ];
    }
    if (role === 'FREELANCER') {
      return [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Browse Projects', path: '/browse', icon: Compass },
        { label: 'My Bids', path: '/my-bids', icon: FolderKanban },
        { label: 'Contracts', path: '/contracts', icon: FileCheck2 },
      ];
    }
    if (role === 'ADMIN') {
      return [
        { label: 'Overview', path: '/admin', icon: LayoutDashboard },
        { label: 'Freelancers', path: '/admin/freelancers', icon: Users },
        { label: 'All Projects', path: '/admin/projects', icon: Briefcase },
      ];
    }
    return [{ label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }];
  })();

  const roleBadge = role === 'CLIENT' ? 'Client' : role === 'FREELANCER' ? 'Freelancer' : 'Admin';

  return (
    <div className="min-h-screen flex bg-background text-ink font-sans">
      {/* Desktop Sidebar: Flat, text-first, 13px items, 2px left accent bar for active */}
      <aside className="hidden lg:flex w-56 flex-col border-r border-border bg-surface shrink-0 fixed inset-y-0 z-30">
        {/* Header */}
        <div className="h-13 px-4 flex items-center justify-between border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-ink">
              WorkCraft
            </span>
            <span className="text-[10px] font-mono uppercase text-muted-foreground px-1 py-0.5 rounded border border-border">
              {roleBadge}
            </span>
          </Link>
        </div>

        {/* Flat text navigation */}
        <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/dashboard' &&
                item.path !== '/admin' &&
                location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'relative flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium transition-colors select-none',
                  isActive
                    ? 'text-ink font-semibold bg-subtle before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-accent'
                    : 'text-muted-foreground hover:text-ink hover:bg-subtle/60'
                )}
              >
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-ink' : 'text-muted-foreground')} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User bar */}
        <div className="p-2 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between p-1.5 rounded-md hover:bg-subtle text-left transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <UserAvatar name={user?.fullName} email={user?.email} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-ink truncate leading-tight">
                      {user?.fullName || 'User'}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate font-mono">
                      {user?.email || role}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 mb-1">
              <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                Signed in as <strong className="text-ink font-medium">{user?.email}</strong>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="w-3.5 h-3.5 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 lg:pl-56 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-13 border-b border-border bg-surface/95 backdrop-blur-[2px] px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-md hover:bg-subtle text-ink"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Search Placeholder: Quiet linear-style search */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-subtle/80 border border-border text-xs text-muted-foreground w-64">
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">Search projects, contracts...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-4 items-center rounded bg-surface border border-border px-1 font-mono text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="lg:hidden">
              <UserAvatar name={user?.fullName} email={user?.email} size="sm" />
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setMobileMenuOpen(false)}>
            <div
              className="w-56 max-w-[80vw] h-full bg-surface p-3 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="font-semibold text-sm text-ink">WorkCraft</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-md hover:bg-subtle">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <nav className="space-y-0.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium',
                            isActive ? 'bg-subtle text-ink font-semibold' : 'text-muted-foreground hover:bg-subtle'
                          )
                        }
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-3 border-t border-border">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs text-destructive" onClick={handleLogout}>
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Viewport */}
        <main className="flex-1 p-4 sm:p-6 max-w-5xl w-full mx-auto pb-20 lg:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Tab Bar */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-14 border-t border-border bg-surface px-1 flex items-center justify-around">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors',
                  isActive ? 'text-accent font-semibold' : 'text-muted-foreground hover:text-ink'
                )}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="truncate max-w-[60px]">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
