import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ProgressBar } from 'react-bootstrap';
import { GST_RATES, calculateGSTComponent, calculateTaxLiability } from '../utils/finance';

const TaxHub: React.FC = () => {
  // GST Calculator State
  const [gstAmount, setGstAmount] = useState('');
  const [gstCategory, setGstCategory] = useState('Dining');
  const [calculatedGST, setCalculatedGST] = useState<{ base: number, tax: number } | null>(null);

  // Income Tax State
  const [income, setIncome] = useState(1200000);
  const [regime, setRegime] = useState<'Old' | 'New'>('Old');
  const [invest80C, setInvest80C] = useState(50000);

  const handleCalculateGST = () => {
    const total = parseFloat(gstAmount);
    if (!total) return;
    const rate = GST_RATES[gstCategory] || 18;
    const tax = calculateGSTComponent(total, rate);
    setCalculatedGST({ base: total - tax, tax });
  };

  const taxLiability = calculateTaxLiability({
    name: 'User',
    annualIncome: income,
    regime,
    investments80C: invest80C
  });

  return (
    <Container className="py-4">
      <h2 className="fw-bold text-primary-custom mb-4">Tax Hub 2025-26</h2>

      <Row className="g-4">
        {/* Income Tax Planner */}
        <Col md={7}>
          <Card className="card-custom h-100 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold m-0">Income Tax Planner</h5>
              <div className="btn-group">
                <Button 
                  size="sm" 
                  variant={regime === 'Old' ? 'primary' : 'outline-primary'} 
                  onClick={() => setRegime('Old')}
                >Old Regime</Button>
                <Button 
                  size="sm" 
                  variant={regime === 'New' ? 'primary' : 'outline-primary'}
                  onClick={() => setRegime('New')}
                >New Regime</Button>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Annual Income (₹)</Form.Label>
              <Form.Range 
                min={300000} max={3000000} step={50000} 
                value={income} 
                onChange={(e) => setIncome(Number(e.target.value))} 
              />
              <div className="fw-bold text-end">₹{income.toLocaleString()}</div>
            </Form.Group>

            {regime === 'Old' ? (
              <div className="mb-4">
                <Form.Label className="d-flex justify-content-between">
                  <span>Section 80C Investments</span>
                  <span className="text-muted small">Max ₹1.5L</span>
                </Form.Label>
                <ProgressBar 
                  now={(invest80C / 150000) * 100} 
                  variant="success" 
                  className="mb-2" 
                  style={{height: 10}}
                />
                <div className="d-flex justify-content-between align-items-center">
                  <Form.Control 
                    type="number" 
                    size="sm" 
                    style={{width: 120}} 
                    value={invest80C} 
                    onChange={(e) => setInvest80C(Number(e.target.value))} 
                  />
                  <small className="text-muted">
                    {invest80C < 150000 
                      ? `Invest ₹${(150000 - invest80C).toLocaleString()} more to save tax.` 
                      : 'Max limit reached!'}
                  </small>
                </div>
              </div>
            ) : (
              <div className="alert alert-info py-2 small mb-4">
                New Regime does not allow 80C deductions. Lower tax slabs applied.
              </div>
            )}

            <div className="bg-light p-3 rounded text-center mt-auto">
              <small className="text-muted text-uppercase">Estimated Tax Liability</small>
              <h2 className="fw-bold text-primary-custom mb-0">₹{taxLiability.toLocaleString()}</h2>
            </div>
          </Card>
        </Col>

        {/* GST Reverse Calculator */}
        <Col md={5}>
          <Card className="card-custom h-100 p-4">
            <h5 className="fw-bold mb-4">GST Analyzer</h5>
            <Form.Group className="mb-3">
              <Form.Label>Total Bill Amount</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="e.g., 1180" 
                value={gstAmount} 
                onChange={(e) => setGstAmount(e.target.value)} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select value={gstCategory} onChange={(e) => setGstCategory(e.target.value)}>
                {Object.keys(GST_RATES).map(c => <option key={c} value={c}>{c}</option>)}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" className="w-100 mb-4" onClick={handleCalculateGST}>
              Analyze Tax Component
            </Button>

            {calculatedGST && (
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Base Cost:</span>
                  <span className="fw-bold">₹{calculatedGST.base.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between text-danger">
                  <span>GST Paid ({GST_RATES[gstCategory]}%):</span>
                  <span className="fw-bold">+ ₹{calculatedGST.tax.toFixed(2)}</span>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TaxHub;
