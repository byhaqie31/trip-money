# Trip Money ✈️

See what your ringgit is really worth at your destination, using official Bank Negara Malaysia rates.

**Live app:** https://tripmoney.axelnova.my/

Built for the [PasarAPI Bounty](https://krackeddevs.com/code/bounty/pasarapi-bounty) by Kracked Devs.

## What it does

Trip Money turns official BNM exchange rates into travel decisions: see where your ringgit is winning, whether today is a good day to change money, and what your budget is worth across 16 destinations.

- Pick a destination and see today's official BNM middle rate with the daily change, plus an honest timing signal: "today's rate is better than X% of the last 90 days"
- Enter your trip budget in RM and watch it convert live, with context: what that same budget was worth months ago, and what it buys everywhere else
- "Where the ringgit is winning": every destination ranked by how much further your ringgit goes than 30 or 90 days ago
- A 90 day trend chart marking the strongest ringgit day, plus a distribution of where today sits
- Pick a traveller class (Backpacker, Traveller, Luxury) and print a boarding pass style summary card, ready to save and share

## API used

**BNM Daily Exchange Rates (1200 session)** via the data.gov.my open API, discovered on [PasarAPI.xyz](https://pasarapi.xyz/).

```
GET https://api.data.gov.my/data-catalogue/?id=exchangerates_daily_1200&limit=270&sort=-date
```

No auth required. The app uses middle rates only, fetched through a cached server route so the upstream endpoint is called at most once per hour. Rates shown are official reference rates; money changers will quote slightly different numbers, and the app says so.

## Built with

- Claude Code (Anthropic) as the AI coding tool, per the bounty rules
- Nuxt 4, Vue 3, TypeScript strict
- Tailwind CSS v4 with OKLCH design tokens
- Deployed on Cloudflare Pages (Nitro cloudflare-pages preset)

## Run locally

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000. No environment variables needed; the exchange rate API is public.

## Project notes

- All rate data flows through a single composable (`useRates()`); components never touch the endpoint directly
- BNM publishes no rates on weekends and public holidays, so the app always labels the actual date of the latest rate
- Budget amounts are handled as integer sen internally and formatted only at display

## Credits

Designed and built by [Qie](https://axelnovaventures.com) · Axel Nova Ventures

Rates: Bank Negara Malaysia via [data.gov.my](https://data.gov.my/data-catalogue/exchangerates_daily_1200), found on [PasarAPI.xyz](https://pasarapi.xyz/)
