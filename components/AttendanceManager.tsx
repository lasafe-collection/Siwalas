
import React, { useState, useEffect } from 'react';
import { Student, AttendanceRecord } from '../types';

interface AttendanceManagerProps {
  students: Student[];
  attendance: AttendanceRecord[];
  onSave: (records: AttendanceRecord[]) => void;
}

const AttendanceManager: React.FC<AttendanceManagerProps> = ({ students, attendance, onSave }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentBatch, setCurrentBatch] = useState<Record<string, 'H'|'I'|'S'|'A'>>({});

  useEffect(() => {
    const existing = attendance.filter(a => a.date === selectedDate);
    const batch: Record<string, 'H'|'I'|'S'|'A'> = {};
    students.forEach(s => {
      const rec = existing.find(e => e.studentId === s.id);
      batch[s.id] = rec ? rec.status : 'H';
    });
    setCurrentBatch(batch);
  }, [selectedDate, students, attendance]);

  const handleStatusChange = (studentId: string, status: 'H'|'I'|'S'|'A') => {
    setCurrentBatch(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    const records: AttendanceRecord[] = Object.entries(currentBatch).map(([studentId, status]) => ({
      date: selectedDate,
      studentId,
      status: status as 'H' | 'I' | 'S' | 'A',
      note: ''
    }));
    onSave(records);
  };

  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 bg-white">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
        <div>
            <h2 className="font-black text-black text-lg uppercase tracking-tight">Input Kehadiran Harian</h2>
            <p className="text-xs text-slate-700 font-medium italic">Pilih tanggal dan sesuaikan status kehadiran siswa.</p>
        </div>
        <div className="flex gap-4">
            <input 
                type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-black text-sm text-white"
            />
            <button onClick={handleSave} className="bg-indigo-600 text-white px-8 py-2 rounded-xl text-sm font-black shadow-lg hover:bg-indigo-700 transition-all">SIMPAN ABSENSI</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-black">
              <th className="px-6 py-4 text-left font-black uppercase text-[10px] tracking-widest">No</th>
              <th className="px-6 py-4 text-left font-black uppercase text-[10px] tracking-widest">Nama Siswa</th>
              <th className="px-6 py-4 text-center font-black uppercase text-[10px] tracking-widest">Status Kehadiran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedStudents.map((s, idx) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-black font-black">{idx + 1}</td>
                <td className="px-6 py-4 font-black text-black">{s.name}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {[
                      { val: 'H', label: 'Hadir', active: 'bg-emerald-600 text-white shadow-emerald-500/30 border-emerald-700' },
                      { val: 'I', label: 'Izin', active: 'bg-blue-600 text-white shadow-blue-500/30 border-blue-700' },
                      { val: 'S', label: 'Sakit', active: 'bg-amber-500 text-white shadow-amber-500/30 border-amber-600' },
                      { val: 'A', label: 'Alfa', active: 'bg-red-600 text-white shadow-red-500/30 border-red-700' }
                    ].map(st => (
                      <button
                        key={st.val}
                        onClick={() => handleStatusChange(s.id, st.val as any)}
                        className={`w-10 h-10 rounded-xl font-black transition-all text-[11px] border ${
                          currentBatch[s.id] === st.val 
                            ? `${st.active} shadow-lg scale-110` 
                            : 'bg-white border-slate-200 text-slate-400 hover:border-black hover:text-black'
                        }`}
                        title={st.label}
                      >
                        {st.val}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
                <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-black font-bold">
                        Belum ada data siswa.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceManager;
