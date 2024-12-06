"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, X } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CreateFolderDialog } from "./CreateFolderDialog"

interface SelectFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folders: Array<{
    id: string
    name: string
    templates: Array<{
      id: string
      title: string
      exercises: string[]
      lastModified: string
    }>
  }>
  onCreateFolder: (name: string) => void
}

export function SelectFolderDialog({ 
  open, 
  onOpenChange,
  folders,
  onCreateFolder
}: SelectFolderDialogProps) {
  const router = useRouter()
  const [createFolderOpen, setCreateFolderOpen] = useState(false)

  const handleFolderSelect = (folderId: string) => {
    onOpenChange(false)
    router.push(`/template/new?folderId=${folderId}`)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90vw] max-w-md p-0 bg-white rounded-3xl">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-semibold">Select Folder</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2 space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-between p-6 text-base font-semibold rounded-2xl"
              onClick={() => setCreateFolderOpen(true)}
            >
              Create New Folder
              <Plus className="h-5 w-5" />
            </Button>
            
            <div className="space-y-[1px]">
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant="ghost"
                  className="w-full justify-between p-6 text-left hover:bg-gray-50"
                  onClick={() => handleFolderSelect(folder.id)}
                >
                  <span className="text-base font-semibold">{folder.name}</span>
                  <span className="text-gray-400">
                    {folder.templates.length} template{folder.templates.length !== 1 ? 's' : ''}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CreateFolderDialog 
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        onCreateFolder={(name) => {
          onCreateFolder(name)
          setCreateFolderOpen(false)
        }}
      />
    </>
  )
}

