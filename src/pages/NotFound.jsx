import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState, Button } from '../components/ui'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="pt-10">
      <EmptyState
        icon={Compass}
        title="You took a wrong turn in the Roxzone"
        desc="This page doesn’t exist. Let’s get you back on the course."
        action={<Button onClick={() => navigate('/dashboard')}>Back to dashboard</Button>}
      />
    </div>
  )
}
