import './globals.css'

export const metadata = {
  title: 'vidsnap.ai',
  description: 'YouTube Video Assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
