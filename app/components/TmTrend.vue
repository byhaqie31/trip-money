<script setup lang="ts">
const { destination } = useTrip()
const rates = useRates()

// Plotted as foreign-per-RM (1/rate) so up = stronger ringgit, per the handoff.
const points = computed(() => rates.history(destination.value.code, 90))

const geom = computed(() => {
  const pts = points.value
  if (pts.length < 2) return null
  const vals = pts.map(p => 1 / p.rate)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const span = max - min || 1
  const X = (i: number) => (i / (vals.length - 1)) * 700
  const Y = (v: number) => 26 + (1 - (v - min) / span) * 106
  let line = ''
  vals.forEach((v, i) => {
    line += (i ? ' L' : 'M') + X(i).toFixed(1) + ',' + Y(v).toFixed(1)
  })
  const bestI = vals.indexOf(max)
  const dotX = X(bestI)
  const nearStart = bestI < vals.length * 0.15
  const nearEnd = bestI > vals.length * 0.85
  return {
    line,
    area: `${line} L700,160 L0,160 Z`,
    dotX,
    dotY: Y(max),
    dotLX: nearStart ? dotX + 8 : nearEnd ? dotX - 8 : dotX,
    dotLY: Math.max(12, Y(max) - 12),
    dotAnchor: nearStart ? 'start' : nearEnd ? 'end' : 'middle',
    dotLabel: `${fmtDayMon(pts[bestI]!.date)} · strongest ringgit day`,
    startLabel: fmtDayMon(pts[0]!.date),
    endLabel: fmtDayMon(pts[pts.length - 1]!.date),
  }
})

const verdict = computed(() => {
  const pts30 = rates.history(destination.value.code, 30)
  const latest = rates.latest(destination.value.code)
  if (pts30.length < 2 || !latest) return null
  const stronger = latest.rate < pts30[0]!.rate
  return `The ringgit is ${stronger ? 'stronger' : 'weaker'} against the ${destination.value.cur} than 30 days ago.`
})

// Feature C companion: distribution of the last 90 days, today's bin marked.
// Same plotting convention as the trend: right = stronger ringgit.
const BINS = 16
const histogram = computed(() => {
  const pts = points.value
  if (pts.length < 8) return null
  const vals = pts.map(p => 1 / p.rate)
  const today = vals[vals.length - 1]!
  const min = Math.min(...vals)
  const span = (Math.max(...vals) - min) || 1
  const counts = Array.from({ length: BINS }, () => 0)
  for (const v of vals) {
    counts[Math.min(BINS - 1, Math.floor(((v - min) / span) * BINS))]!++
  }
  const maxCount = Math.max(...counts)
  return {
    todayBin: Math.min(BINS - 1, Math.floor(((today - min) / span) * BINS)),
    bars: counts.map((count, i) => ({
      x: (700 / BINS) * i + 3,
      width: 700 / BINS - 6,
      height: Math.max(2, (count / maxCount) * 60),
    })),
  }
})
</script>

<template>
  <section v-if="geom" class="rounded-card border border-ink/8 bg-card px-[30px] pb-6 pt-8">
    <div class="mb-4 flex items-baseline justify-between">
      <div class="text-[13px] font-normal tracking-[0.02em] text-ink/70">Last 90 days</div>
      <div class="font-mono text-[10px] text-ink/35">{{ destination.cur }} per RM 1</div>
    </div>

    <svg viewBox="0 0 700 160" class="block w-full" role="img" :aria-label="`90 day trend of ${destination.cur} per RM 1`">
      <defs>
        <linearGradient id="tmFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--color-chart-fill)" stop-opacity="0.22" />
          <stop offset="100%" stop-color="var(--color-chart-fill)" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path :d="geom.area" fill="url(#tmFill)" />
      <path :d="geom.line" fill="none" class="stroke-chart-line" stroke-width="1.8" />
      <circle :cx="geom.dotX" :cy="geom.dotY" r="4" class="fill-card stroke-ink" stroke-width="1.6" />
      <text :x="geom.dotLX" :y="geom.dotLY" :text-anchor="geom.dotAnchor" class="fill-ink/60 font-mono text-[10.5px]">{{ geom.dotLabel }}</text>
      <text x="0" y="156" class="fill-ink/35 font-mono text-[9.5px]">{{ geom.startLabel }}</text>
      <text x="700" y="156" text-anchor="end" class="fill-ink/35 font-mono text-[9.5px]">{{ geom.endLabel }}</text>
    </svg>

    <p v-if="verdict" class="mt-3 text-[13.5px] leading-[1.5] text-ink/60 text-pretty">{{ verdict }}</p>

    <template v-if="histogram">
      <div class="mb-3 mt-6 flex items-baseline justify-between border-t border-ink/8 pt-5">
        <div class="text-[13px] font-normal tracking-[0.02em] text-ink/70">Where today sits</div>
        <div class="font-mono text-[10px] text-ink/45">90 day spread</div>
      </div>
      <svg viewBox="0 0 700 78" class="block w-full" role="img" :aria-label="`Distribution of ${destination.cur} per RM 1 over the last 90 days with today marked`">
        <rect
          v-for="(bar, i) in histogram.bars"
          :key="i"
          :x="bar.x"
          :y="66 - bar.height"
          :width="bar.width"
          :height="bar.height"
          rx="2"
          :class="i === histogram.todayBin ? 'fill-chart-line' : 'fill-ink/10'"
        />
        <text x="0" y="77" class="fill-ink/45 font-mono text-[9.5px]">weaker ringgit</text>
        <text x="700" y="77" text-anchor="end" class="fill-ink/45 font-mono text-[9.5px]">stronger ringgit</text>
      </svg>
      <p class="mt-2 text-[12.5px] leading-[1.5] text-ink/60 text-pretty">
        Each bar counts days at that level in the last 90 days. The green bar is where today sits.
      </p>
    </template>
  </section>
</template>
