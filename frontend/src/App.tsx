import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import TaxHub from './pages/TaxHub';
import Chat from './pages/Chat';
import AddTransactionModal from './components/AddTransactionModal';
import UploadStatementModal from './components/UploadStatementModal'; // Import Upload Modal
import type { Transaction } from './types';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: uuidv4(), date: '2026-01-14', amount: 4500, category: 'Dining', description: 'Team Dinner', isTaxDeductible: false, gstRate: 18 },
    { id: uuidv4(), date: '2026-01-12', amount: 250, category: 'Travel', description: 'Uber to Work', isTaxDeductible: false, gstRate: 5 },
    { id: uuidv4(), date: '2026-01-10', amount: 15000, category: 'Investment', description: 'SIP Mutual Fund', isTaxDeductible: true, gstRate: 0 },
    { id: uuidv4(), date: '2026-01-08', amount: 2500, category: 'Shopping', description: 'Groceries', isTaxDeductible: false, gstRate: 0 },
    { id: uuidv4(), date: '2026-01-05', amount: 899, category: 'Bills', description: 'Netflix Subscription', isTaxDeductible: false, gstRate: 18 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false); // State for upload modal

  const addTransaction = (txn: Transaction) => {
    setTransactions(prev => [txn, ...prev]);
  };

  const addMultipleTransactions = (txns: Transaction[]) => {
    setTransactions(prev => [...txns, ...prev]);
  };

  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        <Navigation />
        
        <div className="flex-grow-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  transactions={transactions} 
                  onAddClick={() => setShowAddModal(true)}
                  onUploadClick={() => setShowUploadModal(true)} // Pass handler to Dashboard
                />
              } 
            />
            <Route path="/tax" element={<TaxHub />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>

        {/* Modals */}
        <AddTransactionModal 
          show={showAddModal} 
          handleClose={() => setShowAddModal(false)} 
          addTransaction={addTransaction} 
        />
        <UploadStatementModal
          show={showUploadModal}
          handleClose={() => setShowUploadModal(false)}
          addTransactions={addMultipleTransactions}
        />
        
        <footer className="bg-white py-3 text-center text-muted small mt-4">
          FinGuide AI © 2026 • Built for Financial Literacy
        </footer>
      </div>
    </Router>
  );
}

export default App;
