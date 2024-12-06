import { ActivitySummary } from "./components/ActivitySummary"
import { FolderList } from "./components/FolderList"
import { ExpandableActionButton } from "./components/ExpandableActionButton"
import { ScheduledWorkout } from "./components/ScheduledWorkout"
import { Greeting } from "./components/Greeting"
import { User } from 'lucide-react'
import { mockWorkouts } from "./data/mockWorkouts"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  const today = new Date()
  const scheduledWorkout = mockWorkouts.find(workout => 
    workout.date.toDateString() === today.toDateString()
  )

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-[#F1F2F3] px-6">
        <div className="flex justify-between items-start pt-4">
          <div className="w-8 h-8 bg-gray-100 rounded-full" />
          <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-black" />
          </button>
        </div>
        <Greeting />
      </header>

      <main className="flex-1 px-4 pb-32 space-y-6">
        <ActivitySummary />
        <Separator className="bg-gray-200 my-3" />
        {scheduledWorkout && (
          <>
            <ScheduledWorkout 
              title={scheduledWorkout.title} 
              type={scheduledWorkout.type}
            />
            <Separator className="bg-gray-200 my-3" />
          </>
        )}
        <div className="-mt-2">
          <FolderList />
        </div>
      </main>

      <ExpandableActionButton />
    </div>
  )
}

