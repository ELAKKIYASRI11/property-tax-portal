import React from 'react';
import { X, Check, Bell, AlertTriangle, FileText, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';

const NotificationDrawer = ({ isOpen, onClose, notifications = [], onNotificationUpdate }) => {
  if (!isOpen) return null;

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      if (onNotificationUpdate) onNotificationUpdate();
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/all/read');
      if (onNotificationUpdate) onNotificationUpdate();
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'assessment_due':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'overdue_alert':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'grievance_status':
        return <FileText className="w-4 h-4 text-brand-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose}></div>
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-400" />
              <h2 className="font-semibold text-base">Municipal Alerts & Notifications</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">{notifications.length} Total Alerts</span>
            <button
              onClick={markAllRead}
              className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No new municipal notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3.5 rounded-xl border transition ${
                    n.isRead
                      ? 'bg-white border-slate-200 text-slate-600'
                      : 'bg-brand-50/50 border-brand-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">{getIcon(n.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold">{n.title}</h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      {!n.isRead && (
                        <button
                          onClick={() => markRead(n._id)}
                          className="mt-2 text-[11px] text-brand-600 hover:text-brand-700 font-semibold"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
