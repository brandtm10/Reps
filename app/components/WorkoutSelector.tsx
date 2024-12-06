import { Button } from '@/components/ui/button'

type Workout = {
  type: 'strength' | 'cardio' | 'flexibility'
  name: string
}

type WorkoutSelectorProps = {
  onSelectWorkout: (workout: Workout) => void
}

const workoutOptions: Workout[] = [
  { type: 'strength', name: 'Full Body Strength' },
  { type: 'strength', name: 'Upper Body' },
  { type: 'strength', name: 'Lower Body' },
  { type: 'cardio', name: 'HIIT' },
  { type: 'cardio', name: 'Steady State Cardio' },
  { type: 'flexibility', name: 'Yoga' },
  { type: 'flexibility', name: 'Stretching' },
]

export function WorkoutSelector({ onSelectWorkout }: WorkoutSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {workoutOptions.map((workout) => (
        <Button
          key={workout.name}
          onClick={() => onSelectWorkout(workout)}
          className={`h-20 ${
            workout.type === 'strength'
              ? 'bg-blue-500 hover:bg-blue-600'
              : workout.type === 'cardio'
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
        >
          {workout.name}
        </Button>
      ))}
    </div>
  )
}

