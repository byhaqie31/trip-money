<script setup lang="ts">
// Feature A: editorial list on mobile, boxed tiles on desktop. Shuffle walks
// through all other destinations four at a time in both views.
import { DESTINATIONS, type Destination } from '~~/config/destinations'

const { destination, budgetSen, budgetRm, select } = useTrip()
const rates = useRates()

const offset = ref(0)
const pool = computed(() => DESTINATIONS.filter(d => d.code !== destination.value.code))

const rows = computed(() => {
  const p = pool.value
  const picked: Destination[] = []
  for (let i = 0; i < Math.min(4, p.length); i++) picked.push(p[(offset.value + i) % p.length]!)
  return picked
    .map(d => ({
      d,
      amount: rates.convert(budgetSen.value, d.code),
      perRm: rates.latest(d.code) ? 1 / rates.latest(d.code)!.rate : null,
    }))
    .filter((r): r is { d: Destination, amount: number, perRm: number } => r.amount != null && r.perRm != null)
})

function shuffle(): void {
  offset.value = (offset.value + 4) % pool.value.length
}
</script>

<template>
  <section v-if="rows.length && budgetRm > 0" class="rounded-card border border-ink/8 bg-card px-[30px] py-8">
    <div class="mb-2 flex items-center justify-between gap-4 desk:mb-4">
      <div class="text-[13px] font-normal tracking-[0.02em] text-ink/70">Your RM{{ budgetRm.toLocaleString('en-MY') }} elsewhere</div>
      <button
        type="button"
        class="inline-flex flex-none cursor-pointer items-center gap-[6px] rounded-full border border-ink/14 px-3 py-[6px] text-[12px] font-medium text-ink/70 [transition:border-color_150ms_ease] hover:border-ink/30 hover:text-ink active:scale-[0.97]"
        @click="shuffle"
      >
        <svg viewBox="0 0 16 16" class="size-[13px]" fill="none" aria-hidden="true">
          <path d="M13.2 8a5.2 5.2 0 1 1-1.5-3.7M13.2 2.6v2.9h-2.9" class="stroke-ink/70" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Shuffle
      </button>
    </div>

    <!-- Mobile: editorial list -->
    <ul class="desk:hidden">
      <li v-for="r in rows" :key="r.d.code" class="border-t border-ink/8 first:border-t-0">
        <button type="button" class="flex w-full cursor-pointer items-center gap-3 py-[13px] text-left" @click="select(r.d.code)">
          <span class="text-[22px] leading-none">{{ r.d.flag }}</span>
          <span class="min-w-0 flex-1">
            <span class="block text-[15px] font-bold">{{ r.d.city }}</span>
            <span class="block font-mono text-[10.5px] text-ink/55">RM1 = {{ r.d.sym }}{{ fmtAmount(r.perRm) }}</span>
          </span>
          <span class="font-mono text-[18px] font-medium [overflow-wrap:anywhere]">{{ r.d.sym }}{{ fmtAmount(r.amount) }}</span>
        </button>
      </li>
    </ul>

    <!-- Desktop: boxed tiles -->
    <div class="hidden desk:grid desk:grid-cols-4 desk:gap-4">
      <button
        v-for="r in rows"
        :key="`tile-${r.d.code}`"
        type="button"
        class="cursor-pointer rounded-input border border-ink/10 bg-bg px-4 py-6 text-center [transition:transform_120ms_ease,border-color_150ms_ease] hover:border-ink/30 active:scale-[0.97]"
        @click="select(r.d.code)"
      >
        <div class="text-[26px] leading-none">{{ r.d.flag }}</div>
        <div class="mt-2 text-[16px] font-bold">{{ r.d.city }}</div>
        <div class="mt-[2px] font-mono text-[10px] uppercase tracking-[0.08em] text-ink/55">{{ r.d.cur }}</div>
        <div class="mt-3 font-mono text-[21px] font-medium [overflow-wrap:anywhere]">{{ r.d.sym }}{{ fmtAmount(r.amount) }}</div>
        <div class="mt-2 font-mono text-[10.5px] text-ink/55">RM1 = {{ r.d.sym }}{{ fmtAmount(r.perRm) }}</div>
      </button>
    </div>
  </section>
</template>
