
import React, { useState, useEffect } from 'react';
import { Section, AppState, SchoolSetup, Student, AttendanceRecord, GradeRecord, GuidanceRecord, AchievementRecord } from './types';
import { INITIAL_SETUP } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SetupForm from './components/SetupForm';
import StudentManager from './components/StudentManager';
import AttendanceManager from './components/AttendanceManager';
import GradeManager from './components/GradeManager';
import GuidanceManager from './components/GuidanceManager';
import AchievementManager from './components/AchievementManager';
import DocumentGenerator from './components/DocumentGenerator';

const STORAGE_KEY = 'admin_wali_kelas_data_v1';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(Section.DASHBOARD);
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          achievements: parsed.achievements || []
        };
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
    return {
      setup: INITIAL_SETUP,
      students: [],
      attendance: [],
      grades: [],
      guidance: [],
      achievements: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  const updateSetup = (setup: SchoolSetup) => setAppState(prev => ({ ...prev, setup }));
  const addStudent = (student: Student) => setAppState(prev => ({ ...prev, students: [...prev.students, student] }));
  const updateStudent = (student: Student) => setAppState(prev => ({
    ...prev,
    students: prev.students.map(s => s.id === student.id ? student : s)
  }));
  const removeStudent = (id: string) => setAppState(prev => ({
    ...prev,
    students: prev.students.filter(s => s.id !== id)
  }));

  const saveAttendanceBatch = (records: AttendanceRecord[]) => {
    setAppState(prev => {
        const date = records[0]?.date;
        const filtered = prev.attendance.filter(a => a.date !== date);
        return { ...prev, attendance: [...filtered, ...records] };
    });
  };

  const addGrade = (grade: GradeRecord) => setAppState(prev => ({ ...prev, grades: [...prev.grades, grade] }));
  const addGuidance = (record: GuidanceRecord) => setAppState(prev => ({ ...prev, guidance: [...prev.guidance, record] }));
  const addAchievement = (achievement: AchievementRecord) => setAppState(prev => ({ ...prev, achievements: [...prev.achievements, achievement] }));
  const removeAchievement = (id: string) => setAppState(prev => ({ ...prev, achievements: prev.achievements.filter(a => a.id !== id) }));

  const renderContent = () => {
    switch (activeSection) {
      case Section.DASHBOARD:
        return <Dashboard state={appState} setActiveSection={setActiveSection} />;
      case Section.SETUP:
        return <SetupForm setup={appState.setup} onSave={updateSetup} />;
      case Section.STUDENTS:
        return <StudentManager students={appState.students} onAdd={addStudent} onUpdate={updateStudent} onRemove={removeStudent} />;
      case Section.ATTENDANCE:
        return <AttendanceManager students={appState.students} attendance={appState.attendance} onSave={saveAttendanceBatch} />;
      case Section.GRADES:
        return <GradeManager students={appState.students} grades={appState.grades} onAdd={addGrade} />;
      case Section.GUIDANCE:
        return <GuidanceManager students={appState.students} records={appState.guidance} onAdd={addGuidance} />;
      case Section.ACHIEVEMENTS:
        return <AchievementManager students={appState.students} achievements={appState.achievements} onAdd={addAchievement} onRemove={removeAchievement} />;
      case Section.DOCUMENTS:
        return <DocumentGenerator state={appState} />;
      default:
        return <Dashboard state={appState} setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white text-black">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-y-auto bg-white relative">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center no-print">
          <div>
            <h1 className="text-xl font-bold text-black capitalize">{activeSection.replace('_', ' ')}</h1>
            <p className="text-xs text-slate-700">
               {appState.setup.schoolName || 'Lembaga Belum Dikonfigurasi'} • Kelas {appState.setup.className || '-'}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-black">{appState.setup.teacherName || 'Guru Wali'}</p>
                <p className="text-xs text-slate-500">Wali Kelas</p>
             </div>
             <div className="w-12 h-12 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center text-black font-bold overflow-hidden shadow-sm">
                {appState.setup.teacherPhoto ? (
                  <img src={appState.setup.teacherPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  appState.setup.teacherName?.charAt(0) || 'W'
                )}
             </div>
          </div>
        </header>
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
