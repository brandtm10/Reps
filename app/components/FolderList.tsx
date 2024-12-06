"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronDown, MoreHorizontal, Plus, Folder } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { TemplateCard } from "./TemplateCard"
import { cn } from "@/lib/utils"
import { CreateFolderDialog } from "./CreateFolderDialog"
import { SelectFolderDialog } from "./SelectFolderDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Template {
  id: string
  name: string
  exercises: {name:string}[]
  lastModified: number
  folderId: string
}

interface WorkoutFolder {
  id: string
  name: string
  templates: Template[]
}

export function FolderList() {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(() => {
    const expandedFolder = localStorage.getItem('expandedFolder')
    return expandedFolder ? [expandedFolder] : []
  })
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [selectFolderOpen, setSelectFolderOpen] = useState(false)
  const [folders, setFolders] = useState<WorkoutFolder[]>([])

  useEffect(() => {
    const loadFolders = () => {
      const storedFolders = JSON.parse(localStorage.getItem('folders') || '[]')
      const workoutTemplates = JSON.parse(localStorage.getItem('workoutTemplates') || '[]')
      
      const updatedFolders = storedFolders.map(folder => ({
        ...folder,
        templates: workoutTemplates.filter(template => template.folderId === folder.id)
      }))
      
      setFolders(updatedFolders)
    }

    loadFolders()

    const expandedFolder = localStorage.getItem('expandedFolder')
    if (expandedFolder) {
      setExpandedFolders(prev => [...prev, expandedFolder])
      localStorage.removeItem('expandedFolder')
    }

    window.addEventListener('storage', loadFolders)
    return () => window.removeEventListener('storage', loadFolders)
  }, [])

  const handleCreateFolder = (name: string) => {
    const newFolder: WorkoutFolder = {
      id: `folder-${Date.now()}`,
      name,
      templates: []
    }
    const updatedFolders = [...folders, newFolder]
    setFolders(updatedFolders)
    localStorage.setItem('folders', JSON.stringify(updatedFolders))
  }

  const handleFolderExpand = useCallback((folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    )
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-gray-400 font-medium tracking-widest uppercase">Templates</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl bg-white"
            onClick={() => setSelectFolderOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Template
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl bg-white"
            onClick={() => setCreateFolderOpen(true)}
          >
            <Folder className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-[5px] mt-2">
        {folders.map((folder) => (
          <div key={folder.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div
              className="flex items-center justify-between py-2 cursor-pointer"
              onClick={() => handleFolderExpand(folder.id)}
            >
              <div className="flex items-center">
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-base font-semibold flex-1">
                    {folder.name}
                  </h3>
                  <span className="text-sm text-gray-400 font-medium tracking-widest uppercase ml-[15px]">
                    {folder.templates.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Move</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform",
                    expandedFolders.includes(folder.id) && "transform rotate-180"
                  )}
                />
              </div>
            </div>
            
            {expandedFolders.includes(folder.id) && (
              <div className="space-y-3 mt-3 max-h-[300px] overflow-y-auto scrollbar-hide">
                {folder.templates && folder.templates.length > 0 ? (
                  folder.templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      title={template.name}
                      exercises={template.exercises.map(e => e.name)}
                      lastModified={new Date(template.lastModified).toLocaleDateString()}
                      onSelect={() => console.log('Selected template:', template.id)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    No templates in this folder
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <CreateFolderDialog 
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        onCreateFolder={handleCreateFolder}
      />

      <SelectFolderDialog
        open={selectFolderOpen}
        onOpenChange={setSelectFolderOpen}
        folders={folders}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  )
}

