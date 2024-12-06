import { MuscleCategory } from "@/types/exercise"

export const muscleCategories: MuscleCategory[] = [
  {
    name: "Arms",
    id: "arms",
    subCategories: [
      { name: "Biceps", id: "biceps" },
      { name: "Forearms", id: "forearms" },
      { name: "Triceps", id: "triceps" }
    ]
  },
  {
    name: "Back",
    id: "back",
    subCategories: [
      { name: "Lats", id: "lats" },
      { name: "Traps", id: "traps" },
      { name: "Upper Back", id: "upper-back" }
    ]
  },
  {
    name: "Chest",
    id: "chest"
  },
  {
    name: "Core",
    id: "core",
    subCategories: [
      { name: "Abdominals", id: "abdominals" },
      { name: "Lower Back", id: "lower-back" }
    ]
  },
  {
    name: "Full Body",
    id: "full-body"
  },
  {
    name: "Legs",
    id: "legs",
    subCategories: [
      { name: "Abductors", id: "abductors" },
      { name: "Adductors", id: "adductors" },
      { name: "Calves", id: "calves" },
      { name: "Hamstrings", id: "hamstrings" },
      { name: "Quadriceps", id: "quadriceps" }
    ]
  }
]

