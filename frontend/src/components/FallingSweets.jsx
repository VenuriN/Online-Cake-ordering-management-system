import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import { motion } from 'framer-motion';
import { 
  FaBirthdayCake, 
  FaCookie, 
  FaIceCream, 
  FaCandyCane, 
  FaAppleAlt,
  FaCarrot, // For carrot cake
  FaLeaf, // For mint desserts
  FaHeart, // For heart-shaped cookies
  FaSnowflake // For frozen desserts
} from 'react-icons/fa';

// Sweet item configuration
const sweetItems = [
  { icon: FaBirthdayCake, color: '#FF85A2', size: 30 },
  { icon: FaCookie, color: '#7B5B3F', size: 25 },
  { icon: FaIceCream, color: '#FFC3D7', size: 28 },
  { icon: FaCandyCane, color: '#FF6B6B', size: 26 },
  { icon: FaAppleAlt, color: '#96D38C', size: 24 },
  { icon: FaCarrot, color: '#FFD166', size: 27 },
  { icon: FaLeaf, color: '#98D8C8', size: 22 },
  { icon: FaHeart, color: '#FF9999', size: 29 },
  { icon: FaSnowflake, color: '#73C2FB', size: 23 }
];

const FallingSweets = ({ count = 15, speed = 1 }) => {
  const [sweets, setSweets] = useState([]);

  useEffect(() => {
    // Generate random sweets
    const generateSweets = () => {
      const newSweets = [];
      
      for (let i = 0; i < count; i++) {
        const randomSweetIndex = Math.floor(Math.random() * sweetItems.length);
        const sweet = sweetItems[randomSweetIndex];
        
        newSweets.push({
          id: i,
          icon: sweet.icon,
          color: sweet.color,
          size: sweet.size,
          x: Math.random() * 100, // Random horizontal position (0-100%)
          delay: Math.random() * 20, // Random delay for animation start
          duration: (Math.random() * 15 + 10) / speed, // Random duration (10-25s) adjusted by speed
          rotation: Math.random() * 360, // Random initial rotation
          rotationSpeed: (Math.random() - 0.5) * 2, // Random rotation direction and speed
        });
      }
      
      setSweets(newSweets);
    };

    generateSweets();
    
    // Regenerate sweets periodically to maintain the animation
    const interval = setInterval(() => {
      generateSweets();
    }, 30000); // Regenerate every 30 seconds
    
    return () => clearInterval(interval);
  }, [count, speed]);

  return (
    <Container 
      fluid 
      className="position-fixed vh-100 w-100" 
      style={{ 
        pointerEvents: 'none', 
        zIndex: 1000, 
        overflow: 'hidden',
        opacity: 0.8 // 80% opacity as requested
      }}
    >
      {sweets.map((sweet) => (
        <motion.div
          key={sweet.id}
          initial={{ 
            y: -100, 
            x: `${sweet.x}vw`, 
            rotate: sweet.rotation,
            opacity: 0.8
          }}
          animate={{ 
            y: '110vh', 
            rotate: sweet.rotation + (360 * sweet.rotationSpeed),
            opacity: 0.8
          }}
          transition={{ 
            duration: sweet.duration,
            delay: sweet.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ 
            position: 'absolute',
            top: 0,
            color: sweet.color,
            fontSize: sweet.size,
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          }}
        >
          <sweet.icon />
        </motion.div>
      ))}
    </Container>
  );
};

export default FallingSweets;
