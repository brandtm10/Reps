import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface TemplateCardProps {
  id: string
  title: string
  exercises: string[]
  onSelect: () => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onRename: (id: string, newName: string) => void
}

export function TemplateCard({ id, title, exercises, onSelect, onDelete, onDuplicate, onRename }: TemplateCardProps) {
  const [isRenaming, setIsRenaming] = useState(false) //This will be removed later
  const [newName, setNewName] = useState(title)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false) // Added rename dialog state
  const router = useRouter()

  const handleRename = () => {
    onRename(id, newName)
    setIsRenameDialogOpen(false) // Update to close rename dialog
  }

  const handleDelete = () => {
    onDelete(id)
    setIsDeleteDialogOpen(false)
  }

  const handleEditTemplate = () => {
    router.push(`/template/edit/${id}`)
  }

  useEffect(() => {
    if (isRenaming) { //This will be removed later
      const input = document.querySelector('input') as HTMLInputElement;
      if (input) {
        input.select();
      }
    }
  }, [isRenaming]); //This will be removed later

  return (
    <Card 
      className="bg-white hover:bg-gray-50 transition-colors cursor-pointer rounded-3xl" 
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {exercises.join(", ")}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setIsRenameDialogOpen(true)}> {/* Updated to open rename dialog */}
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleEditTemplate}>
                Edit Template
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDuplicate(id)}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600" 
                onSelect={() => setIsDeleteDialogOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this template?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}> {/* Added rename dialog */}
        <DialogContent className="w-[90vw] max-w-md p-0 bg-white rounded-3xl">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-lg font-semibold">Choose a Template Name</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2 space-y-3">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="rounded-2xl border-gray-200"
              autoFocus
            />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 rounded-2xl h-12"
                onClick={() => {
                  setNewName(title)
                  setIsRenameDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 rounded-2xl bg-black hover:bg-gray-800 h-12"
                onClick={() => {
                  if (newName.trim() && newName !== title) {
                    onRename(id, newName.trim())
                  }
                  setIsRenameDialogOpen(false)
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

