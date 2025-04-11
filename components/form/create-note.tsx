"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPortal } from "react-dom";
import { useCreateNote } from "@/hooks/beta/note/use-create-note";
import Cookies from "js-cookie";

interface CreateNotePopoverProps {
   children: React.ReactNode;
   onNoteCreated?: () => void;
}

export function CreateNotePopover({
   children,
   onNoteCreated,
}: CreateNotePopoverProps) {
   const [open, setOpen] = React.useState(false);
   const [title, setTitle] = React.useState("");
   const [content, setContent] = React.useState("");
   const { createNote, isLoading } = useCreateNote();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // Get IDs from cookies or use defaults
      const IDWidget = Cookies.get("IDWidget") || "";
      const IDAuthor = Cookies.get("IDAuthor") || "";

      try {
         await createNote({
            IDWidget: IDWidget,
            IDAuthor: IDAuthor,
            title: title,
            content: content,
            attachment: [],
         });

         // Reset form
         setTitle("");
         setContent("");

         // Close popover
         setOpen(false);

         // Callback if provided
         if (onNoteCreated) {
            onNoteCreated();
         }

         // Reload the page
         window.location.reload();
      } catch (error) {
         console.error("Failed to create note:", error);
      }
   };

   return (
      <>
         {open &&
            createPortal(
               <div
                  className="fixed inset-0 bg-background/30 backdrop-blur-[10px] z-[49]"
                  onClick={() => setOpen(false)}
                  style={{
                     position: "fixed",
                     top: 0,
                     left: 0,
                     right: 0,
                     bottom: 0,
                  }}
               />,
               document.body
            )}
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
               className="w-80 mr-4 bg-background z-[51] relative"
               side="right"
               align="start"
               sideOffset={5}
            >
               <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="space-y-2">
                     <h4 className="font-medium leading-none">
                        CREATE NEW NOTE
                     </h4>
                     <p className="text-sm text-muted-foreground">
                        Create a new note to store your ideas and information.
                     </p>
                  </div>
                  <div className="grid gap-3">
                     <div className="items-center gap-4">
                        <Label htmlFor="title" className="pb-1">
                           Title
                        </Label>
                        <Input
                           id="title"
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           placeholder="Note Title"
                           required
                           disabled={isLoading}
                        />
                     </div>
                     <div className="items-center gap-4">
                        <Label htmlFor="content" className="pb-1">
                           Content
                        </Label>
                        <Textarea
                           id="content"
                           value={content}
                           onChange={(e) => setContent(e.target.value)}
                           placeholder="Note Content"
                           disabled={isLoading}
                        />
                     </div>
                     <div className="flex justify-between gap-2">
                        <Button
                           type="button"
                           variant="outline"
                           className="w-2/5"
                           onClick={() => setOpen(false)}
                           disabled={isLoading}
                        >
                           Cancel
                        </Button>
                        <Button
                           type="submit"
                           className="w-2/5"
                           disabled={isLoading}
                        >
                           {isLoading ? "Creating..." : "Create"}
                        </Button>
                     </div>
                  </div>
               </form>
            </PopoverContent>
         </Popover>
      </>
   );
}
