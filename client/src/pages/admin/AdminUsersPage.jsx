import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, UserCheck, UserX, Edit2 } from 'lucide-react';
import api from '../../services/api.js';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Modal from '../../components/ui/Modal.jsx';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog.jsx';
import { TableSkeleton } from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Alert from '../../components/ui/Alert.jsx';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Role edit modal state
  const [userForRole, setUserForRole] = useState(null);
  const [newRole, setNewRole] = useState('STUDENT');

  // Status toggle confirmation
  const [userToToggle, setUserToToggle] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', {
        role: roleFilter !== 'all' ? roleFilter : '',
        status: statusFilter !== 'all' ? statusFilter : '',
        search,
        page,
        limit: 15
      });
      if (res.success) {
        setUsers(res.data || []);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, search, page]);

  const handleRoleChange = async () => {
    if (!userForRole) return;
    setSubmitting(true);
    try {
      const res = await api.patch(`/users/${userForRole._id}/role`, { role: newRole });
      if (res.success) {
        setFeedback(`Role updated to ${newRole} for ${userForRole.name}.`);
        setUserForRole(null);
        fetchUsers();
      }
    } catch (err) {
      setFeedback(`Role update error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!userToToggle) return;
    setSubmitting(true);
    try {
      const res = await api.patch(`/users/${userToToggle._id}/status`, {
        isActive: !userToToggle.isActive
      });
      if (res.success) {
        setFeedback(`Account status updated for ${userToToggle.name}.`);
        setUserToToggle(null);
        fetchUsers();
      }
    } catch (err) {
      setFeedback(`Status update error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          User & Role Administration
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Inspect student profiles, change role permissions, and toggle access states.
        </p>
      </div>

      {feedback && (
        <Alert type="info" onClose={() => setFeedback('')}>
          {feedback}
        </Alert>
      )}

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, email, or student ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#151A24] text-white rounded-xl border border-[#232A3B] focus:outline-none focus:border-[#FF4B4B] placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="text-xs py-2 px-3 bg-[#151A24] text-white border border-[#232A3B] rounded-xl font-medium focus:border-[#FF4B4B]"
          >
            <option value="all">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="LIBRARIAN">Librarians</option>
            <option value="ADMIN">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-xs py-2 px-3 bg-[#151A24] text-white border border-[#232A3B] rounded-xl font-medium focus:border-[#FF4B4B]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Card>
        {loading ? (
          <TableSkeleton rows={5} />
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="No user accounts match the current filter selection."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#232A3B] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Name</th>
                  <th className="pb-3 px-3">Email Address</th>
                  <th className="pb-3 px-3">Student ID</th>
                  <th className="pb-3 px-3">Department</th>
                  <th className="pb-3 px-3">Role</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232A3B]">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#151A24]/90 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">
                      {u.name}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {u.email}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {u.studentId || '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {u.department || '—'}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          u.role === 'ADMIN' ? 'purple' :
                          u.role === 'LIBRARIAN' ? 'info' : 'neutral'
                        }
                        size="sm"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={u.isActive ? 'success' : 'danger'}
                        size="sm"
                        dot
                      >
                        {u.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        onClick={() => { setUserForRole(u); setNewRole(u.role); }}
                        className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Change Role"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setUserToToggle(u)}
                        className={`p-1 transition-colors ${u.isActive ? 'text-slate-400 hover:text-rose-600' : 'text-slate-400 hover:text-emerald-600'}`}
                        title={u.isActive ? 'Deactivate User' : 'Reactivate User'}
                      >
                        {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          onPageChange={(p) => setPage(p)}
        />
      </Card>

      {/* Role Change Modal */}
      {userForRole && (
        <Modal
          isOpen={true}
          onClose={() => setUserForRole(null)}
          title={`Update Role for ${userForRole.name}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Select the new access role for <strong>{userForRole.email}</strong>. Privileges are applied immediately upon next server request.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Role Assignment
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-slate-200 text-sm"
              >
                <option value="STUDENT">STUDENT (Catalogue, Loans, Fines, Saved)</option>
                <option value="LIBRARIAN">LIBRARIAN (Circulation Desk, Issue/Return, Scan)</option>
                <option value="ADMIN">ADMIN (Full Access, User & Settings Control)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setUserForRole(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleRoleChange} loading={submitting}>
                Save Role
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Status Toggle Confirmation */}
      <ConfirmationDialog
        isOpen={!!userToToggle}
        onClose={() => setUserToToggle(null)}
        onConfirm={handleStatusToggle}
        title={userToToggle?.isActive ? 'Deactivate User Account' : 'Reactivate User Account'}
        message={`Are you sure you want to ${userToToggle?.isActive ? 'deactivate' : 'reactivate'} the account for ${userToToggle?.name}? ${userToToggle?.isActive ? 'They will no longer be able to borrow books or sign in.' : 'They will regain access to their portal.'}`}
        confirmText={userToToggle?.isActive ? 'Deactivate Account' : 'Reactivate Account'}
        variant={userToToggle?.isActive ? 'danger' : 'primary'}
        loading={submitting}
      />

    </div>
  );
};

export default AdminUsersPage;
