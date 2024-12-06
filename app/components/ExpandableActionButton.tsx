"use client"

import { useState } from "react"
import { Plus, X, Play, FolderPlus, FilePlus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function ExpandableActionButton() {
  const [isExpanded, setIsExpanded] = useState(false)

  const actions = [
    {
      label: "Start Empty Workout",
      icon: Play,
      onClick: () => console.log("Start empty workout")
    },
    {
      label: "Create Workout",
      icon: FilePlus,
      onClick: () => console.log("Create workout")
    },
    {
      label: "Create Folder",
      icon: FolderPlus,
      onClick: () => console.log("Create folder")
    }
  ]

  return (
    <div className="fixed bottom-24 right-4 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isExpanded && (
          <>
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white shadow-lg w-56 justify-start gap-2 pl-3"
                  onClick={() => {
                    action.onClick()
                    setIsExpanded(false)
                  }}
                >
                  <action.icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </Button>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
      
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg bg-black hover:bg-gray-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="h-6 w-6" />
        </motion.div>
      </Button>
    </div>
  )
}

