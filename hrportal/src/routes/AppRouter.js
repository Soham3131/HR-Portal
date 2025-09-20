

// src/routes/AppRouter.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import EmployeeProfile from '../pages/EmployeeProfile';
import HRDashboard from '../pages/HRDashboard';
import HREmployeeView from '../pages/HREmployeeView';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import RegisterHRPage from "../pages/registerHRPage";
import EODReportsPage from "../pages/EODReportsPage";
import ManageEmployeesPage from '../pages/ManageEmployeesPage';
import SalaryCalculatorPage from '../pages/SalaryCalculatorPage';
import EmployeeAnnouncements from '../pages/EmployeeAnnouncements';
import AnnouncementsPage from '../pages/AnnouncmentsPage';
import AnalyticsDashboard from '../pages/AnalyticsDashbaord';
import GetDataPage from '../pages/GetDataPage';
import ApplyForLeavePage from '../pages/ApplyForLeavePage';
import ApproveLeavePage from '../pages/ApproveLeavePage';
import MainLayout from "../components/MainLayout";
import RankingsPage from '../pages/RankingsPage';
import PenaltiesPage from '../pages/PenaltiesPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
      <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
      <Route path="/register-hr" element={<RegisterHRPage />} />
      <Route path="/forgot-password" element={<MainLayout><ForgotPasswordPage /></MainLayout>} />

      {/* Employee Protected Routes */}
      <Route 
        path="/employee/dashboard" 
        element={<ProtectedRoute roles={['employee']}><MainLayout><EmployeeDashboard /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/employee/profile" 
        element={<ProtectedRoute roles={['employee']}><MainLayout><EmployeeProfile /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/employee/announcements" 
        element={<ProtectedRoute roles={['employee']}><MainLayout><EmployeeAnnouncements /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/employee/apply-leave" 
        element={<ProtectedRoute roles={['employee']}><MainLayout><ApplyForLeavePage /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/employee/rankings" 
        element={<ProtectedRoute roles={['employee']}><MainLayout><RankingsPage /></MainLayout></ProtectedRoute>} 
      />

      {/* HR Protected Routes */}

      
      <Route 
        path="/hr/dashboard" 
        element={<ProtectedRoute roles={['hr']}><MainLayout><HRDashboard /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/hr/employee/:id" 
        element={<ProtectedRoute roles={['hr']}><HREmployeeView /></ProtectedRoute>} 
      />
      <Route 
        path="/hr/eod-reports" 
        element={<ProtectedRoute roles={['hr']}><EODReportsPage /></ProtectedRoute>} 
      />
      <Route 
        path="/hr/manage-employees" 
        element={<ProtectedRoute roles={['hr']}><ManageEmployeesPage /></ProtectedRoute>} 
      />
      <Route 
        path="/hr/salary-calculator" 
        element={<ProtectedRoute roles={['hr']}><SalaryCalculatorPage /></ProtectedRoute>} 
      />
      <Route 
        path="/hr/announcements" 
        element={<ProtectedRoute roles={['hr']}><AnnouncementsPage /></ProtectedRoute>} 
      />
      <Route 
        path="/hr/analytics" 
        element={<ProtectedRoute roles={['hr']}><AnalyticsDashboard /></ProtectedRoute>} 
      />
      {/* --- NEW HR RANKINGS ROUTE --- */}
      <Route 
        path="/hr/rankings" 
        element={<ProtectedRoute roles={['hr']}><MainLayout><RankingsPage /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/hr/getdata" 
        element={<ProtectedRoute roles={['hr']}><GetDataPage /></ProtectedRoute>} 
      />
      <Route 
        path="/hr/approve-leave" 
        element={<ProtectedRoute roles={['hr']}><ApproveLeavePage /></ProtectedRoute>} 
      />
 <Route 
        path="/hr/penalties" 
        element={
          <ProtectedRoute roles={['hr']}>
            <MainLayout>
              <PenaltiesPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      {/* Catch-all Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
