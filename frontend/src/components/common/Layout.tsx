import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  onThemeToggle?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onThemeToggle }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onThemeToggle={onThemeToggle} />
      <Container
        component="main"
        maxWidth="lg"
        sx={{ mt: 4, mb: 4, flex: 1 }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
