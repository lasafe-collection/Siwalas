
import React from 'react';

export const DOCUMENT_TEMPLATES = [
  { id: 'cover', title: 'Sampul Administrasi', category: 'Umum', icon: '📄' },
  { id: 'student_list', title: 'Daftar Peserta Didik', category: 'Data Siswa', icon: '📋' },
  { id: 'attendance_monthly', title: 'Rekap Absensi Bulanan', category: 'Kehadiran', icon: '📅' },
  { id: 'grade_recap', title: 'Rekap Nilai Semester', category: 'Penilaian', icon: '📊' },
  { id: 'guidance_log', title: 'Buku Bimbingan', category: 'Bimbingan', icon: '💬' },
  { id: 'achievement_report', title: 'Buku Prestasi Siswa', category: 'Prestasi', icon: '🏆' },
  { id: 'parent_call', title: 'Surat Panggilan Ortu', category: 'Komunikasi', icon: '✉️' },
];

export const INITIAL_SETUP: any = {
  schoolName: '',
  schoolType: 'sekolah',
  schoolLevel: 'SMP/MTs',
  academicYear: '2024/2025',
  semester: 'Ganjil',
  className: '',
  teacherName: '',
  teacherNip: '',
  teacherPhoto: '',
  principalName: '',
  principalNip: '',
  curriculum: 'Kurikulum Merdeka',
  schoolAddress: ''
};
