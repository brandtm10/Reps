"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import BottomNav from '../components/BottomNav'
import { mockWorkouts } from "../data/mockWorkouts"
import { format, subDays } from "date-fns"

const data = Array.from({ length: 7 }, (_, i) => {
  const date = subDays(new Date(), 6 - i)
  const workout = mockWorkouts.find(w => w.date.toDateString() === date.toDateString())
  return {
    date: format(date, 'M/d'),
    squat: workout?.exercises.find(e => e.name === "Squat")?.sets[0]?.weight || null,
    bench: workout?.exercises.find(e => e.name === "Bench Press")?.sets[0]?.weight || null,
    deadlift: workout?.exercises.find(e => e.name === "Deadlift")?.sets[0]?.weight || null,
  }
})

export default function StatsPage() {
  return (
    <main className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Performance Stats</h1>
        <Card className="mb-4 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Strength Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                <Legend />
                <Line type="monotone" dataKey="squat" stroke="#8884d8" />
                <Line type="monotone" dataKey="bench" stroke="#82ca9d" />
                <Line type="monotone" dataKey="deadlift" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="mb-4 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Personal Records</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {mockWorkouts.flatMap(workout => 
                workout.exercises.flatMap(exercise => 
                  exercise.sets
                    .filter(set => set.isPR)
                    .map(set => (
                      <li key={`${workout.date}-${exercise.name}`}>
                        {exercise.name}: {set.weight} lbs x {set.reps}
                      </li>
                    ))
                )
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </main>
  )
}

