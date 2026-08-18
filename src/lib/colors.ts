export const NOTE_COLORS = [
  { id: 'Yellow', bg: 'bg-note-yellow', border: 'border-note-yellow', text: 'text-black', hover: 'hover:opacity-80' },
  { id: 'Green', bg: 'bg-[#A2E676]', border: 'border-[#8BCC61]', text: 'text-black', hover: 'hover:bg-[#8BCC61]' },
  { id: 'Pink', bg: 'bg-[#FF94D2]', border: 'border-[#E67CB9]', text: 'text-black', hover: 'hover:bg-[#E67CB9]' },
  { id: 'Purple', bg: 'bg-[#C197FF]', border: 'border-[#A97DE6]', text: 'text-black', hover: 'hover:bg-[#A97DE6]' },
  { id: 'Blue', bg: 'bg-[#6BD9FA]', border: 'border-[#55C3E6]', text: 'text-black', hover: 'hover:bg-[#55C3E6]' },
  { id: 'Gray', bg: 'bg-[#E0E0E0]', border: 'border-[#C4C4C4]', text: 'text-black', hover: 'hover:bg-[#C4C4C4]' },
  { id: 'Charcoal', bg: 'bg-[#2E2E2E]', border: 'border-[#1C1C1C]', text: 'text-white', hover: 'hover:bg-[#1C1C1C]' },
]

export const getDefaultColor = () => NOTE_COLORS[0]

export const getColorStyles = (colorId: string | null | undefined) => {
  const color = NOTE_COLORS.find(c => c.id === colorId) || NOTE_COLORS[0]
  return color
}
