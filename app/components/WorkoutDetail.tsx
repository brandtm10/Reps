"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function WorkoutDetail() {
  const [exercises, setExercises] = useState([
    { id: 1, name: "Squat (Barbell)", sets: [{ weight: 175, reps: 5 }] },
    { id: 2, name: "Pull Up", sets: [{ weight: 0, reps: 10 }] },
  ])

  const addSet = (exerciseId: number) => {
    setExercises(exercises.map(exercise => 
      exercise.id === exerciseId 
        ? { ...exercise, sets: [...exercise.sets, { weight: 0, reps: 0 }] }
        : exercise
    ))
  }

  const updateSet = (exerciseId: number, setIndex: number, field: 'weight' | 'reps', value: number) => {
    setExercises(exercises.map(exercise => 
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">FB1 - Lower + Back</h2>
      {exercises.map((exercise) => (
        <Card key={exercise.id} className="mb-4 bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{exercise.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Add note</DropdownMenuItem>
                <DropdownMenuItem>Add warm-up sets</DropdownMenuItem>
                <DropdownMenuItem>Replace exercise</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            {exercise.sets.map((set, index) => (
              <div key={index} className="flex items-center mb-2">
                <span className="w-8 text-gray-400">{index + 1}</span>
                <Input
                  type="number"
                  value={set.weight}
                  onChange={(e) => updateSet(exercise.id, index, 'weight', Number(e.target.value))}
                  className="w-20 mr-2 bg-gray-800 border-gray-700"
                />
                <span className="mr-2">lbs</span>
                <Input
                  type="number"
                  value={set.reps}
                  onChange={(e) => updateSet(exercise.id, index, 'reps', Number(e.target.value))}
                  className="w-16 mr-2 bg-gray-800 border-gray-700"
                />
                <span>reps</span>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addSet(exercise.id)} className="mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add Set
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button className="w-full mt-4">Complete Workout</Button>
    </div>
  )
}

