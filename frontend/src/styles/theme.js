// Custom color palette for Sweet Delights Bakery
const theme = {
  colors: {
    // Primary colors
    primary: '#FF85A2',       // Soft pink - main brand color
    secondary: '#FFC3D7',     // Light pink - secondary brand color
    accent: '#7B5EA7',        // Purple - accent color for highlights
    
    // Neutrals
    dark: '#4A4A4A',          // Dark gray - for text
    light: '#FFFFFF',         // White - for backgrounds
    muted: '#F9F5F6',         // Off-white - for secondary backgrounds
    
    // Semantic colors
    success: '#96D38C',       // Soft green - for success states
    warning: '#FFD166',       // Soft yellow - for warnings
    danger: '#FF6B6B',        // Soft red - for errors
    info: '#73C2FB',          // Soft blue - for information
    
    // Additional cake-themed colors
    chocolate: '#7B5B3F',     // Chocolate brown
    vanilla: '#F3E5AB',       // Vanilla cream
    strawberry: '#FF9999',    // Strawberry pink
    blueberry: '#6B7FD7',     // Blueberry blue
    mint: '#98D8C8',          // Mint green
    
    // Gradients
    primaryGradient: 'linear-gradient(to right, #FF85A2, #FFC3D7)',
    accentGradient: 'linear-gradient(to right, #7B5EA7, #9B8DC0)',
  },
  
  // You can also define other theme properties
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    round: '50%',
    pill: '9999px',
  },
  
  boxShadow: {
    small: '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.15)',
    large: '0 8px 24px rgba(0, 0, 0, 0.2)',
  },
  
  // Font settings
  fontFamily: {
    primary: "'Poppins', sans-serif",
    secondary: "'Playfair Display', serif",
  },
};

export default theme;
