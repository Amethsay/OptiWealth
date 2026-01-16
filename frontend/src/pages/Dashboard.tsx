import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { Transaction } from '../types';
import TransactionList from '../components/TransactionList';
import { calculateHealthScore } from '../utils/finance';
import { FaPlus, FaFileUpload } from 'react-icons/fa';

interface Props {
  transactions: Transaction[];
  onAddClick: () => void;
  onUploadClick: () => void; // Add this
}

const Dashboard: React.FC<Props> = ({ transactions, onAddClick, onUploadClick }) => {
  const healthScore = calculateHealthScore(transactions, 100000); // Mock monthly income 1L
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Fix Chart Data Properly
  const chartDataMap: Record<string, number> = {};
  transactions.forEach(t => {
    chartDataMap[t.category] = (chartDataMap[t.category] || 0) + t.amount;
  });
  const chartData = Object.keys(chartDataMap).map(k => ({ name: k, value: chartDataMap[k] }));

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-primary-custom">Financial Health</h2>
          <p className="text-muted">Your real-time financial fitness score.</p>
        </div>
        <div className="d-flex gap-2">
          <Button onClick={onUploadClick} variant="outline-primary" className="d-flex align-items-center">
            <FaFileUpload className="me-2" /> Upload
          </Button>
          <Button onClick={onAddClick} className="rounded-circle btn-lg bg-primary-custom border-0" style={{width: 50, height: 50}}>
            <FaPlus />
          </Button>
        </div>
      </div>

      <Row className="g-4 mb-4">
        {/* Health Score Card */}
        <Col md={4}>
          <Card className="card-custom h-100 p-3 text-center">
            <Card.Body>
              <Card.Title className="text-muted mb-4">HEALTH SCORE</Card.Title>
              <div style={{ height: 150 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: healthScore }, { value: 100 - healthScore }]}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={80}
                      startAngle={180} endAngle={0}
                      dataKey="value"
                    >
                      <Cell fill={healthScore > 70 ? "#00D09C" : "#FFBB28"} />
                      <Cell fill="#e0e0e0" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <h1 className="display-4 fw-bold mt-n4" style={{ marginTop: '-80px' }}>{healthScore}</h1>
              <p className="text-muted small">Based on 50/30/20 Rule</p>
            </Card.Body>
          </Card>
        </Col>

        {/* Spend Summary */}
        <Col md={8}>
          <Card className="card-custom h-100 p-3">
            <Card.Body>
              <div className="d-flex justify-content-between mb-4">
                 <Card.Title className="text-muted">SPENDING TRENDS</Card.Title>
                 <h4 className="fw-bold">Total: ₹{totalSpent.toLocaleString()}</h4>
              </div>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#8884d8" fontSize={12} />
                    <YAxis stroke="#8884d8" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0A2540" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <h5 className="fw-bold mb-3 text-primary-custom">Recent Transactions</h5>
      <Card className="card-custom">
        <Card.Body>
          <TransactionList transactions={transactions} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
