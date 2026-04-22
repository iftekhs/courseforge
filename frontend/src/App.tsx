import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Courses from './pages/Courses'
import CourseDetail from './pages/Courses/course'
import Exam from './pages/Exam'
import Settings from './pages/Settings'
import Sidebar from './components/Sidebar'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/courses" replace />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/courses/:courseId/exam" element={<Exam />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}