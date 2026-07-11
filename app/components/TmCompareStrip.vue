<script setup lang="ts">
// Feature A: full-width comparison band. Centered, flag-led tiles with the
// converted budget and the RM1 unit rate for each destination.
import { DESTINATIONS, type Destination } from '~~/config/destinations'

const { destination, budgetSen, budgetRm, select } = useTrip()
const rates = useRates()

const cards = computed(() =>
  DESTINATIONS.filter(d => d.code !== destination.value.code)
    .map(d => ({
      d,
      amount: rates.convert(budgetSen.value, d.code),
      perRm: rates.latest(d.code) ? 1 / rates.latest(d.code)!.rate : null,
    }))
    .filter((c): c is { d: Destination, amount: number, perRm: number } => c.amount != null && c.perRm != null)
    .slice(0, 4),
)
</script>

<template>
  <section v-if="cards.length && budgetRm > 0" class="rounded-card border border-ink/8 bg-card px-[30px] py-8">
    <div class="mb-4 text-[13px] font-normal tracking-[0.02em] text-ink/70">Your RM{{ budgetRm.toLocaleString('en-MY') }} elsewhere</div>
    <div class="no-scrollbar flex gap-[10px] overflow-x-auto desk:grid desk:grid-cols-4 desk:gap-4 desk:overflow-visible">
      <button
        v-for="c in cards"
        :key="c.d.code"
        type="button"
        class="min-w-[180px] flex-none cursor-pointer rounded-input border border-ink/10 bg-bg px-4 py-6 text-center [transition:transform_120ms_ease,border-color_150ms_ease] hover:border-ink/30 active:scale-[0.97] desk:min-w-0"
        @click="select(c.d.code)"
      >
        <div class="text-[26px] leading-none">{{ c.d.flag }}</div>
        <div class="mt-2 text-[16px] font-bold">{{ c.d.city }}</div>
        <div class="mt-[2px] font-mono text-[10px] uppercase tracking-[0.08em] text-ink/55">{{ c.d.cur }}</div>
        <div class="mt-3 font-mono text-[21px] font-medium [overflow-wrap:anywhere]">{{ c.d.sym }}{{ fmtAmount(c.amount) }}</div>
        <div class="mt-2 font-mono text-[10.5px] text-ink/55">RM1 = {{ c.d.sym }}{{ fmtAmount(c.perRm) }}</div>
      </button>
    </div>
  </section>
</template>
