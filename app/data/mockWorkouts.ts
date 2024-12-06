import { subDays } from 'date-fns'

export interface Set {
  weight: number
  reps: number
  isPR: boolean
}

export interface Exercise {
  name: string
  sets: Set[]
}

export interface Workout {
  date: Date
  title: string
  exercises: Exercise[]
  type: 'Strength' | 'Hypertrophy' | 'Circuit' | 'Rehab'
}

export const mockWorkouts: Workout[] = [
  {
    date: new Date(), // Today's workout
    title: "Upper Body Power",
    type: "Strength",
    exercises: [
      {
        name: "Bench Press",
        sets: [
          { weight: 185, reps: 5, isPR: false },
          { weight: 205, reps: 5, isPR: false },
          { weight: 225, reps: 5, isPR: true },
        ]
      },
      {
        name: "Pull-ups",
        sets: [
          { weight: 0, reps: 10, isPR: false },
          { weight: 0, reps: 10, isPR: false },
          { weight: 0, reps: 12, isPR: true },
        ]
      }
    ]
  },
  {
    date: subDays(new Date(), 6),
    title: "Full Body",
    type: "Strength",
    exercises: [
      {
        name: "Squat",
        sets: [
          { weight: 185, reps: 5, isPR: false },
          { weight: 205, reps: 5, isPR: false },
          { weight: 225, reps: 5, isPR: true },
        ]
      },
      {
        name: "Bench Press",
        sets: [
          { weight: 135, reps: 8, isPR: false },
          { weight: 155, reps: 8, isPR: false },
          { weight: 175, reps: 6, isPR: true },
        ]
      }
    ]
  },
  {
    date: subDays(new Date(), 5),
    title: "Upper Body",
    type: "Strength",
    exercises: [
      {
        name: "Pull-ups",
        sets: [
          { weight: 0, reps: 10, isPR: false },
          { weight: 0, reps: 10, isPR: false },
          { weight: 0, reps: 8, isPR: false },
        ]
      },
      {
        name: "Overhead Press",
        sets: [
          { weight: 95, reps: 8, isPR: false },
          { weight: 105, reps: 6, isPR: true },
          { weight: 95, reps: 7, isPR: false },
        ]
      }
    ]
  },
  {
    date: subDays(new Date(), 3),
    title: "Lower Body",
    type: "Strength",
    exercises: [
      {
        name: "Deadlift",
        sets: [
          { weight: 225, reps: 5, isPR: false },
          { weight: 275, reps: 5, isPR: false },
          { weight: 315, reps: 3, isPR: true },
        ]
      },
      {
        name: "Leg Press",
        sets: [
          { weight: 300, reps: 10, isPR: false },
          { weight: 320, reps: 10, isPR: false },
          { weight: 340, reps: 8, isPR: false },
        ]
      }
    ]
  },
  {
    date: subDays(new Date(), 1),
    title: "Push Day",
    type: "Strength",
    exercises: [
      {
        name: "Incline Bench Press",
        sets: [
          { weight: 135, reps: 8, isPR: false },
          { weight: 145, reps: 8, isPR: true },
          { weight: 145, reps: 7, isPR: false },
        ]
      },
      {
        name: "Tricep Pushdown",
        sets: [
          { weight: 50, reps: 12, isPR: false },
          { weight: 60, reps: 10, isPR: false },
          { weight: 70, reps: 8, isPR: true },
        ]
      }
    ]
  },
  {
    date: subDays(new Date(), 0),
    title: "Pull Day",
    type: "Strength",
    exercises: [
      {
        name: "Barbell Row",
        sets: [
          { weight: 135, reps: 8, isPR: false },
          { weight: 155, reps: 8, isPR: false },
          { weight: 175, reps: 6, isPR: true },
        ]
      },
      {
        name: "Bicep Curls",
        sets: [
          { weight: 30, reps: 12, isPR: false },
          { weight: 35, reps: 10, isPR: false },
          { weight: 40, reps: 8, isPR: true },
        ]
      }
    ]
  }
]

