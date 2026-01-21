
import React, { useState, useRef } from 'react';
import { SchoolSetup, AppState } from '../types';

interface SetupFormProps {
  setup: SchoolSetup;
  onSave: (setup: SchoolSetup) => void;
}

const SetupForm: React.FC<SetupFormProps> = ({ setup, onSave }) => {
  const [formData, setFormData] = useState<SchoolSetup>(setup);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, teacherPhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportData = () => {
    const data = localStorage.getItem('admin_wali_kelas_data_v1');
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_admin_wali_kelas_${formData.className || 'data'}.json`;
    link.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        localStorage.setItem('admin_wali_kelas_data_v1', JSON.stringify(json));
        window.location.reload();
      } catch (err) {
        alert("File tidak valid!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20 bg-white">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-black uppercase tracking-tight">Konfigurasi Sistem</h2>
            <p className="text-xs text-black font-bold mt-1 italic">Lengkapi data di bawah ini untuk mengaktifkan fitur otomatis.</p>
          </div>
          <div className="flex gap-2">
             <label className="cursor-pointer bg-white border border-slate-300 text-black px-4 py-2 rounded-xl text-xs font-black hover:bg-slate-50 transition-all shadow-sm">
                📥 IMPORT
                <input type="file" className="hidden" accept=".json" onChange={handleImportData} />
             </label>
             <button onClick={handleExportData} className="bg-white border border-slate-300 text-black px-4 py-2 rounded-xl text-xs font-black hover:bg-slate-50 transition-all shadow-sm">
                📤 EKSPOR
             </button>
          </div>
        </div>
        
        <div className="p-8 bg-white border-b border-slate-200 flex flex-col items-center gap-4">
            <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-slate-100 shadow-2xl bg-white flex items-center justify-center text-3xl font-black text-black overflow-hidden ring-4 ring-indigo-50">
                    {formData.teacherPhoto ? (
                        <img src={formData.teacherPhoto} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        formData.teacherName?.charAt(0) || '?'
                    )}
                </div>
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all border-2 border-white"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                />
            </div>
            <p className="text-[10px] font-black text-black uppercase tracking-widest">Foto Profil Wali Kelas</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-widest">Nama Sekolah/Madrasah</label>
              <input 
                type="text" name="schoolName" value={formData.schoolName} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-white placeholder-slate-500"
                placeholder="Misal: SMP Negeri 1 Jakarta"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-widest">Nama Kelas / Rombel</label>
              <input 
                type="text" name="className" value={formData.className} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-white placeholder-slate-500"
                placeholder="Misal: VII-A"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-widest">Alamat Lembaga</label>
              <input 
                type="text" name="schoolAddress" value={formData.schoolAddress} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-white placeholder-slate-500"
                placeholder="Jl. Raya No. 1..."
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <h3 className="font-black text-black mb-6 uppercase text-xs tracking-widest">Pejabat Berwenang</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">Nama Wali Kelas</label>
                    <input 
                    type="text" name="teacherName" value={formData.teacherName} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-white placeholder-slate-500"
                    placeholder="Nama Lengkap & Gelar"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">NIP Wali Kelas</label>
                    <input 
                    type="text" name="teacherNip" value={formData.teacherNip} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-white placeholder-slate-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">Nama Kepala Sekolah</label>
                    <input 
                    type="text" name="principalName" value={formData.principalName} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-white placeholder-slate-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">NIP Kepala Sekolah</label>
                    <input 
                    type="text" name="principalNip" value={formData.principalNip} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-white placeholder-slate-500"
                    />
                </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className={`px-10 py-4 rounded-2xl text-sm font-black shadow-2xl transition-all ${
                isSaved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95'
              }`}
            >
              {isSaved ? 'TERSIMPAN ✓' : 'SIMPAN SEMUA PERUBAHAN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupForm;
