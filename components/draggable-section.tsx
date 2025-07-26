"use client"

import { useDrag, useDrop } from "react-dnd"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GripVertical, Trash2 } from "lucide-react"
import type { Section } from "@/app/page"

interface DraggableSectionProps {
  section: Section
  index: number
  onMove: (dragIndex: number, hoverIndex: number) => void
  onSelect: (section: Section) => void
  onDelete: (id: string) => void
  isSelected: boolean
}

export function DraggableSection({ section, index, onMove, onSelect, onDelete, isSelected }: DraggableSectionProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: "section",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "section",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index)
        item.index = index
      }
    },
  })

  return (
    <div ref={(node) => preview(drop(node))}>
      <Card
        className={`p-4 mb-3 cursor-pointer transition-all ${
          isSelected ? "ring-2 ring-primary" : ""
        } ${isDragging ? "opacity-50" : ""}`}
        onClick={() => onSelect(section)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div ref={drag} className="cursor-grab">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium">{section.title}</h4>
              <p className="text-sm text-muted-foreground capitalize">{section.type} section</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(section.id)
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
