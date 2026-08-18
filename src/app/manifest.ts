import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NOPEPADS",
    short_name: "NOPEPADS",
    description: "A brutally awesome markdown notebook",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF4E0",
    theme_color: "#E6B905",
    icons: [
      {
        src: "/icon-192.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/icon-512.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
    shortcuts: [
      {
        name: "New Note",
        short_name: "New Note",
        description: "Create a new note",
        url: "/notes?new=true",
        icons: [{ src: "/icon-192.jpg", sizes: "192x192" }]
      },
      {
        name: "Notes List",
        short_name: "Notes",
        description: "View all notes",
        url: "/notes",
        icons: [{ src: "/icon-192.jpg", sizes: "192x192" }]
      },
      {
        name: "Archived Notes",
        short_name: "Archive",
        description: "View archived notes",
        url: "/notes?tab=archive",
        icons: [{ src: "/icon-192.jpg", sizes: "192x192" }]
      }
    ]
  } as MetadataRoute.Manifest
}
