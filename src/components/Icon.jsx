import {
  Wind, MoveRight, MoveLeft, Zap, Waves, Dumbbell, Footprints, Target, Timer, Flag, Flame, Trophy,
} from 'lucide-react'

const map = {
  wind: Wind,
  'move-right': MoveRight,
  'move-left': MoveLeft,
  zap: Zap,
  waves: Waves,
  dumbbell: Dumbbell,
  footprints: Footprints,
  target: Target,
  timer: Timer,
  flag: Flag,
  flame: Flame,
  trophy: Trophy,
}

export default function Icon({ name, ...props }) {
  const C = map[name] ?? Zap
  return <C {...props} />
}
