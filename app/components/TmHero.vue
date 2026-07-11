<script setup lang="ts">
import { gsap } from 'gsap'
import { DESTINATIONS, type Destination } from '~~/config/destinations'

const { destination, select } = useTrip()
const rates = useRates()

// Hovering the ticker previews that currency in the exchange box without
// changing the selection; leaving reverts to the selected destination.
const preview = ref<Destination | null>(null)
const shown = computed(() => preview.value ?? destination.value)
const shownPerRm = computed(() => {
  const latest = rates.latest(shown.value.code)
  return latest ? 1 / latest.rate : null
})

// Departures-board roll for the city inside the one-line headline.
function onWordEnter(el: Element, done: () => void): void {
  if (prefersReducedMotion()) return done()
  gsap.fromTo(el, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'expo.out', onComplete: done })
}

function onWordLeave(el: Element, done: () => void): void {
  if (prefersReducedMotion()) return done()
  const node = el as HTMLElement
  node.style.position = 'absolute'
  node.style.left = '12px'
  node.style.top = '0'
  gsap.to(node, { yPercent: -110, opacity: 0, duration: 0.4, ease: 'expo.inOut', onComplete: done })
}

// Horizontal ticker on the ivory strip: pauses on hover, click selects.
const tickerItems = [...DESTINATIONS, ...DESTINATIONS]
const tickerEl = ref<HTMLElement | null>(null)
let tickerTween: gsap.core.Tween | null = null

onMounted(() => {
  if (!tickerEl.value || prefersReducedMotion()) return
  tickerTween = gsap.to(tickerEl.value, { xPercent: -50, duration: 48, ease: 'none', repeat: -1 })
})
onUnmounted(() => tickerTween?.kill())

function pauseTicker(): void {
  if (tickerTween) gsap.to(tickerTween, { timeScale: 0, duration: 0.35 })
}

function resumeTicker(): void {
  preview.value = null
  if (tickerTween) gsap.to(tickerTween, { timeScale: 1, duration: 0.35 })
}
</script>

<template>
  <section class="relative flex min-h-[480px] flex-col overflow-hidden rounded-panel bg-pass-panel desk:min-h-[640px]">
    <TmHeroMap />

    <div class="relative flex flex-1 flex-col items-center justify-center px-6 py-14 text-center desk:py-20">
      <p class="font-normal text-[12.5px] tracking-[0.04em] text-pass-paper/55">berapa rate hari ni?</p>

      <h1 class="mt-4 font-display text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-pass-paper text-pretty desk:text-[56px]">
        Now boarding:
        <span class="relative ml-2 inline-block overflow-hidden rounded-[10px] bg-lime px-[12px] text-lime-ink desk:ml-3">
          <Transition :css="false" @enter="onWordEnter" @leave="onWordLeave">
            <span :key="shown.city" class="inline-block whitespace-nowrap">{{ shown.city }}</span>
          </Transition>
        </span>
      </h1>

      <div class="mt-6 inline-flex items-center gap-2 rounded-[10px] border border-pass-paper/15 bg-pass-paper/10 px-4 py-[10px]">
        <span class="text-[14px] leading-none">{{ shown.flag }}</span>
        <span class="font-mono text-[13px] text-pass-paper/85">
          MYR 1 = {{ shown.cur }} <template v-if="shownPerRm != null">{{ fmtAmount(shownPerRm) }}</template> · middle rate
        </span>
      </div>
    </div>

    <!-- Bright cardboard strip: the moving countries, pause on hover -->
    <div
      class="relative bg-pass-paper py-3 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
      @mouseenter="pauseTicker"
      @mouseleave="resumeTicker"
    >
      <div ref="tickerEl" class="flex w-max whitespace-nowrap">
        <button
          v-for="(d, i) in tickerItems"
          :key="`${d.code}-${i}`"
          type="button"
          class="mr-7 inline-flex cursor-pointer items-center gap-[6px] font-mono text-[11px] tracking-[0.06em] text-pass-ink/70 hover:text-pass-ink"
          @mouseenter="preview = d"
          @focus="preview = d"
          @click="select(d.code)"
        >
          <span>{{ d.flag }}</span>
          <span>{{ d.city }} · {{ d.cur }}</span>
        </button>
      </div>
    </div>
  </section>
</template>
