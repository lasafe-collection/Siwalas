
import React, { useState } from 'react';
import { AppState, Section } from '../types';
import { DOCUMENT_TEMPLATES } from '../constants';
import { createGoogleDocsCompatibleHtml, copyHtmlToClipboard } from '../utils/documentRenderer';

interface DocumentGeneratorProps {
  state: AppState;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ state }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async (html: string) => {
    const fullHtml = createGoogleDocsCompatibleHtml(html, 'Dokumen Wali Kelas');
    const success = await copyHtmlToClipboard(fullHtml);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const renderTemplatePreview = () => {
    if (!selectedTemplate) return null;

    const { setup, students, attendance, grades, guidance, achievements } = state;
    const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    let contentHtml = "";

    const headerHtml = `
      <div class="header">
        <h1>${setup.schoolName || 'NAMA SEKOLAH'}</h1>
        <p>${setup.schoolAddress || 'Alamat Sekolah'}</p>
      </div>
    `;

    const footerHtml = `
      <div class="sig-container">
        <div class="sig-box">
           <p>Mengetahui,</p>
           <p>Kepala Sekolah</p>
           <div class="sig-space"></div>
           <p><strong>${setup.principalName || '________________'}</strong></p>
           <p>NIP. ${setup.principalNip || '-'}</p>
        </div>
        <div class="sig-box">
           <p>${setup.schoolAddress?.split(',')[0] || 'Kota'}, ${now}</p>
           <p>Wali Kelas</p>
           <div class="sig-space"></div>
           <p><strong>${setup.teacherName || '________________'}</strong></p>
           <p>NIP. ${setup.teacherNip || '-'}</p>
        </div>
      </div>
    `;

    switch (selectedTemplate) {
      case 'cover':
        contentHtml = `
          <div style="text-align: center; padding: 100px 0; border: 5px double black;">
            <h1 style="font-size: 24pt; margin-bottom: 10px;">ADMINISTRASI WALI KELAS</h1>
            <h2 style="font-size: 20pt; margin-bottom: 40px;">TAHUN PELAJARAN ${setup.academicYear}</h2>
            <div style="margin: 50px 0; font-size: 16pt;">
              <p>KELAS:</p>
              <h3 style="font-size: 28pt; font-weight: bold;">${setup.className || '____'}</h3>
            </div>
            <div style="margin-top: 100px;">
              <p>Disusun Oleh:</p>
              <h3 style="font-size: 18pt; font-weight: bold;">${setup.teacherName || '____'}</h3>
              <p>NIP. ${setup.teacherNip || '____'}</p>
            </div>
            <div style="margin-top: 100px;">
              <h2 style="font-size: 20pt; font-weight: bold;">${setup.schoolName || '____'}</h2>
              <p>${setup.schoolAddress || '____'}</p>
            </div>
          </div>
        `;
        break;

      case 'student_list':
        contentHtml = `
          ${headerHtml}
          <div class="doc-title">DAFTAR PESERTA DIDIK KELAS ${setup.className}</div>
          <p>Tahun Pelajaran: ${setup.academicYear} | Semester: ${setup.semester}</p>
          <table border="1">
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;">No</th>
                <th style="width: 100px;">NIS/NISN</th>
                <th>Nama Lengkap</th>
                <th style="width: 40px; text-align: center;">L/P</th>
                <th>Tempat, Tgl Lahir</th>
              </tr>
            </thead>
            <tbody>
              ${students.map((s, i) => `
                <tr>
                  <td style="text-align: center;">${i + 1}</td>
                  <td>${s.nis}/${s.nisn}</td>
                  <td>${s.name}</td>
                  <td style="text-align: center;">${s.gender}</td>
                  <td>${s.birthPlace}, ${s.birthDate}</td>
                </tr>
              `).join('')}
              ${students.length === 0 ? '<tr><td colspan="5" style="text-align:center">Belum ada data siswa</td></tr>' : ''}
            </tbody>
          </table>
          ${footerHtml}
        `;
        break;

      case 'attendance_monthly':
        contentHtml = `
          ${headerHtml}
          <div class="doc-title">REKAPITULASI KEHADIRAN SISWA</div>
          <p>Bulan: ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
          <p>Kelas: ${setup.className} | Tahun Pelajaran: ${setup.academicYear}</p>
          <table border="1">
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;" rowspan="2">No</th>
                <th rowspan="2">Nama Peserta Didik</th>
                <th colspan="4" style="text-align: center;">Keterangan</th>
                <th rowspan="2" style="text-align: center;">%</th>
              </tr>
              <tr>
                <th style="text-align: center;">S</th>
                <th style="text-align: center;">I</th>
                <th style="text-align: center;">A</th>
                <th style="text-align: center;">JML</th>
              </tr>
            </thead>
            <tbody>
              ${students.map((s, i) => {
                const sRecords = attendance.filter(a => a.studentId === s.id);
                const sakit = sRecords.filter(r => r.status === 'S').length;
                const izin = sRecords.filter(r => r.status === 'I').length;
                const alfa = sRecords.filter(r => r.status === 'A').length;
                const total = sakit + izin + alfa;
                return `
                  <tr>
                    <td style="text-align: center;">${i + 1}</td>
                    <td>${s.name}</td>
                    <td style="text-align: center;">${sakit || '-'}</td>
                    <td style="text-align: center;">${izin || '-'}</td>
                    <td style="text-align: center;">${alfa || '-'}</td>
                    <td style="text-align: center;">${total || '-'}</td>
                    <td style="text-align: center;">-</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          ${footerHtml}
        `;
        break;

      case 'grade_recap':
        contentHtml = `
          ${headerHtml}
          <div class="doc-title">REKAPITULASI NILAI SISWA</div>
          <p>Kelas: ${setup.className} | Semester: ${setup.semester}</p>
          <table border="1">
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;">No</th>
                <th>Nama Peserta Didik</th>
                <th style="text-align: center;">Rata-rata</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              ${students.map((s, i) => {
                const sGrades = grades.filter(g => g.studentId === s.id);
                const avg = sGrades.length > 0 
                  ? (sGrades.reduce((sum, curr) => sum + curr.score, 0) / sGrades.length).toFixed(1)
                  : '-';
                return `
                  <tr>
                    <td style="text-align: center;">${i + 1}</td>
                    <td>${s.name}</td>
                    <td style="text-align: center;">${avg}</td>
                    <td>${Number(avg) >= 75 ? 'Tuntas' : avg === '-' ? '-' : 'Perlu Perbaikan'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          ${footerHtml}
        `;
        break;

      case 'guidance_log':
        contentHtml = `
          ${headerHtml}
          <div class="doc-title">BUKU CATATAN BIMBINGAN SISWA</div>
          <p>Tahun Pelajaran: ${setup.academicYear} | Kelas: ${setup.className}</p>
          <table border="1">
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;">No</th>
                <th style="width: 80px;">Tanggal</th>
                <th>Nama Siswa</th>
                <th>Masalah / Kejadian</th>
                <th>Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody>
              ${guidance.map((g, i) => {
                const student = students.find(s => s.id === g.studentId);
                return `
                  <tr>
                    <td style="text-align: center;">${i + 1}</td>
                    <td>${g.date}</td>
                    <td><strong>${student?.name || 'Siswa'}</strong></td>
                    <td>${g.description}</td>
                    <td>${g.action}</td>
                  </tr>
                `;
              }).join('')}
              ${guidance.length === 0 ? '<tr><td colspan="5" style="text-align:center">Belum ada catatan bimbingan</td></tr>' : ''}
            </tbody>
          </table>
          ${footerHtml}
        `;
        break;

      case 'achievement_report':
        contentHtml = `
          ${headerHtml}
          <div class="doc-title">BUKU CATATAN PRESTASI SISWA</div>
          <p>Tahun Pelajaran: ${setup.academicYear} | Kelas: ${setup.className}</p>
          <table border="1">
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;">No</th>
                <th style="width: 80px;">Tanggal</th>
                <th>Nama Peserta Didik</th>
                <th>Nama Prestasi / Lomba</th>
                <th style="width: 100px;">Tingkat</th>
                <th>Peringkat</th>
              </tr>
            </thead>
            <tbody>
              ${achievements.map((a, i) => {
                const student = students.find(s => s.id === a.studentId);
                return `
                  <tr>
                    <td style="text-align: center;">${i + 1}</td>
                    <td>${a.date}</td>
                    <td><strong>${student?.name || 'Siswa'}</strong></td>
                    <td>${a.title}</td>
                    <td style="text-align: center;">${a.level}</td>
                    <td>${a.rank}</td>
                  </tr>
                `;
              }).join('')}
              ${achievements.length === 0 ? '<tr><td colspan="6" style="text-align:center">Belum ada data prestasi siswa</td></tr>' : ''}
            </tbody>
          </table>
          <p style="margin-top: 15px; font-size: 10pt;">* Dokumen ini mencatat seluruh prestasi akademik maupun non-akademik yang diperoleh siswa selama masa pembelajaran.</p>
          ${footerHtml}
        `;
        break;

      case 'parent_call':
        contentHtml = `
          ${headerHtml}
          <div style="margin-bottom: 20px;">
            <p>Nomor : ___/___/___</p>
            <p>Lampiran : -</p>
            <p>Perihal : <strong>Panggilan Orang Tua Siswa</strong></p>
          </div>
          <p>Kepada Yth,</p>
          <p>Bapak/Ibu Orang Tua/Wali Siswa dari:</p>
          <p>Nama: <strong>_______________________</strong></p>
          <p>Kelas: ${setup.className}</p>
          <p>Di Tempat</p>
          
          <p style="margin-top: 20px;">Assalamu'alaikum Wr. Wb.</p>
          <p style="text-indent: 30px; text-align: justify;">Mengharap kehadiran Bapak/Ibu pada:</p>
          <table style="border: none; margin-left: 30px;">
            <tr><td style="border: none; width: 100px;">Hari/Tanggal</td><td style="border: none;">: ___________________</td></tr>
            <tr><td style="border: none;">Waktu</td><td style="border: none;">: ___________________</td></tr>
            <tr><td style="border: none;">Tempat</td><td style="border: none;">: Ruang Wali Kelas ${setup.className}</td></tr>
            <tr><td style="border: none;">Agenda</td><td style="border: none;">: Koordinasi Pembinaan Siswa</td></tr>
          </table>
          <p style="text-indent: 30px; text-align: justify; margin-top: 15px;">Mengingat pentingnya acara tersebut, kami mohon kehadiran Bapak/Ibu tepat pada waktunya. Atas perhatian dan kerjasamanya kami ucapkan terima kasih.</p>
          <p style="margin-top: 15px;">Wassalamu'alaikum Wr. Wb.</p>
          
          <div class="sig-container">
            <div class="sig-box"></div>
            <div class="sig-box">
               <p>${now}</p>
               <p>Wali Kelas</p>
               <div class="sig-space"></div>
               <p><strong>${setup.teacherName || '________________'}</strong></p>
               <p>NIP. ${setup.teacherNip || '-'}</p>
            </div>
          </div>
        `;
        break;

      default:
        contentHtml = `<p class="text-center p-10">Template "${selectedTemplate}" dalam pengembangan.</p>`;
    }

    return (
      <div className="bg-white rounded-2xl border shadow-lg overflow-hidden flex flex-col h-[80vh]">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">Preview Dokumen</h3>
          <div className="flex gap-2">
            <button 
                onClick={() => handleCopy(contentHtml)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    copySuccess ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
            >
              {copySuccess ? '✓ TERSALIN' : '📋 SALIN KE GOOGLE DOCS'}
            </button>
            <button onClick={() => setSelectedTemplate(null)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300">TUTUP</button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-10 bg-slate-200">
           <div 
             className="bg-white mx-auto shadow-2xl p-12 min-h-full w-[21cm] font-serif"
             dangerouslySetInnerHTML={{ __html: contentHtml }}
           />
        </div>
        <div className="p-4 bg-slate-50 border-t text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Gunakan fitur "Paste" di Google Docs setelah menekan tombol salin di atas.
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DOCUMENT_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => setSelectedTemplate(tmpl.id)}
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{tmpl.icon}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-500">{tmpl.category}</span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">{tmpl.title}</h3>
            <p className="text-xs text-slate-500">Klik untuk generate dokumen otomatis berdasarkan data kelas Anda.</p>
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8">
            <div className="w-full max-w-5xl">
                {renderTemplatePreview()}
            </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGenerator;
