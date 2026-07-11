<script setup lang="ts">
// Feature B: the headline feature. Editorial ranked list in the handoff's
// card language, not a data table. Positive = the rate fell = the ringgit
// buys more there than `windowDays` ago.
import { destinationByCode } from '~~/config/destinations'

const { select } = useTrip()
const rates = useRates()

const windowDays = ref<30 | 90>(30)
const expanded = ref(false)

const entries = computed(() =>
  rates.leaderboard(windowDays.value)
    .map(e => ({ ...e, dest: destinationByCode(e.currency) }))
    .filter(e => e.dest != null),
)
const visible = computed(() => (expanded.value ? entries.value : entries.value.slice(0, 8)))
</script>

<template>
  <section class="rounded-card border border-ink/8 bg-card px-[30px] py-8">
    <div class="mb-2 flex items-center justify-between gap-4">
      <h2 class="text-[15px] font-semibold">Where the ringgit is winning</h2>
      <div class="flex flex-none rounded-full border border-ink/14 bg-bg p-[3px]">
        <button
          v-for="d in [30, 90] as const"
          :key="d"
          type="button"
          class="cursor-pointer rounded-full px-3 py-[5px] font-mono text-[11.5px] [transition:background-color_150ms_ease]"
          :class="windowDays === d ? 'bg-ink text-bg' : 'text-ink/55'"
          @click="windowDays = d"
        >
          {{ d }}d
        </button>
      </div>
    </div>
    <p class="text-[12.5px] text-ink/50">How much further your ringgit goes than {{ windowDays }} days ago.</p>

    <ul class="mt-3">
      <li v-for="(e, i) in visible" :key="e.currency" class="border-t border-ink/8 first:border-t-0">
        <button type="button" class="flex w-full cursor-pointer items-center gap-3 py-[14px] text-left" @click="select(e.currency)">
          <span class="w-[22px] font-mono text-[10.5px] text-ink/35">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="text-[16px]">{{ e.dest!.flag }}</span>
          <span class="min-w-0 flex-1">
            <span class="text-[14px] font-medium">{{ e.dest!.city }}</span>
            <span class="ml-2 font-mono text-[10.5px] text-ink/55">{{ e.dest!.cur }}</span>
          </span>
          <span class="font-mono text-[15px] font-medium" :class="e.changePct >= 0 ? 'text-positive' : 'text-negative'">
            {{ e.changePct >= 0 ? '▲' : '▼' }} {{ Math.abs(e.changePct).toFixed(1) }}%
          </span>
        </button>
      </li>
    </ul>

    <button
      v-if="entries.length > 8"
      type="button"
      class="mt-2 w-full cursor-pointer rounded-btn border border-ink/14 py-[10px] text-center text-[13px] font-medium text-ink/70 [transition:transform_120ms_ease] active:scale-[0.98]"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Show less' : `Show all ${entries.length}` }}
    </button>
  </section>
</template>
