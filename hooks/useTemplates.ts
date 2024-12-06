import { useState, useEffect } from 'react'

interface Template {
  id: string
  name: string
  exercises: { name: string }[]
  lastModified: string
  folderId: string
}

export function useTemplates(folderId: string) {
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    const loadTemplates = () => {
      try {
        const allTemplates = JSON.parse(localStorage.getItem('workoutTemplates') || '[]')
        const folderTemplates = allTemplates.filter((t: Template) => t.folderId === folderId)
        setTemplates(folderTemplates)
        console.log('Templates loaded:', folderTemplates)
      } catch (error) {
        console.error('Error loading templates:', error)
      }
    }

    loadTemplates()
    window.addEventListener('storage', loadTemplates)
    return () => window.removeEventListener('storage', loadTemplates)
  }, [folderId])

  const addTemplate = (newTemplate: Template) => {
    setTemplates(prev => {
      const updated = [...prev, newTemplate]
      updateLocalStorage(updated)
      return updated
    })
  }

  const updateTemplate = (updatedTemplate: Template) => {
    setTemplates(prev => {
      const updated = prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t)
      updateLocalStorage(updated)
      return updated
    })
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => {
      const updated = prev.filter(t => t.id !== templateId)
      updateLocalStorage(updated)
      return updated
    })
  }

  const duplicateTemplate = (templateId: string) => {
    const templateToDuplicate = templates.find(t => t.id === templateId)
    if (templateToDuplicate) {
      const newTemplate: Template = {
        ...templateToDuplicate,
        id: `template-${Date.now()}`,
        name: `${templateToDuplicate.name} (2)`,
        lastModified: new Date().toISOString()
      }
      addTemplate(newTemplate)
      console.log('Template duplicated:', newTemplate)
    } else {
      console.error('Template not found for duplication:', templateId)
    }
  }

  const updateLocalStorage = (updatedTemplates: Template[]) => {
    try {
      const allTemplates = JSON.parse(localStorage.getItem('workoutTemplates') || '[]')
      const otherTemplates = allTemplates.filter((t: Template) => t.folderId !== folderId)
      const newAllTemplates = [...otherTemplates, ...updatedTemplates]
      localStorage.setItem('workoutTemplates', JSON.stringify(newAllTemplates))
      console.log('localStorage updated:', newAllTemplates)
    } catch (error) {
      console.error('Error updating localStorage:', error)
    }
  }

  return { templates, addTemplate, updateTemplate, deleteTemplate, duplicateTemplate }
}

