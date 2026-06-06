/**
 * NexusVault AI Icon Generator
 *
 * Generates unique, beautiful SVG icons for each product listing
 * based on title, description, and category. Every icon is deterministically
 * unique — same input always produces the same icon, but different products
 * always get different designs.
 */

// ── Hash utility ──────────────────────────────────────────────
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function hashToValues(seed: string, count: number): number[] {
  const values: number[] = [];
  for (let i = 0; i < count; i++) {
    values.push(hashString(seed + "_" + i));
  }
  return values;
}

function pick<T>(arr: T[], hash: number): T {
  return arr[hash % arr.length];
}

function range(hash: number, min: number, max: number): number {
  return min + (hash % (max - min + 1));
}

function rangeFloat(hash: number, min: number, max: number): number {
  return min + ((hash % 10000) / 10000) * (max - min);
}

// ── Color palettes per category ───────────────────────────────
const CATEGORY_PALETTES: Record<string, string[][]> = {
  "ai-tools-prompts": [
    ["#8B5CF6", "#A78BFA", "#C4B5FD", "#7C3AED"],
    ["#6366F1", "#818CF8", "#A5B4FC", "#4F46E5"],
    ["#EC4899", "#F472B6", "#F9A8D4", "#DB2777"],
    ["#8B5CF6", "#EC4899", "#F472B6", "#7C3AED"],
  ],
  "presentation-templates": [
    ["#F59E0B", "#FBBF24", "#FDE68A", "#D97706"],
    ["#EF4444", "#F87171", "#FCA5A5", "#DC2626"],
    ["#F97316", "#FB923C", "#FDBA74", "#EA580C"],
  ],
  "document-templates": [
    ["#3B82F6", "#60A5FA", "#93C5FD", "#2563EB"],
    ["#0EA5E9", "#38BDF8", "#7DD3FC", "#0284C7"],
    ["#6366F1", "#818CF8", "#A5B4FC", "#4F46E5"],
  ],
  "spreadsheet-templates": [
    ["#10B981", "#34D399", "#6EE7B7", "#059669"],
    ["#14B8A6", "#2DD4BF", "#5EEAD4", "#0D9488"],
    ["#22C55E", "#4ADE80", "#86EFAC", "#16A34A"],
  ],
  "notion-productivity": [
    ["#8B5CF6", "#A78BFA", "#C4B5FD", "#7C3AED"],
    ["#F59E0B", "#FBBF24", "#FDE68A", "#D97706"],
    ["#EC4899", "#F472B6", "#F9A8D4", "#DB2777"],
  ],
  "design-assets": [
    ["#EC4899", "#F472B6", "#F9A8D4", "#DB2777"],
    ["#F43F5E", "#FB7185", "#FDA4AF", "#E11D48"],
    ["#D946EF", "#E879F9", "#F0ABFC", "#C026D3"],
  ],
  "ebooks-guides": [
    ["#6366F1", "#818CF8", "#A5B4FC", "#4F46E5"],
    ["#8B5CF6", "#A78BFA", "#C4B5FD", "#7C3AED"],
    ["#0EA5E9", "#38BDF8", "#7DD3FC", "#0284C7"],
  ],
  "courses-tutorials": [
    ["#F59E0B", "#FBBF24", "#FDE68A", "#D97706"],
    ["#EF4444", "#F87171", "#FCA5A5", "#DC2626"],
    ["#8B5CF6", "#A78BFA", "#C4B5FD", "#7C3AED"],
  ],
  "code-dev-tools": [
    ["#10B981", "#34D399", "#6EE7B7", "#059669"],
    ["#06B6D4", "#22D3EE", "#67E8F9", "#0891B2"],
    ["#3B82F6", "#60A5FA", "#93C5FD", "#2563EB"],
  ],
  "photography-video": [
    ["#F43F5E", "#FB7185", "#FDA4AF", "#E11D48"],
    ["#F97316", "#FB923C", "#FDBA74", "#EA580C"],
    ["#EF4444", "#F87171", "#FCA5A5", "#DC2626"],
  ],
  "music-audio": [
    ["#D946EF", "#E879F9", "#F0ABFC", "#C026D3"],
    ["#EC4899", "#F472B6", "#F9A8D4", "#DB2777"],
    ["#8B5CF6", "#A78BFA", "#C4B5FD", "#7C3AED"],
  ],
  "printables": [
    ["#14B8A6", "#2DD4BF", "#5EEAD4", "#0D9488"],
    ["#F59E0B", "#FBBF24", "#FDE68A", "#D97706"],
    ["#EC4899", "#F472B6", "#F9A8D4", "#DB2777"],
  ],
  "website-themes-plugins": [
    ["#3B82F6", "#60A5FA", "#93C5FD", "#2563EB"],
    ["#06B6D4", "#22D3EE", "#67E8F9", "#0891B2"],
    ["#10B981", "#34D399", "#6EE7B7", "#059669"],
  ],
  "social-media-content": [
    ["#F43F5E", "#FB7185", "#FDA4AF", "#E11D48"],
    ["#EC4899", "#F472B6", "#F9A8D4", "#DB2777"],
    ["#8B5CF6", "#A78BFA", "#C4B5FD", "#7C3AED"],
  ],
  "coaching-membership": [
    ["#F59E0B", "#FBBF24", "#FDE68A", "#D97706"],
    ["#EF4444", "#F87171", "#FCA5A5", "#DC2626"],
    ["#10B981", "#34D399", "#6EE7B7", "#059669"],
  ],
};

const DEFAULT_PALETTES = [
  ["#8B5CF6", "#A78BFA", "#C4B5FD", "#7C3AED"],
  ["#3B82F6", "#60A5FA", "#93C5FD", "#2563EB"],
  ["#EC4899", "#F472B6", "#F9A8D4", "#DB2777"],
];

// ── Category icon paths (SVG path data) ──────────────────────
const CATEGORY_SYMBOLS: Record<string, string[]> = {
  "ai-tools-prompts": [
    // Brain / neural network
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
    // Sparkle / AI star
    "M12 2L14.4 8.2L21 9.2L16 13.9L17.2 20.5L12 17.3L6.8 20.5L8 13.9L3 9.2L9.6 8.2L12 2Z",
    // Robot head
    "M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-.5-4c-.83 0-1.5-.67-1.5-1.5S14.67 10 15.5 10s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
    // Chat/prompt bubble
    "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7V9zm4 0h2v2h-2V9zm4 0h2v2h-2V9z",
  ],
  "spreadsheet-templates": [
    // Grid/table
    "M3 3h18v18H3V3zm2 4v4h6V7H5zm8 0v4h6V7h-6zm-8 6v4h6v-4H5zm8 0v4h6v-4h-6z",
    // Chart bars
    "M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z",
    // Trending up
    "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",
  ],
  "design-assets": [
    // Palette
    "M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.2-.64-1.67-.08-.1-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
    // Pen tool
    "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    // Shapes
    "M11.15 3.4L7.43 9.48c-.41.66.07 1.52.85 1.52h7.43c.78 0 1.26-.86.85-1.52l-3.72-6.07c-.39-.67-1.31-.67-1.69-.01zM17 14.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zM3.5 21.5h7v-7h-7v7z",
  ],
  "code-dev-tools": [
    // Code brackets
    "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
    // Terminal
    "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-2-1h-6v-2h6v2zM7.5 17l-1.41-1.41L8.67 13l-2.59-2.59L7.5 9l4 4-4 4z",
    // Bug
    "M20 8h-2.81a5.985 5.985 0 0 0-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z",
  ],
  "ebooks-guides": [
    // Open book
    "M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z",
    // Bookmark
    "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z",
    // Article
    "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
  ],
  "courses-tutorials": [
    // Graduation cap
    "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z",
    // Play circle
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
    // School
    "M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z",
  ],
  "music-audio": [
    // Music note
    "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
    // Headphones
    "M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z",
    // Waveform
    "M7 18h2V6H7v12zm4 4h2V2h-2v20zm-8-8h2v-4H3v4zm12 4h2V6h-2v12zm4-8v4h2v-4h-2z",
  ],
  "photography-video": [
    // Camera
    "M12 10.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z",
    // Film
    "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z",
    // Aperture
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z",
  ],
  "social-media-content": [
    // Heart
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    // Share
    "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z",
    // Megaphone
    "M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1l5 3V6L5 9H4z",
  ],
  "printables": [
    // Print
    "M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z",
    // Scissors
    "M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64z",
    // Grid view
    "M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z",
  ],
  "website-themes-plugins": [
    // Globe
    "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z",
    // Layers
    "M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z",
    // Code
    "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
  ],
  "coaching-membership": [
    // Target
    "M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
    // People
    "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    // Rocket
    "M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55l1.33.26zM11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57-.95-.3-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83L11.17 17zm6.48-2.16c-2.29 2.04-5.58 3.44-5.89 3.57L13.31 22l4.05-4.05c.47-.47.68-1.15.55-1.81l-.26-1.3zM9 18c0 .83-.34 1.58-.88 2.12C6.94 21.3 2 22 2 22s.7-4.94 1.88-6.12A2.996 2.996 0 0 1 9 18z",
  ],
  "document-templates": [
    // Document
    "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01V17h2.01v-1.99H8zm0-4V13h2.01v-1.99H8z",
    // File copy
    "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z",
    // Assignment
    "M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
  ],
  "presentation-templates": [
    // Slideshow
    "M10 8v8l5-4-5-4zm9-5H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z",
    // Dashboard
    "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    // Monitor
    "M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z",
  ],
  "notion-productivity": [
    // Dashboard
    "M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm11 1h2v4h-2v-4zm-2-3h8v8h-8v-8zm2 2v4h4v-4h-4z",
    // Checklist
    "M3 5h2V3H3v2zm4 14h14v-2H7v2zM3 13h2v-2H3v2zm0 4h2v-2H3v2zM3 9h2V7H3v2zm4-4h14V3H7v2zm0 8h14v-2H7v2zm0-4h14V7H7v2z",
    // Widgets
    "M13 13v8h8v-8h-8zM3 21h8v-8H3v8zM3 3v8h8V3H3zm13.66-1.31L11 7.34 16.66 13l5.66-5.66-5.66-5.65z",
  ],
};

// ── Background pattern generators ─────────────────────────────
function generateDots(h: number[], color: string, opacity: number): string {
  let dots = "";
  const count = range(h[0], 6, 14);
  for (let i = 0; i < count; i++) {
    const cx = range(h[i + 1] || h[0] + i * 31, 30, 370);
    const cy = range(h[i + 2] || h[1] + i * 47, 30, 370);
    const r = rangeFloat(h[i + 3] || h[2] + i * 13, 2, 8);
    dots += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity.toFixed(2)}" />`;
  }
  return dots;
}

function generateLines(h: number[], color: string, opacity: number): string {
  let lines = "";
  const count = range(h[0], 3, 7);
  for (let i = 0; i < count; i++) {
    const x1 = range(h[i + 1] || h[0] + i * 41, 0, 400);
    const y1 = range(h[i + 2] || h[1] + i * 53, 0, 400);
    const x2 = range(h[i + 3] || h[2] + i * 29, 0, 400);
    const y2 = range(h[i + 4] || h[3] + i * 37, 0, 400);
    lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.5" opacity="${opacity.toFixed(2)}" />`;
  }
  return lines;
}

function generateHexGrid(h: number[], color: string, opacity: number): string {
  let hexes = "";
  const size = range(h[0], 20, 35);
  const rows = Math.ceil(400 / (size * 1.5));
  const cols = Math.ceil(400 / (size * 1.73));
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * size * 1.73 + (row % 2 === 0 ? 0 : size * 0.866);
      const cy = row * size * 1.5;
      if ((hashString(`${row}_${col}`) + h[1]) % 3 === 0) {
        const points = [];
        for (let a = 0; a < 6; a++) {
          const angle = (Math.PI / 3) * a - Math.PI / 6;
          points.push(`${cx + size * 0.4 * Math.cos(angle)},${cy + size * 0.4 * Math.sin(angle)}`);
        }
        hexes += `<polygon points="${points.join(" ")}" fill="none" stroke="${color}" stroke-width="0.8" opacity="${opacity.toFixed(2)}" />`;
      }
    }
  }
  return hexes;
}

function generateCircleRings(h: number[], color: string, opacity: number): string {
  let rings = "";
  const cx = range(h[0], 120, 280);
  const cy = range(h[1], 120, 280);
  const count = range(h[2], 3, 6);
  for (let i = 1; i <= count; i++) {
    rings += `<circle cx="${cx}" cy="${cy}" r="${i * range(h[3], 25, 45)}" fill="none" stroke="${color}" stroke-width="1" opacity="${(opacity * (1 - i * 0.12)).toFixed(2)}" />`;
  }
  return rings;
}

function generateWaves(h: number[], color: string, opacity: number): string {
  let waves = "";
  const count = range(h[0], 3, 6);
  for (let i = 0; i < count; i++) {
    const y = 60 + i * range(h[1], 50, 80);
    const amp = range(h[2] + i, 15, 40);
    const freq = rangeFloat(h[3] + i, 0.01, 0.03);
    let d = `M 0 ${y}`;
    for (let x = 0; x <= 400; x += 10) {
      d += ` L ${x} ${y + amp * Math.sin(x * freq * 6.28 + i)}`;
    }
    waves += `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.5" opacity="${(opacity * (1 - i * 0.15)).toFixed(2)}" />`;
  }
  return waves;
}

// ── Decorative shapes ─────────────────────────────────────────
function generateFloatingShapes(h: number[], colors: string[]): string {
  let shapes = "";
  const count = range(h[0], 3, 6);
  const shapeTypes = ["circle", "rect", "diamond", "triangle"];

  for (let i = 0; i < count; i++) {
    const x = range(h[i + 1] || h[0] + i * 67, 20, 380);
    const y = range(h[i + 2] || h[1] + i * 43, 20, 380);
    const size = range(h[i + 3] || h[2] + i * 31, 8, 25);
    const color = pick(colors, h[i + 4] || h[3] + i);
    const opacity = rangeFloat(h[i + 5] || h[4] + i * 17, 0.1, 0.3);
    const type = pick(shapeTypes, h[i + 6] || h[5] + i * 23);
    const rotation = range(h[i + 7] || h[6] + i * 11, 0, 360);

    switch (type) {
      case "circle":
        shapes += `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="${opacity.toFixed(2)}" />`;
        break;
      case "rect":
        shapes += `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" rx="${size * 0.2}" fill="${color}" opacity="${opacity.toFixed(2)}" transform="rotate(${rotation} ${x} ${y})" />`;
        break;
      case "diamond":
        shapes += `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" fill="${color}" opacity="${opacity.toFixed(2)}" transform="rotate(45 ${x} ${y})" />`;
        break;
      case "triangle":
        const s = size;
        shapes += `<polygon points="${x},${y - s} ${x - s * 0.87},${y + s * 0.5} ${x + s * 0.87},${y + s * 0.5}" fill="${color}" opacity="${opacity.toFixed(2)}" transform="rotate(${rotation} ${x} ${y})" />`;
        break;
    }
  }
  return shapes;
}

// ── Main icon generator ───────────────────────────────────────
export function generateProductIcon(
  title: string,
  description: string,
  category: string
): string {
  const seed = `${title}::${description}::${category}`;
  const h = hashToValues(seed, 30);

  // Pick color palette
  const palettes = CATEGORY_PALETTES[category] || DEFAULT_PALETTES;
  const palette = pick(palettes, h[0]);
  const [primary, secondary, light, dark] = palette;

  // Background gradient direction
  const gradAngle = range(h[1], 0, 360);
  const gradX1 = 50 + 50 * Math.cos((gradAngle * Math.PI) / 180);
  const gradY1 = 50 + 50 * Math.sin((gradAngle * Math.PI) / 180);
  const gradX2 = 50 - 50 * Math.cos((gradAngle * Math.PI) / 180);
  const gradY2 = 50 - 50 * Math.sin((gradAngle * Math.PI) / 180);

  // Background pattern type
  const patternTypes = ["dots", "lines", "hexgrid", "rings", "waves", "none"];
  const patternType = pick(patternTypes, h[2]);
  const patternH = hashToValues(seed + "_pattern", 20);
  let patternSvg = "";
  switch (patternType) {
    case "dots":
      patternSvg = generateDots(patternH, light, 0.15);
      break;
    case "lines":
      patternSvg = generateLines(patternH, light, 0.1);
      break;
    case "hexgrid":
      patternSvg = generateHexGrid(patternH, light, 0.12);
      break;
    case "rings":
      patternSvg = generateCircleRings(patternH, light, 0.15);
      break;
    case "waves":
      patternSvg = generateWaves(patternH, light, 0.12);
      break;
  }

  // Floating decorative shapes
  const shapeH = hashToValues(seed + "_shapes", 20);
  const floatingShapes = generateFloatingShapes(shapeH, [primary, secondary, light]);

  // Central icon
  const symbols = CATEGORY_SYMBOLS[category] || CATEGORY_SYMBOLS["ai-tools-prompts"];
  const iconPath = pick(symbols, h[3]);
  const iconScale = rangeFloat(h[4], 5, 6.5);
  const iconX = 200 - 12 * iconScale;
  const iconY = 200 - 12 * iconScale;

  // Glow behind icon
  const glowRadius = range(h[5], 40, 70);

  // Optional accent ring around icon
  const hasRing = h[6] % 3 !== 0;
  const ringRadius = range(h[7], 55, 80);

  // Optional corner accent
  const hasCornerAccent = h[8] % 2 === 0;
  const cornerType = h[9] % 3;

  // Unique ID suffix to avoid SVG ID collisions
  const uid = Math.abs(h[10]).toString(36).slice(0, 6);

  let cornerAccent = "";
  if (hasCornerAccent) {
    if (cornerType === 0) {
      // Top-right triangle
      cornerAccent = `<polygon points="280,0 400,0 400,120" fill="${primary}" opacity="0.15" />`;
    } else if (cornerType === 1) {
      // Bottom-left arc
      cornerAccent = `<circle cx="0" cy="400" r="120" fill="${dark}" opacity="0.12" />`;
    } else {
      // Top-left square
      cornerAccent = `<rect x="0" y="0" width="80" height="80" fill="${secondary}" opacity="0.1" rx="10" />`;
    }
  }

  // Build the SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bg_${uid}" x1="${gradX1.toFixed(1)}%" y1="${gradY1.toFixed(1)}%" x2="${gradX2.toFixed(1)}%" y2="${gradY2.toFixed(1)}%">
      <stop offset="0%" stop-color="#0a0a0f" />
      <stop offset="50%" stop-color="#111118" />
      <stop offset="100%" stop-color="#0d0d14" />
    </linearGradient>
    <radialGradient id="glow_${uid}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.4" />
      <stop offset="60%" stop-color="${primary}" stop-opacity="0.1" />
      <stop offset="100%" stop-color="${primary}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glow2_${uid}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${secondary}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${secondary}" stop-opacity="0" />
    </radialGradient>
    <filter id="blur_${uid}">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
    </filter>
    <filter id="shadow_${uid}">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="${primary}" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="400" height="400" rx="24" fill="url(#bg_${uid})" />

  <!-- Subtle gradient overlay -->
  <rect width="400" height="400" rx="24" fill="${dark}" opacity="0.05" />

  <!-- Corner accent -->
  ${cornerAccent}

  <!-- Pattern layer -->
  <g clip-path="inset(0 round 24px)">
    ${patternSvg}
  </g>

  <!-- Floating shapes -->
  ${floatingShapes}

  <!-- Central glow -->
  <circle cx="200" cy="200" r="${glowRadius}" fill="url(#glow_${uid})" filter="url(#blur_${uid})" />
  <circle cx="${200 + range(h[11], -30, 30)}" cy="${200 + range(h[12], -30, 30)}" r="${glowRadius * 0.6}" fill="url(#glow2_${uid})" filter="url(#blur_${uid})" />

  <!-- Accent ring -->
  ${hasRing ? `<circle cx="200" cy="200" r="${ringRadius}" fill="none" stroke="${primary}" stroke-width="1.5" opacity="0.25" />
  <circle cx="200" cy="200" r="${ringRadius + 12}" fill="none" stroke="${secondary}" stroke-width="0.5" opacity="0.15" stroke-dasharray="4 6" />` : ""}

  <!-- Central icon -->
  <g transform="translate(${iconX.toFixed(1)}, ${iconY.toFixed(1)}) scale(${iconScale.toFixed(2)})" filter="url(#shadow_${uid})">
    <path d="${iconPath}" fill="${primary}" />
  </g>

  <!-- Icon highlight layer (slightly offset for depth) -->
  <g transform="translate(${(iconX - 1).toFixed(1)}, ${(iconY - 1).toFixed(1)}) scale(${iconScale.toFixed(2)})" opacity="0.3">
    <path d="${iconPath}" fill="${light}" />
  </g>

  <!-- Border glow -->
  <rect width="398" height="398" x="1" y="1" rx="23" fill="none" stroke="${primary}" stroke-width="1" opacity="0.2" />
</svg>`;

  return svg;
}

/**
 * Converts an SVG string to a data URL for use as thumbnailUrl
 */
export function svgToDataUrl(svg: string): string {
  const encoded = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${encoded}`;
}

/**
 * Full pipeline: generate icon and return as data URL
 */
export function generateProductIconUrl(
  title: string,
  description: string,
  category: string
): string {
  const svg = generateProductIcon(title, description, category);
  return svgToDataUrl(svg);
}
