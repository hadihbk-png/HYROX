// Realistic mock data for RoxForge. No backend: everything lives here.

export const user = {
  name: 'Jordan Reyes',
  handle: '@jreyes.trains',
  initials: 'JR',
  division: 'Open',
  category: 'Men',
  homeGym: 'Forge Lab — East Side',
  targetRace: 'HYROX-style Race · Berlin',
  targetFinish: 80 * 60 + 0, // 1:20:00
  streak: 17,
  bestStreak: 24,
  memberSince: 'Mar 2025',
}

// Next race is always ~38 days out so the countdown stays alive in the demo
export const nextRace = {
  name: 'HYROX-style Race · Berlin',
  venue: 'Messe Berlin, Hall 20',
  date: new Date(Date.now() + (38 * 24 + 6) * 3600 * 1000 + 17 * 60 * 1000),
  wave: 'Open Men · 10:40 wave',
}

// The 8 stations in race order, plus Running and Strength as training categories
export const stations = [
  {
    id: 'skierg',
    order: 1,
    name: 'SkiErg',
    spec: '1000 m',
    icon: 'wind',
    difficulty: 3,
    category: 'Engine',
    standards: {
      Open: 'Damper of choice · Men & Women 1000 m',
      Pro: 'Damper of choice · Men & Women 1000 m',
      Doubles: 'Split freely between partners · 1000 m total',
    },
    tips: [
      'Hinge at the hips and let your bodyweight drive the handles down; arms finish the stroke.',
      'Settle into a pace 3–5 s/500 m slower than your 1k test. The race is long.',
      'Breathe out on the pull and in on the recovery. Keep it rhythmic.',
    ],
    target: 285,
  },
  {
    id: 'sled-push',
    order: 2,
    name: 'Sled Push',
    spec: '4 × 12.5 m',
    icon: 'move-right',
    difficulty: 5,
    category: 'Power',
    standards: {
      Open: 'Men 152 kg · Women 102 kg (incl. sled)',
      Pro: 'Men 202 kg · Women 152 kg (incl. sled)',
      Doubles: 'Open weights · alternate lengths with partner',
    },
    tips: [
      'Arms locked, low body angle (~45°), drive through the balls of your feet.',
      'Short, choppy steps beat long strides. Keep the sled moving because restarts cost the most.',
      'Turn fast at each end: the sled stops, your feet shouldn’t.',
    ],
    target: 195,
  },
  {
    id: 'sled-pull',
    order: 3,
    name: 'Sled Pull',
    spec: '4 × 12.5 m',
    icon: 'move-left',
    difficulty: 4,
    category: 'Power',
    standards: {
      Open: 'Men 103 kg · Women 78 kg (incl. sled)',
      Pro: 'Men 153 kg · Women 103 kg (incl. sled)',
      Doubles: 'Open weights · alternate lengths with partner',
    },
    tips: [
      'Sit back into a quarter squat and use legs + hips, not just arms.',
      'Hand-over-hand with long pulls; lay the rope neatly so you don’t trip.',
      'Walk backwards to the line between pulls to buy rope length.',
    ],
    target: 260,
  },
  {
    id: 'burpee-broad-jump',
    order: 4,
    name: 'Burpee Broad Jumps',
    spec: '80 m',
    icon: 'zap',
    difficulty: 4,
    category: 'Bodyweight',
    standards: {
      Open: 'Chest to floor, two-foot take-off and landing · 80 m',
      Pro: 'Chest to floor, two-foot take-off and landing · 80 m',
      Doubles: 'Split freely between partners · 80 m',
    },
    tips: [
      'Step back out of the burpee instead of jumping to save your heart rate.',
      'Moderate jumps (≈1.6–1.9 m) are more sustainable than max-effort leaps.',
      'Find a breathing rhythm: one breath on the floor, one on the jump.',
    ],
    target: 270,
  },
  {
    id: 'row',
    order: 5,
    name: 'Rowing',
    spec: '1000 m',
    icon: 'waves',
    difficulty: 3,
    category: 'Engine',
    standards: {
      Open: 'Damper of choice · Men & Women 1000 m',
      Pro: 'Damper of choice · Men & Women 1000 m',
      Doubles: 'Split freely between partners · 1000 m',
    },
    tips: [
      'Legs → body → arms on the drive; arms → body → legs on the recovery.',
      'Rate 26–30 spm with a strong push holds pace without burning the legs.',
      'Use the last 100 m to stand up early and shake out the legs for the run.',
    ],
    target: 290,
  },
  {
    id: 'farmers-carry',
    order: 6,
    name: 'Farmers Carry',
    spec: '200 m',
    icon: 'dumbbell',
    difficulty: 2,
    category: 'Grip',
    standards: {
      Open: 'Men 2 × 24 kg · Women 2 × 16 kg',
      Pro: 'Men 2 × 32 kg · Women 2 × 24 kg',
      Doubles: 'Open weights · split freely',
    },
    tips: [
      'Shoulders packed, chest tall. Walk fast with quick, short steps.',
      'Grip with the whole hand; chalk before the station if allowed.',
      'If you must drop, set them down with intent and pick up within 3 s.',
    ],
    target: 110,
  },
  {
    id: 'sandbag-lunges',
    order: 7,
    name: 'Sandbag Lunges',
    spec: '100 m',
    icon: 'footprints',
    difficulty: 4,
    category: 'Legs',
    standards: {
      Open: 'Men 20 kg · Women 10 kg · knee touches floor',
      Pro: 'Men 30 kg · Women 20 kg · knee touches floor',
      Doubles: 'Open weights · split freely',
    },
    tips: [
      'Bag high across the shoulders, torso upright. Don’t let it slide forward.',
      'Short, consistent steps: tap the knee lightly, drive through the front heel.',
      'Break the 100 m mentally into 4 × 25 m chunks.',
    ],
    target: 285,
  },
  {
    id: 'wall-balls',
    order: 8,
    name: 'Wall Balls',
    spec: '100 reps',
    icon: 'target',
    difficulty: 4,
    category: 'Finisher',
    standards: {
      Open: 'Men 6 kg to 3.0 m · Women 4 kg to 2.7 m',
      Pro: 'Men 9 kg to 3.0 m · Women 6 kg to 2.7 m',
      Doubles: 'Open weights · split freely',
    },
    tips: [
      'Plan your sets before you arrive (e.g. 25-20-20-15-10-10) and stick to it.',
      'Catch high, ride the squat down and use the bounce out of the bottom.',
      'Rest with the ball held at the chest. Never drop it to the floor.',
    ],
    target: 330,
  },
  {
    id: 'running',
    order: null,
    name: 'Running',
    spec: '8 × 1 km',
    icon: 'footprints',
    difficulty: 3,
    category: 'Running',
    standards: {
      Open: '8 × 1 km between stations, plus Roxzone transitions',
      Pro: '8 × 1 km between stations, plus Roxzone transitions',
      Doubles: 'Both partners run every 1 km together',
    },
    tips: [
      'Your first 1 km should feel too easy. Adrenaline lies.',
      'Train compromised running: 1 km straight after leg-heavy stations.',
      'Take short, quick steps for the first 200 m after a station to reset your legs.',
    ],
    target: 285,
  },
  {
    id: 'strength',
    order: null,
    name: 'Strength',
    spec: 'Gym work',
    icon: 'dumbbell',
    difficulty: 3,
    category: 'Strength',
    standards: {
      Open: 'Support work: squats, deadlifts, lunges, rows, carries',
      Pro: 'Heavier loads: prioritise posterior chain and grip',
      Doubles: 'Same as individual. Build a strong base for both',
    },
    tips: [
      'Two strength sessions per week are enough to support race performance.',
      'Prioritise unilateral leg work: split squats and step-ups carry over to lunges.',
      'Grip endurance: heavy holds, 3 × 45 s, twice a week.',
    ],
    target: null,
  },
]

export const raceStations = stations.filter((s) => s.order).sort((a, b) => a.order - b.order)

// Today's planned session
export const todaySession = {
  title: 'Compromised Running',
  subtitle: '4 × 1 km + Wall Balls',
  duration: 52,
  intensity: 'High',
  focus: 'Race-pace under fatigue',
  blocks: [
    { label: 'Warm-up', detail: '10 min easy jog + drills' },
    { label: '4 rounds', detail: '1 km @ 4:40/km → 25 Wall Balls' },
    { label: 'Rest', detail: '90 s between rounds' },
    { label: 'Cool-down', detail: '8 min easy + mobility' },
  ],
}

export const weeklyTraining = [
  { day: 'Mon', runKm: 8.2, stationMin: 22 },
  { day: 'Tue', runKm: 5.0, stationMin: 38 },
  { day: 'Wed', runKm: 10.4, stationMin: 0 },
  { day: 'Thu', runKm: 4.0, stationMin: 45 },
  { day: 'Fri', runKm: 0, stationMin: 30 },
  { day: 'Sat', runKm: 12.6, stationMin: 26 },
  { day: 'Sun', runKm: 6.0, stationMin: 0 },
]

export const weeklyGoals = {
  sessions: { done: 5, target: 6 },
  runKm: { done: 46.2, target: 55 },
  stationTargets: { done: 7, target: 8 },
}

// Past race results (simulations + real races), seconds
const mkSplits = (runs, st, roxzone) => ({ runs, stations: st, roxzone })

export const pastRaces = [
  {
    id: 'r1', date: '2025-11-15', name: 'Sim · Forge Lab', type: 'Simulation',
    ...mkSplits([272, 290, 301, 309, 305, 312, 318, 330], [312, 246, 318, 336, 315, 132, 342, 418], 492),
  },
  {
    id: 'r2', date: '2026-01-24', name: 'HYROX-style Race · Hamburg', type: 'Race',
    ...mkSplits([268, 284, 296, 302, 298, 304, 310, 322], [305, 232, 300, 318, 309, 126, 330, 398], 470),
  },
  {
    id: 'r3', date: '2026-03-21', name: 'Sim · Forge Lab', type: 'Simulation',
    ...mkSplits([262, 280, 289, 296, 292, 298, 302, 314], [298, 222, 288, 306, 302, 121, 318, 384], 450),
  },
  {
    id: 'r4', date: '2026-05-30', name: 'HYROX-style Race · Amsterdam', type: 'Race',
    ...mkSplits([258, 276, 284, 290, 287, 292, 297, 306], [292, 214, 279, 294, 297, 118, 309, 370], 432),
  },
  {
    id: 'r5', date: '2026-08-09', name: 'Sim · Forge Lab', type: 'Simulation',
    ...mkSplits([255, 272, 280, 285, 282, 287, 292, 300], [288, 205, 272, 286, 293, 114, 300, 362], 418),
  },
  {
    id: 'r6', date: '2026-10-04', name: 'HYROX-style Race · Cologne', type: 'Race',
    ...mkSplits([250, 268, 276, 281, 279, 283, 288, 296], [284, 198, 268, 279, 290, 111, 294, 352], 405),
  },
].map((r) => ({
  ...r,
  total: r.runs.reduce((a, b) => a + b, 0) + r.stations.reduce((a, b) => a + b, 0) + r.roxzone,
}))

export const classes = [
  { id: 'c1', day: 'Mon', time: '06:30', name: 'HYROX-style Class', type: 'hyrox', coach: 'Maya K.', duration: 60, spots: 4, capacity: 20 },
  { id: 'c2', day: 'Mon', time: '18:00', name: 'Strength', type: 'strength', coach: 'Leo B.', duration: 50, spots: 9, capacity: 14 },
  { id: 'c3', day: 'Tue', time: '07:00', name: 'Run Club', type: 'run', coach: 'Sam O.', duration: 45, spots: 12, capacity: 25 },
  { id: 'c4', day: 'Tue', time: '19:00', name: 'Engine Builder', type: 'engine', coach: 'Maya K.', duration: 45, spots: 2, capacity: 16 },
  { id: 'c5', day: 'Wed', time: '06:30', name: 'HYROX-style Class', type: 'hyrox', coach: 'Ana P.', duration: 60, spots: 0, capacity: 20 },
  { id: 'c6', day: 'Wed', time: '18:30', name: 'Strength', type: 'strength', coach: 'Leo B.', duration: 50, spots: 6, capacity: 14 },
  { id: 'c7', day: 'Thu', time: '07:00', name: 'Engine Builder', type: 'engine', coach: 'Sam O.', duration: 45, spots: 7, capacity: 16 },
  { id: 'c8', day: 'Thu', time: '19:00', name: 'Run Club', type: 'run', coach: 'Sam O.', duration: 45, spots: 15, capacity: 25 },
  { id: 'c9', day: 'Fri', time: '06:30', name: 'HYROX-style Class', type: 'hyrox', coach: 'Maya K.', duration: 60, spots: 8, capacity: 20 },
  { id: 'c10', day: 'Sat', time: '09:00', name: 'Mock Race', type: 'mock', coach: 'Full coaching team', duration: 120, spots: 5, capacity: 40 },
  { id: 'c11', day: 'Sat', time: '12:00', name: 'Strength', type: 'strength', coach: 'Ana P.', duration: 50, spots: 10, capacity: 14 },
  { id: 'c12', day: 'Sun', time: '09:30', name: 'Run Club', type: 'run', coach: 'Sam O.', duration: 60, spots: 18, capacity: 25 },
]

export const classTypes = {
  hyrox: { label: 'HYROX-style', color: '#ff8a00' },
  engine: { label: 'Engine', color: '#ffd600' },
  strength: { label: 'Strength', color: '#ff4d00' },
  run: { label: 'Run', color: '#38bdf8' },
  mock: { label: 'Mock Race', color: '#a78bfa' },
}

export const achievements = [
  { id: 'sub90', name: 'Sub-90', desc: 'Finish a full race under 1:30:00', earned: true, icon: 'timer' },
  { id: 'wbw', name: 'Wall Ball Warrior', desc: '100 unbroken-ish wall balls under 5:00', earned: true, icon: 'target' },
  { id: 'firstsim', name: 'First Full Sim', desc: 'Complete your first full race simulation', earned: true, icon: 'flag' },
  { id: 'streak14', name: 'Two-Week Fire', desc: 'Train 14 days in a row', earned: true, icon: 'flame' },
  { id: 'sledking', name: 'Sled Dog', desc: 'Sled push under 3:20', earned: true, icon: 'zap' },
  { id: 'sub80', name: 'Sub-80', desc: 'Finish a full race under 1:20:00', earned: false, icon: 'trophy' },
  { id: 'century', name: 'Century Month', desc: 'Run 100 km in a calendar month', earned: false, icon: 'footprints' },
  { id: 'pro', name: 'Pro Ready', desc: 'Complete a sim at Pro weights', earned: false, icon: 'dumbbell' },
]

export const quotes = [
  { text: 'The race is won in the Roxzone you didn’t waste.', author: 'Coach’s whiteboard' },
  { text: 'Run like you have nothing left, then pick up a sandbag.', author: 'Forge Lab' },
  { text: 'Comfort is the enemy of a sub-80.', author: 'Anonymous athlete' },
  { text: 'Every wall ball is a vote for the athlete you’re becoming.', author: 'RoxForge' },
  { text: 'Pace the first km like you’re scared of the last one.', author: 'Race-day wisdom' },
  { text: 'Strong legs, quiet mind, fast transitions.', author: 'RoxForge' },
  { text: 'You don’t rise to the occasion. You fall to your level of training.', author: 'Archilochus (paraphrased)' },
]

export const communityStats = {
  athletes: 48210,
  simulations: 126540,
  kmThisWeek: 392780,
}
