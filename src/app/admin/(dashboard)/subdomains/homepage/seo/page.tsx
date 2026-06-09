'use client';

import React, { useState, useEffect } from 'react';
import { Save, Search, Layout, CheckCircle2, XCircle } from 'lucide-react';
import { getSubdomainHomepageSeo, saveSubdomainHomepageSeo } from '../actions';

export default function SeoSettingsPage() {
  const [seo, setSeo] = useState({ title: '', description: '', keywords: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getSubdomainHomepageSeo()
      .then(data => {
        setSeo({
          title: data?.title || '',
          description: data?.description || '',
          keywords: data?.keywords || ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load SEO settings", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await saveSubdomainHomepageSeo(seo);
    setSaving(false);
    if (res.success) {
      showToast("Market Area SEO settings saved!");
    } else {
      showToast(`Error: ${res.error || 'Failed to save'}`, 'error');
    }
  };

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
        <h1 className="text-2xl font-black text-gray-900 font-poppins flex items-center gap-2">
          <Search className="text-[#1a8b4c]" /> Search Engine SEO Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure Meta Titles, Meta Descriptions, and Keywords to rank on Search Engines for the market area subdomains. Supports <strong>{'{location}'}</strong>.</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-[#f0f9ff] border-2 border-blue-200 rounded-2xl p-7 shadow-lg shadow-blue-100/50 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest shadow-md">
          High Priority SEO
        </div>
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-blue-200/60 mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-poppins">
                <Layout size={20} className="text-[#1a8b4c]" /> Market Area Homepage SEO
              </h2>
              <p className="text-xs text-gray-500 mt-1">SEO settings for the market area homepage URLs.</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="bg-[#1a8b4c] hover:bg-[#157a41] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 font-poppins text-xs"
            >
              <Save size={14} /> {saving ? 'Saving...' : 'Save SEO Settings'}
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 font-semibold font-poppins">Loading SEO...</div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-poppins">Meta Title</label>
                  <span className={`text-[10px] font-bold ${seo.title.length > 60 ? 'text-amber-500' : 'text-gray-400'}`}>
                    {seo.title.length} / 60 chars recommended
                  </span>
                </div>
                <input
                  type="text"
                  value={seo.title}
                  onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                  placeholder="Enter market area homepage SEO title..."
                  className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c] transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-poppins">Meta Description</label>
                  <span className={`text-[10px] font-bold ${seo.description.length > 160 ? 'text-amber-500' : 'text-gray-400'}`}>
                    {seo.description.length} / 160 chars recommended
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={seo.description}
                  onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                  placeholder="Enter meta description summarizing the content..."
                  className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5 font-poppins">Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={seo.keywords}
                  onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                  placeholder="e.g. Web Development {location}, SEO {location}"
                  className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c] transition-colors"
                />
              </div>

              {/* Google Snippet Preview */}
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-poppins">Search Snippet Preview</span>
                <div className="text-[#1a0dab] text-lg font-medium hover:underline cursor-pointer leading-tight truncate">
                  {seo.title || "Please enter a meta title"}
                </div>
                <div className="text-[#006621] text-xs leading-tight">
                  https://globalwebify.com/location
                </div>
                <div className="text-[#545454] text-xs leading-normal line-clamp-2">
                  {seo.description || "Please enter a meta description summarizing what your services are about to help Google users understand your site content."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
