"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

interface CreateFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateFolder: (name: string) => void
}

export function CreateFolderDialog({ 
  open, 
  onOpenChange,
  onCreateFolder 
}: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("")

  const handleCreate = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName)
      
      setFolderName("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-md p-0 bg-white rounded-3xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-semibold">Create New Folder</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-2 space-y-3">
          <Input
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="rounded-2xl border-gray-200"
          />
          <div className="space-y-2">
            <Button 
              className="w-full rounded-2xl bg-black hover:bg-gray-800 h-12 text-sm"
              onClick={handleCreate}
            >
              Create
            </Button>
            <Button 
              variant="outline" 
              className="w-full rounded-2xl h-12 text-sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

