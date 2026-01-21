
import React from 'react';
import { AppState, Section } from '../types';

interface DashboardProps {
  state: AppState;
  setActiveSection: (s: Section) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, setActiveSection }) => {
  const stats = [
    { label: 'Total Siswa', value: state.students.length, color: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', icon: '👥' },
    { label: 'Total Prestasi', value: state.achievements.length, color: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: '🏆' },
    { label: 'Catatan Bimbingan', value: state.guidance.length, color: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: '📝' },
    { label: 'Dokumen Siap', value: '7', color: 'bg-slate-50 border-slate-200', text: 'text-slate-700', icon: '📜' },
  ];

  const recentStudents = state.students.slice(-5).reverse();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-2xl border ${stat.color} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} border flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-extrabold text-black uppercase tracking-widest">RINGKASAN</span>
            </div>
            <h3 className="text-black text-sm font-semibold">{stat.label}</h3>
            <p className={`text-3xl font-black ${stat.text} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/30">
              <h2 className="font-bold text-black uppercase tracking-tight">Siswa Terbaru</h2>
              <button onClick={() => setActiveSection(Section.STUDENTS)} className="text-xs font-black text-indigo-600 hover:text-indigo-800">LIHAT SEMUA</button>
            </div>
            <div className="p-0">
              {recentStudents.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-black border-b border-slate-200 bg-slate-50/20">
                      <th className="px-6 py-3 font-bold uppercase text-[10px] tracking-widest">Nama</th>
                      <th className="px-6 py-3 font-bold uppercase text-[10px] tracking-widest">NIS</th>
                      <th className="px-6 py-3 font-bold uppercase text-[10px] tracking-widest text-center">Gender</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-black">{s.name}</td>
                        <td className="px-6 py-4 text-black font-medium">{s.nis}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black border ${s.gender === 'L' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-pink-50 text-pink-800 border-pink-200'}`}>
                            {s.gender === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center text-slate-600">
                  <p className="font-medium">Belum ada data siswa.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 text-black border-2 border-indigo-600 shadow-xl relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl"></div>
                <h3 className="text-lg font-black mb-1">Aksi Cepat</h3>
                <p className="text-slate-600 text-xs mb-6 font-medium">Kelola administrasi Anda dengan efisien.</p>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setActiveSection(Section.ACHIEVEMENTS)} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-2 shadow-sm">
                        <span className="text-xl">🏆</span> Prestasi
                    </button>
                    <button onClick={() => setActiveSection(Section.ATTENDANCE)} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-2 shadow-sm">
                        <span className="text-xl">📅</span> Absensi
                    </button>
                    <button onClick={() => setActiveSection(Section.DOCUMENTS)} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-2 shadow-sm">
                        <span className="text-xl">📄</span> Cetak
                    </button>
                    <button onClick={() => setActiveSection(Section.GRADES)} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-2 shadow-sm">
                        <span className="text-xl">📊</span> Nilai
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-black text-black mb-4 uppercase text-xs tracking-widest">Statistik Kehadiran</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-black font-bold">Hadir</span>
                        <span className="font-black text-emerald-600">0%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                        <div className="bg-emerald-500 h-full w-0"></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-black font-bold">Absen</span>
                        <span className="font-black text-red-600">0%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                        <div className="bg-red-500 h-full w-0"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
