"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { PlusIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

type Work = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  tags: string[];
};

interface WorksManagementProps {
  works: Work[];
  onWorksChanged: () => void;
}

// Create a fully uncontrolled form component with refs to prevent any re-renders during typing
const AddWorkForm = React.memo(({ 
  onSubmit,
  isSubmitting
}: { 
  onSubmit: (formData: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
  }) => Promise<void>;
  isSubmitting: boolean;
}) => {
  // Use refs for form inputs to avoid state updates during typing
  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const excerptRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);
  
  // Handle form submission without any state updates
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert tags string to array
    const tagsArray = tagsRef.current?.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0) || [];
    
    // Call the parent's submit handler with all form data
    onSubmit({
      title: titleRef.current?.value || '',
      category: categoryRef.current?.value || '',
      excerpt: excerptRef.current?.value || '',
      content: contentRef.current?.value || '',
      tags: tagsArray
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title"
            ref={titleRef}
            required
            className="text-white"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Input 
            id="category"
            ref={categoryRef}
            placeholder="poetry, essay, story, etc."
            required
            className="text-white"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="excerpt">Excerpt (Short Description)</Label>
          <Textarea 
            id="excerpt"
            ref={excerptRef}
            className="h-20 text-white"
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="content">Content</Label>
          <Textarea 
            id="content"
            ref={contentRef}
            className="h-40 text-white"
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input 
            id="tags"
            ref={tagsRef}
            placeholder="poetry, life, nature"
            required
            className="text-white"
          />
        </div>
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" className="cursor-pointer">Cancel</Button>
        </DialogClose>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
        >
          {isSubmitting ? "Adding..." : "Add Work"}
        </Button>
      </DialogFooter>
    </form>
  );
});

AddWorkForm.displayName = "AddWorkForm";

// Create memoized delete form component with ref
const DeleteWorkForm = React.memo(({
  works,
  isSubmitting,
  onDelete
}: {
  works: Work[];
  isSubmitting: boolean;
  onDelete: (workId: string) => Promise<void>;
}) => {
  // Use ref for work selection to avoid re-renders
  const workSelectRef = useRef<HTMLSelectElement>(null);
  
  const handleDelete = () => {
    const selectedId = workSelectRef.current?.value;
    if (selectedId) {
      onDelete(selectedId);
    }
  };
  
  return (
    <>
      <div className="py-4">
        <Label htmlFor="workToDelete">Select Work</Label>
        <select
          id="workToDelete"
          ref={workSelectRef}
          className="flex h-10 w-full mt-2 rounded-md border border-purple-500/40 bg-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
          defaultValue=""
        >
          <option value="" disabled>Select a work to delete</option>
          {works.map((work) => (
            <option key={work.id} value={work.id}>
              {work.title}
            </option>
          ))}
        </select>
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" className="cursor-pointer">Cancel</Button>
        </DialogClose>
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          {isSubmitting ? "Deleting..." : "Delete Work"}
        </Button>
      </DialogFooter>
    </>
  );
});

DeleteWorkForm.displayName = "DeleteWorkForm";

export function WorksManagement({ works, onWorksChanged }: WorksManagementProps) {
  const { data: session } = useSession();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if the current user is authorized - memoize this calculation
  const authorizedEmail = process.env.NEXT_PUBLIC_AUTHORIZED_EMAIL;
  const isAuthorized = useMemo(() => 
    session?.user?.email === authorizedEmail, 
    [session?.user?.email, authorizedEmail]
  );
  
  // Form submission handlers - defined before any conditional returns
  const handleAddWork = useCallback(async (formData: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
  }) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch("/api/works/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category.toLowerCase(),
          tags: formData.tags
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to add work");
      }
      
      // Success - close dialog and refresh works
      toast.success("Work added successfully!");
      setIsAddDialogOpen(false);
      onWorksChanged();
    } catch (error) {
      console.error("Error adding work:", error);
      toast.error(`Failed to add work: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [onWorksChanged]);

  const handleDeleteWork = useCallback(async (workId: string) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/works/delete?id=${workId}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete work");
      }
      
      // Success - close dialog and refresh works
      toast.success("Work deleted successfully!");
      setIsDeleteDialogOpen(false);
      onWorksChanged();
    } catch (error) {
      console.error("Error deleting work:", error);
      toast.error(`Failed to delete work: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [onWorksChanged]);
  
  // Don't render anything if not authorized
  if (!isAuthorized) {
    return null;
  }
  
  return (
    <div className="mb-8 border border-purple-500/40 rounded-lg p-4 bg-black/30">
      <h2 className="text-xl font-bold mb-4 text-purple-300">Works Management</h2>
      
      <div className="flex flex-wrap gap-4">
        {/* Add Work Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 cursor-pointer">
              <PlusIcon className="mr-2 h-4 w-4" /> Add New Work
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-black/90 border-purple-500/40">
            <DialogHeader>
              <DialogTitle>Add New Work</DialogTitle>
              <DialogDescription>
                Create a new work to showcase on your site
              </DialogDescription>
            </DialogHeader>
            
            <AddWorkForm 
              onSubmit={handleAddWork} 
              isSubmitting={isSubmitting} 
            />
          </DialogContent>
        </Dialog>
        
        {/* Delete Work Button */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="cursor-pointer">
              <TrashIcon className="mr-2 h-4 w-4" /> Delete Work
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-black/90 border-purple-500/40">
            <DialogHeader>
              <DialogTitle>Delete Work</DialogTitle>
              <DialogDescription>
                Select a work to delete. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <DeleteWorkForm 
              works={works}
              isSubmitting={isSubmitting}
              onDelete={handleDeleteWork}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}