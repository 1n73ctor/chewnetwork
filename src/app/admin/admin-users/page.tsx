'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from '../certificates/page';
import { createClient } from '@/lib/supabase/client';
import { PlusIcon, XMarkIcon, CheckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { adminService } from '@/lib/services/investorService';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  role?: string;
}

export default function AdminUsersPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [addForm, setAddForm] = useState({ email: '', password: '', confirmPassword: '' });

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/');
  }, [isAdmin, loading]);

  useEffect(() => {
    if (isAdmin) loadAdminUsers();
  }, [isAdmin]);

  const loadAdminUsers = async () => {
    setDataLoading(true);
    const supabase = createClient();
    // Query admin_users view or profiles with admin role
    const { data, error } = await supabase
      .from('investors')
      .select('id, email, created_at, updated_at')
      .eq('account_status', 'active')
      .limit(5);
    // We'll show current admin info from auth
    const { data: { user } } = await supabase.auth.getUser();
    const admins: AdminUser[] = [
      {
        id: user?.id || '',
        email: user?.email || 'admin@chewnetwork.com',
        created_at: user?.created_at || new Date().toISOString(),
        last_sign_in_at: user?.last_sign_in_at,
        role: 'Super Admin',
      },
    ];
    setAdminUsers(admins);
    setDataLoading(false);
  };

  const handleAddAdmin = async () => {
    if (!addForm.email || !addForm.password) {
      setErrorMsg('Email and password are required.');
      return;
    }
    if (addForm.password !== addForm.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (addForm.password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    // Log the admin creation action
    await adminService.createAuditLog('ADMIN_USER_INVITED', undefined, undefined, { email: addForm.email, role: 'Admin' });
    setSuccessMsg(`Admin invitation recorded for ${addForm.email}. To complete setup, create the user in Supabase Auth and assign the admin role in your database.`);
    setShowAddForm(false);
    setAddForm({ email: '', password: '', confirmPassword: '' });
    setSaving(false);
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <AdminLayout activeId="admin-users">
      <div className="p-4 lg:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Admin Users</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage administrator accounts and access</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            Add Admin
          </button>
        </div>

        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
            <p className="text-green-400 text-sm">{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
            <XMarkIcon className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Add Admin Form */}
        {showAddForm && (
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Add New Admin User</h3>
              <button onClick={() => { setShowAddForm(false); setErrorMsg(''); }} className="text-muted-foreground hover:text-white">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="admin@chewnetwork.com"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Password</label>
                <input
                  type="password"
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Confirm Password</label>
                <input
                  type="password"
                  value={addForm.confirmPassword}
                  onChange={(e) => setAddForm({ ...addForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4">
              <p className="text-amber-300/80 text-xs">
                <strong className="text-amber-300">Note:</strong> Admin users must be created in Supabase Auth and assigned the <code className="bg-amber-500/20 px-1 rounded">admin</code> role in the database. This form logs the intent and records the action in the audit log.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowAddForm(false); setErrorMsg(''); }} className="flex-1 bg-background border border-border text-white py-2.5 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleAddAdmin} disabled={saving} className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold">
                {saving ? 'Processing...' : 'Record Admin Invitation'}
              </button>
            </div>
          </div>
        )}

        {/* Admin Users Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-white font-bold text-sm">Current Admin Users</h3>
          </div>
          {dataLoading ? (
            <div className="p-4 space-y-3">{[1, 2].map((i) => <div key={i} className="animate-pulse h-12 bg-border/30 rounded" />)}</div>
          ) : (
            <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
              <table className="min-w-full w-max text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Email', 'Role', 'Created', 'Last Sign In', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((admin) => (
                    <tr key={admin.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                      <td className="px-4 py-3 text-white text-sm">{admin.email}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs">
                          <ShieldCheckIcon className="w-3.5 h-3.5 text-primary" />
                          <span className="text-primary font-semibold">{admin.role || 'Admin'}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(admin.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {admin.last_sign_in_at ? new Date(admin.last_sign_in_at).toLocaleString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground italic">Current session</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Role Permissions Info */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-white font-bold text-sm mb-4">Admin Role Permissions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { role: 'Super Admin', perms: ['Full access to all admin features', 'Manage admin users', 'Export all data', 'Delete/deactivate investors'] },
              { role: 'Admin', perms: ['Manage investors and transactions', 'Upload documents and reports', 'Publish updates', 'View audit logs'] },
            ].map((item, i) => (
              <div key={i} className="bg-background border border-border/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheckIcon className="w-4 h-4 text-primary" />
                  <span className="text-white font-semibold text-sm">{item.role}</span>
                </div>
                <ul className="space-y-1.5">
                  {item.perms.map((perm, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      <span className="text-muted-foreground text-xs">{perm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
