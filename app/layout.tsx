import './globals.css'
export const metadata = { title: 'RTA - Tennis', description: 'Ranking Amateur' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
