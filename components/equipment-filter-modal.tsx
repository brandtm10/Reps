"use client"

import { useState } from "react"
import { motion, PanInfo } from "framer-motion"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { equipmentList } from "@/data/equipment"
import { Checkbox } from "@/components/ui/checkbox"
import { Equipment } from "@/types/exercise"

interface EquipmentFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEquipment: string[];
  onSelectEquipment: (equipmentIds: string[]) => void;
  onApplyFilter: (selectedEquipment: string[]) => void;
}

export function EquipmentFilterModal({
  isOpen,
  onClose,
  selectedEquipment,
  onSelectEquipment,
  onApplyFilter
}: EquipmentFilterModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen)

  const handleSelectEquipment = (equipmentId: string) => {
    onSelectEquipment(prevSelected => {
      const newSelected = prevSelected.includes(equipmentId)
        ? prevSelected.filter(id => id !== equipmentId)
        : [...prevSelected, equipmentId];
      // Ensure the modal stays open by not triggering a close action
      return newSelected;
    });
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      onApplyFilter(selectedEquipment);
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
                onApplyFilter(selectedEquipment);
                // onClose(); // Remove this line
              }}
            >
              <X className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold flex-1 text-center">Equipment</h2>
            <div className="w-8"></div> {/* This empty div balances the layout */}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {equipmentList.map((equipment) => (
              <label 
                key={equipment.id} 
                htmlFor={equipment.id}
                className="text-base cursor-pointer flex-1 flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelectEquipment(equipment.id);
                }}
              >
                <Checkbox
                  id={equipment.id}
                  checked={selectedEquipment.includes(equipment.id)}
                  className="rounded-full border-gray-300 h-5 w-5"
                />
                <span>{equipment.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="sticky bottom-0 left-0 right-0 p-4 pb-8 bg-white border-t border-gray-200 flex justify-between">
          <Button
            variant="outline"
            onClick={() => onSelectEquipment([])}
            className="flex-1 mr-2"
          >
            Clear All
          </Button>
          <Button
            variant="default"
            onClick={() => {
              onApplyFilter(selectedEquipment);
              onClose();
            }}
            className="flex-1 ml-2 bg-black text-white hover:bg-gray-800"
          >
            Filter
          </Button>
        </div>
      </motion.div>
    </>
  )
}

