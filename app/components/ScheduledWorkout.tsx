import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ScheduledWorkoutProps {
  title: string
  type: 'Strength' | 'Hypertrophy' | 'Circuit' | 'Rehab'
}

export function ScheduledWorkout({ title, type }: ScheduledWorkoutProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm text-gray-400 font-medium tracking-widest uppercase">Today's Workout</h2>
      <Card className="bg-black text-white rounded-3xl border-0 shadow-sm">
        <CardContent className="flex items-center justify-between px-6 py-5">
          <h3 className="text-lg">{title}</h3>
          <Badge variant="outline" className="text-white border-white">
            {type}
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}

