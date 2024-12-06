"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"
import { MuscleFilterModal } from "@/components/muscle-filter-modal"
import { EquipmentFilterModal } from "@/components/equipment-filter-modal"
import { equipmentList } from "@/data/equipment"

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
  { id: "4", name: "Iso-Lateral Row", muscle: "Back", equipment: "Machine", usageCount: 4 },
  { id: "5", name: "Iso-Lateral Press", muscle: "Chest", equipment: "Machine", usageCount: 6 },
  { id: "6", name: "Incline Bench Press", muscle: "Chest", equipment: "Barbell", usageCount: 3 },
]

export default function AddExercisePage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExercises, setSelectedExercises] = useState<string[]>([])
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
  const [isMuscleFilterOpen, setIsMuscleFilterOpen] = useState(false)
  const [isEquipmentFilterOpen, setIsEquipmentFilterOpen] = useState(false)
  const [filteredExercises, setFilteredExercises] = useState(recentExercises)

  useEffect(() => {
    setIsVisible(true)
    const currentExercises = localStorage.getItem('currentExercises')
    if (currentExercises) {
      const parsedExercises = JSON.parse(currentExercises)
      setSelectedExercises(parsedExercises.map((exercise: Exercise) => exercise.id))
    }
  }, [])

  useEffect(() => {
    let filtered = recentExercises

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply muscle filter
    if (selectedMuscles.length > 0) {
      filtered = filtered.filter(exercise =>
        selectedMuscles.some(muscle => exercise.muscle.toLowerCase().includes(muscle.toLowerCase()))
      )
    }

    // Apply equipment filter
    if (selectedEquipment.length > 0) {
      filtered = filtered.filter(exercise =>
        selectedEquipment.includes(exercise.equipment.toLowerCase())
      )
    }

    setFilteredExercises(filtered)
  }, [searchQuery, selectedMuscles, selectedEquipment])

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
    localStorage.setItem('selectedExercises', JSON.stringify(selectedExerciseObjects))
    router.back()
  }

  return (
    <>
      <motion.div
        className={`fixed inset-0 bg-[#F1F2F3] z-50 overflow-hidden transition-opacity duration-200 ${
          isMuscleFilterOpen || isEquipmentFilterOpen ? 'opacity-50 pointer-events-none' : ''
        }`}
        initial={{ y: "100%" }}
        animate={{ y: isVisible ? 0 : "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div className="flex flex-col h-full">
          <header className="sticky top-0 z-10 bg-[#F1F2F3] px-6 py-4 flex items-center justify-between border-b border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => router.back()}
            >
              <X className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Add Exercise</h1>
            <Button
              onClick={handleAddExercises}
              className="bg-black hover:bg-gray-800 text-white rounded-full px-4"
            >
              Add ({selectedExercises.length})
            </Button>
          </header>

          <main className="flex-1 overflow-y-auto p-6 space-y-4">
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
                onClick={() => setIsMuscleFilterOpen(true)}
              >
                {selectedMuscles.length ? `${selectedMuscles.length} Selected` : 'All Muscles'}
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-2xl border border-gray-200"
                onClick={() => setIsEquipmentFilterOpen(true)}
              >
                {selectedEquipment.length > 0
                  ? `${selectedEquipment.length} Selected`
                  : 'All Equipment'}
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
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl cursor-pointer"
                    onClick={() => handleExerciseToggle(exercise.id)}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedExercises.includes(exercise.id)}
                        onCheckedChange={() => handleExerciseToggle(exercise.id)}
                        className="rounded-full border-gray-300 h-6 w-6 data-[state=checked]:bg-black data-[state=checked]:border-black checkbox-custom"
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
          </main>
        </div>
      </motion.div>

      <MuscleFilterModal
        isOpen={isMuscleFilterOpen}
        onClose={() => setIsMuscleFilterOpen(false)}
        selectedMuscles={selectedMuscles}
        onSelectMuscle={setSelectedMuscles}
        onApplyFilter={(muscles) => {
          setSelectedMuscles(muscles);
          setIsMuscleFilterOpen(false);
        }}
        className="z-[70]"
      />

      <EquipmentFilterModal
        isOpen={isEquipmentFilterOpen}
        onClose={() => setIsEquipmentFilterOpen(false)}
        selectedEquipment={selectedEquipment}
        onSelectEquipment={setSelectedEquipment}
        onApplyFilter={(equipment) => {
          setSelectedEquipment(equipment);
          setIsEquipmentFilterOpen(false);
        }}
        className="z-[70]"
      />
    </>
  )
}

