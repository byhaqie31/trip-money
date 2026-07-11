<script setup lang="ts">
import { DESTINATIONS } from '~~/config/destinations'

const { selectedCode, select } = useTrip()
</script>

<template>
  <div class="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 pt-1 desk:mx-0 desk:max-w-[1100px] desk:flex-wrap desk:gap-[9px] desk:overflow-visible desk:px-0">
    <button
      v-for="d in DESTINATIONS"
      :key="d.code"
      type="button"
      class="flex flex-none cursor-pointer select-none items-center gap-[7px] rounded-full border px-[15px] py-[10px] [transition:transform_120ms_ease,background-color_150ms_ease] active:scale-[0.97]"
      :class="d.code === selectedCode ? 'border-ink bg-ink text-bg' : 'border-ink/14 bg-card text-ink'"
      @click="select(d.code)"
    >
      <span class="text-[14px]">{{ d.flag }}</span>
      <span class="text-[13px] font-medium">{{ d.city }}</span>
      <span class="font-mono text-[10.5px] opacity-55">{{ d.cur }}</span>
    </button>
  </div>
</template>
