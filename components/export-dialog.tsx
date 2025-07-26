"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Code } from "lucide-react"
import type { Section } from "@/app/page"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sections: Section[]
}

export function ExportDialog({ open, onOpenChange, sections }: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false)

  const generateHTML = () => {
    const sortedSections = [...sections].sort((a, b) => a.order - b.order)

    const sectionHTML = sortedSections
      .map((section) => {
        switch (section.type) {
          case "about":
            return `
            <section class="about-section">
              <div class="container">
                <div class="about-content">
                  <img src="${section.content.image}" alt="${section.content.name}" class="profile-image">
                  <div class="about-text">
                    <h1>${section.content.name}</h1>
                    <h2>${section.content.title}</h2>
                    <p>${section.content.description}</p>
                  </div>
                </div>
              </div>
            </section>
          `
          case "projects":
            const projectsHTML =
              section.content.projects
                ?.map(
                  (project: any) => `
            <div class="project-card">
              <img src="${project.image}" alt="${project.title}" class="project-image">
              <h3>${project.title}</h3>
              <p>${project.description}</p>
              ${project.link ? `<a href="${project.link}" target="_blank">View Project</a>` : ""}
            </div>
          `,
                )
                .join("") || ""

            return `
            <section class="projects-section">
              <div class="container">
                <h2>${section.title}</h2>
                <div class="projects-grid">
                  ${projectsHTML}
                </div>
              </div>
            </section>
          `
          case "skills":
            const skillsHTML =
              section.content.categories
                ?.map(
                  (category: any) => `
            <div class="skill-category">
              <h3>${category.name}</h3>
              <div class="skills-list">
                ${category.skills.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join("")}
              </div>
            </div>
          `,
                )
                .join("") || ""

            return `
            <section class="skills-section">
              <div class="container">
                <h2>${section.title}</h2>
                <div class="skills-grid">
                  ${skillsHTML}
                </div>
              </div>
            </section>
          `
          case "contact":
            return `
            <section class="contact-section">
              <div class="container">
                <h2>${section.title}</h2>
                <div class="contact-info">
                  ${section.content.email ? `<p>Email: <a href="mailto:${section.content.email}">${section.content.email}</a></p>` : ""}
                  ${section.content.phone ? `<p>Phone: <a href="tel:${section.content.phone}">${section.content.phone}</a></p>` : ""}
                  ${section.content.location ? `<p>Location: ${section.content.location}</p>` : ""}
                </div>
              </div>
            </section>
          `
          default:
            return ""
        }
      })
      .join("")

    const css = `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        section { padding: 60px 0; }
        .about-content { display: flex; align-items: center; gap: 40px; flex-wrap: wrap; }
        .profile-image { width: 200px; height: 200px; border-radius: 50%; object-fit: cover; }
        .about-text h1 { font-size: 3rem; margin-bottom: 10px; }
        .about-text h2 { font-size: 1.5rem; color: #666; margin-bottom: 20px; }
        .about-text p { font-size: 1.1rem; }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 30px; }
        .project-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
        .project-image { width: 100%; height: 200px; object-fit: cover; border-radius: 4px; margin-bottom: 15px; }
        .project-card h3 { margin-bottom: 10px; }
        .project-card a { display: inline-block; margin-top: 10px; color: #0066cc; text-decoration: none; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-top: 30px; }
        .skill-category h3 { margin-bottom: 15px; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-tag { background: #f0f0f0; padding: 4px 12px; border-radius: 20px; font-size: 0.9rem; }
        .contact-info p { margin-bottom: 10px; }
        .contact-info a { color: #0066cc; text-decoration: none; }
        h2 { font-size: 2.5rem; margin-bottom: 20px; text-align: center; }
        @media (max-width: 768px) {
          .about-content { flex-direction: column; text-align: center; }
          .about-text h1 { font-size: 2rem; }
          h2 { font-size: 2rem; }
        }
      </style>
    `

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Portfolio</title>
        ${css}
      </head>
      <body>
        ${sectionHTML}
      </body>
      </html>
    `
  }

  const exportHTML = () => {
    const html = generateHTML()
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "portfolio.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportPDF = async () => {
    setIsExporting(true)
    try {
      // Create a temporary iframe with the HTML content
      const html = generateHTML()
      const iframe = document.createElement("iframe")
      iframe.style.position = "absolute"
      iframe.style.left = "-9999px"
      iframe.style.width = "1200px"
      iframe.style.height = "800px"
      document.body.appendChild(iframe)

      iframe.contentDocument?.open()
      iframe.contentDocument?.write(html)
      iframe.contentDocument?.close()

      // Wait for content to load
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Use browser's print functionality
      iframe.contentWindow?.print()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 1000)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Portfolio</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="html" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="html">HTML Export</TabsTrigger>
            <TabsTrigger value="pdf">PDF Export</TabsTrigger>
          </TabsList>

          <TabsContent value="html" className="space-y-4">
            <div className="text-center space-y-4">
              <Code className="w-16 h-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">Export as HTML</h3>
                <p className="text-muted-foreground">
                  Download a complete HTML file with embedded CSS that you can host anywhere.
                </p>
              </div>
              <Button onClick={exportHTML} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download HTML
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="pdf" className="space-y-4">
            <div className="text-center space-y-4">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">Export as PDF</h3>
                <p className="text-muted-foreground">
                  Generate a PDF version of your portfolio for easy sharing and printing.
                </p>
              </div>
              <Button onClick={exportPDF} disabled={isExporting} className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                {isExporting ? "Generating PDF..." : "Generate PDF"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
