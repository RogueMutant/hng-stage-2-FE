import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { InvoiceProvider } from './context/InvoiceContext';
import Sidebar from './components/Sidebar';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';
import './index.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <Router>
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<InvoiceList />} />
                <Route path="/invoice/:id" element={<InvoiceDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </InvoiceProvider>
    </ThemeProvider>
  );
};

export default App;
