<script setup lang="ts">
// Feature A: not in the design handoff (it shipped with the v1 brief), so this
// follows the handoff's language: white card, page-colour tiles like the date
// chip, mono amounts, chip-style press feedback.
import { DESTINATIONS, type Destination } from '~~/config/destinations'

const { destination, budgetSen, budgetRm, select } = useTrip()
const rates = useRates()

const cards = computed(() =>
  DESTINATIONS.filter(d => d.code !== destination.value.code)
    .map(d => ({ d, amount: rates.convert(budgetSen.value, d.code) }))
    .filter((c): c is { d: Destination, amount: number } => c.amount != null)
    .slice(0, 4),
)
</script>

<template>
  <section v-if="cards.length && budgetRm > 0" class="rounded-card border border-ink/8 bg-card px-[30px] py-8">
    <div class="mb-4 text-[13px] text-ink/55">Your RM{{ budgetRm.toLocaleString('en-MY') }} elsewhere</div>
    <div class="no-scrollbar flex gap-[10px] overflow-x-auto desk:grid desk:grid-cols-2 desk:overflow-visible">
      <button
        v-for="c in cards"
        :key="c.d.code"
        type="button"
        class="min-w-[150px] flex-none cursor-pointer rounded-input border border-ink/10 bg-bg p-4 text-left [transition:transform_120ms_ease] active:scale-[0.97] desk:min-w-0"
        @click="select(c.d.code)"
      >
        <div class="flex items-center gap-[6px]">
          <span class="text-[14px]">{{ c.d.flag }}</span>
          <span class="text-[13px] font-medium">{{ c.d.city }}</span>
        </div>
        <div class="mt-2 font-mono text-[18px] font-medium [overflow-wrap:anywhere]">{{ c.d.sym }}{{ fmtAmount(c.amount) }}</div>
        <div class="mt-[2px] font-mono text-[10px] uppercase tracking-[0.08em] text-ink/45">{{ c.d.cur }}</div>
      </button>
    </div>
  </section>
</template>
