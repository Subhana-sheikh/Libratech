import React, { useState, useEffect } from 'react';
import { History, Search, Shield, Clock } from 'lucide-react';
import api from '../../services/api.js';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { TableSkeleton } from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export const AdminActivityPage = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/admin/activity', { page, limit: 20 })
      .then(res => {
        if (res.success) {
          setLogs(res.data || []);
          if (res.pagination) setPagination(res.pagination);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <History className="w-6 h-6 text-[#FF4B4B]" />
          System Audit & Activity Trail
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Immutable audit record of all authentication, circulation, inventory, and policy actions.
        </p>
      </div>

      <Card>
        {loading ? (
          <TableSkeleton rows={6} />
        ) : logs.length === 0 ? (
          <EmptyState
            icon={History}
            title="No audit events logged"
            description="System activity and staff transactions will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#232A3B] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Timestamp</th>
                  <th className="pb-3 px-3">Actor</th>
                  <th className="pb-3 px-3">Action</th>
                  <th className="pb-3 px-3">Entity</th>
                  <th className="pb-3 px-3">Details / Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232A3B]">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#151A24]/90 transition-colors">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString([], {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {log.actorUserId ? (
                        <div>
                          <span>{log.actorUserId.name}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {log.actorUserId.role}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">System</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          log.action.includes('ISSUE') ? 'info' :
                          log.action.includes('RETURN') ? 'success' :
                          log.action.includes('DELETE') ? 'danger' : 'neutral'
                        }
                        size="sm"
                      >
                        {log.action}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {log.entityType}
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate font-mono text-[11px]">
                      {JSON.stringify(log.metadata || {})}
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
    </div>
  );
};

export default AdminActivityPage;
