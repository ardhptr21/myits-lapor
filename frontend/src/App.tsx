import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Report from './pages/report/Report';
import ReportCreate from './pages/report/ReportCreate';
import ReportDetail from './pages/report/ReportDetail';
import ReportMe from './pages/report/ReportMe';

export default function App() {
  return (
    <Routes>
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />

      <Route path="/reports/create" element={<ReportCreate />} />
      <Route path="/reports/me" element={<ReportMe />} />
      <Route path="/reports/:id" element={<ReportDetail />} />
      <Route path="/reports" element={<Report />} />

      <Route path="/" element={<Home />} />
    </Routes>
  );
}
