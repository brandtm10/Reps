"use client"

import { useState } from "react"
import { MoreHorizontal, Link, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Set {
  weight: number
  reps: number
  isPR?: boolean
  setType?: 'normal' | 'warmup' | 'drop' | 'failure'
}

interface ExerciseRowProps {
  name: string
  equipment: string
  previousSets?: Set[]
  onAddSet: () => void
  onUpdateSet: (index: number, field: 'weight' | 'reps' | 'setType', value: number | 'normal' | 'warmup' | 'drop' | 'failure') => void
  sets: Set[]
  onRemoveSet: (index: number) => void
}

const cycleSetType = (currentType?: 'normal' | 'warmup' | 'drop' | 'failure') => {
  const types: ('normal' | 'warmup' | 'drop' | 'failure')[] = ['normal', 'warmup', 'drop', 'failure'];
  const currentIndex = types.indexOf(currentType || 'normal');
  return types[(currentIndex + 1) % types.length];
};

export function ExerciseRow({
  name,
  equipment,
  previousSets,
  onAddSet,
  onUpdateSet,
  sets,
  onRemoveSet,
}: ExerciseRowProps) {
  return (
    <div className="space-y-4 px-0">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-black text-left flex items-center">
          <span className="text-md">{name}</span>
          <span className="text-gray-400 ml-2 text-sm">{equipment}</span>
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Link className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Add note</DropdownMenuItem>
              <DropdownMenuItem>Add warm-up sets</DropdownMenuItem>
              <DropdownMenuItem>Replace exercise</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-2 pl-0 pr-0">
        <div className="flex items-center mb-2">
          <div className="w-12 text-left text-sm text-gray-500">Set</div>
          <div className="w-1/3 text-sm text-gray-500">Previous</div>
          <div className="w-[80px] text-sm text-gray-500 text-center">Weight</div>
          <div className="w-4"></div>
          <div className="w-[80px] text-sm text-gray-500 text-center">Reps</div>
          <div className="w-10"></div>
        </div>

        {(() => {
          let normalSetCount = 0;
          return sets.map((set, index) => {
            if (set.setType === 'normal' || !set.setType) {
              normalSetCount++;
            }
            return (
              <div key={index} className="flex items-center mb-1">
                <div 
                  className="w-12 text-sm cursor-pointer"
                  onClick={() => onUpdateSet(index, 'setType', cycleSetType(set.setType))}
                >
                  {set.setType === 'warmup' ? (
                    <span className="text-[#8D80CE] font-bold">W</span>
                  ) : set.setType === 'drop' ? (
                    <span className="text-[#6C97D3] font-bold">D</span>
                  ) : set.setType === 'failure' ? (
                    <span className="text-[#C46464] font-bold">F</span>
                  ) : (
                    normalSetCount
                  )}
                </div>
                <div className="w-1/3 text-sm text-gray-400">
                  {previousSets?.[index] ? 
                    `${previousSets[index].weight}lbs × ${previousSets[index].reps}` : 
                    '—'}
                </div>
                <div className="w-[80px] flex justify-center">
                  <Input
                    type="number"
                    placeholder="0"
                    value={set.weight || ''}
                    onChange={(e) => onUpdateSet(index, 'weight', Number(e.target.value))}
                    className="h-8 bg-gray-50 border-0 text-center w-full placeholder:text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="w-4"></div>
                <div className="w-[80px] flex justify-center">
                  <Input
                    type="number"
                    placeholder="0"
                    value={set.reps || ''}
                    onChange={(e) => onUpdateSet(index, 'reps', Number(e.target.value))}
                    className="h-8 bg-gray-50 border-0 text-center w-full placeholder:text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="flex justify-end ml-auto">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-400 hover:text-red-600"
                    onClick={() => onRemoveSet(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          });
        })()}

        <Button
          variant="ghost"
          onClick={onAddSet}
          className="w-full h-12 border border-dashed border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 rounded-xl"
        >
          + Add Set
        </Button>
      </div>
    </div>
  )
}

