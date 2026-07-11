/**
 * Pure math over BNM daily middle rates. No fetching, no Vue.
 *
 * Every function takes `rows`: middle-rate rows sorted NEWEST FIRST.
 * A rate is always MYR per 1 unit of foreign currency, so:
 *   rate FALLS  -> fewer MYR buys one unit -> the ringgit STRENGTHENED.
 */

export type RateType = 'buying' | 'selling' | 'middle'

/** One raw row from the BNM daily 1200 dataset: currency keys plus date + rate_type. */
export interface BnmRow {
  date: string
  rate_type: RateType | string
  [key: string]: number | string | null | undefined
}

export interface RatePoint {
  date: string
  rate: number
}

export interface LeaderboardEntry {
  currency: string
  changePct: number
  latest: RatePoint
  old: RatePoint
}

/**
 * Feature B. Rank currencies by how much the ringgit strengthened over the
 * last `days` calendar days, anchored to the dataset's as-of date (BNM skips
 * weekends and holidays, so "today" is never assumed).
 *
 * Sign convention (the easiest bug in the app, per the brief):
 *   changePct = (oldRate - latestRate) / oldRate * 100
 *   A FALLING rate (fewer MYR per unit) means the ringgit STRENGTHENED,
 *   which this formula yields as POSITIVE. Positive = green = good for the traveller.
 *
 * A currency with missing data in the window drops out silently.
 */
export function leaderboard(rows: BnmRow[], currencies: string[], days: 30 | 90): LeaderboardEntry[] {
  const asOf = rows[0]?.date
  if (typeof asOf !== 'string') return []
  const entries: LeaderboardEntry[] = []
  for (const currency of currencies) {
    const latest = latestPoint(rows, currency)
    if (!latest) continue
    const target = addDaysIso(asOf, -days)
    const old = pointAtOrBefore(rows, currency, target) ?? oldestPoint(rows, currency)
    if (!old || old.date === latest.date) continue
    entries.push({
      currency,
      changePct: ((old.rate - latest.rate) / old.rate) * 100,
      latest,
      old,
    })
  }
  return entries.sort((a, b) => b.changePct - a.changePct)
}

/**
 * Feature C. Definition (stated per the brief): the share of rows in the last
 * `windowDays` calendar days, EXCLUDING the latest row, whose middle rate was
 * strictly HIGHER than the latest rate. A higher historical rate means one unit
 * of foreign currency cost more MYR then, so today is cheaper for the traveller.
 * "Better than 78% of the last 90 days" = 78% of those days had a higher rate.
 *
 * Historical context only, never predictive. Returns null when there is no
 * usable history.
 */
export function timingPercentile(rows: BnmRow[], currency: string, windowDays = 90): number | null {
  const latest = latestPoint(rows, currency)
  if (!latest) return null
  const windowStart = addDaysIso(latest.date, -windowDays)
  const hist = pointsBetween(rows, currency, windowStart, latest.date).filter(p => p.date !== latest.date)
  if (hist.length === 0) return null
  const higher = hist.filter(p => p.rate > latest.rate).length
  return Math.round((higher / hist.length) * 100)
}

/** Latest available rate for a currency (walks past nulls; BNM skips weekends). */
export function latestPoint(rows: BnmRow[], currency: string): RatePoint | null {
  for (const row of rows) {
    const rate = rateOf(row, currency)
    if (rate !== null) return { date: row.date, rate }
  }
  return null
}

export interface Delta {
  /** Positive = the rate fell vs the previous available day = ringgit strengthened. */
  pct: number
  latest: RatePoint
  prev: RatePoint
}

/** Change vs the previous available day (not previous calendar day). */
export function delta(rows: BnmRow[], currency: string): Delta | null {
  const latest = latestPoint(rows, currency)
  if (!latest) return null
  for (const row of rows) {
    if (row.date >= latest.date) continue
    const rate = rateOf(row, currency)
    if (rate === null) continue
    const prev = { date: row.date, rate }
    return { pct: ((prev.rate - latest.rate) / prev.rate) * 100, latest, prev }
  }
  return null
}

/** Points in the last `days` calendar days, oldest first (for the chart). */
export function historyPoints(rows: BnmRow[], currency: string, days: number): RatePoint[] {
  const latest = latestPoint(rows, currency)
  if (!latest) return []
  return pointsBetween(rows, currency, addDaysIso(latest.date, -days), latest.date)
}

/**
 * Strongest ringgit day in the window: the MINIMUM rate (fewest MYR per unit
 * buys the most foreign currency per RM).
 */
export function bestDay(rows: BnmRow[], currency: string, days: number): RatePoint | null {
  const points = historyPoints(rows, currency, days)
  if (points.length === 0) return null
  return points.reduce((best, p) => (p.rate < best.rate ? p : best))
}

/** Oldest available rate in the fetched window (for the time-travel story line). */
export function oldestPoint(rows: BnmRow[], currency: string): RatePoint | null {
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i]!
    const rate = rateOf(row, currency)
    if (rate !== null) return { date: row.date, rate }
  }
  return null
}

/** Budgets live as integer sen; conversion happens here only. foreign = MYR / rate. */
export function convertSen(myrSen: number, rate: number): number | null {
  if (!Number.isFinite(myrSen) || !Number.isFinite(rate) || rate <= 0) return null
  return myrSen / 100 / rate
}

/** Keep only middle-rate rows with a valid date, sorted newest first. */
export function toMiddleRows(raw: unknown): BnmRow[] {
  if (!Array.isArray(raw)) return []
  return (raw as BnmRow[])
    .filter(row => row && row.rate_type === 'middle' && typeof row.date === 'string')
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

/** Guarded numeric read: finite positive numbers only, everything else is null. */
function rateOf(row: BnmRow, currency: string): number | null {
  const value = row[currency]
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null
}

/** Most recent point at or before `targetDate` (rows are newest first). */
function pointAtOrBefore(rows: BnmRow[], currency: string, targetDate: string): RatePoint | null {
  for (const row of rows) {
    if (row.date > targetDate) continue
    const rate = rateOf(row, currency)
    if (rate !== null) return { date: row.date, rate }
  }
  return null
}

/** Points with fromDate <= date <= toDate, oldest first. */
function pointsBetween(rows: BnmRow[], currency: string, fromDate: string, toDate: string): RatePoint[] {
  const points: RatePoint[] = []
  for (const row of rows) {
    if (row.date > toDate || row.date < fromDate) continue
    const rate = rateOf(row, currency)
    if (rate !== null) points.push({ date: row.date, rate })
  }
  return points.reverse()
}

/** ISO date arithmetic in UTC; YYYY-MM-DD strings compare lexicographically. */
function addDaysIso(iso: string, deltaDays: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y!, m! - 1, d! + deltaDays))
  return date.toISOString().slice(0, 10)
}
