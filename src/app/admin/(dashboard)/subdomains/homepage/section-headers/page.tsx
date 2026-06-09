'use client';

import React, { useState, useEffect } from 'react';
import { Save, Heading, CheckCircle2, XCircle } from 'lucide-react';
import { getSubdomainSectionHeaders, saveSubdomainSectionHeaders } from '../actions';

export default function SubdomainSectionHeadersPage() {
  const [headers, setHeaders] = useState<any>({
    services: { title: '', description: '' },
    portfolio: { title: '', description: '' },
    techStack: { title: '', description: '' },
    latestBlog: { title: '', description: '' },
    trust: { title: '', description: '' },
    faq: { title: '', description: '' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getSubdomainSectionHeaders()
      .then(data => {
        setHeaders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load subdomain section headers", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await saveSubdomainSectionHeaders(headers);
    setSaving(false);
    if (res.success) {
      showToast("Market Area section headers saved!");
    } else {
      showToast(`Error: ${res.error || 'Failed to save'}`, 'error');
    }
  };

  const sections = [
    { key: 'services', label: 'Services Grid Section' },
    { key: 'portfolio', label: 'Portfolio Section' },
    { key: 'techStack', label: 'Tech Stack Section' },
    { key: 'latestBlog', label: 'Latest Blog Section' },
    { key: 'trust', label: 'Trust Section' },
    { key: 'faq', label: 'FAQ Section' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 relative space-y-10 font-poppins">
      {toast && (
        <div className={`fixed top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border ${
          toast.type === 'success' ? 'bg-[#1a8b4c] text-white border-[#15703d]' : 'bg-red-600 text-white border-red-700'
        } animate-in slide-in-from-top-2 fade-in duration-300 font-bold`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Heading className="text-[#1a8b4c]" /> Market Area Section Headers
          </h1>
          <p className="text-sm text-gray-500 mt-1">Configure the main Titles and Descriptions for every section on the Subdomain Homepage. Use <span className="text-[#1a8b4c] font-bold">{'{location}'}</span> to automatically insert the city name.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-[#1a8b4c] hover:bg-[#157a41] text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 text-xs uppercase tracking-wider"
        >
          <Save size={14} /> {saving ? 'Saving...' : 'Save All Headers'}
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400 font-semibold">Loading Headers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map(({ key, label }) => (
            <div key={key} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">{label}</h2>
              </div>
              
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">Section Title <span className="text-[#1a8b4c] normal-case tracking-normal">Supports {'{location}'}</span></label>
                <input
                  type="text"
                  value={headers[key]?.title || ''}
                  onChange={(e) => setHeaders({ ...headers, [key]: { ...headers[key], title: e.target.value } })}
                  placeholder="e.g. Our Premium Services in {location}"
                  className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">Section Subtitle / Description <span className="text-[#1a8b4c] normal-case tracking-normal">Supports {'{location}'}</span></label>
                <textarea
                  rows={2}
                  value={headers[key]?.description || ''}
                  onChange={(e) => setHeaders({ ...headers, [key]: { ...headers[key], description: e.target.value } })}
                  placeholder="e.g. Elevate your business in {location} with our solutions."
                  className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
