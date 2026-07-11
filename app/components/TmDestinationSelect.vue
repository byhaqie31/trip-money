<script setup lang="ts">
// Custom dropdown (combobox + listbox pattern), not the browser select.
// Focus stays on the trigger; arrows move the highlight, Enter commits,
// Escape closes, focus leaving the component closes it.
import { DESTINATIONS } from '~~/config/destinations'

const { selectedCode, destination, select } = useTrip()

const open = ref(false)
const highlighted = ref(0)
const rootEl = ref<HTMLElement | null>(null)
const listEl = ref<HTMLElement | null>(null)

function openList(): void {
  open.value = true
  highlighted.value = Math.max(0, DESTINATIONS.findIndex(d => d.code === selectedCode.value))
  nextTick(() => scrollHighlightedIntoView())
}

function close(): void {
  open.value = false
}

function choose(code: string): void {
  select(code)
  close()
}

function moveHighlight(delta: number): void {
  if (!open.value) return openList()
  const count = DESTINATIONS.length
  highlighted.value = (highlighted.value + delta + count) % count
  scrollHighlightedIntoView()
}

function scrollHighlightedIntoView(): void {
  listEl.value?.children[highlighted.value]?.scrollIntoView({ block: 'nearest' })
}

function onKeydown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'ArrowDown': event.preventDefault(); moveHighlight(1); break
    case 'ArrowUp': event.preventDefault(); moveHighlight(-1); break
    case 'Home': if (open.value) { event.preventDefault(); highlighted.value = 0; scrollHighlightedIntoView() } break
    case 'End': if (open.value) { event.preventDefault(); highlighted.value = DESTINATIONS.length - 1; scrollHighlightedIntoView() } break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (open.value) choose(DESTINATIONS[highlighted.value]!.code)
      else openList()
      break
    case 'Escape': close(); break
  }
}

function onFocusout(event: FocusEvent): void {
  if (!rootEl.value?.contains(event.relatedTarget as Node)) close()
}
</script>

<template>
  <div ref="rootEl" class="relative" @focusout="onFocusout">
    <button
      type="button"
      role="combobox"
      aria-label="Choose your destination"
      :aria-expanded="open"
      aria-haspopup="listbox"
      aria-controls="tm-destination-list"
      :aria-activedescendant="open ? `tm-option-${DESTINATIONS[highlighted]!.code}` : undefined"
      class="flex w-full cursor-pointer items-center gap-3 rounded-input border-[1.5px] border-ink/16 bg-bg px-4 py-3 text-left transition-colors focus:border-ink focus:outline-none"
      @click="open ? close() : openList()"
      @keydown="onKeydown"
    >
      <span class="text-[16px] leading-none">{{ destination.flag }}</span>
      <span class="min-w-0 flex-1 truncate text-[15px] font-medium">{{ destination.city }}</span>
      <span class="font-mono text-[11px] text-ink/55">{{ destination.cur }} · {{ destination.airport }}</span>
      <svg viewBox="0 0 16 16" class="size-4 flex-none transition-transform duration-150" :class="open && 'rotate-180'" fill="none" aria-hidden="true">
        <path d="M4 6.5 8 10.5 12 6.5" class="stroke-ink/55" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="-translate-y-1 opacity-0"
      leave-active-class="transition duration-75 ease-in"
      leave-to-class="-translate-y-1 opacity-0"
    >
      <ul
        v-show="open"
        id="tm-destination-list"
        ref="listEl"
        role="listbox"
        aria-label="Destinations"
        class="absolute inset-x-0 top-full z-20 mt-2 max-h-[320px] overflow-y-auto rounded-input border border-ink/8 bg-card py-1 [box-shadow:0_12px_32px_color-mix(in_oklab,var(--color-ink)_14%,transparent)]"
      >
        <li
          v-for="(d, i) in DESTINATIONS"
          :id="`tm-option-${d.code}`"
          :key="d.code"
          role="option"
          :aria-selected="d.code === selectedCode"
          class="flex cursor-pointer items-center gap-3 px-4 py-[10px]"
          :class="[i === highlighted ? 'bg-bg' : '', d.code === selectedCode ? 'font-medium' : '']"
          @mouseenter="highlighted = i"
          @mousedown.prevent
          @click="choose(d.code)"
        >
          <span class="text-[15px] leading-none">{{ d.flag }}</span>
          <span class="min-w-0 flex-1 truncate text-[14px]">{{ d.city }}</span>
          <span class="font-mono text-[10.5px] text-ink/55">{{ d.cur }} · {{ d.airport }}</span>
          <span v-if="d.code === selectedCode" class="size-[6px] rounded-full bg-positive" />
        </li>
      </ul>
    </Transition>
  </div>
</template>
