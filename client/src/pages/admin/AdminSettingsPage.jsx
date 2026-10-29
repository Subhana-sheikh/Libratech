import React, { useState, useEffect } from 'react';
import { Settings, Shield, Bell, CheckCircle2, Save, Play } from 'lucide-react';
import api from '../../services/api.js';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Alert from '../../components/ui/Alert.jsx';

export const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    loanDurationDays: 14,
    gracePeriodDays: 0,
    finePerDay: 5,
    maxFine: 500,
    maxBooksPerStudent: 4,
    timezone: 'Asia/Kolkata',
    libraryName: 'Libratech Central University Library',
    contactEmail: 'support@libratech.edu'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [triggeringJob, setTriggeringJob] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/admin/settings')
      .then(res => {
        if (res.success && res.data) {
          setSettings(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setSettings(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await api.patch('/admin/settings', settings);
      if (res.success) {
        setMessage('Library circulation and policy settings updated successfully.');
      }
    } catch (err) {
      setMessage(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerReminders = async () => {
    setTriggeringJob(true);
    setMessage('');
    try {
      const res = await api.post('/notifications/test-reminders');
      if (res.success) {
        setMessage(`Reminder scan executed manually: ${res.data.generatedCount} notification(s) generated without duplicates.`);
      }
    } catch (err) {
      setMessage(`Job execution failed: ${err.message}`);
    } finally {
      setTriggeringJob(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#FF4B4B]" />
          Circulation Policy & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure authoritative loan durations, fine formulas, borrowing limits, and automated jobs.
        </p>
      </div>

      {message && (
        <Alert type="info" onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Circulation Rules Card */}
        <Card>
          <CardHeader
            title="Circulation & Lending Policy"
            subtitle="Authoritative server rules applied across all student loans."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Standard Loan Duration (Days)"
              name="loanDurationDays"
              type="number"
              min="1"
              value={settings.loanDurationDays}
              onChange={handleChange}
              required
            />

            <Input
              label="Borrowing Limit per Student (Books)"
              name="maxBooksPerStudent"
              type="number"
              min="1"
              max="20"
              value={settings.maxBooksPerStudent}
              onChange={handleChange}
              required
            />
          </div>
        </Card>

        {/* Fine Calculation Formula Card */}
        <Card>
          <CardHeader
            title="Overdue Fine Calculation Rules"
            subtitle="Configures daily rates, grace boundaries, and legal fee caps."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Daily Overdue Fine (₹)"
              name="finePerDay"
              type="number"
              min="0"
              value={settings.finePerDay}
              onChange={handleChange}
              required
            />

            <Input
              label="Grace Period (Calendar Days)"
              name="gracePeriodDays"
              type="number"
              min="0"
              helperText="Days after due date before fines apply"
              value={settings.gracePeriodDays}
              onChange={handleChange}
              required
            />

            <Input
              label="Maximum Fine Cap (₹ / Book)"
              name="maxFine"
              type="number"
              min="0"
              value={settings.maxFine}
              onChange={handleChange}
              required
            />
          </div>
        </Card>

        {/* Institutional Metadata Card */}
        <Card>
          <CardHeader
            title="Institution Metadata & Timezone"
            subtitle="Calendar calculation timezone and support contact."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="University / Library Name"
              name="libraryName"
              value={settings.libraryName}
              onChange={handleChange}
              required
            />

            <Input
              label="Circulation Desk Email"
              name="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={handleChange}
              required
            />

            <Input
              label="Timezone (IANA)"
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              required
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" variant="primary" loading={saving} icon={Save}>
            Save System Policies
          </Button>
        </div>
      </form>

      {/* Automated Reminder Job Section */}
      <Card className="border-[#232A3B] bg-[#151A24]">
        <CardHeader
          title="Automated Due-Date Alerts Job"
          subtitle="Cron job runs daily at 08:00 AM with idempotent deduplication keys."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={handleTriggerReminders}
              loading={triggeringJob}
              icon={Play}
            >
              Execute Scan Now
            </Button>
          }
        />
        <p className="text-xs text-slate-300 leading-relaxed">
          The background reminder engine inspects active student loans and issues notifications at 3 days before due date, 1 day before, due today, and overdue stages. Deduplication prevents multiple alerts on the same calendar milestone.
        </p>
      </Card>

    </div>
  );
};

export default AdminSettingsPage;
