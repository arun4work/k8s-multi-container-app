import styled from '@emotion/styled';
import { Link, NavLink } from 'react-router-dom';

const Nav = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const LogoLink = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #3b82f6;
  text-decoration: none; /* Remove default underline */
  cursor: pointer;
`;

const NavLinks = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

// Styled NavLink for Menu Items
const StyledNavLink = styled(NavLink)`
  font-size: 1rem;
  font-weight: 500;
  color: #4b5563;
  text-decoration: none;
  transition: color 0.2s;
  position: relative;

  &:hover {
    color: #3b82f6;
  }

  /* React Router automatically adds an 'active' class to NavLink */
  &.active {
    color: #3b82f6;
    font-weight: 700;
  }
`;

const Header = () => {
  return (
    <Nav>
      <LogoLink to="/">Docker Multi Container App</LogoLink>

      <NavLinks>
        <StyledNavLink to="/">Home</StyledNavLink>
        <StyledNavLink to="/other">Other</StyledNavLink>
      </NavLinks>
    </Nav>
  );
};

export default Header;
