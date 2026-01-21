
import React, { useState } from 'react';
import { Student, GuidanceRecord } from '../types';
import { generateStudentNarrative } from '../services/geminiService';

interface GuidanceManagerProps {
  students: Student[];
  records: GuidanceRecord[];
  onAdd: (r: GuidanceRecord) => void;
}

const GuidanceManager: React.FC<GuidanceManagerProps> = ({ students, records, onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [formData, setFormData] = useState<Partial<GuidanceRecord>>({
    date: new Date().toISOString().split('T')[0],
    studentId: '',
    type: 'konseling',
    description: '',
    action: ''
  });

  const [aiKeywords, setAiKeywords] = useState('');

  const handleAiGenerate = async () => {
    if (!formData.studentId || !aiKeywords) return;
    setLoadingAi(true);
    const studentName = students.find(s => s.id === formData.studentId)?.name || 'Siswa';
    const text = await generateStudentNarrative(studentName, aiKeywords);
    setFormData(prev => ({ ...prev, description: text }));
    setLoadingAi(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) return;
    onAdd({
      ...formData,
      id: Date.now().toString()
    } as GuidanceRecord);
    setShowModal(false);
    setFormData({ date: new Date().toISOString().split('T')[0], studentId: '', type: 'konseling', description: '', action: '' });
  };

  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500 bg-white">
      <div className="flex justify-between items-center">
        <h2 className="font-black text-black text-lg uppercase tracking-tight">Bimbingan & Konseling</h2>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all shadow-lg">
          <span>+</span> TAMBAH CATATAN
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRecords.map((r) => {
          const student = students.find(s => s.id === r.studentId);
          return (
            <div key={r.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  r.type === 'pelanggaran' ? 'bg-red-50 text-red-800 border-red-200' :
                  r.type === 'prestasi' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  'bg-blue-50 text-blue-800 border-blue-200'
                }`}>
                  {r.type}
                </span>
                <span className="text-[10px] font-black text-black uppercase tracking-widest border border-slate-200 px-2 py-1 rounded-md bg-slate-50">{r.date}</span>
              </div>
              <h3 className="font-black text-black mb-2 text-lg">{student?.name || 'Siswa Tidak Ditemukan'}</h3>
              <p className="text-sm text-black font-medium italic flex-1 mb-4 leading-relaxed">"{r.description}"</p>
              <div className="pt-4 border-t border-slate-100 text-[10px]">
                <p className="font-black text-black uppercase tracking-widest mb-1">Tindak Lanjut:</p>
                <p className="text-black font-bold text-xs">{r.action || '-'}</p>
              </div>
            </div>
          );
        })}
        {records.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-700 font-black uppercase tracking-widest bg-white rounded-2xl border border-dashed border-slate-300">
            Belum ada catatan bimbingan.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="font-black text-black uppercase">Buat Catatan Bimbingan</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 font-bold text-black text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">Pilih Siswa</label>
                    <select 
                        value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white" required
                    >
                        <option value="">Cari Siswa...</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">Tanggal</label>
                    <input 
                        type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white" required
                    />
                  </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-200 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🤖</span>
                      <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest">AI NARATOR OTOMATIS</h4>
                  </div>
                  <div className="flex gap-2">
                      <input 
                        type="text" value={aiKeywords} onChange={e => setAiKeywords(e.target.value)}
                        placeholder="Ketik kata kunci: sopan, rajin, melanggar..."
                        className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-white placeholder-slate-500"
                      />
                      <button 
                        type="button" onClick={handleAiGenerate} disabled={loadingAi || !formData.studentId}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-indigo-700 disabled:opacity-50 shadow-md"
                      >
                        {loadingAi ? 'PROSES...' : 'BUAT'}
                      </button>
                  </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest">Deskripsi Kejadian</label>
                <textarea 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none font-bold text-white placeholder-slate-500" required
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 bg-slate-100 text-black rounded-2xl font-black text-xs hover:bg-slate-200">BATAL</button>
                <button type="submit" className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 shadow-xl">SIMPAN CATATAN</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidanceManager;
