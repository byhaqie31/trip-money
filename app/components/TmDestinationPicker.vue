<script setup lang="ts">
// Destination picker as a dropdown in a card box (replaced the chip row).
// Native select keeps it accessible and great on phones.
import { DESTINATIONS } from '~~/config/destinations'

const { selectedCode, select } = useTrip()

function onChange(event: Event): void {
  select((event.target as HTMLSelectElement).value)
}
</script>

<template>
  <div class="rounded-card border border-ink/8 bg-card px-[30px] py-6">
    <div class="flex flex-col gap-3 desk:flex-row desk:items-center desk:justify-between">
      <label for="tm-destination" class="text-[13px] font-normal tracking-[0.02em] text-ink/55">
        Choose your destination
      </label>
      <div class="relative desk:w-[340px]">
        <select
          id="tm-destination"
          :value="selectedCode"
          class="w-full cursor-pointer appearance-none rounded-input border-[1.5px] border-ink/16 bg-bg py-3 pl-4 pr-11 text-[15px] font-medium text-ink outline-none transition-colors focus:border-ink"
          @change="onChange"
        >
          <option v-for="d in DESTINATIONS" :key="d.code" :value="d.code">
            {{ d.flag }} {{ d.city }} · {{ d.cur }} · {{ d.airport }}
          </option>
        </select>
        <svg viewBox="0 0 16 16" class="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2" fill="none" aria-hidden="true">
          <path d="M4 6.5 8 10.5 12 6.5" class="stroke-ink/55" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
  </div>
</template>
