"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Moon, Sun, Download, Eye, Edit } from "lucide-react"
import { useTheme } from "next-themes"
import { DropZone } from "@/components/drop-zone"
import { PreviewMode } from "@/components/preview-mode"
import { ExportDialog } from "@/components/export-dialog"
import { SectionEditor } from "@/components/section-editor"

export interface Section {
  id: string
  type: "about" | "projects" | "skills" | "contact"
  title: string
  content: any
  order: number
}

const defaultSections: Section[] = [
  {
    id: "1",
    type: "about",
    title: "About Me",
    content: {
      name: "John Doe",
      title: "Full Stack Developer",
      description: "Passionate developer with 5+ years of experience in building web applications.",
      image: "/placeholder.svg?height=200&width=200",
    },
    order: 0,
  },
]

export default function PortfolioBuilder() {
  const [sections, setSections] = useState<Section[]>(defaultSections)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [mode, setMode] = useState<"edit" | "preview">("edit")
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load data from localStorage on mount
  useEffect(() => {
    if (mounted) {
      const saved = localStorage.getItem("portfolio-sections")
      if (saved) {
        setSections(JSON.parse(saved))
      }
    }
  }, [mounted])

  // Save to localStorage whenever sections change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("portfolio-sections", JSON.stringify(sections))
    }
  }, [sections, mounted])

  const addSection = (type: Section["type"]) => {
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: getDefaultContent(type),
      order: sections.length,
    }
    setSections([...sections, newSection])
  }

  const updateSection = (id: string, updates: Partial<Section>) => {
    setSections((prevSections) => {
      const newSections = prevSections.map((section) => {
        if (section.id === id) {
          const updatedSection = { ...section, ...updates }
          // Also update the selectedSection if it's the one being updated
          if (selectedSection?.id === id) {
            setSelectedSection(updatedSection)
          }
          return updatedSection
        }
        return section
      })
      return newSections
    })
  }

  const deleteSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id))
    if (selectedSection?.id === id) {
      setSelectedSection(null)
    }
  }

  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const dragSection = sections[dragIndex]
    const newSections = [...sections]
    newSections.splice(dragIndex, 1)
    newSections.splice(hoverIndex, 0, dragSection)

    // Update order
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }))

    setSections(updatedSections)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Portfolio Builder</h1>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setMode(mode === "edit" ? "preview" : "edit")}>
                {mode === "edit" ? <Eye className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {mode === "edit" ? "Preview" : "Edit"}
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
                {!mounted && <div className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </header>

        {mode === "preview" ? (
          <PreviewMode sections={sections} />
        ) : (
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Add Sections</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => addSection("about")}
                    >
                      About Me
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => addSection("projects")}
                    >
                      Projects
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => addSection("skills")}
                    >
                      Skills
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => addSection("contact")}
                    >
                      Contact
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Main Editor */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Portfolio Sections</h3>
                  <DropZone
                    sections={sections}
                    onMove={moveSection}
                    onSelect={setSelectedSection}
                    onDelete={deleteSection}
                    selectedId={selectedSection?.id}
                  />
                </Card>
              </div>

              {/* Properties Panel */}
              <div className="lg:col-span-1">
                {selectedSection ? (
                  <SectionEditor
                    section={selectedSection}
                    onUpdate={(updates) => updateSection(selectedSection.id, updates)}
                  />
                ) : (
                  <Card className="p-4">
                    <p className="text-muted-foreground text-center">Select a section to edit its properties</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} sections={sections} />
      </div>
    </DndProvider>
  )
}

function getDefaultContent(type: Section["type"]) {
  switch (type) {
    case "about":
      return {
        name: "Your Name",
        title: "Your Title",
        description: "Tell people about yourself...",
        image: "/placeholder.svg?height=200&width=200",
      }
    case "projects":
      return {
        projects: [
          {
            id: "1",
            title: "Project Name",
            description: "Project description...",
            image: "/placeholder.svg?height=200&width=300",
            technologies: ["React", "TypeScript"],
            link: "https://example.com",
          },
        ],
      }
    case "skills":
      return {
        categories: [
          {
            name: "Frontend",
            skills: ["React", "TypeScript", "Tailwind CSS"],
          },
          {
            name: "Backend",
            skills: ["Node.js", "Python", "PostgreSQL"],
          },
        ],
      }
    case "contact":
      return {
        email: "your.email@example.com",
        phone: "+1 (555) 123-4567",
        location: "Your City, Country",
        social: {
          linkedin: "https://linkedin.com/in/yourprofile",
          github: "https://github.com/yourusername",
          twitter: "https://twitter.com/yourusername",
        },
      }
    default:
      return {}
  }
}
