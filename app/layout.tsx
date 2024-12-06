import { Inter } from 'next/font/google'
import BottomNav from '@/components/BottomNav'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#F1F2F3] text-black min-h-screen">
        {children}
        <BottomNav />
      </body>
    </html>
  )
}

