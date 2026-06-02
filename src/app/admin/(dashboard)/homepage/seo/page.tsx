'use client';

import React, { useState, useEffect } from 'react';
import { Save, Search, Globe, Layout, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';
import { getHomepageSeo, saveHomepageSeo, getCitySeo, saveCitySeo } from '../actions';
import { CITIES } from '../cities';

export default function SeoSettingsPage() {
  // Main Homepage SEO States
  const [homepageSeo, setHomepageSeo] = useState({ title: '', description: '', keywords: '' });
  const [loadingHome, setLoadingHome] = useState(true);
  const [savingHome, setSavingHome] = useState(false);

  // City SEO States
  const [selectedCity, setSelectedCity] = useState('delhi');
  const [citySeo, setCitySeo] = useState({ title: '', description: '', keywords: '' });
  const [loadingCity, setLoadingCity] = useState(true);
  const [savingCity, setSavingCity] = useState(false);

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load Main Homepage SEO
  useEffect(() => {
    getHomepageSeo()
      .then(data => {
        setHomepageSeo(data);
        setLoadingHome(false);
      })
      .catch(err => {
        console.error("Failed to load homepage SEO settings", err);
        setLoadingHome(false);
      });
  }, []);

  // Load City SEO whenever selectedCity changes
  useEffect(() => {
    setLoadingCity(true);
    getCitySeo(selectedCity)
      .then(data => {
        setCitySeo(data);
        setLoadingCity(false);
      })
      .catch(err => {
        console.error("Failed to load city SEO settings", err);
        setLoadingCity(false);
      });
  }, [selectedCity]);

  // Main Homepage SEO Save Handler
  const handleSaveHomepageSeo = async () => {
    setSavingHome(true);
    const res = await saveHomepageSeo(homepageSeo);
    setSavingHome(false);
    if (res.success) {
      showToast("Main homepage SEO settings saved!");
    } else {
      showToast(`Error: ${res.error || 'Failed to save'}`, 'error');
    }
  };

  // City SEO Save Handler
  const handleSaveCitySeo = async () => {
    setSavingCity(true);
    const res = await saveCitySeo(selectedCity, citySeo);
    setSavingCity(false);
    if (res.success) {
      const city = CITIES.find(c => c.key === selectedCity);
      showToast(`SEO settings for ${city ? city.name : selectedCity} saved!`);
    } else {
      showToast(`Error: ${res.error || 'Failed to save'}`, 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 relative space-y-10">
      {toast && (
        <div className={`fixed top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border ${
          toast.type === 'success' ? 'bg-[#1a8b4c] text-white border-[#15703d]' : 'bg-red-600 text-white border-red-700'
        } animate-in slide-in-from-top-2 fade-in duration-300 font-bold font-lexend`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 font-lexend flex items-center gap-2">
          <Search className="text-[#1a8b4c]" /> Search Engine SEO Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure Meta Titles, Meta Descriptions, and Keywords to rank on Search Engines for the root homepage and location pages.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION 1: Main Homepage SEO */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-lexend">
                  <Layout size={20} className="text-[#1a8b4c]" /> Main Homepage SEO
                </h2>
                <p className="text-xs text-gray-500 mt-1">SEO settings for the root landing URL (`/` homepage).</p>
              </div>
              <button
                onClick={handleSaveHomepageSeo}
                disabled={savingHome || loadingHome}
                className="bg-[#1a8b4c] hover:bg-[#157a41] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 font-lexend text-xs"
              >
                <Save size={14} /> {savingHome ? 'Saving...' : 'Save Main SEO'}
              </button>
            </div>

            {loadingHome ? (
              <div className="py-12 text-center text-gray-400 font-semibold font-lexend">Loading Homepage SEO...</div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-lexend">Meta Title</label>
                    <span className={`text-[10px] font-bold ${homepageSeo.title.length > 60 ? 'text-amber-500' : 'text-gray-400'}`}>
                      {homepageSeo.title.length} / 60 chars recommended
                    </span>
                  </div>
                  <input
                    type="text"
                    value={homepageSeo.title}
                    onChange={(e) => setHomepageSeo({ ...homepageSeo, title: e.target.value })}
                    placeholder="Enter main homepage SEO title..."
                    className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c] transition-colors"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-lexend">Meta Description</label>
                    <span className={`text-[10px] font-bold ${homepageSeo.description.length > 160 ? 'text-amber-500' : 'text-gray-400'}`}>
                      {homepageSeo.description.length} / 160 chars recommended
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={homepageSeo.description}
                    onChange={(e) => setHomepageSeo({ ...homepageSeo, description: e.target.value })}
                    placeholder="Enter meta description summarizing the homepage content..."
                    className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5 font-lexend">Keywords (Comma separated)</label>
                  <input
                    type="text"
                    value={homepageSeo.keywords}
                    onChange={(e) => setHomepageSeo({ ...homepageSeo, keywords: e.target.value })}
                    placeholder="e.g. Web Development, SEO, Digital Marketing, branding"
                    className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c] transition-colors"
                  />
                </div>

                {/* Google Snippet Preview */}
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-lexend">Search Snippet Preview</span>
                  <div className="text-[#1a0dab] text-lg font-medium hover:underline cursor-pointer leading-tight truncate">
                    {homepageSeo.title || "Please enter a meta title"}
                  </div>
                  <div className="text-[#006621] text-xs leading-tight">
                    https://globalwebify.com/
                  </div>
                  <div className="text-[#545454] text-xs leading-normal line-clamp-2">
                    {homepageSeo.description || "Please enter a meta description summarizing what your services are about to help Google users understand your site content."}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: City Landing SEO */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-lexend">
                  <Globe size={20} className="text-[#1a8b4c]" /> City Landing Pages SEO
                </h2>
                <p className="text-xs text-gray-500 mt-1">SEO settings for location landing URLs.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-white border-2 border-gray-200 text-gray-800 text-xs font-bold rounded-xl px-4 py-2 outline-none focus:border-[#1a8b4c] transition-all cursor-pointer font-lexend appearance-none pr-9"
                  >
                    {CITIES.map(c => (
                      <option key={c.key} value={c.key}>{c.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                    <ChevronDown size={12} />
                  </div>
                </div>

                <button
                  onClick={handleSaveCitySeo}
                  disabled={savingCity || loadingCity}
                  className="bg-[#1a8b4c] hover:bg-[#157a41] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 font-lexend text-xs"
                >
                  <Save size={14} /> {savingCity ? 'Saving...' : 'Save City SEO'}
                </button>
              </div>
            </div>

            {loadingCity ? (
              <div className="py-12 text-center text-gray-400 font-semibold font-lexend">Loading {selectedCity.toUpperCase()} SEO...</div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-lexend">Meta Title</label>
                    <span className={`text-[10px] font-bold ${citySeo.title.length > 60 ? 'text-amber-500' : 'text-gray-400'}`}>
                      {citySeo.title.length} / 60 chars recommended
                    </span>
                  </div>
                  <input
                    type="text"
                    value={citySeo.title}
                    onChange={(e) => setCitySeo({ ...citySeo, title: e.target.value })}
                    placeholder="Enter city landing page title..."
                    className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c] transition-colors"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-lexend">Meta Description</label>
                    <span className={`text-[10px] font-bold ${citySeo.description.length > 160 ? 'text-amber-500' : 'text-gray-400'}`}>
                      {citySeo.description.length} / 160 chars recommended
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={citySeo.description}
                    onChange={(e) => setCitySeo({ ...citySeo, description: e.target.value })}
                    placeholder="Enter meta description for location page..."
                    className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5 font-lexend">Keywords (Comma separated)</label>
                  <input
                    type="text"
                    value={citySeo.keywords}
                    onChange={(e) => setCitySeo({ ...citySeo, keywords: e.target.value })}
                    placeholder="e.g. Web Development Delhi, SEO services Delhi, Digital Marketing Delhi"
                    className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c] transition-colors"
                  />
                </div>

                {/* Google Snippet Preview */}
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-lexend">Search Snippet Preview</span>
                  <div className="text-[#1a0dab] text-lg font-medium hover:underline cursor-pointer leading-tight truncate">
                    {citySeo.title || "Please enter a meta title"}
                  </div>
                  <div className="text-[#006621] text-xs leading-tight">
                    https://globalwebify.com/{selectedCity}
                  </div>
                  <div className="text-[#545454] text-xs leading-normal line-clamp-2">
                    {citySeo.description || "Please enter a meta description summarizing what your local services are about in this city."}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
