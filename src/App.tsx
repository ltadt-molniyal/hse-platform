import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './modules/dashboard/DashboardPage';
import ScannerPage from './modules/scanner/ScannerPage';
import FormPCCC from './modules/pccc/FormPCCC';
import Form6S from './modules/inspection/Form6S';
import FormElec from './modules/elec/FormElec';
import TaskList from './modules/tasks/TaskList';
import HistoryPage from './modules/history/HistoryPage';
import QuestionBankPage from './modules/admin/QuestionBankPage';
import LoginPage from './modules/auth/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="scan" element={<ScannerPage />} />
            <Route path="pccc/form" element={<FormPCCC />} />
            <Route path="inspection/form" element={<Form6S />} />
            <Route path="elec/form" element={<FormElec />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="admin/questions" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><QuestionBankPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
