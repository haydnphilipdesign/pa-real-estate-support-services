import { useRef } from 'react';
import { useMediaQuery } from '@chakra-ui/react';

export const useOptimizedAnimation = (p0: { intensity: number; duration: number; shouldAnimate: boolean; }) => {
  const [prefersReducedMotion] = useMediaQuery('(prefers-reduced-motion: reduce)');
  const elementRef = useRef<HTMLElement>(null);

  const getTransitionConfig = (type: 'tween' | 'spring' = 'spring') => {
    const config = {
      tween: { type: 'tween', duration: 0.3 },
      spring: { type: 'spring', stiffness: 100, damping: 20 }
    };
    return config[type];
  };

  return {
    elementRef,
    animate: !prefersReducedMotion,
    getTransitionConfig
  };
};

export const fadeConfig = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const slideConfig = (direction: 'up' | 'down' | 'left' | 'right' = 'up') => {
  const offset = 50;
  const directions = {
    up: [0, offset],
    down: [0, -offset],
    left: [offset, 0],
    right: [-offset, 0]
  };

  return {
    hidden: { opacity: 0, x: directions[direction][0], y: directions[direction][1] },
    visible: { opacity: 1, x: 0, y: 0 }
  };
};

export const scaleConfig = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

export const depthConfig = (depth: 'shallow' | 'medium' | 'deep' = 'medium') => {
  const depthValues = {
    shallow: { z: -20, rotateX: 2, rotateY: 2 },
    medium: { z: -40, rotateX: 4, rotateY: 4 },
    deep: { z: -60, rotateX: 6, rotateY: 6 }
  };

  return {
    hidden: { 
      opacity: 0, 
      z: depthValues[depth].z,
      rotateX: depthValues[depth].rotateX,
      rotateY: depthValues[depth].rotateY
    },
    visible: { 
      opacity: 1, 
      z: 0,
      rotateX: 0,
      rotateY: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100
      }
    }
  };
};
