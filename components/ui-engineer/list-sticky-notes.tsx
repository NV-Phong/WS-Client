"use client";

import { useState } from "react";
import StickyNote from "./sticky-note";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import GradientBackground from "./gradient-background";
import { useGetNotes } from "@/hooks/note/use-get-notes";
import { formatDistanceToNow } from 'date-fns';
import { useCreateNote } from "@/hooks/note/use-create-note";

interface LocalNote {
  id: string;
  date: string;
  timeAgo: string;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  text: string;
}

const ListStickyNotes = ({ widgetId = "default-widget" }: { widgetId?: string | null }) => {
   const { notes: apiNotes, isLoading, reload: reloadNotes } = useGetNotes(widgetId ?? "default-widget");
   const { createNote: createApiNote } = useCreateNote();
   const [localNotes, setLocalNotes] = useState<LocalNote[]>([]); // Add type annotation
   const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

   // Transform API notes to sticky notes format
   const transformedNotes = [...apiNotes.map((note, index) => ({
      id: note.IDNote,
      date: note.Title || "Untitled", // Use Title as date
      timeAgo: formatDistanceToNow(new Date(note.CreatedAt), { addSuffix: true }),
      x: 150 + (index * 100), // Generate positions based on index
      y: 200 + (index * 50),
      rotation: Math.random() * 10 - 5,
      zIndex: index,
      text: note.Content || "No content", // Use Content as text
   })), ...localNotes];

   const createNote = () => {
      const newNote: LocalNote = {
         id: Date.now().toString(), // Use timestamp as string ID
         date: "Today",
         timeAgo: "just now",
         x: Math.random() * (window.innerWidth - 400) + 200,
         y: Math.random() * (window.innerHeight - 400) + 200,
         rotation: Math.random() * 10 - 5,
         zIndex: transformedNotes.length,
         text: "Click to edit your note...",
      };
      setLocalNotes(prev => [...prev, newNote]);
   };

   const handleDragStart = (id: string) => () => {
      const draggedNote = transformedNotes.find((note) => note.id === id);
      if (!draggedNote) return;

      // const otherNotes = transformedNotes.filter((note) => note.id !== id);
      // Update positions in your state management if needed
   };

   const handleDragEnd = (id: string) => (x: number, y: number) => {
      setLocalNotes(prev => prev.map(note => 
         note.id === id 
            ? { ...note, x, y }
            : note
      ));

      // For API notes, you might want to update their positions in the backend
      const apiNote = apiNotes.find(note => note.IDNote === id);
      if (apiNote) {
         console.log(`Update API note ${id} position to x:${x}, y:${y}`);
         // Here you would call your API update function
      }
   };

   const handleNoteEdit = async (id: string, newText: string, newDate: string) => {
      // Check if this is a local note
      const isLocalNote = localNotes.some(note => note.id === id);
      
      try {
         if (isLocalNote) {
            // Create new note in API
            const noteData = {
               WidgetType: "Note",
               Width: 200, // Default width
               Height: 200, // Default height
               Color: "#FFFFFF", // Default color
               PositionX: 150, // You can get actual position from note
               PositionY: 150, // You can get actual position from note
               Title: newDate, // Using date as Title
               Content: newText // Using text as Content
            };

            await createApiNote(noteData);
            
            // Remove from local notes after successful API creation
            setLocalNotes(prev => prev.filter(note => note.id !== id));
            
            // Reload notes after successful creation
            await reloadNotes();
         } else {
            // Handle API note updates here if needed
            console.log("API note update:", id, newText, newDate);
         }
      } catch (error) {
         console.error("Error saving note:", error);
      } finally {
         setEditingNoteId(null);
      }
   };

   if (isLoading) {
      return <div>Loading...</div>;
   }

   return (
      <div className="absolute inset-0 overflow-hidden">
         <GradientBackground />
         <Button
            onClick={createNote}
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 z-50 shadow-lg hover:shadow-xl transition-shadow"
            size="icon"
         >
            <Plus className="w-6 h-6" />
         </Button>
         {transformedNotes.map((note, index) => (
            <motion.div
               key={note.id}
               initial={{
                  opacity: 0,
                  y: 100,
                  scale: 0.8,
                  rotate: note.rotation,
               }}
               animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: note.rotation,
               }}
               transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
               }}
            >
               <StickyNote
                  date={note.date}
                  timeAgo={note.timeAgo}
                  text={note.text}
                  initialX={note.x}
                  initialY={note.y}
                  rotation={note.rotation}
                  zIndex={note.zIndex}
                  onDragStart={handleDragStart(note.id)}
                  onDragEnd={handleDragEnd(note.id)}
                  isEditing={editingNoteId === note.id}
                  onEditStart={() => setEditingNoteId(note.id)}
                  onEditComplete={(newText, newDate) => 
                     handleNoteEdit(note.id, newText, newDate)
                  }
               />
            </motion.div>
         ))}
      </div>
   );
};

export default ListStickyNotes;
