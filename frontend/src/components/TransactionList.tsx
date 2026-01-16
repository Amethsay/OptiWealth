import React from 'react';
import { ListGroup } from 'react-bootstrap';
import type { Transaction } from '../types';
import { FaHamburger, FaCar, FaFileInvoiceDollar, FaShoppingBag, FaChartLine } from 'react-icons/fa';

interface Props {
  transactions: Transaction[];
}

const getIcon = (cat: string) => {
  switch (cat) {
    case 'Food': 
    case 'Dining': return <FaHamburger className="text-warning" />;
    case 'Travel': return <FaCar className="text-info" />;
    case 'Bills': return <FaFileInvoiceDollar className="text-danger" />;
    case 'Investment': return <FaChartLine className="text-success" />;
    default: return <FaShoppingBag className="text-primary" />;
  }
};

const TransactionList: React.FC<Props> = ({ transactions }) => {
  return (
    <ListGroup variant="flush">
      {transactions.slice(0, 5).map(t => (
        <ListGroup.Item key={t.id} className="d-flex justify-content-between align-items-center border-0 mb-2 shadow-sm rounded">
          <div className="d-flex align-items-center">
            <div className="p-2 bg-light rounded-circle me-3">
              {getIcon(t.category)}
            </div>
            <div>
              <div className="fw-bold">{t.category}</div>
              <small className="text-muted">{t.description || t.date.split('T')[0]}</small>
            </div>
          </div>
          <div className="fw-bold">₹{t.amount.toLocaleString()}</div>
        </ListGroup.Item>
      ))}
      {transactions.length === 0 && <p className="text-muted text-center py-3">No recent transactions.</p>}
    </ListGroup>
  );
};

export default TransactionList;
