import './globals.css'
export const metadata = { title: 'The Ladder - Tennis', description: 'Ranking Amateur' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
