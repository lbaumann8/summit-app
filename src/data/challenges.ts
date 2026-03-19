import { Challenge, Track } from '../types';

export const tracks: Track[] = [
  {
    id: 'valuation',
    name: 'Valuation',
    description: 'DCF, comps, precedent transactions',
    challengeCount: 24,
    completedCount: 8,
    color: '#C8A84B',
  },
  {
    id: 'ma',
    name: 'M&A',
    description: 'Deal structures, synergies, accretion/dilution',
    challengeCount: 18,
    completedCount: 3,
    color: '#6C8EBF',
  },
  {
    id: 'markets',
    name: 'Markets',
    description: 'Equities, fixed income, derivatives',
    challengeCount: 30,
    completedCount: 12,
    color: '#7BB38A',
  },
  {
    id: 'risk',
    name: 'Risk',
    description: 'Credit risk, VaR, stress testing',
    challengeCount: 16,
    completedCount: 0,
    color: '#B87B6C',
  },
];

export const challenges: Challenge[] = [
  {
    id: 'ch-001',
    title: 'LBO Exit Multiple Compression',
    track: 'Valuation',
    difficulty: 'Associate',
    timeEstimate: '3 min',
    scenario:
      'A private equity firm acquired a mid-market industrial manufacturer at an 8.0x EV/EBITDA entry multiple. At acquisition, the company generated $20M in EBITDA. Over a 5-year hold period, the team grew EBITDA to $35M through operational improvements and geographic expansion.\n\nHowever, rising rates and sector rotation compressed transaction multiples. Comparable deals now clear at 6.0x EV/EBITDA. Assuming the exit occurs at the current market multiple, what is the implied change in enterprise value from entry to exit?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'Enterprise value increased by approximately $50M',
      },
      {
        id: 'b',
        label: 'B',
        text: 'Enterprise value decreased — multiple compression fully erased EBITDA growth',
      },
      {
        id: 'c',
        label: 'C',
        text: 'Enterprise value is unchanged — EBITDA growth exactly offset compression',
      },
      {
        id: 'd',
        label: 'D',
        text: 'Enterprise value increased by approximately $120M from EBITDA growth alone',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Entry EV: 8.0x × $20M = $160M\nExit EV: 6.0x × $35M = $210M\nNet change: +$50M\n\nDespite a 25% compression in multiples (8x → 6x), the 75% EBITDA growth ($20M → $35M) more than offset it. This is a core PE insight: EBITDA growth is the most durable value driver in an LBO. Operational improvement can overcome significant market multiple deterioration — but not always. The math always tells the story.',
    edgePoints: 75,
  },
  {
    id: 'ch-002',
    title: 'Dilution in a Stock-for-Stock Merger',
    track: 'M&A',
    difficulty: 'Analyst',
    timeEstimate: '2 min',
    scenario:
      'Acquirer Corp has 100M diluted shares outstanding and earns $200M in net income ($2.00 EPS). It is acquiring Target Inc. in an all-stock deal — Target shareholders receive 20M newly issued Acquirer shares.\n\nTarget contributes $30M in net income to the combined entity. No synergies are assumed. What is the pro-forma EPS of the combined company, and is the deal accretive or dilutive?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: '$1.92 EPS — dilutive by $0.08 per share',
      },
      {
        id: 'b',
        label: 'B',
        text: '$2.08 EPS — accretive by $0.08 per share',
      },
      {
        id: 'c',
        label: 'C',
        text: '$1.83 EPS — dilutive by $0.17 per share',
      },
      {
        id: 'd',
        label: 'D',
        text: '$2.00 EPS — neutral, no change',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Combined net income: $200M + $30M = $230M\nPro-forma shares: 100M + 20M = 120M\nPro-forma EPS: $230M ÷ 120M ≈ $1.92\n\nThe deal is dilutive by ~$0.08. While Target adds earnings (+15%), the share issuance grows the count by 20%. When share count grows faster than earnings, EPS falls.\n\nCore rule: a stock deal is accretive only when the target\'s implied P/E is lower than the acquirer\'s P/E. Always run the EPS math before the announcement.',
    edgePoints: 50,
  },
  {
    id: 'ch-003',
    title: 'Duration and Interest Rate Risk',
    track: 'Markets',
    difficulty: 'Analyst',
    timeEstimate: '2 min',
    scenario:
      'A portfolio manager holds two bonds with identical credit quality and 5% annual coupons. Bond A matures in 2 years; Bond B matures in 10 years. Both are currently priced at par ($1,000).\n\nThe central bank unexpectedly raises the policy rate by 100 basis points. Which bond experiences the larger price decline, and approximately by how much?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'Bond A falls more — shorter bonds are more price-sensitive',
      },
      {
        id: 'b',
        label: 'B',
        text: 'Bond B falls more — approximately $62–$68 per $1,000 face value',
      },
      {
        id: 'c',
        label: 'C',
        text: 'Both bonds fall by the same amount since they have identical coupons',
      },
      {
        id: 'd',
        label: 'D',
        text: 'Bond B falls more — by exactly $100 per $1,000 face value',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Bond B (10-year) has a modified duration of ~7.7 years vs Bond A\'s ~1.9 years. Price change ≈ −Duration × ΔRate, so Bond B falls ~7.7% ≈ $77, Bond A ~1.9% ≈ $19.\n\nLonger-duration bonds are exponentially more sensitive to rate moves because more cash flows are discounted at higher rates for longer periods. This is why the long end of the curve moves violently when rate expectations shift.\n\nThe $62–$68 range accounts for convexity — the actual relationship is curved, not linear.',
    edgePoints: 50,
  },
];

export const todaysChallenge = challenges[0];
