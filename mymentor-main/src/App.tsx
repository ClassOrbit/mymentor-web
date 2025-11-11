import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import ALL your pages
import LoadingPage from './components/pages/LoadingPage.tsx';
import LoginPage from './components/pages/LoginPage.tsx';
import SelectRolePage from './components/pages/SelectRolePage.tsx';
import StudentDashboard from './components/pages/StudentDashboard.tsx';
import TeacherDashboard from './components/pages/TeacherDashboard.tsx';
import Subjects from './components/pages/student/Subjects.tsx';
import MyAgents from './components/pages/student/MyAgents.tsx';
import Assignments from './components/pages/student/Assignments.tsx';
import Classrooms from './components/pages/teacher/Classrooms.tsx';
import Upload from './components/pages/teacher/Upload.tsx';
import Review from './components/pages/teacher/Review.tsx';

// --- Import the new error pages ---
import RestrictedPage from './components/pages/RestrictedPage.tsx';
import NotFoundPage from './components/pages/NotFoundPage.tsx';


// Helper component for protected routes
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!user.role) {
    return <Navigate to="/select-role" />;
  }
  return children;
};

// Helper component to only allow students
const StudentRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'student' ? children : <RestrictedPage />;
};

const TeacherRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();

  return user?.role === 'teacher' ? children : <RestrictedPage />;
};


function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      {/* --- Auth Routes --- */}
      <Route 
        path="/login" 
        element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} 
      />
      <Route
        path="/select-role"
        element={
          !user ? <Navigate to="/login" /> :
          user.role ? <Navigate to="/dashboard" /> :
          <SelectRolePage />
        }
      />

      {/* --- Main Dashboard Route --- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
          </ProtectedRoute>
        }
      />

      {/* --- Student Routes --- */}
      <Route 
        path="/subjects" 
        element={<ProtectedRoute><StudentRoute><Subjects /></StudentRoute></ProtectedRoute>} 
      />
      <Route 
        path="/my-agents" 
        element={<ProtectedRoute><StudentRoute><MyAgents /></StudentRoute></ProtectedRoute>} 
      />
      <Route 
        path="/assignments" 
        element={<ProtectedRoute><StudentRoute><Assignments /></StudentRoute></ProtectedRoute>} 
      />

      {/* --- Teacher Routes --- */}
      <Route 
        path="/classrooms" 
        element={<ProtectedRoute><TeacherRoute><Classrooms /></TeacherRoute></ProtectedRoute>} 
      />
      <Route 
        path="/upload" 
        element={<ProtectedRoute><TeacherRoute><Upload /></TeacherRoute></ProtectedRoute>} 
      />
      <Route 
        path="/review" 
        element={<ProtectedRoute><TeacherRoute><Review /></TeacherRoute></ProtectedRoute>} 
      />

      <Route 
        path="*" 
        element={<NotFoundPage />} 
      />
    </Routes>
  );
}

export default App;