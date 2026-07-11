<script setup lang="ts">
const rates = useRates()
await callOnce(() => rates.load())
const status = rates.status

const { selectedCode, budgetSen, select, setBudgetRm } = useTrip()

// URL state (?to=jpy&budget=500000, budget in sen) so boarding passes are
// linkable. Read once on mount, then mirror quietly via replaceState.
onMounted(() => {
  const query = new URLSearchParams(location.search)
  const to = query.get('to')
  if (to) select(to.toLowerCase())
  const budget = query.get('budget')
  if (budget && /^\d+$/.test(budget)) setBudgetRm(Math.floor(Number.parseInt(budget, 10) / 100))

  watch([selectedCode, budgetSen], () => {
    const url = new URL(location.href)
    url.searchParams.set('to', selectedCode.value)
    url.searchParams.set('budget', String(budgetSen.value))
    history.replaceState(null, '', url)
  })
})
</script>

<template>
  <div class="min-h-dvh bg-bg">
    <TmHeader />
    <TmHero />
    <TmChips />

    <TmSkeletons v-if="status === 'loading'" />
    <TmErrorCard v-else-if="status === 'error'" />
    <main
      v-else
      class="grid max-w-[1440px] grid-cols-1 items-start gap-[18px] px-5 pt-[30px] desk:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] desk:gap-6 desk:px-16"
    >
      <div class="flex min-w-0 flex-col gap-[18px]">
        <TmRateCard />
        <TmConverter />
        <TmCompareStrip />
        <TmLeaderboard />
        <TmTrend />
      </div>
      <div class="min-w-0 desk:sticky desk:top-6">
        <TmBoardingPass />
      </div>
    </main>

    <TmFooter />
  </div>
</template>
