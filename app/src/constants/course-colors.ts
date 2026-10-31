// Shared identical course color palette for both charts
export const courseColors = {
  "CS 480": "#10b981",  // Emerald
  "DES 420": "#8b5cf6", // Purple
  "CS 424": "#f59e0b",  // Amber
  "DES 357": "#ec4899", // Pink
  "DES 355": "#06b6d4"  // Cyan
} as const


export type CourseName = keyof typeof courseColors
