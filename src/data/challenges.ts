import { Challenge, Track } from '../types';

export const tracks: Track[] = [
  {
    id: 'macro',
    name: 'Macro Reactions',
    description: 'CPI, Fed, jobs, inflation, and how markets reprice them',
    challengeCount: 24,
    completedCount: 8,
    color: '#7BB38A',
  },
  {
    id: 'earnings',
    name: 'Earnings Reads',
    description: 'Beats, misses, guidance, and when good news still sells off',
    challengeCount: 18,
    completedCount: 3,
    color: '#C8A84B',
  },
  {
    id: 'momentum',
    name: 'Momentum',
    description: 'Rallies, reversals, gap-ups, and crowd positioning',
    challengeCount: 30,
    completedCount: 12,
    color: '#6C8EBF',
  },
  {
    id: 'risk',
    name: 'Risk Events',
    description: 'Oil shocks, rate spikes, volatility, and defensive rotations',
    challengeCount: 16,
    completedCount: 0,
    color: '#B87B6C',
  },
];

export const challenges: Challenge[] = [
  {
    id: 'ch-001',
    title: 'Cool CPI, Crowded Longs',
    track: 'Macro Reactions',
    difficulty: 'Associate',
    timeEstimate: '2 min',
    scenario:
      'CPI comes in cooler than expected, which is normally bullish for equities. But the S&P 500 has already rallied hard for two weeks and positioning is heavily skewed long into the print.\n\nWhat is the best read on the most likely next move?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'The market likely extends higher because cool CPI is always bullish',
      },
      {
        id: 'b',
        label: 'B',
        text: 'The market could still fade because good news may already be priced in',
      },
      {
        id: 'c',
        label: 'C',
        text: 'The CPI number should not matter once the opening bell rings',
      },
      {
        id: 'd',
        label: 'D',
        text: 'The market must go sideways because bullish positioning cancels out inflation data',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'This is an expectations game. Cooler CPI is bullish on paper, but when positioning is already leaning hard in the same direction, even good news can fail to create fresh upside. If the market cannot rally on favorable data, that can lead to a fade.',
    edgePoints: 50,
  },
  {
    id: 'ch-002',
    title: 'Hot Jobs, Bad for Stocks?',
    track: 'Macro Reactions',
    difficulty: 'Analyst',
    timeEstimate: '2 min',
    scenario:
      'A jobs report comes in much stronger than expected. Wage growth is firm, unemployment stays low, and traders had been hoping for softer data to support future rate cuts.\n\nWhy might stocks trade lower on what looks like good economic news?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'Because strong labor data can keep rates higher for longer',
      },
      {
        id: 'b',
        label: 'B',
        text: 'Because good economic news is always bad for company earnings',
      },
      {
        id: 'c',
        label: 'C',
        text: 'Because employment data only matters for bonds, not stocks',
      },
      {
        id: 'd',
        label: 'D',
        text: 'Because traders ignore jobs reports if inflation is stable',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Markets often care more about the policy implication than the headline itself. If traders were looking for softer growth to support easier policy, a hot jobs report can push yields higher and weigh on equities.',
    edgePoints: 40,
  },
  {
    id: 'ch-003',
    title: 'Beat, but Lower Guide',
    track: 'Earnings Reads',
    difficulty: 'Analyst',
    timeEstimate: '2 min',
    scenario:
      'A company beats revenue and EPS for the quarter, but management lowers full-year guidance and sounds more cautious on the call.\n\nWhat is the best explanation for why the stock could still sell off?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'Because markets discount future expectations more than past results',
      },
      {
        id: 'b',
        label: 'B',
        text: 'Because earnings beats automatically trigger profit-taking',
      },
      {
        id: 'c',
        label: 'C',
        text: 'Because investors only care about revenue and not guidance',
      },
      {
        id: 'd',
        label: 'D',
        text: 'Because after-hours reactions are always reversed the next day',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'A stock is valued on future expectations, not just the last quarter. A solid quarter with weaker forward guidance can still lead to a selloff because the market cares more about what happens next.',
    edgePoints: 40,
  },
  {
    id: 'ch-004',
    title: 'Good Quarter, No Pop',
    track: 'Earnings Reads',
    difficulty: 'Associate',
    timeEstimate: '2 min',
    scenario:
      'A mega-cap tech company beats earnings, margins are solid, and guidance is fine. But the stock barely moves after hours.\n\nWhat is the sharpest interpretation of that muted reaction?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'The report was likely already close to what the market had priced in',
      },
      {
        id: 'b',
        label: 'B',
        text: 'After-hours price action is meaningless for real investors',
      },
      {
        id: 'c',
        label: 'C',
        text: 'The company must have hidden terrible numbers in the release',
      },
      {
        id: 'd',
        label: 'D',
        text: 'A beat guarantees upside, so the market is clearly wrong',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Price reaction is often more revealing than the headline. If a stock cannot move up on objectively solid news, it can mean expectations were already elevated and the upside was priced in.',
    edgePoints: 50,
  },
  {
    id: 'ch-005',
    title: 'Bad Numbers, Stock Up',
    track: 'Earnings Reads',
    difficulty: 'Associate',
    timeEstimate: '2 min',
    scenario:
      'A company reports weak earnings, but the stock rises the next morning.\n\nWhich explanation is usually the most market-savvy read?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'The market expected something even worse, so the report was a relief',
      },
      {
        id: 'b',
        label: 'B',
        text: 'Stocks usually go up after bad quarters because investors buy the dip',
      },
      {
        id: 'c',
        label: 'C',
        text: 'Weak earnings do not matter if the company has a famous CEO',
      },
      {
        id: 'd',
        label: 'D',
        text: 'The stock market often ignores company fundamentals entirely',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Markets move against expectations, not headlines alone. If sentiment was very negative and the report came in less bad than feared, the reaction can still be bullish.',
    edgePoints: 50,
  },
  {
    id: 'ch-006',
    title: 'Gap Up, Then What?',
    track: 'Momentum',
    difficulty: 'Analyst',
    timeEstimate: '2 min',
    scenario:
      'The S&P 500 gaps up 2% at the open on strong overnight news. Early traders now have to decide whether to chase the move or expect it to fade.\n\nWhat matters most in judging whether the gap is real?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'Whether buyers continue to support the move after the open',
      },
      {
        id: 'b',
        label: 'B',
        text: 'The opening price, because it usually determines the close',
      },
      {
        id: 'c',
        label: 'C',
        text: 'Whether the previous day closed green or red',
      },
      {
        id: 'd',
        label: 'D',
        text: 'Whether dividend yields are rising during the session',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'A strong open is not enough. Traders watch follow-through. If buyers cannot keep supporting price after the initial gap, profit-taking can quickly turn a bullish-looking open into a fade.',
    edgePoints: 40,
  },
  {
    id: 'ch-007',
    title: 'Extended Rally Risk',
    track: 'Momentum',
    difficulty: 'Analyst',
    timeEstimate: '2 min',
    scenario:
      'A stock has rallied for six straight sessions and sentiment is turning euphoric.\n\nWhy does that often make the next long entry less attractive?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'Because the reward-to-risk usually gets worse after an extended move',
      },
      {
        id: 'b',
        label: 'B',
        text: 'Because stocks are required to reverse after six green days',
      },
      {
        id: 'c',
        label: 'C',
        text: 'Because momentum stops working once sentiment turns positive',
      },
      {
        id: 'd',
        label: 'D',
        text: 'Because volume no longer matters after a multi-day rally',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'The problem is not that the stock cannot go higher. It is that chasing after a big move often means weaker upside relative to downside, especially if positioning is getting crowded and profit-taking risk is rising.',
    edgePoints: 40,
  },
  {
    id: 'ch-008',
    title: 'Panic Selloff or Opportunity?',
    track: 'Momentum',
    difficulty: 'Associate',
    timeEstimate: '2 min',
    scenario:
      'The market drops hard on heavy volume and sentiment turns fearful fast.\n\nBefore calling a bounce, what is the most important question to ask?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'Was this true capitulation or just the start of a larger unwind?',
      },
      {
        id: 'b',
        label: 'B',
        text: 'Did the market fall enough to satisfy technical traders?',
      },
      {
        id: 'c',
        label: 'C',
        text: 'Did a commentator on financial TV say the bottom was in?',
      },
      {
        id: 'd',
        label: 'D',
        text: 'Was the decline larger than the last decline?',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Fast selloffs can create opportunities, but only if the move reflects panic exhaustion rather than the early stage of deeper liquidation. Volume, reaction quality, and follow-through all matter.',
    edgePoints: 50,
  },
  {
    id: 'ch-009',
    title: 'Rate Spike and Growth Stocks',
    track: 'Risk Events',
    difficulty: 'Analyst',
    timeEstimate: '2 min',
    scenario:
      'The 10-year yield jumps sharply in one session and growth stocks had been leading the market beforehand.\n\nWhy are long-duration growth stocks especially vulnerable here?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'Because more of their value depends on future cash flows being discounted at higher rates',
      },
      {
        id: 'b',
        label: 'B',
        text: 'Because yields only matter for banks and insurance stocks',
      },
      {
        id: 'c',
        label: 'C',
        text: 'Because growth companies are legally required to underperform when rates rise',
      },
      {
        id: 'd',
        label: 'D',
        text: 'Because growth stocks do not generate real earnings',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Long-duration equities are sensitive to discount-rate changes because a larger share of their valuation comes from future earnings. When yields jump fast, that pressure tends to show up quickly in growth-heavy names.',
    edgePoints: 40,
  },
  {
    id: 'ch-010',
    title: 'Oil Shock and Airlines',
    track: 'Risk Events',
    difficulty: 'Easy',
    timeEstimate: '1 min',
    scenario:
      'Oil spikes 10% overnight after geopolitical tension. Which sector is most directly pressured first?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'Airlines, because fuel costs can quickly pressure margins',
      },
      {
        id: 'b',
        label: 'B',
        text: 'Utilities, because lower fuel prices help their margins immediately',
      },
      {
        id: 'c',
        label: 'C',
        text: 'Software, because cloud demand depends directly on crude prices',
      },
      {
        id: 'd',
        label: 'D',
        text: 'Treasuries, because oil spikes mechanically force bond prices higher',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Airlines are often hit quickly when oil spikes because fuel is a major operating cost and margin sensitivity is high.',
    edgePoints: 30,
  },
  {
    id: 'ch-011',
    title: 'Rising Volatility, No Clear Trend',
    track: 'Risk Events',
    difficulty: 'Associate',
    timeEstimate: '2 min',
    scenario:
      'Volatility is rising, but the market is chopping sideways instead of breaking cleanly higher or lower.\n\nWhat is the best read on that type of environment?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'It often reflects uncertainty, weak conviction, and fragile positioning',
      },
      {
        id: 'b',
        label: 'B',
        text: 'It means the next move must be strongly bullish',
      },
      {
        id: 'c',
        label: 'C',
        text: 'It means volatility is no longer useful information',
      },
      {
        id: 'd',
        label: 'D',
        text: 'It proves macro data has stopped mattering',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Higher volatility without a clean trend often signals unstable positioning and uncertainty rather than clarity. That kind of tape can be fragile and prone to sharp reactions once a catalyst finally lands.',
    edgePoints: 40,
  },
  {
    id: 'ch-012',
    title: 'Soft Data, Relief Rally',
    track: 'Macro Reactions',
    difficulty: 'Associate',
    timeEstimate: '2 min',
    scenario:
      'A jobs report misses expectations, but not badly enough to trigger full recession panic. Traders had been wanting softer data to improve the rate outlook.\n\nWhat is the smartest read on why stocks could rally?',
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'Because softer data can ease rate pressure without immediately implying collapse',
      },
      {
        id: 'b',
        label: 'B',
        text: 'Because weak data is always bullish for every part of the market',
      },
      {
        id: 'c',
        label: 'C',
        text: 'Because the Fed is required to cut rates after any economic miss',
      },
      {
        id: 'd',
        label: 'D',
        text: 'Because recession risk never matters when inflation is falling',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'This is the soft-landing sweet spot traders often like. Growth cools enough to help the rate picture, but not so much that the market immediately has to price a deep economic downturn.',
    edgePoints: 50,
  },
];

export const todaysChallenge = challenges[0];