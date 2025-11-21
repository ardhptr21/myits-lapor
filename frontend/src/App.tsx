import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Report from './pages/report/Report';
import ReportMe from './pages/report/ReportMe';

export default function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/reports/me" element={<ReportMe />} />
      <Route path="/reports" element={<Report />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
