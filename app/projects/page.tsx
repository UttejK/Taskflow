"use client";

import { Button } from "@/components/ui/button";
import ResponsiveGrid from "@/components/ui/responsive-grid";
import { PROJECTS } from "@/lib/data";
import { ProjectItem } from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

// shadcn dialog components (adjust path if your scaffold differs)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function fuzzyMatch(text: string, query: string) {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return true;
  if (t.includes(q)) return true;

  const tokens = q.split(/\s+/);
  return tokens.every((token) => {
    if (t.includes(token)) return true;
    let i = 0;
    for (let j = 0; j < t.length && i < token.length; j++) {
      if (t[j] === token[i]) i++;
    }
    return i === token.length;
  });
}

export default function ProjectsPage() {
  // Projects state (client-side)
  const [projects, setProjects] = useState<ProjectItem[]>(() => [...PROJECTS]);

  // UI state for filter
  const [showFilter, setShowFilter] = useState(false);
  const [filterInput, setFilterInput] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Add-modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [meta, setMeta] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  // preview validity
  const [imageValid, setImageValid] = useState<boolean | null>(null);

  // debounce filter input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedFilter(filterInput), 250);
    return () => clearTimeout(id);
  }, [filterInput]);

  // auto-focus when filter is shown
  useEffect(() => {
    if (showFilter) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showFilter]);

  // compute filtered list
  const filtered = useMemo(() => {
    if (!debouncedFilter) return projects;
    const q = debouncedFilter.trim();
    return projects.filter((p) => {
      const hay = `${p.title ?? ""} ${p.description ?? ""} ${p.meta ?? ""}`;
      return fuzzyMatch(hay, q);
    });
  }, [projects, debouncedFilter]);

  // handlers for add modal
  function openAdd() {
    setFormError(null);
    setTitle("");
    setDescription("");
    setImage("");
    setMeta("");
    setImageValid(null);
    setIsAddOpen(true);
  }

  function handleAddSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }

    const newItem: ProjectItem = {
      id: `p-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      image: image.trim() || undefined,
      meta: meta.trim() || undefined,
    };

    setProjects((prev) => [newItem, ...prev]);

    setTitle("");
    setDescription("");
    setImage("");
    setMeta("");
    setFormError(null);
    setImageValid(null);
    setIsAddOpen(false);
  }

  // update imageValid when image URL changes (reset to null -> will update on load/error)
  useEffect(() => {
    setImageValid(null);
  }, [image]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Projects</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* New button opens the add modal */}
          <Button size="sm" onClick={openAdd}>
            New
          </Button>

          {/* Filter group */}
          <div className="relative">
            <button
              onClick={() => setShowFilter((s) => !s)}
              className="inline-flex items-center rounded-md border px-3 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Filter
            </button>

            {/* Animated filter input: visible on toggle */}
            <div
              className={`absolute right-0 top-full mt-2 transform transition-all duration-150 origin-top-right ${
                showFilter
                  ? "scale-y-100 opacity-100"
                  : "scale-y-0 opacity-0 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-2 rounded-md border bg-white px-2 py-1 shadow-md dark:bg-slate-900">
                <input
                  ref={inputRef}
                  value={filterInput}
                  onChange={(e) => setFilterInput(e.target.value)}
                  placeholder="Search projects..."
                  className="w-56 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                {filterInput ? (
                  <button
                    onClick={() => {
                      setFilterInput("");
                      setDebouncedFilter("");
                      inputRef.current?.focus();
                    }}
                    className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Clear filter"
                  >
                    <X size={14} />
                  </button>
                ) : null}
              </div>

              <div className="mt-1 w-full rounded-md bg-white/90 px-3 py-2 text-xs shadow-sm dark:bg-slate-900/90">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Try parts of title or characters in order.
                </div>
              </div>
            </div>
          </div>

          {/* Add Project Dialog (controlled) */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add project</DialogTitle>
                <DialogDescription>
                  Fill in a title (required) and optional details.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={(e) => handleAddSubmit(e)}
                className="mt-4 flex flex-col gap-3"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Title *
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none"
                    placeholder="Project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none"
                    placeholder="Short description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Image URL
                  </label>
                  <input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none"
                    placeholder="https://..."
                  />

                  {/* Plain <img> preview for arbitrary URLs (safer than next/image for free-form URLs) */}
                  {image ? (
                    <div className="mt-2 h-32 w-full overflow-hidden rounded-md border bg-slate-100 flex items-center justify-center">
                      {imageValid === false ? (
                        <div className="text-xs text-slate-500">
                          Preview unavailable
                        </div>
                      ) : (
                        <img
                          src={image}
                          alt="preview"
                          className="h-full w-full object-cover"
                          onLoad={() => setImageValid(true)}
                          onError={() => setImageValid(false)}
                        />
                      )}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Meta
                  </label>
                  <input
                    value={meta}
                    onChange={(e) => setMeta(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none"
                    placeholder="e.g. React, Next.js"
                  />
                </div>

                {formError ? (
                  <div className="text-sm text-red-600">{formError}</div>
                ) : null}

                <DialogFooter>
                  <div className="flex w-full justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddOpen(false);
                        setImageValid(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" onClick={(e) => handleAddSubmit(e)}>
                      Add Project
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <ResponsiveGrid items={filtered} />
      </div>
    </div>
  );
}
