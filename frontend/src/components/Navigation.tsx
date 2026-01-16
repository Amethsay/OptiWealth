import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaWallet } from 'react-icons/fa';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <Navbar expand="lg" className="bg-white shadow-sm py-3 mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-primary-custom fw-bold">
          <FaWallet className="me-2" size={24} />
          FinGuide AI
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/tax" active={location.pathname === '/tax'}>Tax Hub</Nav.Link>
            <Nav.Link as={Link} to="/chat" active={location.pathname === '/chat'}>AI Advisor</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
