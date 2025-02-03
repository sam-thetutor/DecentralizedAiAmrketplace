import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { clearAppEndpoint, clearJWT } from '@calimero-is-near/calimero-p2p-sdk';
import { clearApplicationId } from '../utils/storage';

const NavbarWrapper = styled.nav`
  background-color: rgba(17, 17, 17, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
`;

const NavContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.img`
  height: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavButton = styled(Link)`
  background-color: #5dbb63;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4a9550;
  }
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: #ff4444;
  padding: 0.5rem 1rem;
  border: 1px solid #ff4444;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #ff4444;
    color: white;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    clearAppEndpoint();
    clearJWT();
    clearApplicationId();
    navigate('/auth');
  };

  return (
    <NavbarWrapper>
      <NavContent>
        <Link to="/home">
          {/* <Logo src={CalimeroLogo} alt="Calimero Logo" /> */}
          AgentRouter
        </Link>
        <ButtonGroup>
          <NavButton to="/proposals">Proposals</NavButton>
          <NavButton to="/chat">Chat</NavButton>
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </ButtonGroup>
      </NavContent>
    </NavbarWrapper>
  );
};

export default Navbar; 