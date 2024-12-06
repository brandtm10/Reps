'use client'

import { useState, useEffect } from 'react'

export function Greeting() {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours()
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting('good morning.')
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting('good afternoon.')
      } else {
        setGreeting('good evening.')
      }
    }

    updateGreeting()
    const interval = setInterval(updateGreeting, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <h1 className="text-3xl leading-tight font-bold tracking-tight mt-4 mb-4">
      {greeting}
    </h1>
  )
}

