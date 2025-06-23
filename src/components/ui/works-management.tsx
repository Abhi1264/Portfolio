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
import { PlusIcon, TrashIcon, PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "./rich-text-editor";

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
const AddWorkForm = React.memo(
  ({
    onSubmit,
    isSubmitting,
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
    const tagsRef = useRef<HTMLInputElement>(null);

    const [richContent, setRichContent] = React.useState("");

    // Handle form submission without any state updates
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // Convert tags string to array
      const tagsArray =
        tagsRef.current?.value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0) || [];

      // Call the parent's submit handler with all form data
      onSubmit({
        title: titleRef.current?.value || "",
        category: categoryRef.current?.value || "",
        excerpt: excerptRef.current?.value || "",
        content: richContent,
        tags: tagsArray,
      });
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-white">
              Title
            </Label>
            <Input
              id="title"
              ref={titleRef}
              required
              className="bg-neutral-950 border-purple-500/40 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category" className="text-white">
              Category
            </Label>
            <Input
              id="category"
              ref={categoryRef}
              placeholder="poetry, essay, story, etc."
              required
              className="bg-neutral-950 border-purple-500/40 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="excerpt" className="text-white">
              Excerpt (Short Description)
            </Label>
            <Textarea
              id="excerpt"
              ref={excerptRef}
              className="h-20 bg-neutral-950 border-purple-500/40 text-white"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content" className="text-white">
              Content
            </Label>
            <RichTextEditor value={richContent} onChange={setRichContent} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags" className="text-white">
              Tags (comma-separated)
            </Label>
            <Input
              id="tags"
              ref={tagsRef}
              placeholder="poetry, life, nature"
              required
              className="bg-neutral-950 border-purple-500/40 text-white"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer bg-neutral-950 text-white hover:bg-neutral-600"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white"
          >
            {isSubmitting ? "Adding..." : "Add Work"}
          </Button>
        </DialogFooter>
      </form>
    );
  }
);

AddWorkForm.displayName = "AddWorkForm";

// Create memoized delete form component with ref
const DeleteWorkForm = React.memo(
  ({
    works,
    isSubmitting,
    onDelete,
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
          <Label htmlFor="workToDelete" className="text-white">
            Select Work
          </Label>
          <select
            id="workToDelete"
            ref={workSelectRef}
            className="flex h-10 w-full mt-2 rounded-md border text-white border-purple-500/40 bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            defaultValue=""
          >
            <option value="" disabled>
              Select a work to delete
            </option>
            {works.map((work) => (
              <option key={work.id} value={work.id}>
                {work.title}
              </option>
            ))}
          </select>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer bg-neutral-950 text-white hover:bg-neutral-600"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="cursor-pointer text-white"
          >
            {isSubmitting ? "Deleting..." : "Delete Work"}
          </Button>
        </DialogFooter>
      </>
    );
  }
);

DeleteWorkForm.displayName = "DeleteWorkForm";

// Edit Work Form
const EditWorkForm = React.memo(
  ({
    work,
    onSubmit,
    isSubmitting,
  }: {
    work: Work;
    onSubmit: (formData: {
      id: string;
      title: string;
      excerpt: string;
      content: string;
      category: string;
      tags: string[];
    }) => Promise<void>;
    isSubmitting: boolean;
  }) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLInputElement>(null);
    const excerptRef = useRef<HTMLTextAreaElement>(null);
    const tagsRef = useRef<HTMLInputElement>(null);
    const [richContent, setRichContent] = React.useState(work.content || "");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const tagsArray =
        tagsRef.current?.value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0) || [];
      onSubmit({
        id: work.id,
        title: titleRef.current?.value || "",
        category: categoryRef.current?.value || "",
        excerpt: excerptRef.current?.value || "",
        content: richContent,
        tags: tagsArray,
      });
    };

    return (
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="grid gap-4 py-4 flex-1 min-h-0 overflow-y-auto">
          <div className="grid gap-2">
            <Label htmlFor="edit-title" className="text-white">
              Title
            </Label>
            <Input
              id="edit-title"
              ref={titleRef}
              defaultValue={work.title}
              required
              className="bg-neutral-950 border-purple-500/40 text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-category" className="text-white">
              Category
            </Label>
            <Input
              id="edit-category"
              ref={categoryRef}
              defaultValue={work.category}
              required
              className="bg-neutral-950 border-purple-500/40 text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-excerpt" className="text-white">
              Excerpt
            </Label>
            <Textarea
              id="edit-excerpt"
              ref={excerptRef}
              defaultValue={work.excerpt}
              className="h-20 bg-neutral-950 border-purple-500/40 text-white"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-content" className="text-white">
              Content
            </Label>
            <RichTextEditor value={richContent} onChange={setRichContent} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-tags" className="text-white">
              Tags (comma-separated)
            </Label>
            <Input
              id="edit-tags"
              ref={tagsRef}
              defaultValue={work.tags.join(", ")}
              required
              className="bg-neutral-950 border-purple-500/40 text-white"
            />
          </div>
        </div>
        <DialogFooter className="shrink-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer bg-neutral-950 text-white hover:bg-neutral-600"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    );
  }
);
EditWorkForm.displayName = "EditWorkForm";

export function WorksManagement({
  works,
  onWorksChanged,
}: WorksManagementProps) {
  const { data: session } = useSession();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEditWork, setSelectedEditWork] = useState<Work | null>(null);

  // Check if the current user is authorized - memoize this calculation
  const authorizedEmail = process.env.NEXT_PUBLIC_AUTHORIZED_EMAIL;
  const isAuthorized = useMemo(
    () => session?.user?.email === authorizedEmail,
    [session?.user?.email, authorizedEmail]
  );

  // Form submission handlers - defined before any conditional returns
  const handleAddWork = useCallback(
    async (formData: {
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
            tags: formData.tags,
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
        toast.error(
          `Failed to add work: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [onWorksChanged]
  );

  const handleDeleteWork = useCallback(
    async (workId: string) => {
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
        toast.error(
          `Failed to delete work: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [onWorksChanged]
  );

  const handleEditWork = useCallback(
    async (formData: {
      id: string;
      title: string;
      excerpt: string;
      content: string;
      category: string;
      tags: string[];
    }) => {
      try {
        setIsSubmitting(true);
        const response = await fetch(`/api/works/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            category: formData.category.toLowerCase(),
            tags: formData.tags,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to update work");
        }
        toast.success("Work updated successfully!");
        setIsEditDialogOpen(false);
        setSelectedEditWork(null);
        onWorksChanged();
      } catch (error) {
        console.error("Error updating work:", error);
        toast.error(
          `Failed to update work: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [onWorksChanged]
  );

  // Don't render anything if not authorized
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="mb-8 border border-purple-500/40 rounded-lg p-4 bg-black/30">
      <h2 className="text-xl font-bold mb-4 text-purple-300">
        Works Management
      </h2>

      <div className="flex flex-wrap gap-4">
        {/* Add Work Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 cursor-pointer">
              <PlusIcon className="mr-2 h-4 w-4" /> Add New Work
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl bg-neutral-950 border-purple-500/40">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Work</DialogTitle>
              <DialogDescription className="text-purple-300">
                Create a new work to showcase on your site
              </DialogDescription>
            </DialogHeader>

            <AddWorkForm onSubmit={handleAddWork} isSubmitting={isSubmitting} />
          </DialogContent>
        </Dialog>

        {/* Edit Work Button */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-purple-500 hover:bg-purple-700 cursor-pointer"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <PencilIcon className="mr-2 h-4 w-4" /> Edit Work
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl bg-neutral-950 border-purple-500/40 h-[80vh] flex flex-col">
            <DialogHeader className="shrink-0">
              <DialogTitle className="text-white">Edit Work</DialogTitle>
              <DialogDescription className="text-purple-300">
                Select and edit an existing work
              </DialogDescription>
            </DialogHeader>
            <div className="mb-4 shrink-0">
              <Label htmlFor="edit-work-select" className="text-white">
                Select Work
              </Label>
              <select
                id="edit-work-select"
                className="flex h-10 w-full mt-2 rounded-md border text-white border-purple-500/40 bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                value={selectedEditWork?.id || ""}
                onChange={(e) => {
                  const work =
                    works.find((w) => w.id === e.target.value) || null;
                  setSelectedEditWork(work);
                }}
              >
                <option value="" disabled>
                  Select a work to edit
                </option>
                {works.map((work) => (
                  <option key={work.id} value={work.id}>
                    {work.title}
                  </option>
                ))}
              </select>
            </div>
            {/* Make the form scrollable and take up remaining space */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {selectedEditWork && (
                <EditWorkForm
                  work={selectedEditWork}
                  onSubmit={handleEditWork}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Work Button */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="cursor-pointer">
              <TrashIcon className="mr-2 h-4 w-4" /> Delete Work
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-neutral-950 border-purple-500/40">
            <DialogHeader>
              <DialogTitle className="text-white">Delete Work</DialogTitle>
              <DialogDescription className="text-purple-300">
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
