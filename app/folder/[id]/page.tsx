"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TemplateCard } from "@/app/components/TemplateCard"
import { X, Plus } from 'lucide-react'

interface Template {
  id: string
  name: string
  exercises: { name: string }[]
  lastModified: string
  folderId: string
}

interface Folder {
  id: string
  name: string
}

export default function FolderPage() {
  const params = useParams()
  const router = useRouter()
  const [folder, setFolder] = useState<Folder | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    const folders = JSON.parse(localStorage.getItem('folders') || '[]')
    const currentFolder = folders.find((f: Folder) => f.id === params.id)
    setFolder(currentFolder || null)

    const allTemplates = JSON.parse(localStorage.getItem('workoutTemplates') || '[]')
    const folderTemplates = allTemplates.filter((t: Template) => t.folderId === params.id)
    setTemplates(folderTemplates)
  }, [params.id])

  const handleNavigateAway = () => {
    router.back()
  }

  const handleAddTemplate = () => {
    router.push(`/template/new?folderId=${params.id}`)
  }

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId)
    setTemplates(updatedTemplates)

    // Update localStorage
    const allTemplates = JSON.parse(localStorage.getItem('workoutTemplates') || '[]')
    const updatedAllTemplates = allTemplates.filter((t: Template) => t.id !== templateId)
    localStorage.setItem('workoutTemplates', JSON.stringify(updatedAllTemplates))
  }

  const handleDuplicateTemplate = (templateId: string) => {
    const templateToDuplicate = templates.find(t => t.id === templateId)
    if (templateToDuplicate) {
      const newTemplate = {
        ...templateToDuplicate,
        id: `template-${Date.now()}`,
        name: `${templateToDuplicate.name} (2)`,
        lastModified: new Date().toISOString(),
      }
      const updatedTemplates = [...templates, newTemplate]
      setTemplates(updatedTemplates)

      // Update localStorage
      const allTemplates = JSON.parse(localStorage.getItem('workoutTemplates') || '[]')
      const updatedAllTemplates = [...allTemplates, newTemplate]
      localStorage.setItem('workoutTemplates', JSON.stringify(updatedAllTemplates))
    }
  }

  const handleRenameTemplate = (templateId: string, newName: string) => {
    const updatedTemplates = templates.map(t => 
      t.id === templateId ? { ...t, name: newName } : t
    )
    setTemplates(updatedTemplates)

    // Update localStorage
    const allTemplates = JSON.parse(localStorage.getItem('workoutTemplates') || '[]')
    const updatedAllTemplates = allTemplates.map((t: Template) => 
      t.id === templateId ? { ...t, name: newName } : t
    )
    localStorage.setItem('workoutTemplates', JSON.stringify(updatedAllTemplates))
  }

  if (!folder) {
    return <div>Folder not found</div>
  }

  return (
    <div className="min-h-screen bg-[#F1F2F3] flex flex-col">
      <header className="sticky top-0 z-10 bg-[#F1F2F3] px-6 py-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleNavigateAway}
        >
          <X className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">{folder.name}</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-1 px-6 pb-24 space-y-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            id={template.id}
            title={template.name}
            exercises={template.exercises.map(e => e.name)}
            onSelect={() => console.log('Selected template:', template.id)}
            onDelete={handleDeleteTemplate}
            onDuplicate={handleDuplicateTemplate}
            onRename={handleRenameTemplate}
          />
        ))}
      </main>

      <div className="fixed bottom-[68px] left-0 right-0 p-4 bg-[#F1F2F3] border-t border-gray-200">
        <Button 
          className="w-full rounded-2xl bg-black hover:bg-gray-800 text-white h-12"
          onClick={handleAddTemplate}
        >
          <Plus className="h-5 w-5 mr-2" />
          New Template
        </Button>
      </div>
    </div>
  )
}

