/**
 * Count-up used by the big hero rate: ~600ms cubic ease-out between values,
 * per the handoff. Server render shows the target directly; the first client
 * frame animates in from 92% of target, exactly like the prototype.
 */
export function useAnimatedNumber(target: () => number | null, duration = 600) {
  const display = ref<number | null>(target())
  let raf = 0

  function animate(from: number, to: number): void {
    cancelAnimationFrame(raf)
    const t0 = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const eased = 1 - (1 - p) ** 3
      display.value = from + (to - from) * eased
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }

  onMounted(() => {
    const to = target()
    if (to != null) animate(to * 0.92, to)
  })

  watch(target, (to) => {
    if (to == null) {
      display.value = null
    } else if (import.meta.client) {
      animate(display.value ?? to * 0.92, to)
    } else {
      display.value = to
    }
  })

  onUnmounted(() => cancelAnimationFrame(raf))

  return display
}
