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

    <!-- Hero: the main full-width section -->
    <section class="mx-auto max-w-[1440px] px-5 desk:px-16">
      <TmHero />
      <TmChips />
    </section>

    <main class="mx-auto max-w-[1440px] px-5 pt-[30px] desk:px-16">
      <TmErrorCard v-if="status === 'error'" />

      <template v-else>
        <!-- Rate + converter left, boarding pass aligned right -->
        <div class="grid grid-cols-1 items-start gap-[18px] desk:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] desk:gap-6">
          <div v-if="status === 'loading'" class="flex min-w-0 flex-col gap-[18px]">
            <TmSkeletons />
          </div>
          <div v-else class="flex min-w-0 flex-col gap-[18px]">
            <TmRateCard />
            <TmConverter />
          </div>
          <div class="min-w-0 desk:sticky desk:top-6">
            <div v-if="status === 'loading'" class="rounded-card border border-ink/8 bg-card px-[30px] py-8">
              <div class="skeleton h-[200px] rounded-input" />
            </div>
            <TmBoardingPass v-else />
          </div>
        </div>

        <template v-if="status === 'ready'">
          <!-- Comparison strip: full width -->
          <div class="mt-[18px] desk:mt-6">
            <TmCompareStrip />
          </div>

          <!-- Leaderboard and trend, paired -->
          <div class="mt-[18px] grid grid-cols-1 items-start gap-[18px] desk:mt-6 desk:grid-cols-2 desk:gap-6">
            <TmLeaderboard />
            <TmTrend />
          </div>
        </template>
      </template>
    </main>

    <TmFooter />
  </div>
</template>
