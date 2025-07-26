"use client"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import type { Section } from "@/app/page"

interface SectionEditorProps {
  section: Section
  onUpdate: (updates: Partial<Section>) => void
}

export function SectionEditor({ section, onUpdate }: SectionEditorProps) {
  const handleContentUpdate = (field: string, value: any) => {
    onUpdate({
      content: {
        ...section.content,
        [field]: value,
      },
    })
  }

  const handleNestedUpdate = (field: string, nestedField: string, value: any) => {
    onUpdate({
      content: {
        ...section.content,
        [field]: {
          ...section.content[field],
          [nestedField]: value,
        },
      },
    })
  }

  const handleArrayUpdate = (field: string, index: number, updates: any) => {
    const array = [...(section.content[field] || [])]
    array[index] = { ...array[index], ...updates }
    onUpdate({
      content: {
        ...section.content,
        [field]: array,
      },
    })
  }

  const addToArray = (field: string, newItem: any) => {
    const array = [...(section.content[field] || [])]
    array.push(newItem)
    onUpdate({
      content: {
        ...section.content,
        [field]: array,
      },
    })
  }

  const removeFromArray = (field: string, index: number) => {
    const array = [...(section.content[field] || [])]
    array.splice(index, 1)
    onUpdate({
      content: {
        ...section.content,
        [field]: array,
      },
    })
  }

  const renderEditor = () => {
    switch (section.type) {
      case "about":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={section.content.name || ""}
                onChange={(e) => handleContentUpdate("name", e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={section.content.title || ""}
                onChange={(e) => handleContentUpdate("title", e.target.value)}
                placeholder="Your professional title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={section.content.description || ""}
                onChange={(e) => handleContentUpdate("description", e.target.value)}
                rows={4}
                placeholder="Tell people about yourself..."
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={section.content.image || ""}
                onChange={(e) => handleContentUpdate("image", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        )

      case "projects":
        const projects = section.content.projects || []
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Projects</Label>
              <Button
                size="sm"
                onClick={() => {
                  const newProject = {
                    id: Date.now().toString(),
                    title: "New Project",
                    description: "Project description...",
                    image: "/placeholder.svg?height=200&width=300",
                    technologies: ["React"],
                    link: "",
                  }
                  addToArray("projects", newProject)
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Project
              </Button>
            </div>

            {projects.map((project: any, index: number) => (
              <Card key={project.id} className="p-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Project {index + 1}</Label>
                    <Button variant="ghost" size="sm" onClick={() => removeFromArray("projects", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <Label>Title</Label>
                    <Input
                      placeholder="Project title"
                      value={project.title || ""}
                      onChange={(e) => handleArrayUpdate("projects", index, { title: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Project description"
                      value={project.description || ""}
                      onChange={(e) => handleArrayUpdate("projects", index, { description: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Image URL</Label>
                    <Input
                      placeholder="Project image URL"
                      value={project.image || ""}
                      onChange={(e) => handleArrayUpdate("projects", index, { image: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Technologies (comma separated)</Label>
                    <Input
                      placeholder="React, TypeScript, Node.js"
                      value={Array.isArray(project.technologies) ? project.technologies.join(", ") : ""}
                      onChange={(e) => {
                        const techs = e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t)
                        handleArrayUpdate("projects", index, { technologies: techs })
                      }}
                    />
                  </div>

                  <div>
                    <Label>Project Link</Label>
                    <Input
                      placeholder="https://project-url.com"
                      value={project.link || ""}
                      onChange={(e) => handleArrayUpdate("projects", index, { link: e.target.value })}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )

      case "skills":
        const categories = section.content.categories || []
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Skill Categories</Label>
              <Button
                size="sm"
                onClick={() => {
                  const newCategory = {
                    name: "New Category",
                    skills: ["Skill 1", "Skill 2"],
                  }
                  addToArray("categories", newCategory)
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Category
              </Button>
            </div>

            {categories.map((category: any, index: number) => (
              <Card key={index} className="p-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-2">
                      <Label>Category Name</Label>
                      <Input
                        placeholder="Category name"
                        value={category.name || ""}
                        onChange={(e) => handleArrayUpdate("categories", index, { name: e.target.value })}
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFromArray("categories", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <Label>Skills (comma separated)</Label>
                    <Textarea
                      placeholder="React, TypeScript, Node.js"
                      value={Array.isArray(category.skills) ? category.skills.join(", ") : ""}
                      onChange={(e) => {
                        const skills = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s)
                        handleArrayUpdate("categories", index, { skills })
                      }}
                      rows={2}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )

      case "contact":
        const social = section.content.social || {}
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={section.content.email || ""}
                onChange={(e) => handleContentUpdate("email", e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={section.content.phone || ""}
                onChange={(e) => handleContentUpdate("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={section.content.location || ""}
                onChange={(e) => handleContentUpdate("location", e.target.value)}
                placeholder="Your City, Country"
              />
            </div>
            <div>
              <Label>Social Links</Label>
              <div className="space-y-2 mt-2">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={social.linkedin || ""}
                    onChange={(e) => handleNestedUpdate("social", "linkedin", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/yourusername"
                    value={social.github || ""}
                    onChange={(e) => handleNestedUpdate("social", "github", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/yourusername"
                    value={social.twitter || ""}
                    onChange={(e) => handleNestedUpdate("social", "twitter", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="section-title">Section Title</Label>
          <Input
            id="section-title"
            value={section.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Section title"
          />
        </div>

        {renderEditor()}
      </div>
    </Card>
  )
}
