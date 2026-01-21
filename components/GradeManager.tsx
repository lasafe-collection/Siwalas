
import React, { useState } from 'react';
import { Student, GradeRecord } from '../types';

interface GradeManagerProps {
  students: Student[];
  grades: GradeRecord[];
  onAdd: (g: GradeRecord) => void;
}

const GradeManager: React.FC<GradeManagerProps> = ({ students, grades, onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<GradeRecord>>({
    studentId: '',
    subject: '',
    category: 'UH',
    score: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.subject) return;
    
    onAdd({
      ...formData,
      id: Date.now().toString(),
      score: Number(formData.score)
    } as GradeRecord);
    
    setShowModal(false);
    setFormData({ ...formData, studentId: '', score: 0, description: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 bg-white">
      <div className="flex justify-between items-center">
        <h2 className="font-black text-black text-lg uppercase">Manajemen Nilai Siswa</h2>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all shadow-lg">
          <span>+</span> INPUT NILAI
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left text-black">
                <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Nama Siswa</th>
                <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Mata Pelajaran</th>
                <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-center">Kategori</th>
                <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-center">Nilai</th>
                <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((g) => {
                const student = students.find(s => s.id === g.studentId);
                return (
                  <tr key={g.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-black text-black">{student?.name || 'Siswa'}</td>
                    <td className="px-6 py-4 text-black font-medium">{g.subject}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-white border border-slate-200 text-black rounded-md text-[10px] font-black uppercase">
                        {g.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-black text-lg ${g.score < 75 ? 'text-red-700' : 'text-emerald-700'}`}>
                        {g.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-black font-medium text-xs">{g.description || '-'}</td>
                  </tr>
                );
              })}
              {grades.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-700 font-bold">
                    Belum ada data nilai yang diinput.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="font-black text-black uppercase">Input Nilai Baru</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 font-bold text-black text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4 bg-white">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-black uppercase tracking-widest">Siswa</label>
                <select 
                  value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white" required
                >
                  <option value="">Pilih Siswa</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest">Mata Pelajaran</label>
                  <input 
                    type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                    placeholder="Contoh: Matematika"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white placeholder-slate-500" required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest">Kategori</label>
                  <select 
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white"
                  >
                    <option value="UH">Ulangan Harian</option>
                    <option value="Tugas">Tugas</option>
                    <option value="UTS">UTS</option>
                    <option value="UAS">UAS</option>
                    <option value="Sikap">Sikap</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-black uppercase tracking-widest">Skor (0-100)</label>
                <input 
                  type="number" min="0" max="100" value={formData.score} onChange={e => setFormData({...formData, score: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-xl font-black text-white" required
                />
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 bg-slate-100 text-black rounded-2xl font-black text-xs hover:bg-slate-200">BATAL</button>
                <button type="submit" className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 shadow-xl">SIMPAN NILAI</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeManager;
