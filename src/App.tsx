
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import MainLayout from "./components/MainLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/student/DashboardPage";
import AttendancePage from "./pages/student/AttendancePage";
import ScanPage from "./pages/student/ScanPage";
import SettingsPage from "./pages/student/SettingsPage";
import FacultyDashboardPage from "./pages/faculty/FacultyDashboardPage";
import DepartmentsPage from "./pages/faculty/DepartmentsPage";
import StudentsPage from "./pages/faculty/StudentsPage";
import ClassReportsPage from "./pages/faculty/ClassReportsPage";
import TimetablePage from "./pages/faculty/TimetablePage";
import FacultySettingsPage from "./pages/faculty/SettingsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminDepartmentsPage from "./pages/admin/DepartmentsPage";
import AdminStudentsPage from "./pages/admin/StudentsPage";
import AdminSettingsPage from "./pages/admin/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <SonnerToaster />
          <BrowserRouter>
            <Routes>
              {/* Auth Page */}
              <Route path="/" element={<LoginPage />} />
              
              {/* All other pages wrapped with MainLayout */}
              <Route element={<MainLayout />}>
                {/* Common Pages */}
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Student Pages */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/scan" element={<ScanPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                
                {/* Faculty Pages */}
                <Route path="/faculty" element={<FacultyDashboardPage />} />
                <Route path="/faculty/departments" element={<DepartmentsPage />} />
                <Route path="/faculty/students" element={<StudentsPage />} />
                <Route path="/faculty/reports" element={<ClassReportsPage />} />
                <Route path="/faculty/timetable" element={<TimetablePage />} />
                <Route path="/faculty/settings" element={<FacultySettingsPage />} />
                
                {/* Admin Pages */}
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
                <Route path="/admin/students" element={<AdminStudentsPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
