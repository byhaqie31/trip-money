import { DESTINATIONS } from '~~/config/destinations'
import {
  type BnmRow,
  type Delta,
  type LeaderboardEntry,
  type RatePoint,
  bestDay as bestDayOf,
  convertSen,
  delta as deltaOf,
  historyPoints,
  latestPoint,
  leaderboard as leaderboardOf,
  oldestPoint,
  timingPercentile as timingPercentileOf,
  toMiddleRows,
} from '~/utils/rateMath'

export type RatesStatus = 'loading' | 'ready' | 'error'

const CURRENCIES = DESTINATIONS.map(d => d.code)

/**
 * The single data seam. Components never fetch and never know the endpoint;
 * all rate reads go through here. Rows are middle rates only, newest first.
 */
export function useRates() {
  const rows = useState<BnmRow[]>('tm:rows', () => [])
  const status = useState<RatesStatus>('tm:status', () => 'loading')
  /** ISO timestamp of the last fetch attempt, for the error card. */
  const lastAttempt = useState<string | null>('tm:last-attempt', () => null)

  async function load(): Promise<void> {
    status.value = 'loading'
    lastAttempt.value = new Date().toISOString()
    try {
      const raw = await $fetch<unknown[]>('/api/rates')
      const middle = toMiddleRows(raw)
      if (middle.length === 0) throw new Error('no middle-rate rows in response')
      rows.value = middle
      status.value = 'ready'
    } catch {
      status.value = 'error'
    }
  }

  /** Date of the newest available row; BNM skips weekends, never assume today. */
  const asOfDate = computed<string | null>(() => rows.value[0]?.date ?? null)

  return {
    status,
    asOfDate,
    lastAttempt,
    load,
    latest: (currency: string): RatePoint | null => latestPoint(rows.value, currency),
    delta: (currency: string): Delta | null => deltaOf(rows.value, currency),
    history: (currency: string, days: number): RatePoint[] => historyPoints(rows.value, currency, days),
    convert: (myrSen: number, currency: string): number | null => {
      const point = latestPoint(rows.value, currency)
      return point ? convertSen(myrSen, point.rate) : null
    },
    timingPercentile: (currency: string): number | null => timingPercentileOf(rows.value, currency, 90),
    leaderboard: (days: 30 | 90): LeaderboardEntry[] => leaderboardOf(rows.value, CURRENCIES, days),
    bestDay: (currency: string, days: number): RatePoint | null => bestDayOf(rows.value, currency, days),
    oldest: (currency: string): RatePoint | null => oldestPoint(rows.value, currency),
  }
}
