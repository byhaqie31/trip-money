<script setup lang="ts">
const rates = useRates()
await callOnce(() => rates.load())
const status = rates.status
</script>

<template>
  <div class="min-h-dvh bg-bg">
    <TmHeader />
    <TmHero />
    <TmChips />

    <TmSkeletons v-if="status === 'loading'" />
    <TmErrorCard v-else-if="status === 'error'" />
    <!-- Interim single column; the desktop two-column grid with the sticky
         boarding pass panel lands in Phase 3 together with the pass itself. -->
    <main v-else class="flex max-w-[760px] flex-col gap-[18px] px-5 pt-[30px] desk:px-16">
      <TmRateCard />
      <TmConverter />
      <TmCompareStrip />
      <TmLeaderboard />
      <TmTrend />
    </main>

    <TmFooter />
  </div>
</template>
