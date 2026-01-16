import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';
import { sendChatMessage } from '../api';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Message[]>([
    { role: 'model', parts: [{ text: "Hello! I'm FinGuide. I can help you analyze your spending or explain tax rules. Try asking 'How can I save on dining expenses?'" }] }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', parts: [{ text: input }] };
    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      // Prepare history for API (don't send the initial welcome message)
      const apiHistory = history.length > 1 ? history.slice(1) : [];
      const response = await sendChatMessage(apiHistory, input);

      const aiMsg: Message = { role: 'model', parts: [{ text: response.message }] };
      setHistory(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <Card className="card-custom border-0 shadow-sm" style={{ height: '70vh' }}>
        <Card.Header className="bg-white border-bottom py-3">
          <div className="d-flex align-items-center">
             <div className="bg-primary-custom text-white rounded-circle p-2 me-2 d-flex justify-content-center align-items-center" style={{width: 40, height: 40}}>
               <FaRobot />
             </div>
             <div>
               <h6 className="fw-bold mb-0">FinGuide AI</h6>
               <small className="text-muted text-success-custom">● Online (Live)</small>
             </div>
          </div>
        </Card.Header>
        <Card.Body className="d-flex flex-column" style={{ overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
          {error && <Alert variant="danger">{error}</Alert>}
          {history.map((msg, index) => (
            <div key={index} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
              <div 
                className={`p-3 rounded-3 shadow-sm ${msg.role === 'user' ? 'bg-primary-custom text-white' : 'bg-white text-dark'}`}
                style={{ maxWidth: '75%', borderBottomRightRadius: msg.role === 'user' ? 0 : 12, borderBottomLeftRadius: msg.role === 'model' ? 0 : 12 }}
              >
                {msg.parts[0].text}
              </div>
            </div>
          ))}
          {isTyping && <div className="text-muted small ms-2">FinGuide is typing...</div>}
        </Card.Body>
        <Card.Footer className="bg-white border-top p-3">
          <Form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="d-flex gap-2">
            <Form.Control 
              placeholder="Ask for financial advice..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              className="border-0 bg-light"
            />
            <Button type="submit" variant="primary" className="bg-primary-custom border-0" disabled={!input.trim() || isTyping}>
              <FaPaperPlane />
            </Button>
          </Form>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Chat;
