'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Home, GripVertical, CheckCircle2, XCircle } from 'lucide-react';
import { getHomepageFaqs, saveHomepageFaqs } from './actions';

export default function HomepageSettingsPage() {
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getHomepageFaqs().then((data) => {
      setFaqs(data || []);
      setLoading(false);
    });
  }, []);

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await saveHomepageFaqs(faqs);
    setSaving(false);
    if (res.success) {
      showToast("Homepage FAQs saved successfully!");
    } else {
      showToast("Failed to save: " + res.error, 'error');
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 relative">
      {toast && (
        <div className={`fixed top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border ${
          toast.type === 'success' ? 'bg-[#1a8b4c] text-white border-[#15703d]' : 'bg-red-600 text-white border-red-700'
        } animate-in slide-in-from-top-2 fade-in duration-300 font-bold font-lexend`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-lexend flex items-center gap-2">
            <Home className="text-[#1a8b4c]" /> Homepage Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage global content for your homepage, such as the FAQ section.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1a8b4c] hover:bg-[#157a41] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-xs text-gray-500 mt-1">These FAQs appear at the bottom of the main homepage.</p>
          </div>
          <button
            onClick={addFaq}
            className="px-3 py-1.5 bg-green-50 text-[#1a8b4c] border border-green-200 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-green-100 transition-colors"
          >
            <Plus size={14} /> Add FAQ
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50 group">
              <div className="pt-2 cursor-grab text-gray-300">
                <GripVertical size={16} />
              </div>
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  placeholder="Question..."
                  value={faq.question}
                  onChange={(e) => updateFaq(index, 'question', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c]"
                />
                <textarea
                  placeholder="Answer..."
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a8b4c] resize-none"
                />
              </div>
              <button
                onClick={() => removeFaq(index)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                title="Remove FAQ"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {faqs.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
              No FAQs added yet. Click "Add FAQ" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
