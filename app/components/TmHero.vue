<script setup lang="ts">
import { gsap } from 'gsap'
import { DESTINATIONS, destinationByCode, type Destination } from '~~/config/destinations'

const { destination, select } = useTrip()
const { stopped } = useTour()
const rates = useRates()

// The tour and ticker hovers drive `preview` only: the hero display changes,
// the selection (rate card, converter, boarding pass) stays untouched.
const preview = ref<Destination | null>(null)
const shown = computed(() => preview.value ?? destination.value)
const shownRate = computed(() => rates.latest(shown.value.code)?.rate ?? null)
const shownPerRm = computed(() => (shownRate.value != null ? 1 / shownRate.value : null))

const sectionEl = ref<HTMLElement | null>(null)
const inView = ref(true)
const hovering = ref(false)
let tourTimer: ReturnType<typeof setInterval> | undefined
let observer: IntersectionObserver | undefined

onMounted(() => {
  // Auto-tour every 5s: pauses off-screen and while hovering the ticker;
  // any real interaction stops it for good (useTour.stopped).
  if (!stopped.value && !prefersReducedMotion()) {
    tourTimer = setInterval(() => {
      if (stopped.value || hovering.value || !inView.value) return
      const current = shown.value.code as (typeof TOUR_ORDER)[number]
      const at = TOUR_ORDER.indexOf(current)
      preview.value = destinationByCode(TOUR_ORDER[(at + 1) % TOUR_ORDER.length]!) ?? null
    }, 5000)
  }
  if (sectionEl.value) {
    observer = new IntersectionObserver(([entry]) => {
      inView.value = entry?.isIntersecting ?? true
    })
    observer.observe(sectionEl.value)
  }
})

onUnmounted(() => {
  clearInterval(tourTimer)
  observer?.disconnect()
  tickerTween?.kill()
})

// Once the user has spoken, the hero mirrors the real selection.
watch(stopped, (isStopped) => {
  if (isStopped && !hovering.value) preview.value = null
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
// The second run is decorative (aria-hidden, no tab stops).
const tickerItems = [...DESTINATIONS, ...DESTINATIONS]
const tickerEl = ref<HTMLElement | null>(null)
let tickerTween: gsap.core.Tween | null = null

onMounted(() => {
  if (!tickerEl.value || prefersReducedMotion()) return
  tickerTween = gsap.to(tickerEl.value, { xPercent: -50, duration: 80, ease: 'none', repeat: -1 })
})

function pauseTicker(): void {
  hovering.value = true
  if (tickerTween) gsap.to(tickerTween, { timeScale: 0, duration: 0.35 })
}

function resumeTicker(): void {
  hovering.value = false
  preview.value = null
  if (tickerTween) gsap.to(tickerTween, { timeScale: 1, duration: 0.35 })
}
</script>

<template>
  <section ref="sectionEl" class="relative flex min-h-[480px] flex-col overflow-hidden rounded-panel bg-pass-panel desk:min-h-[640px]">
    <TmHeroMap :code="shown.code" />

    <div class="relative flex flex-1 flex-col items-center justify-center px-6 py-14 text-center desk:py-20">
      <p class="font-normal text-[12.5px] tracking-[0.04em] text-pass-paper/75">berapa rate hari ni?</p>

      <h1 class="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 font-display text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-pass-paper desk:gap-x-3 desk:text-[56px]">
        <span>Now boarding:</span>
        <span class="relative inline-block overflow-hidden rounded-[10px] bg-lime px-[12px] text-lime-ink">
          <Transition :css="false" @enter="onWordEnter" @leave="onWordLeave">
            <span :key="shown.city" class="inline-block whitespace-nowrap">{{ shown.city }}</span>
          </Transition>
        </span>
      </h1>

      <div
        v-if="shownPerRm != null && shownRate != null"
        class="mt-6 flex flex-col items-stretch overflow-hidden rounded-[10px] border border-pass-paper/15 bg-pass-paper/10 font-mono text-[13px] text-pass-paper/85 desk:flex-row desk:items-center"
      >
        <span class="flex items-center justify-center gap-2 px-4 py-[10px]">
          <span class="text-[14px] leading-none">🇲🇾</span>
          <span>MYR 1 = {{ shown.cur }} {{ fmtAmount(shownPerRm) }}</span>
        </span>
        <span class="h-px w-full flex-none bg-pass-paper/15 desk:h-6 desk:w-px" aria-hidden="true" />
        <span class="flex items-center justify-center gap-2 px-4 py-[10px]">
          <span class="text-[14px] leading-none">{{ shown.flag }}</span>
          <span>{{ shown.cur }} 1 = MYR {{ fmtRate(shownRate) }}</span>
        </span>
      </div>
    </div>

    <!-- Bright cardboard strip: the moving countries as tappable chips -->
    <div
      class="relative bg-pass-paper py-4 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
      @mouseenter="pauseTicker"
      @mouseleave="resumeTicker"
    >
      <div ref="tickerEl" class="flex w-max whitespace-nowrap">
        <button
          v-for="(d, i) in tickerItems"
          :key="`${d.code}-${i}`"
          type="button"
          :tabindex="i >= DESTINATIONS.length ? -1 : undefined"
          :aria-hidden="i >= DESTINATIONS.length ? 'true' : undefined"
          class="mr-3 inline-flex cursor-pointer items-center gap-[6px] rounded-full border border-ink/10 bg-card px-3 py-[6px] font-mono text-[11px] tracking-[0.04em] text-pass-ink/80 [transition:border-color_150ms_ease] hover:border-ink/30 hover:text-pass-ink"
          @mouseenter="preview = d"
          @focus="preview = d"
          @blur="preview = null"
          @click="select(d.code)"
        >
          <span>{{ d.flag }}</span>
          <span>{{ d.city }} · {{ d.cur }}</span>
        </button>
      </div>
    </div>
  </section>
</template>
