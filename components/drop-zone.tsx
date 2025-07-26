"use client"

import { DraggableSection } from "./draggable-section"
import type { Section } from "@/app/page"

interface DropZoneProps {
  sections: Section[]
  onMove: (dragIndex: number, hoverIndex: number) => void
  onSelect: (section: Section) => void
  onDelete: (id: string) => void
  selectedId?: string
}

export function DropZone({ sections, onMove, onSelect, onDelete, selectedId }: DropZoneProps) {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order)

  if (sections.length === 0) {
    return (
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
        <p className="text-muted-foreground">Add sections from the sidebar to start building your portfolio</p>
      </div>
    )
  }

  return (
    <div>
      {sortedSections.map((section, index) => (
        <DraggableSection
          key={section.id}
          section={section}
          index={index}
          onMove={onMove}
          onSelect={onSelect}
          onDelete={onDelete}
          isSelected={section.id === selectedId}
        />
      ))}
    </div>
  )
}
