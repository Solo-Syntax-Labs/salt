import Button from '@mui/material/Button'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

interface Props {
  href: string
  label: string
  variant?: 'customer' | 'team'
  size?: 'small' | 'medium'
}

export function WhatsAppButton({ href, label, variant = 'customer', size = 'small' }: Props) {
  const bgcolor = variant === 'customer' ? '#16a34a' : '#1d4ed8'
  const hoverColor = variant === 'customer' ? '#15803d' : '#1e40af'

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <Button
        size={size}
        variant="contained"
        startIcon={<OpenInNewIcon />}
        sx={{
          backgroundColor: bgcolor,
          '&:hover': { backgroundColor: hoverColor },
          textTransform: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Button>
    </a>
  )
}
