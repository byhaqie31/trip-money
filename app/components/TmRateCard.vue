<script setup lang="ts">
const { destination } = useTrip()
const rates = useRates()
const asOfDate = rates.asOfDate

const latest = computed(() => rates.latest(destination.value.code))
const deltaInfo = computed(() => rates.delta(destination.value.code))
const percentile = computed(() => rates.timingPercentile(destination.value.code))
const perRm = useAnimatedNumber(() => (latest.value ? 1 / latest.value.rate : null), 500)
</script>

<template>
  <section class="rounded-card border border-ink/8 bg-card px-[30px] py-8">
    <div class="mb-[14px] flex items-center justify-between">
      <div class="text-[13px] font-normal tracking-[0.02em] text-ink/55">RM 1 buys you</div>
      <div v-if="deltaInfo" class="flex items-center gap-[5px] rounded-full bg-lime px-[11px] py-[5px] text-lime-ink">
        <span class="text-[10px]">{{ deltaInfo.pct >= 0 ? '▲' : '▼' }}</span>
        <span class="font-mono text-[11.5px] font-medium">{{ Math.abs(deltaInfo.pct).toFixed(2) }}%</span>
      </div>
    </div>

    <div class="font-display text-[58px] font-bold leading-none tracking-[-0.03em] desk:text-[80px]">
      <template v-if="perRm != null">{{ destination.sym }}{{ fmtAmount(perRm) }}</template>
    </div>

    <div v-if="latest" class="mt-[14px] font-mono text-[11.5px] text-ink/50">
      {{ destination.sym }}1 = RM {{ fmtRate(latest.rate) }} · middle rate
    </div>

    <div v-if="asOfDate" class="mt-4 inline-flex items-center gap-2 rounded-[8px] border border-ink/10 bg-bg px-3 py-[7px]">
      <span class="inline-block size-[6px] rounded-full bg-positive" />
      <span class="font-mono text-[11px] text-ink/65">rate as of {{ fmtDateChip(asOfDate) }}</span>
    </div>

    <!-- Feature C: historical context only, never predictive, never advice. -->
    <p v-if="percentile != null" class="mt-4 text-[13.5px] leading-[1.5] text-ink/60 text-pretty">
      Today's rate is better than {{ percentile }}% of the last 90 days.
    </p>
  </section>
</template>
