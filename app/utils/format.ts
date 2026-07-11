/** Display formatting only. All numbers stay raw until they reach a template. */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']

/** Handoff number rules: >=1000 round + separators; scale decimals down from there. */
export function fmtAmount(value: number): string {
  if (value >= 1000) return Math.round(value).toLocaleString('en-MY')
  if (value >= 100) return value.toLocaleString('en-MY', { maximumFractionDigits: 0 })
  if (value >= 10) return value.toFixed(1)
  if (value >= 1) return value.toFixed(2)
  return value.toFixed(3)
}

/** Rates: 4dp when >=1, else 6dp. */
export function fmtRate(rate: number): string {
  return rate >= 1 ? rate.toFixed(4) : rate.toFixed(6)
}

function parts(iso: string): { y: number, m: number, d: number } {
  const [y, m, d] = iso.split('-').map(Number)
  return { y: y!, m: m!, d: d! }
}

/** "10 Jul" for chart axis labels. */
export function fmtDayMon(iso: string): string {
  const { m, d } = parts(iso)
  return `${d} ${MONTHS[m - 1]}`
}

/** "Fri 10 Jul 2026" for the rate date chip. */
export function fmtDateChip(iso: string): string {
  const { y, m, d } = parts(iso)
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
  return `${weekday} ${d} ${MONTHS[m - 1]} ${y}`
}

/** "10 JUL 2026" for the boarding pass date field. */
export function fmtPassDate(iso: string): string {
  const { y, m, d } = parts(iso)
  return `${d} ${MONTHS[m - 1]!.toUpperCase()} ${y}`
}

/**
 * Honest label for the time-travel line: how far back the oldest fetched row
 * actually is ("Four months ago"), never a claim the data cannot back.
 */
export function agoLabel(oldIso: string, newIso: string): string {
  const o = parts(oldIso)
  const n = parts(newIso)
  const days = (Date.UTC(n.y, n.m - 1, n.d) - Date.UTC(o.y, o.m - 1, o.d)) / 86_400_000
  const months = Math.round(days / 30.44)
  if (months < 2) return `${Math.round(days / 7)} weeks ago`
  return `${MONTH_WORDS[months] ?? months} months ago`
}

/** "09:42:18 MYT" for the error card's last attempt line. */
export function fmtTimeMYT(isoTimestamp: string): string {
  const time = new Date(isoTimestamp).toLocaleTimeString('en-GB', {
    hour12: false,
    timeZone: 'Asia/Kuala_Lumpur',
  })
  return `${time} MYT`
}
