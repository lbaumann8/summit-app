export type TrackPerformance = {
  attempts: number;
  correct: number;
};

export type PerformanceMap = {
  macro: TrackPerformance;
  earnings: TrackPerformance;
  momentum: TrackPerformance;
  risk: TrackPerformance;
};

export type ActivityEntry = {
  id: string;
  type: 'daily_call' | 'practice';
  title: string;
  subtitle: string;
  createdAt: number;
};

const PERFORMANCE_STORAGE_KEY = 'trackPerformance';
const ACTIVITY_STORAGE_KEY = 'recentActivity';

function getDefaultPerformance(): PerformanceMap {
  return {
    macro: { attempts: 0, correct: 0 },
    earnings: { attempts: 0, correct: 0 },
    momentum: { attempts: 0, correct: 0 },
    risk: { attempts: 0, correct: 0 },
  };
}

export function getTrackPerformance(): PerformanceMap {
  try {
    const raw = localStorage.getItem(PERFORMANCE_STORAGE_KEY);
    if (!raw) return getDefaultPerformance();

    const parsed = JSON.parse(raw) as Partial<PerformanceMap>;

    return {
      macro: parsed.macro ?? { attempts: 0, correct: 0 },
      earnings: parsed.earnings ?? { attempts: 0, correct: 0 },
      momentum: parsed.momentum ?? { attempts: 0, correct: 0 },
      risk: parsed.risk ?? { attempts: 0, correct: 0 },
    };
  } catch {
    return getDefaultPerformance();
  }
}

export function saveTrackPerformance(data: PerformanceMap) {
  localStorage.setItem(PERFORMANCE_STORAGE_KEY, JSON.stringify(data));
}

export function recordTrackPerformance(
  trackId: keyof PerformanceMap,
  attemptsToAdd: number,
  correctToAdd: number
) {
  const current = getTrackPerformance();

  current[trackId] = {
    attempts: current[trackId].attempts + attemptsToAdd,
    correct: current[trackId].correct + correctToAdd,
  };

  saveTrackPerformance(current);
}

export function getTrackAccuracy(trackId: keyof PerformanceMap): number {
  const data = getTrackPerformance()[trackId];
  if (data.attempts === 0) return 0;
  return data.correct / data.attempts;
}

export function getRecommendedTrackFromPerformance(): keyof PerformanceMap {
  const data = getTrackPerformance();
  const entries = Object.entries(data) as [keyof PerformanceMap, TrackPerformance][];

  const attempted = entries.filter(([, value]) => value.attempts > 0);

  if (attempted.length === 0) return 'macro';

  attempted.sort((a, b) => {
    const aAcc = a[1].correct / a[1].attempts;
    const bAcc = b[1].correct / b[1].attempts;
    return aAcc - bAcc;
  });

  return attempted[0][0];
}

export function getRecentActivity(): ActivityEntry[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as ActivityEntry[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.id === 'string' &&
          typeof item.type === 'string' &&
          typeof item.title === 'string' &&
          typeof item.subtitle === 'string' &&
          typeof item.createdAt === 'number'
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export function addRecentActivity(entry: Omit<ActivityEntry, 'id'>) {
  const current = getRecentActivity();

  const next: ActivityEntry[] = [
    {
      id: `${entry.type}-${entry.createdAt}-${Math.random().toString(36).slice(2, 8)}`,
      ...entry,
    },
    ...current,
  ].slice(0, 8);

  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(next));
}