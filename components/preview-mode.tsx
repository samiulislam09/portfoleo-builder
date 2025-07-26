"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, ExternalLink } from "lucide-react"
import type { Section } from "@/app/page"

interface PreviewModeProps {
  sections: Section[]
}

export function PreviewMode({ sections }: PreviewModeProps) {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order)

  const renderSection = (section: Section) => {
    switch (section.type) {
      case "about":
        return (
          <Card key={section.id} className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src={section.content.image || "/placeholder.svg"}
                alt={section.content.name}
                className="w-48 h-48 rounded-full object-cover"
              />
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{section.content.name}</h1>
                <h2 className="text-2xl text-muted-foreground mb-4">{section.content.title}</h2>
                <p className="text-lg leading-relaxed">{section.content.description}</p>
              </div>
            </div>
          </Card>
        )

      case "projects":
        return (
          <Card key={section.id} className="p-8">
            <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.content.projects?.map((project: any) => (
                <Card key={project.id} className="p-6">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.map((tech: string) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  {project.link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Project
                      </a>
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </Card>
        )

      case "skills":
        return (
          <Card key={section.id} className="p-8">
            <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.content.categories?.map((category: any, index: number) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold mb-3">{category.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill: string) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )

      case "contact":
        return (
          <Card key={section.id} className="p-8">
            <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {section.content.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <a href={`mailto:${section.content.email}`} className="hover:underline">
                      {section.content.email}
                    </a>
                  </div>
                )}
                {section.content.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <a href={`tel:${section.content.phone}`} className="hover:underline">
                      {section.content.phone}
                    </a>
                  </div>
                )}
                {section.content.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span>{section.content.location}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {section.content.social?.linkedin && (
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-5 h-5 text-muted-foreground" />
                    <a
                      href={section.content.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
                {section.content.social?.github && (
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-muted-foreground" />
                    <a
                      href={section.content.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      GitHub
                    </a>
                  </div>
                )}
                {section.content.social?.twitter && (
                  <div className="flex items-center gap-3">
                    <Twitter className="w-5 h-5 text-muted-foreground" />
                    <a
                      href={section.content.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Twitter
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">{sortedSections.map(renderSection)}</div>
      </div>
    </div>
  )
}
