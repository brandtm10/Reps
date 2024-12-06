"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"

interface Exercise {
  id: string
  name: string
  muscle: string
  equipment: string
  usageCount: number
}

const recentExercises: Exercise[] = [
  { id: "1", name: "Tricep Rope Pushdown", muscle: "Triceps", equipment: "Machine", usageCount: 7 },
  { id: "2", name: "Skullcrusher", muscle: "Triceps", equipment: "Barbell", usageCount: 8 },
  { id: "3", name: "Bicep Curl", muscle: "Biceps", equipment: "Dumbbell", usageCount: 10 },
  { id: "4", name: "Iso-Lateral Row", muscle: "Lats", equipment: "Machine", usageCount: 4 },
  { id: "5", name: "Iso-Lateral Press", muscle: "Chest", equipment: "Machine", usageCount: 6 },
  { id: "6", name: "Incline Bench Press", muscle: "Chest", equipment: "Barbell", usageCount: 3 },
]

interface AddExerciseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddExercises: (exercises: Exercise[]) => void
}

export function AddExerciseDialog({
  open,
  onOpenChange,
  onAddExercises,
}: AddExerciseDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExercises, setSelectedExercises] = useState<string[]>([])
  const [muscleFilter, setMuscleFilter] = useState<string | null>(null)
  const [equipmentFilter, setEquipmentFilter] = useState<string | null>(null)

  const filteredExercises = recentExercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMuscle = !muscleFilter || exercise.muscle === muscleFilter
    const matchesEquipment = !equipmentFilter || exercise.equipment === equipmentFilter
    return matchesSearch && matchesMuscle && matchesEquipment
  })

  const handleExerciseToggle = (exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    )
  }

  const handleAddExercises = () => {
    const selectedExerciseObjects = recentExercises.filter((exercise) =>
      selectedExercises.includes(exercise.id)
    )
    onAddExercises(selectedExerciseObjects)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md p-0 bg-white rounded-3xl">
        <DialogHeader className="px-6 py-4 flex flex-row items-center justify-between border-b">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
          <DialogTitle className="text-xl font-semibold">Add Exercise</DialogTitle>
          <Button
            onClick={handleAddExercises}
            className="bg-black hover:bg-gray-800 text-white rounded-full px-4"
          >
            Add ({selectedExercises.length})
          </Button>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <Input
            placeholder="Search exercise"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-2xl bg-gray-50 border-0 placeholder:text-gray-500"
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-2xl border border-gray-200"
              onClick={() => setMuscleFilter(null)}
            >
              All Muscles
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-2xl border border-gray-200"
              onClick={() => setEquipmentFilter(null)}
            >
              All Equipment
            </Button>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm text-gray-400 font-medium tracking-widest uppercase px-1">
              Recent
            </h3>
            <div className="space-y-[1px]">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedExercises.includes(exercise.id)}
                      onCheckedChange={() => handleExerciseToggle(exercise.id)}
                      className="rounded-full border-gray-300 h-5 w-5"
                    />
                    <div>
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-gray-500">
                        {exercise.muscle} • {exercise.equipment}
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-lg">{exercise.usageCount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

