'use client';

import React, { useState } from 'react';
import { 
  Search, Trash2, Calendar, Phone, Mail, User, 
  MessageSquare, X, ShieldAlert, AlertCircle, Copy, Check
} from 'lucide-react';

interface Submission {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  message: string;
  createdAt: string;
}

interface ContactsListClientProps {
  initialSubmissions: Submission[];
}

export default function ContactsListClient({ initialSubmissions }: ContactsListClientProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;

    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setSubmissions(submissions.filter(sub => sub.id !== id));
        triggerToast('Submission deleted successfully');
        if (selectedSub?.id === id) {
          setSelectedSub(null);
        }
      } else {
        alert('Failed to delete: ' + (data.error || 'Unknown error'));
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred while deleting the submission.');
    }
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter logic
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.phone && sub.phone.includes(searchTerm));

    const matchesService = 
      serviceFilter === 'all' || 
      (sub.service && sub.service.toLowerCase() === serviceFilter.toLowerCase());

    return matchesSearch && matchesService;
  });

  // Calculate statistics
  const totalCount = submissions.length;
  const webDevCount = submissions.filter(s => s.service === 'web-dev' || (s.service && s.service.toLowerCase().includes('web'))).length;
  const marketingCount = submissions.filter(s => s.service === 'marketing' || (s.service && s.service.toLowerCase().includes('market'))).length;
  const seoCount = submissions.filter(s => s.service === 'seo' || (s.service && s.service.toLowerCase().includes('seo'))).length;
  const otherCount = totalCount - webDevCount - marketingCount - seoCount;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-gray-800 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-2 h-2 rounded-full bg-[#1a8b4c] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Stats Counter Panels */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Total Submissions</span>
          <span className="text-2xl font-black text-gray-900 mt-1 block">{totalCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider block">Web Development</span>
          <span className="text-2xl font-black text-purple-900 mt-1 block">{webDevCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">Digital Marketing</span>
          <span className="text-2xl font-black text-emerald-900 mt-1 block">{marketingCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block">SEO Services</span>
          <span className="text-2xl font-black text-blue-900 mt-1 block">{seoCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] col-span-2 lg:col-span-1">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">Other/General</span>
          <span className="text-2xl font-black text-gray-800 mt-1 block">{otherCount}</span>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search submissions by name, email, keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all text-gray-800"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider whitespace-nowrap">Filter Service:</label>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1a8b4c] cursor-pointer text-gray-800"
          >
            <option value="all">All Services</option>
            <option value="web-dev">Web Development</option>
            <option value="seo">SEO Services</option>
            <option value="marketing">Digital Marketing</option>
            <option value="other">Other / General</option>
          </select>
        </div>

      </div>

      {/* Submissions Datatable */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Sender Details</th>
                <th className="py-4 px-6">Requested Service</th>
                <th className="py-4 px-6">Message Preview</th>
                <th className="py-4 px-6">Submitted Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-xs font-semibold">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={24} className="text-gray-300" />
                      <span>No contact submissions found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  // Service label styling
                  const serviceLower = sub.service ? sub.service.toLowerCase() : '';
                  let badgeStyle = 'bg-gray-50 text-gray-600 border-gray-200';
                  if (serviceLower.includes('web')) badgeStyle = 'bg-purple-50 text-purple-700 border-purple-100';
                  else if (serviceLower.includes('market')) badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  else if (serviceLower.includes('seo')) badgeStyle = 'bg-blue-50 text-blue-700 border-blue-100';

                  return (
                    <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Sender Column */}
                      <td className="py-4 px-6 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#dcfce7] text-[#1a8b4c] flex items-center justify-center font-bold text-xs">
                            {sub.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900">{sub.name}</h4>
                            <div className="flex flex-col text-[10px] text-gray-400 font-semibold mt-0.5 space-y-0.5">
                              <span className="flex items-center gap-1"><Mail size={10} /> {sub.email}</span>
                              {sub.phone && <span className="flex items-center gap-1"><Phone size={10} /> {sub.phone}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Service Column */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${badgeStyle}`}>
                          {sub.service || 'General'}
                        </span>
                      </td>

                      {/* Message Preview Column */}
                      <td className="py-4 px-6 max-w-xs">
                        <p className="text-xs text-gray-500 font-medium truncate">
                          {sub.message}
                        </p>
                      </td>

                      {/* Submitted Date Column */}
                      <td className="py-4 px-6 whitespace-nowrap text-xs text-gray-500 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-gray-400" />
                          <span>
                            {new Date(sub.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(sub.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-6 whitespace-nowrap text-right text-xs">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedSub(sub)}
                            className="px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 font-bold transition-all text-[11px]"
                          >
                            Read Message
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete submission"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Detailed Message View Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-[9999] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#1a8b4c]">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">
                    Contact Message Detail
                  </h3>
                  <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                    Submitted on {new Date(selectedSub.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Contact Card */}
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Sender Name</span>
                    <span className="text-sm font-black text-gray-900">{selectedSub.name}</span>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                    selectedSub.service?.toLowerCase().includes('web') 
                      ? 'bg-purple-50 text-purple-700 border-purple-100'
                      : selectedSub.service?.toLowerCase().includes('market')
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-blue-50 text-blue-700 border-blue-100'
                  }`}>
                    {selectedSub.service || 'General'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100/80">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Email Address</span>
                    <a href={`mailto:${selectedSub.email}`} className="text-xs font-bold text-[#1a8b4c] hover:underline break-all">{selectedSub.email}</a>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Phone Number</span>
                    {selectedSub.phone ? (
                      <a href={`tel:${selectedSub.phone}`} className="text-xs font-bold text-gray-900 hover:underline">{selectedSub.phone}</a>
                    ) : (
                      <span className="text-xs font-semibold text-gray-400">N/A</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Message Content</span>
                  <button
                    onClick={() => handleCopy(selectedSub.message, selectedSub.id)}
                    className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-[#1a8b4c] font-bold"
                  >
                    {copiedId === selectedSub.id ? <Check size={11} className="text-[#1a8b4c]" /> : <Copy size={11} />}
                    <span>{copiedId === selectedSub.id ? 'Copied' : 'Copy text'}</span>
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 text-xs font-semibold text-gray-700 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedSub.message}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between gap-2.5">
              <button
                onClick={() => handleDelete(selectedSub.id)}
                className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                Delete Message
              </button>
              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedSub.email}?subject=Regarding your request for ${selectedSub.service || 'GlobalWebify services'}`}
                  className="px-4 py-2 bg-[#1a8b4c] hover:bg-[#157a41] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-green-900/10"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold transition-all"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
