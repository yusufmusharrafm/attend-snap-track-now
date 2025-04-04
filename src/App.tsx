
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
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
import FacultyDashboardPage from "./pages/faculty/FacultyDashboardPage";
import DepartmentsPage from "./pages/faculty/DepartmentsPage";
import StudentsPage from "./pages/faculty/StudentsPage";
import ClassReportsPage from "./pages/faculty/ClassReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainLayout>
              <Routes>
                {/* Auth Page */}
                <Route path="/" element={<LoginPage />} />
                
                {/* Student Pages */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/scan" element={<ScanPage />} />
                
                {/* Faculty Pages */}
                <Route path="/faculty" element={<FacultyDashboardPage />} />
                <Route path="/faculty/departments" element={<DepartmentsPage />} />
                <Route path="/faculty/students" element={<StudentsPage />} />
                <Route path="/faculty/reports" element={<ClassReportsPage />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
