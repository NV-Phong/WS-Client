"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Save } from "lucide-react";

interface StickyNoteProps {
  date: string;
  timeAgo: string;
  text: string;
  initialX: number;
  initialY: number;
  rotation: number;
  zIndex: number;
  onDragStart?: () => void;
  onDragEnd?: (x: number, y: number) => void;
  isEditing?: boolean;
  onEditStart?: () => void;
  onEditComplete?: (newText: string, newDate: string) => void;
  animation?: string;
}

const StickyNote: React.FC<StickyNoteProps> = ({
  date,
  timeAgo,
  text,
  initialX,
  initialY,
  rotation,
  zIndex,
  onDragStart,
  onDragEnd,
  isEditing,
  onEditStart,
  onEditComplete,
  // animation,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editText, setEditText] = useState(text);
  const [editDate, setEditDate] = useState(date);
  const noteRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  const springConfig = { damping: 50, stiffness: 800 };
  const scaleMotion = useSpring(1, springConfig);

  useEffect(() => {
    scaleMotion.set(isDragging ? 1.02 : 1);
  }, [isDragging, scaleMotion]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded && noteRef.current && !noteRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  useEffect(() => {
    setEditDate(date);
  }, [date]);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push("/auth");
  };

  const handleClick = () => {
    if (!isEditing && onEditStart && isExpanded) {
      onEditStart();
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditComplete && (editText !== text || editDate !== date)) {
      onEditComplete(editText, editDate);
    }
  };

  const getAnimationVariants = () => {
    const baseVariants = {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        rotate: isExpanded ? 0 : rotation,
        scale: isExpanded ? 1.2 : 1,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 25,
          mass: 1,
          ease: [0.23, 1, 0.32, 1],
          duration: 0.3,
        },
      },
      exit: { opacity: 0 },
    };

    return baseVariants;
  };

  return (
    <motion.div
      ref={noteRef}
      className={`absolute p-6 cursor-pointer bg-[#FFFAF0] rounded-2xl shadow-lg touch-none flex flex-col ${
        isExpanded ? "w-96 h-96" : "w-64 h-64"
      }`}
      style={{
        x,
        y,
        scale: scaleMotion,
        zIndex: isExpanded ? 999 : zIndex,
      }}
      variants={getAnimationVariants()}
      initial="initial"
      animate="animate"
      exit="exit"
      drag
      dragMomentum={false}
      dragElastic={0.01}
      dragTransition={{
        bounceStiffness: 800,
        bounceDamping: 50,
        power: 0.5,
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
        scale: isDragging ? 1.02 : isExpanded ? 1.2 : 1.01,
        rotate: isExpanded ? 0 : rotation + (Math.random() - 0.5) * 3,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25,
        },
      }}
      layout
      onClick={isExpanded ? handleClick : undefined}
    >
      {isEditing && isExpanded ? (
        <>
          <input
            type="text"
            className="text-[#FF9999] text-2xl font-medium mb-2 w-full bg-transparent border-b border-[#FF9999] focus:outline-none"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
          />
          <div className="text-gray-400 text-xs mb-3">{timeAgo}</div>
          <textarea
            className="w-full flex-1 p-2 bg-transparent border border-gray-200 rounded resize-none focus:outline-none mb-4"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          <Button
            onClick={handleSaveClick}
            className="w-full bg-[#FF9999] text-white hover:bg-[#ff8080] transition-colors duration-200"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </>
      ) : (
        <>
          {date && (
            <div className="text-[#FF9999] text-2xl font-medium mb-2 select-none">
              {date}
            </div>
          )}
          {timeAgo && (
            <div className="text-gray-400 text-xs mb-3 select-none">
              {timeAgo}
            </div>
          )}
          <div className="text-gray-600 text-sm leading-relaxed select-none flex-1 overflow-y-auto">
            {text}
          </div>
        </>
      )}

      {date === "Register" && (
        <Button
          onClick={handleRegisterClick}
          className="mt-4 px-4 py-2 bg-[#FF9999] text-white rounded-lg hover:bg-[#ff8080] transition-colors duration-200"
        >
          Register Now
        </Button>
      )}

      <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-400 text-xs select-none">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 12.2H15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 16.2H12.38"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Note • {timeAgo}
        </div>

        <div className="select-none cursor-pointer" onClick={handleExpandClick}>
          <svg
            className="w-4 h-4 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 11L21.2 2.80005"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 6.8V2H17.2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default StickyNote;