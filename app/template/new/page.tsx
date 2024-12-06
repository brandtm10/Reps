"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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

export default function NewTemplatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const folderId = searchParams.get('folderId')
  const [templateName, setTemplateName] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const { toast } = useToast()

  // Load selected exercises from localStorage when navigating back from add-exercise page
  useEffect(() => {
    const selectedExercises = localStorage.getItem('selectedExercises');
    const currentExercises = localStorage.getItem('currentExercises');

    if (selectedExercises || currentExercises) {
      const parsedSelectedExercises = selectedExercises ? JSON.parse(selectedExercises) : [];
      const parsedCurrentExercises = currentExercises ? JSON.parse(currentExercises) : [];

      const mergedExercises = [...parsedCurrentExercises];
      parsedSelectedExercises.forEach(selectedExercise => {
        const existingIndex = mergedExercises.findIndex(e => e.id === selectedExercise.id);
        if (existingIndex === -1) {
          mergedExercises.push({
            ...selectedExercise,
            sets: [{ weight: 0, reps: 0 }]
          });
        }
      });

      setExercises(mergedExercises);
      localStorage.setItem('currentExercises', JSON.stringify(mergedExercises));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currentExercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    const savedTemplateName = localStorage.getItem('currentTemplateName');
    if (savedTemplateName) {
      setTemplateName(savedTemplateName);
    }
  }, []);

  const handleAddSet = (exerciseId: string) => {
    setExercises(prev => prev.map(exercise => 
      exercise.id === exerciseId
        ? { ...exercise, sets: [...exercise.sets, { weight: 0, reps: 0 }] }
        : exercise
    ))
  }

  const handleUpdateSet = (exerciseId: string, setIndex: number, field: 'weight' | 'reps' | 'setType', value: number | string) => {
    setExercises(prev => prev.map(exercise => 
      exercise.id === exerciseId
        ? {
            ...exercise,
            sets: exercise.sets.map((set, index) =>
              index === setIndex ? { ...set, [field]: value } : set
            )
          }
        : exercise
    ))
  }

  const handleRemoveSet = (exerciseId: string, setIndex: number) => {
    setExercises(prev => prev.map(exercise => 
      exercise.id === exerciseId
        ? { ...exercise, sets: exercise.sets.filter((_, index) => index !== setIndex) }
        : exercise
    ))
  }

  const handleNavigateAway = () => {
    localStorage.removeItem('currentExercises');
    localStorage.removeItem('selectedExercises');
    localStorage.removeItem('currentTemplateName');
    router.back();
  };

  const createTemplate = useCallback(() => {
    if (!templateName.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your workout template.",
        variant: "destructive",
      })
      return null
    }
    
    return {
      id: Date.now().toString(),
      name: templateName,
      folderId,
      exercises: exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({
          weight: set.weight,
          reps: set.reps,
          setType: set.setType || 'normal'
        }))
      })),
      lastModified: new Date().toISOString()
    }
  }, [templateName, folderId, exercises])

  const handleSaveTemplate = () => {
    const newTemplate = createTemplate()
    if (!newTemplate) return

    // Save to local storage
    const existingTemplates = JSON.parse(localStorage.getItem('workoutTemplates') || '[]')
    const updatedTemplates = [...existingTemplates, newTemplate]
    localStorage.setItem('workoutTemplates', JSON.stringify(updatedTemplates))
    
    // Update folder template count
    const folders = JSON.parse(localStorage.getItem('folders') || '[]')
    const updatedFolders = folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, templateCount: (folder.templateCount || 0) + 1 }
        : folder
    )
    localStorage.setItem('folders', JSON.stringify(updatedFolders))
    
    // Clear temporary storage
    localStorage.removeItem('currentExercises')
    localStorage.removeItem('selectedExercises')
    localStorage.removeItem('currentTemplateName')
    
    // Store the folder ID to expand
    localStorage.setItem('expandedFolder', folderId || '')

    // Redirect to home page
    router.push('/')
    
    toast({
      title: "Template saved",
      description: `Your workout template "${newTemplate.name}" has been saved successfully.`,
    })
  }

  const handleTemplateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setTemplateName(newName);
    localStorage.setItem('currentTemplateName', newName);
  };

  return (
    <div className="min-h-screen bg-[#F1F2F3] flex flex-col">
      <header className="sticky top-0 z-10 bg-[#F1F2F3] px-6 py-4">
        <div className="h-8"></div>
      </header>

      <main className="flex-1 px-6 pb-[calc(84px+68px+20px)] space-y-6 overflow-y-auto">
        <Input
          value={templateName}
          onChange={handleTemplateNameChange}
          className="text-xl h-12 bg-transparent border-0 p-0 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:outline-none focus:ring-[#F1F2F3] focus:border-[#F1F2F3]"
          placeholder="Template name"
        />

        <div className="space-y-8">
          {exercises.map((exercise) => (
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
          onClick={handleSaveTemplate}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

