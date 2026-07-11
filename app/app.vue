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

    <!-- Wise-style hero composition on desktop: story left, pass top right. -->
    <main class="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-x-6 px-5 desk:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] desk:px-16">
      <div class="flex min-w-0 flex-col">
        <TmHero />
        <TmChips />
        <div class="mt-[30px]">
          <TmSkeletons v-if="status === 'loading'" />
          <TmErrorCard v-else-if="status === 'error'" />
          <div v-else class="flex flex-col gap-[18px]">
            <TmRateCard />
            <TmConverter />
            <TmCompareStrip />
            <TmLeaderboard />
            <TmTrend />
          </div>
        </div>
      </div>

      <div v-if="status !== 'error'" class="mt-[18px] min-w-0 desk:sticky desk:top-6 desk:mt-16">
        <div v-if="status === 'loading'" class="rounded-card border border-ink/8 bg-card px-[30px] py-8">
          <div class="skeleton h-[200px] rounded-input" />
        </div>
        <TmBoardingPass v-else />
      </div>
    </main>

    <TmFooter />
  </div>
</template>
