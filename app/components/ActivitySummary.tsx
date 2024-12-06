"use client"

import { Card, CardContent } from "@/components/ui/card"
import { subDays, format } from "date-fns"
import { mockWorkouts } from "../data/mockWorkouts"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface Activity {
  date: string
  volume: number
}

export function ActivitySummary() {
  const activities: Activity[] = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const workout = mockWorkouts.find(w => w.date.toDateString() === date.toDateString())
    const volume = workout ? workout.exercises.reduce((total, exercise) => 
      total + exercise.sets.reduce((setTotal, set) => setTotal + set.weight * set.reps, 0)
    , 0) : 0
    return { 
      date: format(date, 'E')[0],
      volume
    }
  })

  const totalVolume = activities.reduce((acc, curr) => acc + curr.volume, 0)

  return (
    <Card className="bg-white rounded-3xl border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-1 mb-4">
          <h2 className="text-sm text-gray-400 font-medium tracking-widest uppercase">Last 7 Days</h2>
          <p className="text-sm text-gray-400">Total Volume: {totalVolume.toLocaleString()} lbs</p>
        </div>
        
        <div className="h-[112px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activities}>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis hide />
              <Bar
                dataKey="volume"
                fill="black"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

