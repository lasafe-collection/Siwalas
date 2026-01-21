
import React, { useState } from 'react';
import { Student, AchievementRecord } from '../types';
import { generateStudentNarrative } from '../services/geminiService';

interface AchievementManagerProps {
  students: Student[];
  achievements: AchievementRecord[];
  onAdd: (a: AchievementRecord) => void;
  onRemove: (id: string) => void;
}

const AchievementManager: React.FC<AchievementManagerProps> = ({ students, achievements, onAdd, onRemove }) => {
  const [showModal, setShowModal] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [formData, setFormData] = useState<Partial<AchievementRecord>>({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    title: '',
    level: 'Sekolah',
    rank: '',
    description: ''
  });

  const [aiKeywords, setAiKeywords] = useState('');

  const handleAiGenerate = async () => {
    if (!formData.studentId || !aiKeywords) return;
    setLoadingAi(true);
    const studentName = students.find(s => s.id === formData.studentId)?.name || 'Siswa';
    const text = await generateStudentNarrative(studentName, `Prestasi: ${formData.title}. Detail: ${aiKeywords}`);
    setFormData(prev => ({ ...prev, description: text }));
    setLoadingAi(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.title) return;
    onAdd({
      ...formData,
      id: Date.now().toString(),
    } as AchievementRecord);
    setShowModal(false);
    setFormData({ studentId: '', date: new Date().toISOString().split('T')[0], title: '', level: 'Sekolah', rank: '', description: '' });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500 bg-white">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-black text-lg uppercase">Daftar Prestasi Siswa</h2>
          <p className="text-xs text-slate-700">Catat semua pencapaian akademik dan non-akademik siswa.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20">
          <span>🏆</span> TAMBAH PRESTASI
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((a) => {
          const student = students.find(s => s.id === a.studentId);
          return (
            <div key={a.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <button onClick={() => onRemove(a.id)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{a.level}</p>
              <h3 className="font-black text-black text-lg mb-1 leading-tight">{a.title}</h3>
              <p className="text-xs text-slate-700 font-bold mb-3">{student?.name || 'Siswa'}</p>
              
              <div className="bg-slate-50 rounded-2xl p-4 flex-1 mb-4 border border-slate-100">
                <p className="text-[10px] font-black text-black uppercase tracking-widest mb-2">Peringkat & Keterangan</p>
                <p className="text-sm font-black text-black mb-1">{a.rank}</p>
                <p className="text-xs text-slate-800 italic line-clamp-3">{a.description}</p>
              </div>
              
              <div className="flex justify-between items-center text-[10px] font-black text-black uppercase tracking-widest">
                <span>🏆 TERCATAT</span>
                <span>{a.date}</span>
              </div>
            </div>
          );
        })}
        {achievements.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-black text-black uppercase">Belum ada data prestasi</h3>
            <p className="text-sm text-slate-600">Klik tombol di atas untuk mencatat prestasi pertama siswa Anda.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="font-black text-black uppercase">Input Prestasi Siswa</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 font-bold text-black text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto bg-white">
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">Siswa</label>
                    <select 
                        value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white" required
                    >
                        <option value="">Pilih Siswa</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">Tanggal Perolehan</label>
                    <input 
                        type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white" required
                    />
                  </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest">Nama Prestasi / Lomba</label>
                <input 
                  type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white placeholder-slate-500" 
                  placeholder="Contoh: Olimpiade Matematika Terintegrasi" required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">Tingkat</label>
                    <select 
                      value={formData.level} onChange={e => setFormData({...formData, level: e.target.value as any})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white"
                    >
                      <option value="Sekolah">Sekolah</option>
                      <option value="Kecamatan">Kecamatan</option>
                      <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                      <option value="Provinsi">Provinsi</option>
                      <option value="Nasional">Nasional</option>
                      <option value="Internasional">Internasional</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">Peringkat / Hasil</label>
                    <input 
                      type="text" value={formData.rank} onChange={e => setFormData({...formData, rank: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white placeholder-slate-500" 
                      placeholder="Contoh: Juara 1 / Medali Emas"
                    />
                  </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🤖</span>
                      <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest">AI Narrator: Deskripsi Prestasi</h4>
                  </div>
                  <div className="flex gap-2">
                      <input 
                        type="text" value={aiKeywords} onChange={e => setAiKeywords(e.target.value)}
                        placeholder="Misal: kompetisi ketat, membanggakan..."
                        className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-amber-500 font-bold text-white placeholder-slate-500"
                      />
                      <button 
                        type="button" onClick={handleAiGenerate} disabled={loadingAi || !formData.studentId || !formData.title}
                        className="bg-amber-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-amber-700 disabled:opacity-50"
                      >
                        {loadingAi ? 'MENGOLAH...' : 'BUAT NARASI'}
                      </button>
                  </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest">Deskripsi / Keterangan</label>
                <textarea 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none font-bold text-white placeholder-slate-500" 
                  placeholder="Ceritakan detail prestasi di sini..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 bg-slate-100 text-black rounded-2xl font-black text-xs hover:bg-slate-200">BATAL</button>
                <button type="submit" className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 shadow-xl">SIMPAN PRESTASI</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementManager;
