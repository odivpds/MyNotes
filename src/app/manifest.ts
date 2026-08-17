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
  }
}
