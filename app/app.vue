<script setup lang="ts">
import type { TravelClass } from '~/composables/useTrip'

const rates = useRates()
await callOnce(() => rates.load())
const status = rates.status

const { selectedCode, budgetSen, travelClass, select, setBudgetRm } = useTrip()
const { stopTour } = useTour()

const TRAVEL_CLASS_KEYS: TravelClass[] = ['economy', 'business', 'first']

// URL state (?to=jpy&budget=500000&class=first, budget in sen) so boarding
// passes are linkable with their costume. A shared link means intent, so it
// also stops the auto-tour. The tour never writes state, so the URL mirror
// is unconditional.
onMounted(() => {
  const query = new URLSearchParams(location.search)
  const to = query.get('to')
  const budget = query.get('budget')
  const cls = query.get('class') as TravelClass | null
  if (to || budget || cls) stopTour()
  if (cls && TRAVEL_CLASS_KEYS.includes(cls)) travelClass.value = cls
  if (to) select(to.toLowerCase())
  if (budget && /^\d+$/.test(budget)) setBudgetRm(Math.floor(Number.parseInt(budget, 10) / 100))

  watch([selectedCode, budgetSen, travelClass], () => {
    const url = new URL(location.href)
    url.searchParams.set('to', selectedCode.value)
    url.searchParams.set('budget', String(budgetSen.value))
    if (travelClass.value === 'economy') url.searchParams.delete('class')
    else url.searchParams.set('class', travelClass.value)
    history.replaceState(null, '', url)
  })
})
</script>

<template>
  <div class="min-h-dvh bg-bg">
    <a
      href="#rates"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-ink focus:px-4 focus:py-2 focus:text-[13.5px] focus:font-medium focus:text-bg"
    >
      Skip to rates
    </a>

    <TmHeader />

    <!-- Hero: tall green card with the route map -->
    <section class="mx-auto max-w-[1440px] px-5 pt-4 desk:px-16 desk:pt-6">
      <TmHero />
    </section>

    <main id="rates" class="mx-auto max-w-[1440px] px-5 pt-[30px] desk:px-16">
      <TmErrorCard v-if="status === 'error'" />

      <div v-else-if="status === 'loading'" class="grid grid-cols-1 gap-[18px] desk:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] desk:gap-6">
        <div class="flex min-w-0 flex-col gap-[18px]">
          <TmSkeletons />
        </div>
        <div class="min-w-0">
          <div class="h-full rounded-card border border-ink/8 bg-card px-[30px] py-8">
            <div class="skeleton h-[200px] rounded-input" />
          </div>
        </div>
      </div>

      <!-- One grid, two stories: desktop pins the pass beside the rate stack;
           mobile runs rate, budget, then the pass right after, then the
           comparison, leaderboard and trend. -->
      <div v-else class="grid grid-cols-1 gap-[18px] desk:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] desk:gap-6">
        <div class="order-1 flex min-w-0 flex-col gap-[18px] desk:col-start-1 desk:row-start-1">
          <TmRateCard />
          <TmConverter />
        </div>

        <div class="order-2 min-w-0 desk:col-start-2 desk:row-start-1">
          <TmBoardingPass />
        </div>

        <div class="order-3 min-w-0 desk:col-span-2">
          <TmCompareStrip />
        </div>

        <div class="order-4 grid min-w-0 grid-cols-1 items-start gap-[18px] desk:col-span-2 desk:grid-cols-2 desk:gap-6">
          <TmLeaderboard />
          <TmTrend />
        </div>
      </div>
    </main>

    <TmFooter />
  </div>
</template>
