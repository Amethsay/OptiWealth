import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import type { Category, Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  show: boolean;
  handleClose: () => void;
  addTransaction: (t: Transaction) => void;
}

const AddTransactionModal: React.FC<Props> = ({ show, handleClose, addTransaction }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [desc, setDesc] = useState('');

  const handleSubmit = () => {
    if (!amount) return;
    
    const newTxn: Transaction = {
      id: uuidv4(),
      date: new Date().toISOString(),
      amount: parseFloat(amount),
      category,
      description: desc,
      isTaxDeductible: false,
      gstRate: category === 'Dining' ? 18 : 0 // Simplified for demo
    };
    
    addTransaction(newTxn);
    handleClose();
    setAmount('');
    setDesc('');
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Amount (₹)</Form.Label>
            <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              <option value="Food">Food</option>
              <option value="Dining">Dining</option>
              <option value="Travel">Travel</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Investment">Investment</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" className="bg-primary-custom border-0" onClick={handleSubmit}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTransactionModal;
