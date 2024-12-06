"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from 'lucide-react'
import { ExerciseRow } from "@/app/components/ExerciseRow"
import { useToast } from "@/components/ui/use-toast"

interface Set {
  weight: number
  reps: number
  isPR?: boolean
  setType?: string
}

interface Exercise {
  id: string
  name: string
  muscle: string
  equipment: string
  sets: Set[]
  previousSets?: Set[]
}

interface Template {
  id: string
  name: string
  exercises: Exercise[]
  folderId: string
  lastModified: string
}

export default function EditTemplatePage() {
  const params = useParams()
  const router = useRouter()
  const [template, setTemplate] = useState<Template | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadTemplate = () => {
      const allTemplates = JSON.parse(localStorage.getItem('workoutTemplates') || '[]')
      const currentTemplate = allTemplates.find((t: Template) => t.id === params.id)
      if (currentTemplate) {
        setTemplate(currentTemplate)
      }
    }
    loadTemplate()
  }, [params.id])

  const handleAddSet = (exerciseId: string) => {
    if (!template) return
    setTemplate(prev => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises.map(exercise =>
          exercise.id === exerciseId
            ? { ...exercise, sets: [...exercise.sets, { weight: 0, reps: 0 }] }
            : exercise
        )
      }
    })
  }

  const handleUpdateSet = (exerciseId: string, setIndex: number, field: 'weight' | 'reps' | 'setType', value: number | string) => {
    if (!template) return
    setTemplate(prev => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises.map(exercise =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                sets: exercise.sets.map((set, index) =>
                  index === setIndex ? { ...set, [field]: value } : set
                )
              }
            : exercise
        )
      }
    })
  }

  const handleRemoveSet = (exerciseId: string, setIndex: number) => {
    if (!template) return
    setTemplate(prev => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises.map(exercise =>
          exercise.id === exerciseId
            ? { ...exercise, sets: exercise.sets.filter((_, index) => index !== setIndex) }
            : exercise
        )
      }
    })
  }

  const handleNavigateAway = () => {
    router.back()
  }

  const handleSave = () => {
    if (!template) return

    // Update localStorage
    const allTemplates = JSON.parse(localStorage.getItem('workoutTemplates') || '[]')
    const updatedTemplates = allTemplates.map((t: Template) =>
      t.id === template.id ? { ...template, lastModified: new Date().toISOString() } : t
    )
    localStorage.setItem('workoutTemplates', JSON.stringify(updatedTemplates))

    toast({
      title: "Template saved",
      description: "Your changes have been saved successfully.",
    })

    router.back()
  }

  if (!template) {
    return <div>Template not found</div>
  }

  return (
    <div className="min-h-screen bg-[#F1F2F3] flex flex-col">
      <header className="sticky top-0 z-10 bg-[#F1F2F3] px-6 py-4">
        <div className="h-8"></div>
      </header>

      <main className="flex-1 px-6 pb-[calc(84px+68px+20px)] space-y-6 overflow-y-auto">
        <Input
          value={template.name}
          onChange={(e) => setTemplate(prev => prev ? { ...prev, name: e.target.value } : prev)}
          className="text-xl h-12 bg-transparent border-0 p-0 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:outline-none focus:ring-[#F1F2F3] focus:border-[#F1F2F3]"
          placeholder="Template name"
        />

        <div className="space-y-8">
          {template.exercises.map((exercise) => (
            <ExerciseRow
              key={exercise.id}
              name={exercise.name}
              equipment={exercise.equipment}
              previousSets={exercise.previousSets}
              sets={exercise.sets}
              onAddSet={() => handleAddSet(exercise.id)}
              onUpdateSet={(setIndex, field, value) => 
                handleUpdateSet(exercise.id, setIndex, field, value)
              }
              onRemoveSet={(setIndex) => handleRemoveSet(exercise.id, setIndex)}
            />
          ))}
        </div>

        <Button 
          variant="outline"
          className="w-full rounded-2xl border-black text-black hover:bg-gray-100 h-12 font-medium"
          onClick={() => router.push('/template/add-exercise')}
        >
          Add Exercises
        </Button>
      </main>

      <div className="fixed bottom-[68px] left-0 right-0 p-4 bg-[#F1F2F3] border-t border-gray-200 flex gap-3">
        <Button 
          variant="outline" 
          size="lg" 
          className="rounded-2xl bg-white w-12 h-12 flex-shrink-0"
          onClick={handleNavigateAway}
        >
          <X className="h-6 w-6" />
        </Button>
        <Button 
          className="rounded-2xl bg-black hover:bg-gray-800 text-white h-12 flex-1"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

