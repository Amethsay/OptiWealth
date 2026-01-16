import React, { useState, useRef } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaUpload } from 'react-icons/fa';
import { uploadStatement } from '../api';
import type { Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  show: boolean;
  handleClose: () => void;
  addTransactions: (txns: Transaction[]) => void;
}

const UploadStatementModal: React.FC<Props> = ({ show, handleClose, addTransactions }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const extractedData = await uploadStatement(selectedFile);
      
      // Transform the extracted data into our Transaction type
      const newTransactions: Transaction[] = extractedData.map((item: any) => ({
        id: uuidv4(),
        date: item.date || new Date().toISOString(),
        amount: parseFloat(item.amount) || 0,
        description: item.description || 'N/A',
        category: 'Other', // Default category, user can change later
        isTaxDeductible: false,
        gstRate: 0,
      })).filter((t: Transaction) => t.amount > 0); // Filter out invalid entries

      addTransactions(newTransactions);
      handleClose();

    } catch (err: any) {
      setError(err.message || "An unknown error occurred during upload.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Statement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form.Control 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf,.xlsx,.csv,.docx"
          className="d-none"
        />

        <div 
          onClick={triggerFileSelect} 
          className="text-center p-5 border-2 border-dashed rounded-3"
          style={{ cursor: 'pointer', border: '2px dashed #ccc' }}
        >
          <FaUpload size={40} className="text-muted mb-3" />
          <p className="m-0">{selectedFile ? selectedFile.name : 'Click to select a file'}</p>
          <small className="text-muted">PDF, Excel, CSV, or Word</small>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>Cancel</Button>
        <Button 
          variant="primary" 
          className="bg-primary-custom border-0" 
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? <Spinner as="span" size="sm" /> : 'Upload & Analyze'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadStatementModal;
