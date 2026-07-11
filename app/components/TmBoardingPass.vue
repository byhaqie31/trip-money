<script setup lang="ts">
// The signature share card. One markup tree; traveller classes swap paper,
// ink, rules and foil purely through the .tm-pass CSS variable themes.
import { gsap } from 'gsap'

const { destination, budgetRm, budgetSen, travelClass } = useTrip()
const rates = useRates()
const asOfDate = rates.asOfDate

const latest = computed(() => rates.latest(destination.value.code))
const converted = computed(() => rates.convert(budgetSen.value, destination.value.code))
const percentile = computed(() => rates.timingPercentile(destination.value.code))

const passEl = ref<HTMLElement | null>(null)
const saved = ref(false)
const shared = ref(false)
let savedTimer: ReturnType<typeof setTimeout> | undefined
let sharedTimer: ReturnType<typeof setTimeout> | undefined

// Reprint feel on class change: quick fade-through, nothing 3D.
watch(travelClass, () => {
  if (!passEl.value || prefersReducedMotion()) return
  gsap.fromTo(passEl.value, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
})

async function save(): Promise<void> {
  if (!passEl.value) return
  try {
    const { toPng } = await import('html-to-image')
    const dataUrl = await toPng(passEl.value, {
      pixelRatio: 3,
      style: { boxShadow: 'none', animation: 'none' },
    })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `trip-money-KUL-${destination.value.airport}-${travelClass.value}.png`
    a.click()
    saved.value = true
    clearTimeout(savedTimer)
    savedTimer = setTimeout(() => (saved.value = false), 1600)
  } catch (error) {
    console.error('save failed', error)
  }
}

async function share(): Promise<void> {
  try {
    await navigator.clipboard.writeText(location.href)
    shared.value = true
    clearTimeout(sharedTimer)
    sharedTimer = setTimeout(() => (shared.value = false), 1600)
  } catch (error) {
    console.error('share failed', error)
  }
}
</script>

<template>
  <!-- h-full + my-auto card: the panel stretches to the left column's
       height, the pass floats centered between title and buttons. -->
  <section class="flex h-full flex-col rounded-panel bg-pass-panel px-6 pb-[26px] pt-7">
    <div class="mb-4 flex-none text-center font-mono text-[11px] uppercase tracking-[0.12em] text-pass-paper/50">Your boarding pass</div>

    <div
      ref="passEl"
      class="tm-pass my-auto rounded-pass bg-[var(--paper)] text-[color:var(--ink)] shadow-pass [animation:var(--animate-pass-in)]"
      :class="{ 'tm-pass--business': travelClass === 'business', 'tm-pass--first': travelClass === 'first' }"
    >
      <div class="flex items-baseline justify-between px-[22px] pt-5">
        <div class="font-mono text-[13px] font-medium tracking-[0.22em]">TRIP MONEY</div>
        <div class="font-mono text-[9px] tracking-[0.14em] text-[color:var(--muted)]">BOARDING PASS</div>
      </div>

      <div class="flex items-center gap-4 px-[22px] pt-[18px]">
        <div>
          <div class="font-display text-[42px] font-bold leading-none tracking-[-0.01em] text-[color:var(--code)]">KUL</div>
          <div class="mt-[5px] font-mono text-[9px] tracking-[0.1em] text-[color:var(--muted)]">KUALA LUMPUR</div>
        </div>
        <div class="flex min-w-0 flex-1 items-center gap-2">
          <div class="h-px flex-1 bg-[var(--rule)]" />
          <div class="text-[13px] text-[color:var(--muted)]">→</div>
          <div class="h-px flex-1 bg-[var(--rule)]" />
        </div>
        <div class="text-right">
          <div class="font-display text-[42px] font-bold leading-none tracking-[-0.01em] text-[color:var(--code)]">{{ destination.airport }}</div>
          <div class="mt-[5px] font-mono text-[9px] tracking-[0.1em] text-[color:var(--muted)]">{{ destination.airportCity }}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-x-3 gap-y-4 px-[22px] pb-5 pt-[22px]">
        <div>
          <div class="mb-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[color:var(--muted)]">Traveller budget</div>
          <div class="font-mono text-[16px] font-medium">RM {{ budgetRm.toLocaleString('en-MY') }}.00</div>
        </div>
        <div class="text-right">
          <div class="mb-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[color:var(--muted)]">Converted</div>
          <div class="font-mono text-[16px] font-medium [overflow-wrap:anywhere]">
            <template v-if="converted != null">{{ destination.sym }}{{ fmtAmount(converted) }}</template>
          </div>
        </div>
        <div>
          <div class="mb-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[color:var(--muted)]">Middle rate</div>
          <div class="font-mono text-[13px]">
            <template v-if="latest">{{ fmtRate(latest.rate) }}</template>
          </div>
        </div>
        <div class="text-right">
          <div class="mb-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[color:var(--muted)]">Date</div>
          <div class="font-mono text-[13px]">
            <template v-if="asOfDate">{{ fmtPassDate(asOfDate) }}</template>
          </div>
        </div>
        <div>
          <div class="mb-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[color:var(--muted)]">Class</div>
          <div class="font-mono text-[13px] uppercase">{{ travelClass }}</div>
        </div>
        <div v-if="percentile != null" class="text-right">
          <div class="mb-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[color:var(--muted)]">Timing</div>
          <div class="font-mono text-[10.5px] leading-[1.4]">Better than {{ percentile }}% of the last 90 days</div>
        </div>
      </div>

      <div class="relative h-0 border-t-2 border-dashed [border-color:var(--rule)]">
        <div class="absolute -left-[10px] -top-[10px] size-5 rounded-full bg-pass-panel" />
        <div class="absolute -right-[10px] -top-[10px] size-5 rounded-full bg-pass-panel" />
      </div>

      <div class="flex items-center gap-4 px-[22px] pb-[18px] pt-4">
        <div class="h-9 flex-1 rounded-[2px] opacity-85 [background:repeating-linear-gradient(90deg,var(--barcode)_0_2px,transparent_2px_4px,var(--barcode)_4px_5px,transparent_5px_9px,var(--barcode)_9px_12px,transparent_12px_14px)]" />
        <div class="max-w-[60%] flex-none text-right">
          <div class="font-mono text-[10px] tracking-[0.06em] [overflow-wrap:anywhere]">
            KUL→{{ destination.airport }}<template v-if="converted != null"> · {{ destination.sym }}{{ fmtAmount(converted) }}</template>
          </div>
          <div class="mt-[3px] font-mono text-[8.5px] text-[color:var(--muted)]">Trip Money · rates by BNM via data.gov.my</div>
        </div>
      </div>
    </div>

    <div class="mt-[18px] flex flex-none flex-col gap-[10px]">
      <button
        type="button"
        class="flex h-[52px] cursor-pointer items-center justify-center rounded-btn bg-lime text-[15px] font-bold text-lime-ink [transition:transform_120ms_ease] active:scale-[0.99]"
        @click="save"
      >
        {{ saved ? 'Saved ✓' : 'Save boarding pass' }}
      </button>
      <button
        type="button"
        class="flex h-12 cursor-pointer items-center justify-center rounded-btn border border-pass-paper/22 text-[14px] font-medium text-pass-paper/80 active:bg-pass-paper/6"
        @click="share"
      >
        {{ shared ? 'Link copied ✓' : 'Share' }}
      </button>
    </div>
  </section>
</template>
