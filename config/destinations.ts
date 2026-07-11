/**
 * The only file that knows destinations: countries, flags, city labels,
 * currency symbols and airport codes (for the boarding pass route KUL -> X).
 * `code` is the lowercase currency key used by the BNM dataset.
 */

export interface Destination {
  /** Lowercase currency key in the API response, e.g. 'jpy'. */
  code: string
  /** Display currency code, e.g. 'JPY'. */
  cur: string
  city: string
  flag: string
  /** IATA airport code for the boarding pass. */
  airport: string
  /** Uppercase city line under the airport code on the pass. */
  airportCity: string
  /** Currency symbol used for amounts. */
  sym: string
}

export const DESTINATIONS: Destination[] = [
  { code: 'jpy', city: 'Tokyo', flag: '🇯🇵', cur: 'JPY', airport: 'NRT', airportCity: 'TOKYO NARITA', sym: '¥' },
  { code: 'krw', city: 'Seoul', flag: '🇰🇷', cur: 'KRW', airport: 'ICN', airportCity: 'SEOUL INCHEON', sym: '₩' },
  { code: 'thb', city: 'Bangkok', flag: '🇹🇭', cur: 'THB', airport: 'BKK', airportCity: 'BANGKOK', sym: '฿' },
  { code: 'idr', city: 'Jakarta', flag: '🇮🇩', cur: 'IDR', airport: 'CGK', airportCity: 'JAKARTA', sym: 'Rp' },
  { code: 'sgd', city: 'Singapore', flag: '🇸🇬', cur: 'SGD', airport: 'SIN', airportCity: 'SINGAPORE', sym: 'S$' },
  { code: 'twd', city: 'Taipei', flag: '🇹🇼', cur: 'TWD', airport: 'TPE', airportCity: 'TAIPEI', sym: 'NT$' },
  { code: 'cny', city: 'Beijing', flag: '🇨🇳', cur: 'CNY', airport: 'PEK', airportCity: 'BEIJING', sym: '¥' },
  { code: 'vnd', city: 'Ho Chi Minh', flag: '🇻🇳', cur: 'VND', airport: 'SGN', airportCity: 'HO CHI MINH', sym: '₫' },
  { code: 'hkd', city: 'Hong Kong', flag: '🇭🇰', cur: 'HKD', airport: 'HKG', airportCity: 'HONG KONG', sym: 'HK$' },
  { code: 'php', city: 'Manila', flag: '🇵🇭', cur: 'PHP', airport: 'MNL', airportCity: 'MANILA', sym: '₱' },
  { code: 'aed', city: 'Dubai', flag: '🇦🇪', cur: 'AED', airport: 'DXB', airportCity: 'DUBAI', sym: 'AED ' },
  { code: 'sar', city: 'Jeddah', flag: '🇸🇦', cur: 'SAR', airport: 'JED', airportCity: 'JEDDAH', sym: 'SAR ' },
  { code: 'gbp', city: 'London', flag: '🇬🇧', cur: 'GBP', airport: 'LHR', airportCity: 'LONDON HEATHROW', sym: '£' },
  { code: 'eur', city: 'Paris', flag: '🇪🇺', cur: 'EUR', airport: 'CDG', airportCity: 'PARIS CDG', sym: '€' },
  { code: 'usd', city: 'New York', flag: '🇺🇸', cur: 'USD', airport: 'JFK', airportCity: 'NEW YORK JFK', sym: '$' },
  { code: 'aud', city: 'Sydney', flag: '🇦🇺', cur: 'AUD', airport: 'SYD', airportCity: 'SYDNEY', sym: 'A$' },
]

export const DEFAULT_DESTINATION = 'jpy'

export function destinationByCode(code: string): Destination | undefined {
  return DESTINATIONS.find(d => d.code === code)
}
