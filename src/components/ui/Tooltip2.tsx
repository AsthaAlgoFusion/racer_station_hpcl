import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TooltipColor = 'blue' | 'indigo' | 'teal' | 'green' | 'slate' | 'red' | 'default';
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: TooltipPosition;
  color?: TooltipColor;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  text, 
  children, 
  position = 'top', 
  color = 'default', 
  className = '' 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [actualPosition, setActualPosition] = useState<TooltipPosition>(position);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const tooltipColorStyles: Record<TooltipColor, { bg: string; borderTop: string; borderBottom: string; borderLeft: string; borderRight: string }> = {
    default: { bg: 'bg-gray-800', borderTop: 'border-t-gray-800', borderBottom: 'border-b-gray-800', borderLeft: 'border-l-gray-800', borderRight: 'border-r-gray-800' },
    blue: { bg: 'bg-blue-600', borderTop: 'border-t-blue-600', borderBottom: 'border-b-blue-600', borderLeft: 'border-l-blue-600', borderRight: 'border-r-blue-600' },
    indigo: { bg: 'bg-indigo-600', borderTop: 'border-t-indigo-600', borderBottom: 'border-b-indigo-600', borderLeft: 'border-l-indigo-600', borderRight: 'border-r-indigo-600' },
    teal: { bg: 'bg-teal-600', borderTop: 'border-t-teal-600', borderBottom: 'border-b-teal-600', borderLeft: 'border-l-teal-600', borderRight: 'border-r-teal-600' },
    green: { bg: 'bg-green-600', borderTop: 'border-t-green-600', borderBottom: 'border-b-green-600', borderLeft: 'border-l-green-600', borderRight: 'border-r-green-600' },
    slate: { bg: 'bg-slate-500', borderTop: 'border-t-slate-500', borderBottom: 'border-b-slate-500', borderLeft: 'border-l-slate-500', borderRight: 'border-r-slate-500' },
    red: { bg: 'bg-red-600', borderTop: 'border-t-red-600', borderBottom: 'border-b-red-600', borderLeft: 'border-l-red-600', borderRight: 'border-r-red-600' },
  };

  const currentColors = tooltipColorStyles[color] || tooltipColorStyles.default;

  useLayoutEffect(() => {
    if (isHovered && tooltipRef.current && triggerRef.current) {
      const tooltipEl = tooltipRef.current;
      const triggerEl = triggerRef.current;
      
      const tooltipRect = tooltipEl.getBoundingClientRect();
      const triggerRect = triggerEl.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      let newPosition = position; // Start with the preferred position

      // Simplified overflow check and flip logic
      const margin = 8; // Small margin from viewport edges

      if (position === 'top') {
        if (triggerRect.top - tooltipRect.height - margin < 0) newPosition = 'bottom';
      } else if (position === 'bottom') {
        if (triggerRect.bottom + tooltipRect.height + margin > vh) newPosition = 'top';
      } else if (position === 'left') {
        if (triggerRect.left - tooltipRect.width - margin < 0) newPosition = 'right';
      } else if (position === 'right') {
        if (triggerRect.right + tooltipRect.width + margin > vw) newPosition = 'left';
      }
      
      // Second pass if flipped: check if the new position also overflows significantly
      // This is a basic check; truly robust positioning is complex.
      if (newPosition !== position) {
        if (newPosition === 'top' && triggerRect.top - tooltipRect.height - margin < 0) {
           // If 'top' still overflows after flipping from 'bottom', consider 'right' or 'left' if space allows, or default to initial 'bottom' if it was less bad.
           // For simplicity, we'll just stick with the flipped position or original if flip is also bad.
           // This part can be expanded for more sophisticated fallbacks.
        } else if (newPosition === 'bottom' && triggerRect.bottom + tooltipRect.height + margin > vh) {
           // Similar logic if 'bottom' (flipped from 'top') also overflows
        }
        // etc. for left/right
      }

      setActualPosition(newPosition);
    }
  }, [isHovered, position, text]); // text dependency because its length affects tooltip size

  const basePositionClasses: Record<TooltipPosition, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const pointerBaseClasses: Record<TooltipPosition, string> = {
    top: `absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]`,
    bottom: `absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px]`,
    left: `absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px]`,
    right: `absolute top-1/2 -translate-y-1/2 right-full w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px]`,
  };
  
  const getPointerColorClass = (pos: TooltipPosition): string => {
    if (pos === 'top') return currentColors.borderTop;
    if (pos === 'bottom') return currentColors.borderBottom;
    if (pos === 'left') return currentColors.borderLeft;
    if (pos === 'right') return currentColors.borderRight;
    return '';
  }

  return (
    <div 
      ref={triggerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)} // For keyboard accessibility
      onBlurCapture={() => setIsHovered(false)}  // For keyboard accessibility
      tabIndex={0} // Make it focusable
    >
      {children}
      <AnimatePresence>
        {isHovered && text && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: actualPosition === 'top' ? 8 : (actualPosition === 'bottom' ? -8 : 0), x: actualPosition === 'left' ? 8 : (actualPosition === 'right' ? -8 : 0) }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: actualPosition === 'top' ? 8 : (actualPosition === 'bottom' ? -8 : 0), x: actualPosition === 'left' ? 8 : (actualPosition === 'right' ? -8 : 0) }}
            transition={{ duration: 0.15, delay: 0.1 }}
            className={`absolute z-30 px-3 py-1.5 text-xs font-medium text-white ${currentColors.bg} rounded-md shadow-lg whitespace-normal max-w-[200px] sm:max-w-xs ${basePositionClasses[actualPosition]}`}
            role="tooltip"
          >
            {text}
            <div className={`${pointerBaseClasses[actualPosition]} ${getPointerColorClass(actualPosition)}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
