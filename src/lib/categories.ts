export const CATEGORIES = [
  { slug: "ai-tools-prompts", name: "AI Tools & Prompts", icon: "🤖", description: "Claude/ChatGPT/Gemini skills, system prompts, agent configs, automation workflows" },
  { slug: "presentation-templates", name: "Presentation & Slide Templates", icon: "📊", description: "PowerPoint, Google Slides, Keynote, Pitch decks" },
  { slug: "document-templates", name: "Document Templates", icon: "📄", description: "Word/Google Docs resumes, cover letters, legal templates, SOPs, business plans" },
  { slug: "spreadsheet-templates", name: "Spreadsheet Templates", icon: "📈", description: "Excel/Google Sheets financial models, trackers, dashboards, budgets" },
  { slug: "notion-productivity", name: "Notion & Productivity Templates", icon: "🗂️", description: "Notion dashboards, Obsidian vaults, ClickUp templates" },
  { slug: "design-assets", name: "Design Assets", icon: "🎨", description: "Canva templates, Figma components, UI kits, icon packs, fonts, mockups" },
  { slug: "ebooks-guides", name: "eBooks & Guides", icon: "📚", description: "PDFs, how-to guides, research reports, playbooks" },
  { slug: "courses-tutorials", name: "Online Courses & Tutorials", icon: "🎓", description: "Video lessons, structured learning modules, workshop recordings" },
  { slug: "code-dev-tools", name: "Code & Dev Tools", icon: "💻", description: "VS Code extensions, scripts, boilerplates, SaaS starter kits, APIs" },
  { slug: "photography-video", name: "Photography & Video", icon: "📷", description: "Stock photos, video clips, LUTs, Lightroom presets, After Effects templates" },
  { slug: "music-audio", name: "Music & Audio", icon: "🎵", description: "Royalty-free tracks, sound effects, sample packs, podcast intros" },
  { slug: "printables", name: "Printables", icon: "🖨️", description: "Planners, calendars, worksheets, wall art" },
  { slug: "website-themes-plugins", name: "Website Themes & Plugins", icon: "🌐", description: "WordPress themes, Webflow templates, Shopify themes, browser extensions" },
  { slug: "social-media-content", name: "Social Media Content", icon: "📱", description: "Instagram/TikTok templates, caption packs, content calendars" },
  { slug: "coaching-membership", name: "Coaching & Membership Access", icon: "🎯", description: "Gated community invites, 1:1 session booking links, cohort access" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryName(slug: string) {
  return getCategoryBySlug(slug)?.name ?? slug;
}
