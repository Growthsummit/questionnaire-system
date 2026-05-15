import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Questionnaire from './pages/Questionnaire.jsx';
import ThankYou from './pages/ThankYou.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const [page, setPage] = useState('home');
  const [token, setToken] = useState(() => localStorage.getItem('mf_admin_token'));
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'https://questionnaire-api-2t7v.onrender.com';
    fetch(`${API_URL}/api/responses`)
      .then((res) => res.json())
      .then((data) => setResponses(data))
      .catch((error) => {
        console.error('Unable to load responses from the API:', error);
        setResponses([]);
      });
  }, []);

  const addResponse = (response) => setResponses((prev) => [...prev, response]);

  return (
    <>
      <Navbar page={page} setPage={setPage} token={token} setToken={setToken} />
      {page === 'home' && <Home setPage={setPage} />}
      {page === 'questionnaire' && <Questionnaire setPage={setPage} addResponse={addResponse} />}
      {page === 'thankyou' && <ThankYou setPage={setPage} />}
      {page === 'adminlogin' && <AdminLogin setPage={setPage} setToken={setToken} />}
      {page === 'dashboard' && (
        <ProtectedRoute token={token} setPage={setPage}>
          <Dashboard responses={responses} setPage={setPage} setToken={setToken} />
        </ProtectedRoute>
      )}
    </>
  );
}
