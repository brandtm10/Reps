'use client'

import { useState } from 'react'
import { format, addMonths, subMonths, isSameDay, isToday, isPast } from 'date-fns'
import { Plus, ArrowRight, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import BottomNav from '@/components/BottomNav'
import { motion, useAnimation, PanInfo } from 'framer-motion'
import { mockWorkouts } from '../data/mockWorkouts'

type WorkoutType = 'Strength' | 'Hypertrophy' | 'Circuit' | 'Rehab'

interface Set {
  weight: number
  reps: number
  isPR: boolean
}

interface Exercise {
  name: string
  sets: Set[]
}

interface Workout {
  type: WorkoutType
  title: string
  duration: number // in minutes
  exercises: Exercise[]
}

type WorkoutSchedule = {
  [date: string]: Workout
}

export default function PlanPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const controls = useAnimation()
  
  // Sample workout data
  const workouts: WorkoutSchedule = mockWorkouts.reduce((acc, workout) => {
    const dateString = format(workout.date, 'yyyy-MM-dd')
    acc[dateString] = {
      type: 'Strength', // You may want to add a type field to your mockWorkouts if you want to differentiate
      title: workout.title,
      duration: 60, // You may want to add a duration field to your mockWorkouts
      exercises: workout.exercises
    }
    return acc
  }, {} as WorkoutSchedule)

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  const getWorkoutForDate = (date: Date): Workout | undefined => {
    const dateString = format(date, 'yyyy-MM-dd')
    return workouts[dateString]
  }

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}hr${remainingMinutes ? ` ${remainingMinutes}min` : ''}`
  }

  const calculateVolume = (exercises: Exercise[]): number => {
    return exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight * set.reps)
      }, 0)
    }, 0)
  }

  const getExercisesWithPRs = (exercises: Exercise[]): string[] => {
    return exercises
      .filter(exercise => exercise.sets.some(set => set.isPR))
      .map(exercise => exercise.name)
  }

  const getDotColor = (workout: Workout | undefined, date: Date): string => {
    if (!workout) return ''
    if (isPast(date) && !isToday(date)) return 'bg-gray-300'
    
    switch (workout.type) {
      case 'Strength':
        return 'bg-blue-500'
      case 'Hypertrophy':
        return 'bg-purple-500'
      case 'Circuit':
        return 'bg-green-500'
      case 'Rehab':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-300'
    }
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      handlePrevMonth()
    } else if (info.offset.x < -100) {
      handleNextMonth()
    }
    controls.start({ x: 0 })
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F1F2F3]">
      <header className="sticky top-0 z-10 bg-[#F1F2F3] p-4">
        <h1 className="text-3xl font-bold mt-5">Workout Schedule</h1>
      </header>

      <main className="flex-1 px-4">
        <motion.div
          className="mt-5 touch-pan-x"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={controls}
          dragElastic={0.1}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            month={currentDate}
            className="rounded-3xl border shadow-sm bg-white p-6 w-full max-w-[400px] mx-auto"
            classNames={{
              months: "space-y-4 mx-auto",
              month: "space-y-6",
              caption: "flex justify-center pt-1 pb-4 relative items-center text-base font-medium",
              caption_label: "text-center absolute left-1/2 transform -translate-x-1/2",
              nav: "w-full flex justify-between items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              table: "w-full border-collapse space-y-1",
              head_row: "flex justify-between",
              head_cell: "text-gray-500 w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2 justify-between",
              cell: "text-center text-sm relative p-0 hover:bg-gray-100 rounded-full h-9",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-lg flex items-center justify-center",
              day_selected: "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-lg",
              day_today: "bg-gray-100 text-black",
              day_outside: "opacity-50",
            }}
            components={{
              DayContent: ({ date }) => {
                const workout = getWorkoutForDate(date)
                const dotColor = getDotColor(workout, date)
                
                return (
                  <div className="w-full h-full flex flex-col items-center">
                    <div className="h-6 flex items-center justify-center">
                      <span className="text-sm">
                        {format(date, 'd')}
                      </span>
                    </div>
                    <div className="h-2 flex items-center justify-center">
                      {dotColor && (
                        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                      )}
                    </div>
                  </div>
                )
              },
            }}
          />
        </motion.div>

        <Card className="mt-4 bg-white rounded-3xl w-full max-w-[400px] mx-auto">
          <CardContent className="p-6">
            <h2 className="text-base font-medium mb-4">
              {format(selectedDate, 'EEEE, MMM d')}
            </h2>
            {getWorkoutForDate(selectedDate) ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {getWorkoutForDate(selectedDate)?.title}
                  </h3>
                  <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-sm font-medium">
                      {formatDuration(getWorkoutForDate(selectedDate)?.duration || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Volume</p>
                    <p className="text-sm font-medium">
                      {calculateVolume(getWorkoutForDate(selectedDate)?.exercises || [])} lbs
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {getExercisesWithPRs(getWorkoutForDate(selectedDate)?.exercises || []).map((exercise) => (
                    <Badge 
                      key={exercise}
                      variant="secondary" 
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100"
                    >
                      {exercise}
                      <Trophy className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4 text-sm">
                No planned workout for this day
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Button 
        className="fixed bottom-[5.25rem] right-4 rounded-full w-14 h-14 shadow-lg bg-black hover:bg-gray-800"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <BottomNav />
    </div>
  )
}

