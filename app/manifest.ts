import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Momentier Atelier',
    short_name: 'Momentier',
    description: 'Sistema de gestão Momentier Atelier',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#6a1a16',
    theme_color: '#8A2822',
    icons: [
      {
        src: '/icons/icon-apple.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
