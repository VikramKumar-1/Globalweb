'use client';

import React, { useState, useEffect } from 'react';
import { Save, Layout, CheckCircle2, XCircle } from 'lucide-react';
import { getHomepageAboutCard, saveHomepageAboutCard } from '../actions';
import RichTextInlineEditor from '@/features/admin/components/shared/RichTextInlineEditor';

export default function GrowthCardSettingsPage() {
  const [data, setData] = useState({
    title: '',
    content: '',
    buttonText: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getHomepageAboutCard()
      .then((res) => {
        setData({
          title: res.title || '',
          content: res.content || '',
          buttonText: res.buttonText || ''
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load growth card settings", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await saveHomepageAboutCard(data);
    setSaving(false);
    
    if (res.success) {
      showToast("Growth Card settings saved successfully!");
    } else {
      showToast(`Failed to save settings: ${res.error || 'Unknown error'}`, 'error');
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500 font-semibold font-poppins">Loading Growth Card Settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 relative space-y-10">
      {toast && (
        <div className={`fixed top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border ${
          toast.type === 'success' ? 'bg-[#1a8b4c] text-white border-[#15703d]' : 'bg-red-600 text-white border-red-700'
        } animate-in slide-in-from-top-2 fade-in duration-300 font-bold font-poppins`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-950 font-poppins flex items-center gap-2">
          <Layout className="text-[#1a8b4c]" /> Growth Agency Card Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure the content of the "Data-Driven Growth Agency" card on the homepage.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-poppins">Card Content</h2>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#1a8b4c] hover:bg-[#157a41] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 font-poppins text-xs"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2 font-poppins">Card Title (HTML supported)</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a8b4c] font-poppins"
            />
            <p className="text-xs text-gray-500 mt-1">Example: Data-Driven &lt;br /&gt; Growth Agency</p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2 font-poppins">Card Paragraph</label>
            <textarea
              value={data.content}
              onChange={(e) => setData({ ...data, content: e.target.value })}
              rows={5}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a8b4c] font-poppins whitespace-pre-wrap"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2 font-poppins">Button Text</label>
            <input
              type="text"
              value={data.buttonText}
              onChange={(e) => setData({ ...data, buttonText: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a8b4c] font-poppins"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
