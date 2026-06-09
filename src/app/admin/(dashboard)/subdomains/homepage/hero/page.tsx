'use client';

import React, { useState, useEffect } from 'react';
import { Save, Type, CheckCircle2, XCircle, Layout } from 'lucide-react';
import { getSubdomainHomepageHeroDesc, saveSubdomainHomepageHeroDesc } from '../actions';

export default function HeroSettingsPage() {
  const [homepageTitle, setHomepageTitle] = useState<string>('');
  const [homepageDesc, setHomepageDesc] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [savingDesc, setSavingDesc] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getSubdomainHomepageHeroDesc()
      .then((desc) => {
        setHomepageTitle(desc?.title || '');
        setHomepageDesc(desc?.description || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load hero settings", err);
        setLoading(false);
      });
  }, []);

  const handleSaveHomepageDesc = async () => {
    setSavingDesc(true);
    const res = await saveSubdomainHomepageHeroDesc({ title: homepageTitle, description: homepageDesc });
    setSavingDesc(false);
    
    if (res.success) {
      showToast("Homepage hero description saved successfully!");
    } else {
      showToast(`Failed to save homepage description: ${res.error || 'Unknown error'}`, 'error');
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500 font-semibold font-poppins">Loading Hero Settings...</div>;
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
          <Type className="text-[#1a8b4c]" /> Market Area Hero Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure typing texts and descriptions for the market area subdomain hero banner. Use <strong>{'{location}'}</strong> anywhere!</p>
      </div>

      {/* SECTION 2: Homepage Hero Description */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-poppins">
              <Layout size={20} className="text-[#1a8b4c]" /> Subdomain Title & Description
            </h2>
            <p className="text-xs text-gray-500 mt-1">Customize the title and description displayed on the market area subdomains. Supports {'{location}'}.</p>
          </div>
          <button
            onClick={handleSaveHomepageDesc}
            disabled={savingDesc}
            className="bg-[#1a8b4c] hover:bg-[#157a41] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 font-poppins text-xs"
          >
            <Save size={16} /> {savingDesc ? 'Saving...' : 'Save Description'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2 font-poppins">Hero Section Title (H1)</label>
            <input
              type="text"
              value={homepageTitle}
              onChange={(e) => setHomepageTitle(e.target.value)}
              placeholder="e.g. Grow your business in {location} today"
              className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c] transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2 font-poppins">Hero Description (Subtitle)</label>
            <textarea
              rows={2}
              value={homepageDesc}
              onChange={(e) => setHomepageDesc(e.target.value)}
              placeholder="e.g. We help businesses in {location} get more leads."
              className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c] transition-colors resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
