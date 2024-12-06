'use client'

import { useState } from "react"
import { ChevronRight, Menu, User, Trophy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { mockWorkouts } from "../data/mockWorkouts"
import { format, isThisYear } from "date-fns"
import { Badge } from "@/components/ui/badge"

const timeFrames = ["Day", "Month", "Year"] as const
type TimeFrame = typeof timeFrames[number]

export default function WorkoutList() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("Month")

  const workouts = mockWorkouts.map(workout => ({
    ...workout,
    date: format(workout.date, 'EEEE'),
    fullDate: format(workout.date, 'MMM d, yyyy'),
    time: format(workout.date, 'h:mm a'),
    formattedDate: isThisYear(workout.date) 
      ? format(workout.date, 'd MMM') 
      : format(workout.date, 'd MMM yyyy')
  }))

  return (
    <main className="flex-1 bg-gray-50 min-h-screen pb-24">
      <div className="sticky top-0 z-10 bg-white">
        <header className="flex justify-between items-center p-4 bg-[#F1F2F3]">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-6 w-6" />
          </Button>
        </header>
        
        {/* Removed button mapping section */}

      </div>

      <div className="px-6 space-y-8 bg-[#F1F2F3]">
        {workouts.map((workout) => (
          <div key={workout.fullDate}>
            <div className="flex items-baseline justify-between mb-[7px]">
              <h2 className="text-lg flex items-baseline">
                <span className="font-bold text-black pt-5">{workout.date}</span>
                <span className="text-gray-400 font-normal ml-2">
                  {workout.formattedDate}
                </span>
              </h2>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <Card className="bg-white rounded-3xl border-0 shadow-sm p-4 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-medium">{workout.title}</h3>
                </div>
                <div className="text-sm text-gray-400">{workout.time}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                {workout.exercises.map((exercise) => (
                  <Badge 
                    key={exercise.name}
                    variant="secondary" 
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    {exercise.name}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-gray-100">
                  {workout.type}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100">
                  {workout.exercises.reduce((total, exercise) => 
                    total + exercise.sets.length, 0
                  )} sets
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 flex items-center gap-1">
                  {workout.exercises.reduce((total, exercise) => 
                    total + exercise.sets.reduce((acc, set) => 
                      acc + (set.isPR ? 1 : 0), 0
                    ), 0
                  )}
                  <Trophy className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                </Badge>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </main>
  )
}

