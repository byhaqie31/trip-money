<script setup lang="ts">
import { TRAVEL_CLASSES } from '~/composables/useTrip'

const { destination, budgetRm, budgetSen, travelClass, setBudgetRm, setTravelClass } = useTrip()
const { stopTour } = useTour()
const rates = useRates()
const asOfDate = rates.asOfDate

const converted = computed(() => (budgetRm.value > 0 ? rates.convert(budgetSen.value, destination.value.code) : null))
const oldest = computed(() => rates.oldest(destination.value.code))

const budgetDisplay = computed(() => (budgetRm.value > 0 ? budgetRm.value.toLocaleString('en-MY') : ''))

function onInput(event: Event): void {
  const el = event.target as HTMLInputElement
  const digits = el.value.replace(/[^0-9]/g, '')
  setBudgetRm(digits === '' ? 0 : Number.parseInt(digits, 10))
  el.value = budgetDisplay.value
}

const story = computed(() => {
  if (!oldest.value || converted.value == null || !asOfDate.value) return null
  const then = convertSen(budgetSen.value, oldest.value.rate)
  if (then == null) return null
  const sym = destination.value.sym
  const budget = budgetRm.value.toLocaleString('en-MY')
  return `${agoLabel(oldest.value.date, asOfDate.value)}, RM${budget} was ${sym}${fmtAmount(then)}. Today it is ${sym}${fmtAmount(converted.value)}.`
})
</script>

<template>
  <section class="rounded-card border border-ink/8 bg-card px-[30px] py-8">
    <div class="mb-[10px] text-[13px] font-normal tracking-[0.02em] text-ink/55">Your trip budget</div>

    <!-- Traveller class: presets the budget, pass switches paper to match -->
    <div class="mb-3 grid grid-cols-3 rounded-full border border-ink/14 bg-bg p-[3px]">
      <button
        v-for="c in TRAVEL_CLASSES"
        :key="c.key"
        type="button"
        class="cursor-pointer rounded-full py-[7px] text-[13px] font-medium [transition:background-color_150ms_ease]"
        :class="travelClass === c.key ? 'bg-ink text-bg' : 'text-ink/55'"
        @click="setTravelClass(c.key)"
      >
        {{ c.label }}
      </button>
    </div>

    <div class="flex items-center gap-3 rounded-input border-[1.5px] border-ink/16 bg-bg px-[18px] py-[14px] transition-colors focus-within:border-ink">
      <span class="font-mono text-[15px] text-ink/45">RM</span>
      <input
        :value="budgetDisplay"
        inputmode="numeric"
        autocomplete="off"
        placeholder="5,000"
        aria-label="Your trip budget in ringgit"
        class="min-w-0 flex-1 border-none bg-transparent p-0 font-mono text-[26px] font-medium text-ink outline-none placeholder:text-ink/30"
        @focus="stopTour()"
        @input="onInput"
      >
    </div>

    <div class="mt-[22px]">
      <div class="text-[13px] font-normal tracking-[0.02em] text-ink/55">In {{ destination.city }}, that is</div>
      <div class="mt-[6px] font-mono text-[38px] font-medium tracking-[-0.01em] [overflow-wrap:anywhere]">
        <template v-if="converted != null">{{ destination.sym }}{{ fmtAmount(converted) }}</template>
        <template v-else>&nbsp;</template>
      </div>
    </div>

    <blockquote v-if="story" class="mt-6 border-l-2 border-ink/15 pl-4">
      <p class="text-[17px] font-normal leading-[1.5] text-ink/70 text-pretty">{{ story }}</p>
    </blockquote>
  </section>
</template>
