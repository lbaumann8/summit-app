const dailyChallenges = [
  {
    id: 'cpi-hot-stocks-1',
    title: 'CPI came in hotter than expected',
    description:
      'Inflation surprised to the upside after a strong two-week rally. Does the S&P 500 extend higher or get hit?',
    assets: [{ key: 'sp500', label: 'S&P 500' }],
    outcome: {
      sp500: 'down',
    },
    explanations: {
      sp500:
        'Hotter inflation usually pressures stocks because it raises the odds of higher-for-longer rates. After a strong rally, markets are even more vulnerable because positioning is already leaning bullish and bad macro news can unwind that quickly.',
    },
  },
  {
    id: 'fed-cut-risk-on-1',
    title: 'The Fed unexpectedly cut rates',
    description:
      'The market was positioned for no change, and financial conditions had already tightened. What happens to the S&P 500 next?',
    assets: [{ key: 'sp500', label: 'S&P 500' }],
    outcome: {
      sp500: 'up',
    },
    explanations: {
      sp500:
        'A surprise cut usually supports stocks because lower rates can ease financial conditions and support valuations. The key question is whether the cut signals relief or panic. In this setup, the initial reaction is more likely risk-on because markets were not positioned for easing.',
    },
  },
  {
    id: 'jobs-hot-rates-fear-1',
    title: 'Jobs growth came in much stronger than expected',
    description:
      'Hiring stayed hot, unemployment remained low, and the market had been hoping for softer data. What happens to the S&P 500 next?',
    assets: [{ key: 'sp500', label: 'S&P 500' }],
    outcome: {
      sp500: 'down',
    },
    explanations: {
      sp500:
        'Strong jobs data sounds positive on the surface, but markets often care more about the rate implication. If traders were hoping for cooling growth and easier policy ahead, a hot report can push yields up and stocks down.',
    },
  },
  {
    id: 'cool-cpi-but-crowded-tech-1',
    title: 'CPI cooled, but tech had already rallied hard into the print',
    description:
      'Inflation came in lower than expected, but QQQ was already extended and traders were leaning bullish. Does QQQ keep ripping or stall out?',
    assets: [{ key: 'qqq', label: 'QQQ' }],
    outcome: {
      qqq: 'down',
    },
    explanations: {
      qqq:
        'Cool CPI is normally bullish for tech, but that is exactly why this setup is tricky. When a market is already leaning the same way and a lot of good news is priced in, even a favorable print can trigger profit-taking instead of fresh upside.',
    },
  },
  {
    id: 'earnings-beat-muted-fade-1',
    title:
      'A major tech company beat earnings, but the stock barely moved after hours',
    description:
      'The quarter was strong, guidance was fine, but price reaction was underwhelming. What happens to the stock next session?',
    assets: [{ key: 'techStock', label: 'Mega Cap Tech' }],
    outcome: {
      techStock: 'down',
    },
    explanations: {
      techStock:
        'A muted reaction after a strong report often means expectations were already very high. Traders watch price reaction as much as the headline. If the stock cannot rally on good news, that can be a warning sign that buyers are exhausted and the next move may be lower.',
    },
  },
  {
    id: 'oil-spike-airlines-1',
    title: 'Oil spiked sharply overnight after geopolitical tension',
    description:
      'Crude jumped fast before the open. What happens to airline stocks next?',
    assets: [{ key: 'airlines', label: 'Airline Stocks' }],
    outcome: {
      airlines: 'down',
    },
    explanations: {
      airlines:
        'Airlines are often hit quickly when oil spikes because fuel is one of their biggest cost inputs. Traders usually price the margin pressure in fast, especially when the move in crude is sharp and unexpected.',
    },
  },
  {
    id: 'soft-jobs-relief-rally-1',
    title: 'Jobs growth missed expectations, but not badly enough to scream recession',
    description:
      'The labor market cooled just enough to help the rate outlook without triggering full recession panic. What happens to the S&P 500 next?',
    assets: [{ key: 'sp500', label: 'S&P 500' }],
    outcome: {
      sp500: 'up',
    },
    explanations: {
      sp500:
        'This is the classic soft-landing setup traders like: growth is cooling, but not collapsing. That can bring relief because it lowers pressure on rates without immediately forcing the market to price a hard recession.',
    },
  },
  {
    id: 'good-earnings-lower-guide-1',
    title: 'A company beat the quarter, but lowered forward guidance',
    description:
      'The reported numbers looked good, but management walked down the next few quarters. What happens to the stock next?',
    assets: [{ key: 'singleStock', label: 'Single Stock' }],
    outcome: {
      singleStock: 'down',
    },
    explanations: {
      singleStock:
        'Markets usually care more about where earnings are going than where they were. A strong quarter with weaker guidance often sells off because investors discount the future, not just reward the past.',
    },
  },
  {
    id: 'gap-up-open-fade-1',
    title: 'The market gapped up 2% at the open on bullish overnight news',
    description:
      'Price opened strong, but traders now have to decide whether buyers will follow through or take profits. What happens by the close?',
    assets: [{ key: 'sp500', label: 'S&P 500' }],
    outcome: {
      sp500: 'down',
    },
    explanations: {
      sp500:
        'Gap-up opens are dangerous when everyone sees the same bullish headline. If there is not enough follow-through buying after the open, the move can fade as traders lock in gains and late buyers get trapped.',
    },
  },
  {
    id: 'yield-spike-growth-1',
    title: 'The 10-year yield jumped sharply in one session',
    description:
      'Rates moved fast, valuation-sensitive assets were extended, and growth stocks had been leading. What happens to QQQ next?',
    assets: [{ key: 'qqq', label: 'QQQ' }],
    outcome: {
      qqq: 'down',
    },
    explanations: {
      qqq:
        'Fast moves higher in yields often hit growth stocks because more of their valuation depends on future cash flows. When rates rise quickly, that discounting pressure tends to hit long-duration equities like big tech first.',
    },
  },
  {
    id: 'bad-news-less-bad-rally-1',
    title: 'A company posted weak earnings, but the numbers were not as bad as feared',
    description:
      'Sentiment was already very negative going into the report. What happens to the stock next?',
    assets: [{ key: 'singleStock', label: 'Single Stock' }],
    outcome: {
      singleStock: 'up',
    },
    explanations: {
      singleStock:
        'Markets trade against expectations, not headlines alone. If sentiment was extremely bearish and the report was merely bad instead of disastrous, the stock can rally because reality came in better than fear.',
    },
  },
  {
    id: 'hot-ppi-after-cool-cpi-1',
    title: 'CPI cooled, but PPI came in hotter the next day',
    description:
      'The market celebrated the CPI print first, then had to digest producer inflation that could still feed through later. What happens to the S&P 500 next?',
    assets: [{ key: 'sp500', label: 'S&P 500' }],
    outcome: {
      sp500: 'down',
    },
    explanations: {
      sp500:
        'This kind of setup can reverse a relief rally. Traders may realize the first print was not the full story, and hotter producer inflation can pull rate fears back into the market after optimism got ahead of itself.',
    },
  },
] as const;

function getTodayChallengeIndex() {
  const devIndex = localStorage.getItem('devChallengeIndex');

  if (devIndex !== null) {
    const parsed = Number(devIndex);

    if (!isNaN(parsed) && parsed >= 0 && parsed < dailyChallenges.length) {
      return parsed;
    }
  }

  const today = new Date();
  const dayNumber = Math.floor(today.getTime() / 86400000);

  return dayNumber % dailyChallenges.length;
}

export const dailyChallenge = dailyChallenges[getTodayChallengeIndex()];
export { dailyChallenges };