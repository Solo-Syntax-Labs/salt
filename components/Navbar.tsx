'use client'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Products', href: '/products' },
  { label: 'Order', href: '/order' },
  { label: 'Sell', href: '/sell' },
  { label: 'Track', href: '/track' },
]

export function Navbar() {
  const pathname = usePathname()

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin-login')) return null

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          component={Link}
          href="/"
          variant="h6"
          sx={{ fontWeight: 800, color: 'primary.main', textDecoration: 'none' }}
        >
          🧂 Salt India
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {NAV_LINKS.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: pathname === link.href ? 700 : 400,
                color: pathname === link.href ? 'primary.main' : 'text.secondary',
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
