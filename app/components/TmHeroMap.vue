<script setup lang="ts">
// Real world-map design behind the hero card: land shapes generated at build
// time from world-atlas (no tile API, no keys), destinations at their real
// coordinates, one dotted route KUL -> the shown city (which may be the
// tour/hover preview, not the selection). Static under reduced motion.
import { gsap } from 'gsap'
import { DESTINATIONS } from '~~/config/destinations'
import { WORLD_LAND_PATH } from '~/utils/worldLand'

const props = defineProps<{ code: string }>()

/** Approximate airport lon/lat per currency code, plus KUL as origin. */
const GEO: Record<string, [number, number]> = {
  kul: [101.7, 3.1],
  jpy: [140.4, 35.8],
  krw: [126.5, 37.5],
  thb: [100.6, 13.7],
  idr: [106.7, -6.1],
  sgd: [103.8, 1.3],
  twd: [121.2, 25.1],
  cny: [116.6, 40.1],
  vnd: [106.7, 10.8],
  hkd: [114.0, 22.3],
  php: [121.0, 14.5],
  aed: [55.4, 25.3],
  sar: [39.2, 21.7],
  gbp: [-0.45, 51.5],
  eur: [2.55, 49.0],
  usd: [-73.8, 40.6],
  aud: [151.2, -33.9],
}

// Same equirectangular projection the land path was generated with.
const X = (lon: number): number => ((lon + 180) / 360) * 1000
const Y = (lat: number): number => ((90 - lat) / 180) * 500

const kul = { x: X(GEO.kul![0]), y: Y(GEO.kul![1]) }

const dots = DESTINATIONS.map(d => {
  const geo = GEO[d.code]!
  return { code: d.code, x: X(geo[0]), y: Y(geo[1]) }
})

const arcPath = computed(() => {
  const geo = GEO[props.code]
  if (!geo) return ''
  const to = { x: X(geo[0]), y: Y(geo[1]) }
  const lift = Math.min(70, Math.max(20, Math.hypot(to.x - kul.x, to.y - kul.y) * 0.22))
  const mid = { x: (kul.x + to.x) / 2, y: (kul.y + to.y) / 2 - lift }
  return `M${kul.x} ${kul.y} Q ${mid.x} ${mid.y} ${to.x} ${to.y}`
})

const maskEl = ref<SVGPathElement | null>(null)

function draw(): void {
  if (!maskEl.value || prefersReducedMotion()) return
  const length = maskEl.value.getTotalLength()
  gsap.fromTo(
    maskEl.value,
    { strokeDasharray: length, strokeDashoffset: length },
    { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' },
  )
}

onMounted(draw)
watch(arcPath, () => nextTick(draw))
</script>

<template>
  <!-- Crop to the region holding all 17 dots: lon -85..160, lat -45..65 -->
  <svg
    viewBox="264 69 680 306"
    preserveAspectRatio="xMidYMid slice"
    class="pointer-events-none absolute inset-0 h-full w-full"
    fill="none"
    aria-hidden="true"
  >
    <path :d="WORLD_LAND_PATH" fill-rule="evenodd" class="fill-pass-paper/8" />

    <circle
      v-for="d in dots"
      :key="d.code"
      :cx="d.x"
      :cy="d.y"
      :r="d.code === props.code ? 4.2 : 2.2"
      :class="d.code === props.code ? 'fill-lime' : 'fill-pass-paper/30'"
    />

    <circle :cx="kul.x" :cy="kul.y" r="3.2" class="fill-pass-paper/80" />
    <text :x="kul.x" :y="kul.y + 15" text-anchor="middle" class="fill-pass-paper/40 font-mono text-[10px]">KUL</text>

    <mask id="tm-hero-route" maskUnits="userSpaceOnUse">
      <path ref="maskEl" :d="arcPath" stroke="#fff" stroke-width="8" fill="none" />
    </mask>
    <g mask="url(#tm-hero-route)">
      <path :d="arcPath" class="stroke-lime/70" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="0.1 6" />
    </g>
  </svg>
</template>
