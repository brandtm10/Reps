"use client"

import { useState } from "react"
import { motion, PanInfo } from "framer-motion"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { muscleCategories } from "@/data/muscles"
import { Checkbox } from "@/components/ui/checkbox"
import { MuscleCategory, MuscleSubCategory } from "@/types/exercise"

interface MuscleFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMuscles: string[];
  onSelectMuscle: (muscleIds: string[]) => void;
  onApplyFilter: (selectedMuscles: string[]) => void;
}

export function MuscleFilterModal({
  isOpen,
  onClose,
  selectedMuscles,
  onSelectMuscle,
  onApplyFilter
}: MuscleFilterModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen)

  const handleSelectMuscle = (categoryId: string) => {
    if (categoryId === '') {
      // Clear all selections
      onSelectMuscle([]);
      return;
    }

    const category = muscleCategories.find(c => c.id === categoryId);
    if (category) {
      const subCategoryIds = category.subCategories?.map(sc => sc.id) || [];
      if (selectedMuscles.includes(categoryId)) {
        // Deselect main category and all sub-categories
        onSelectMuscle(selectedMuscles.filter(id => id !== categoryId && !subCategoryIds.includes(id)));
      } else {
        // Select main category and all sub-categories
        onSelectMuscle([...new Set([...selectedMuscles, categoryId, ...subCategoryIds])]);
      }
    } else {
      // Handle sub-category selection
      const parentCategory = muscleCategories.find(c => c.subCategories?.some(sc => sc.id === categoryId));
      if (parentCategory) {
        if (selectedMuscles.includes(categoryId)) {
          // Deselect sub-category and possibly the main category
          const updatedSelection = selectedMuscles.filter(id => id !== categoryId);
          if (!parentCategory.subCategories?.some(sc => updatedSelection.includes(sc.id))) {
            updatedSelection.splice(updatedSelection.indexOf(parentCategory.id), 1);
          }
          onSelectMuscle(updatedSelection);
        } else {
          // Select sub-category and possibly the main category
          const updatedSelection = [...selectedMuscles, categoryId];
          if (parentCategory.subCategories?.every(sc => updatedSelection.includes(sc.id) || sc.id === categoryId)) {
            updatedSelection.push(parentCategory.id);
          }
          onSelectMuscle([...new Set(updatedSelection)]);
        }
      }
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      onApplyFilter(selectedMuscles);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      )}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[75vh] overflow-hidden flex flex-col"
        initial={{ y: "100%" }}
        animate={{ y: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500"
              onClick={() => {
                onApplyFilter(selectedMuscles);
                onClose();
              }}
            >
              <X className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold flex-1 text-center">Muscle Groups</h2>
            <div className="w-8"></div> {/* This empty div balances the layout */}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {muscleCategories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleSelectMuscle(category.id)}
                >
                  <Checkbox
                    id={category.id}
                    checked={selectedMuscles.includes(category.id)}
                    onCheckedChange={() => handleSelectMuscle(category.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-full border-gray-300 h-5 w-5"
                  />
                  <label
                    htmlFor={category.id}
                    className="text-base font-medium cursor-pointer flex-1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelectMuscle(category.id);
                    }}
                  >
                    {category.name}
                  </label>
                </div>

                {category.subCategories && (
                  <div className="space-y-4 ml-4 border-l border-gray-100 pl-4">
                    {category.subCategories.map((subCategory) => (
                      <div
                        key={subCategory.id}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleSelectMuscle(subCategory.id)}
                      >
                        <Checkbox
                          id={subCategory.id}
                          checked={selectedMuscles.includes(subCategory.id)}
                          onCheckedChange={(checked) => {
                            handleSelectMuscle(subCategory.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-full border-gray-300 h-5 w-5"
                        />
                        <label
                          htmlFor={subCategory.id}
                          className="text-sm cursor-pointer flex-1 py-0.5"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectMuscle(subCategory.id);
                          }}
                        >
                          {subCategory.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="sticky bottom-0 left-0 right-0 p-4 pb-8 bg-white border-t border-gray-200 flex justify-between">
          <Button
            variant="outline"
            onClick={() => onSelectMuscle([])}
            className="flex-1 mr-2"
          >
            Clear All
          </Button>
          <Button
            variant="default"
            onClick={() => onApplyFilter(selectedMuscles)}
            className="flex-1 ml-2 bg-black text-white hover:bg-gray-800"
          >
            Filter
          </Button>
        </div>
      </motion.div>
    </>
  )
}

