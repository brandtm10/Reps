import WorkoutDetail from '@/app/components/WorkoutDetail'
import BottomNav from '@/app/components/BottomNav'

export default function WorkoutPage() {
  return (
    <main className="flex flex-col h-screen">
      <WorkoutDetail />
      <BottomNav />
    </main>
  )
}

