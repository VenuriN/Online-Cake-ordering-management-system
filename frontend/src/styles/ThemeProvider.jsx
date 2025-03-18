import React from 'react';
import { createGlobalStyle } from 'styled-components';
import './variables.css';

// Import Google Fonts
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
  
  body {
    font-family: var(--font-primary);
    color: var(--color-dark);
    background-color: var(--color-light);
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-secondary);
  }
  
  .btn-primary {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
  }
  
  .btn-primary:hover, .btn-primary:focus, .btn-primary:active {
    background-color: var(--color-primary);
    filter: brightness(90%);
    border-color: var(--color-primary);
  }
  
  .btn-secondary {
    background-color: var(--color-secondary);
    border-color: var(--color-secondary);
    color: var(--color-dark);
  }
  
  .btn-accent {
    background-color: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--color-light);
  }
  
  .text-primary {
    color: var(--color-primary) !important;
  }
  
  .text-secondary {
    color: var(--color-secondary) !important;
  }
  
  .text-accent {
    color: var(--color-accent) !important;
  }
  
  .bg-primary {
    background-color: var(--color-primary) !important;
  }
  
  .bg-secondary {
    background-color: var(--color-secondary) !important;
  }
  
  .bg-accent {
    background-color: var(--color-accent) !important;
  }
  
  .bg-muted {
    background-color: var(--color-muted) !important;
  }
  
  .bg-gradient-primary {
    background: var(--gradient-primary) !important;
  }
  
  .bg-gradient-accent {
    background: var(--gradient-accent) !important;
  }
  
  /* Card styling */
  .card {
    border-radius: var(--radius-medium);
    box-shadow: var(--shadow-small);
    border: none;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
  }
  
`;

const ThemeProvider = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      {children}
    </>
  );
};

export default ThemeProvider;
