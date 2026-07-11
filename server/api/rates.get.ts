/**
 * Cached proxy for the BNM daily exchange rates dataset.
 * This is the ONLY place in the app that knows the upstream endpoint;
 * everything else goes through useRates(). Cached for an hour.
 */
const UPSTREAM =
  'https://api.data.gov.my/data-catalogue/?id=exchangerates_daily_1200&limit=270&sort=-date'

export default cachedEventHandler(
  async () => await $fetch<unknown[]>(UPSTREAM),
  { maxAge: 60 * 60, swr: true, name: 'bnm-rates', getKey: () => 'daily-1200' },
)
