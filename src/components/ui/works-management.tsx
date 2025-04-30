"use client";

import React, { useState } from "react";
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

export function WorksManagement({ works, onWorksChanged }: WorksManagementProps) {
  const { data: session } = useSession();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  
  // Form state for adding a new work
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if the current user is authorized
  const authorizedEmail = process.env.NEXT_PUBLIC_AUTHORIZED_EMAIL;
  const isAuthorized = session?.user?.email === authorizedEmail;

  if (!isAuthorized) {
    return null; // Don't render anything if not authorized
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      tags: ""
    });
  };

  const handleAddWork = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Process tags (convert comma-separated string to array)
      const tagsArray = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
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
          tags: tagsArray
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to add work");
      }
      
      // Success - close dialog, reset form and refresh works
      toast.success("Work added successfully!");
      setIsAddDialogOpen(false);
      resetForm();
      onWorksChanged();
    } catch (error) {
      console.error("Error adding work:", error);
      toast.error(`Failed to add work: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWork = async () => {
    if (!selectedWork) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/works/delete?id=${selectedWork.id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete work");
      }
      
      // Success - close dialog and refresh works
      toast.success("Work deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedWork(null);
      onWorksChanged();
    } catch (error) {
      console.error("Error deleting work:", error);
      toast.error(`Failed to delete work: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mb-8 border border-purple-500/40 rounded-lg p-4 bg-black/30">
      <h2 className="text-xl font-bold mb-4 text-purple-300">Works Management</h2>
      
      <div className="flex flex-wrap gap-4">
        {/* Add Work Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 cursor-pointer">
              <PlusIcon className="h-4 w-4" />Add New Work
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-black/90 border-purple-500/40">
            <DialogHeader>
              <DialogTitle>Add New Work</DialogTitle>
              <DialogDescription>
                Add a new work
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddWork}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="poetry, essay, story, etc."
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="excerpt">Excerpt (Short Description)</Label>
                  <Textarea 
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    className="h-20"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea 
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="h-40"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input 
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="poetry, life, nature"
                    required
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
          </DialogContent>
        </Dialog>
        
        {/* Delete Work Button */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="cursor-pointe">
              <TrashIcon className="h-4 w-4" /> Delete Work
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-black/90 border-purple-500/40">
            <DialogHeader>
              <DialogTitle>Delete Work</DialogTitle>
              <DialogDescription>
                Select a work to delete. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Label htmlFor="workToDelete">Select Work</Label>
              <select
                id="workToDelete"
                className="flex h-10 w-full mt-2 rounded-md border border-purple-500/40 bg-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                value={selectedWork?.id || ""}
                onChange={(e) => {
                  const selected = works.find(w => w.id === e.target.value);
                  setSelectedWork(selected || null);
                }}
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
                onClick={handleDeleteWork}
                disabled={!selectedWork || isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? "Deleting..." : "Delete Work"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}