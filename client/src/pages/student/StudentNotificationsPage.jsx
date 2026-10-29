import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, AlertTriangle, Info, CheckCheck } from 'lucide-react';
import api from '../../services/api.js';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';

export const StudentNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, readAt: new Date() } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date() })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-[#FF4B4B]" />
            Due-Date Alerts & Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Stay informed on loan due dates, return confirmations, and library announcements.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllRead}
            icon={CheckCheck}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        {loading ? (
          <div className="space-y-3 py-4">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You are fully caught up! When you borrow books, reminders will appear here."
          />
        ) : (
          <div className="divide-y divide-[#232A3B]">
            {notifications.map((n) => {
              const isUnread = !n.readAt;
              const isOverdue = n.type === 'OVERDUE';
              const isDueSoon = n.type === 'DUE_SOON';

              return (
                <div
                  key={n._id}
                  className={`py-4 px-3 sm:px-4 rounded-xl transition-colors flex items-start justify-between gap-4 ${
                    isUnread ? 'bg-[#FF4B4B]/10 border border-[#FF4B4B]/20' : 'hover:bg-[#151A24]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isOverdue ? 'bg-rose-500/20 text-rose-400' :
                      isDueSoon ? 'bg-amber-500/20 text-amber-400' : 'bg-[#FF4B4B]/20 text-[#FF4B4B]'
                    }`}>
                      {isOverdue ? <AlertTriangle className="w-4 h-4" /> :
                       isDueSoon ? <Clock className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white">{n.title}</h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#FF4B4B]" />
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-400 block pt-1">
                        {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {isUnread && (
                    <button
                      onClick={() => handleMarkRead(n._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF4B4B] hover:bg-[#151A24] transition-colors shrink-0"
                      title="Mark read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentNotificationsPage;
