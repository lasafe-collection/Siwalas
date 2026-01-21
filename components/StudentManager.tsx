
import React, { useState } from 'react';
import { Student } from '../types';

interface StudentManagerProps {
  students: Student[];
  onAdd: (s: Student) => void;
  onUpdate: (s: Student) => void;
  onRemove: (id: string) => void;
}

const StudentManager: React.FC<StudentManagerProps> = ({ students, onAdd, onUpdate, onRemove }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    nis: '',
    nisn: '',
    gender: 'L',
    birthPlace: '',
    birthDate: '',
    religion: 'Islam',
    address: '',
    fatherName: '',
    motherName: '',
    parentPhone: ''
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      name: '', nis: '', nisn: '', gender: 'L', birthPlace: '', birthDate: '',
      religion: 'Islam', address: '', fatherName: '', motherName: '', parentPhone: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s: Student) => {
    setEditingStudent(s);
    setFormData(s);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentData = {
      ...formData,
      id: editingStudent ? editingStudent.id : Date.now().toString()
    } as Student;

    if (editingStudent) {
      onUpdate(studentData);
    } else {
      onAdd(studentData);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-left duration-500 bg-white">
      <div className="flex justify-between items-center">
        <h2 className="font-black text-black text-lg uppercase">Kelola Data Peserta Didik</h2>
        <button onClick={handleOpenAdd} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20">
          <span>+</span> TAMBAH SISWA
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left text-black">
              <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">No</th>
              <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Nama Siswa</th>
              <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Identitas (NIS/NISN)</th>
              <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-center">Gender</th>
              <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-right">Kelola</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s, idx) => (
              <tr key={s.id} className="hover:bg-slate-50 group">
                <td className="px-6 py-4 text-black font-black">{idx + 1}</td>
                <td className="px-6 py-4">
                  <p className="font-black text-black">{s.name}</p>
                  <p className="text-[10px] text-slate-700 uppercase font-bold tracking-tighter">{s.birthPlace}, {s.birthDate}</p>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-black font-bold">{s.nis} / {s.nisn}</td>
                <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black border ${s.gender === 'L' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-pink-50 text-pink-800 border-pink-200'}`}>
                        {s.gender === 'L' ? 'L' : 'P'}
                    </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenEdit(s)} className="p-2 text-indigo-700 font-black hover:bg-indigo-50 rounded-lg text-xs uppercase">Edit</button>
                    <button onClick={() => onRemove(s.id)} className="p-2 text-red-700 font-black hover:bg-red-50 rounded-lg text-xs uppercase">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-700 font-bold">
                        Belum ada data siswa. Silakan klik tombol "Tambah Siswa".
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="font-black text-black uppercase">{editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 font-bold text-black text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest">Nama Lengkap</label>
                <input 
                  type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white placeholder-slate-500" required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest">NIS</label>
                <input 
                  type="text" value={formData.nis} onChange={e => setFormData({...formData, nis: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white placeholder-slate-500" required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest">NISN</label>
                <input 
                  type="text" value={formData.nisn} onChange={e => setFormData({...formData, nisn: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white placeholder-slate-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest">Gender</label>
                <select 
                  value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as 'L'|'P'})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest">Agama</label>
                <input 
                  type="text" value={formData.religion} onChange={e => setFormData({...formData, religion: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white placeholder-slate-500"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest">Alamat Domisili</label>
                <input 
                  type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-white placeholder-slate-500"
                />
              </div>
              
              <div className="flex justify-end gap-3 col-span-2 pt-6 border-t border-slate-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 bg-slate-100 text-black rounded-2xl font-black text-xs hover:bg-slate-200">BATAL</button>
                <button type="submit" className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 shadow-xl">SIMPAN DATA</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManager;
