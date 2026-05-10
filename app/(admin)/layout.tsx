import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')

  if (auth?.value !== process.env.ADMIN_SESSION_SECRET) {
    redirect('/admin-login')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            🧂 Salt India — Admin
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              component={Link}
              href="/dashboard"
              size="small"
              sx={{ textTransform: 'none', color: 'text.secondary' }}
            >
              Orders
            </Button>
            <Button
              component={Link}
              href="/dashboard/sell-requests"
              size="small"
              sx={{ textTransform: 'none', color: 'text.secondary' }}
            >
              Sell Requests
            </Button>
            <Button
              href="/api/auth"
              size="small"
              color="error"
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: { xs: 2, md: 4 } }}>
        {children}
      </Box>
    </Box>
  )
}
