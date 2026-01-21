
export enum Section {
  DASHBOARD = 'dashboard',
  SETUP = 'setup',
  STUDENTS = 'students',
  ATTENDANCE = 'attendance',
  GRADES = 'grades',
  GUIDANCE = 'guidance',
  ACHIEVEMENTS = 'achievements',
  DOCUMENTS = 'documents'
}

export interface SchoolSetup {
  schoolName: string;
  schoolType: 'sekolah' | 'madrasah' | 'pesantren';
  schoolLevel: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  className: string;
  teacherName: string;
  teacherNip: string;
  teacherPhoto?: string; // Base64 encoded string
  principalName: string;
  principalNip: string;
  curriculum: string;
  schoolAddress: string;
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  religion: string;
  address: string;
  fatherName: string;
  motherName: string;
  parentPhone: string;
}

export interface AttendanceRecord {
  date: string;
  studentId: string;
  status: 'H' | 'I' | 'S' | 'A'; // Hadir, Izin, Sakit, Alfa
  note: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  subject: string;
  category: string;
  score: number;
  description: string;
  date: string;
}

export interface GuidanceRecord {
  id: string;
  date: string;
  studentId: string;
  type: 'konseling' | 'pelanggaran' | 'prestasi' | 'lainnya';
  description: string;
  action: string;
}

export interface AchievementRecord {
  id: string;
  studentId: string;
  date: string;
  title: string;
  level: 'Sekolah' | 'Kecamatan' | 'Kabupaten/Kota' | 'Provinsi' | 'Nasional' | 'Internasional';
  rank: string;
  description: string;
}

export interface AppState {
  setup: SchoolSetup;
  students: Student[];
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  guidance: GuidanceRecord[];
  achievements: AchievementRecord[];
}
