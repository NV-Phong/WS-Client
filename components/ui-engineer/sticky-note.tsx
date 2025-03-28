"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface StickyNoteProps {
  text?: string;
  date?: string;
  timeAgo?: string;
  initialX: number;
  initialY: number;
  rotation: number;
  zIndex: number;
  onDragStart?: () => void;
  onDragEnd?: (x: number, y: number) => void;
}

const StickyNote = ({ text, date, timeAgo, initialX, initialY, rotation, zIndex, onDragStart, onDragEnd }: StickyNoteProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);
  
  // Tăng stiffness và damping để giảm hiệu ứng đàn hồi
  const springConfig = { damping: 50, stiffness: 800 };
  const scaleMotion = useSpring(1, springConfig);

  useEffect(() => {
    scaleMotion.set(isDragging ? 1.02 : 1);
  }, [isDragging, scaleMotion]);

  return (
    <motion.div
      className="absolute w-64 h-64 p-6 cursor-pointer bg-[#FFFAF0] rounded-2xl shadow-lg touch-none flex flex-col"
      style={{
        rotate: rotation,
        x,
        y,
        scale: scaleMotion,
        zIndex,
      }}
      drag
      dragMomentum={false}
      dragElastic={0.01} // Giảm độ đàn hồi khi kéo
      dragTransition={{ 
        bounceStiffness: 800, // Tăng độ cứng
        bounceDamping: 50,    // Tăng độ giảm chấn
        power: 0.5            // Giảm lực kéo
      }}
      onDragStart={() => {
        setIsDragging(true);
        onDragStart?.();
      }}
      onDragEnd={(event, info) => {
        setIsDragging(false);
        onDragEnd?.(info.point.x, info.point.y);
      }}
      whileHover={{
        scale: isDragging ? 1.02 : 1.01,
        rotate: rotation + (Math.random() - 0.5) * 3,
      }}
      initial={{ opacity: 0, y: initialY + 20 }}
      animate={{ opacity: 1, y: initialY }}
      transition={{ 
        duration: 0.2,
        ease: "easeOut"
      }}
    >
      {date && (
        <div className="text-[#FF9999] text-2xl font-medium mb-2 select-none">
          {date}
        </div>
      )}
      
      {text && (
        <div className="text-gray-600 text-sm leading-relaxed select-none flex-1 overflow-y-auto">
          {text}
        </div>
      )}
      
      <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-400 text-xs select-none">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12.2H15" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 16.2H12.38" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Note • {timeAgo}
        </div>
        
        <div className="select-none">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 11L21.2 2.80005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 6.8V2H17.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default StickyNote; 