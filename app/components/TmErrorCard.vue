<script setup lang="ts">
const rates = useRates()
const lastAttempt = rates.lastAttempt
</script>

<template>
  <div class="max-w-[560px] rounded-2xl border border-negative/35 bg-card px-[26px] py-7">
    <div class="flex items-center gap-2">
      <span class="inline-block size-[7px] rounded-full bg-negative" />
      <span class="text-[15px] font-semibold">Rates did not load</span>
    </div>
    <p class="mt-2 text-[13.5px] leading-[1.55] text-ink/60 text-pretty">
      BNM's data service is not answering right now. Your last attempt was a moment ago.
    </p>
    <p v-if="lastAttempt" class="mt-[10px] font-mono text-[10.5px] text-ink/40">last attempt {{ fmtTimeMYT(lastAttempt) }}</p>
    <button
      type="button"
      class="mt-4 inline-flex h-11 cursor-pointer items-center justify-center rounded-[10px] bg-ink px-[22px] text-[13.5px] font-medium text-bg active:scale-[0.98]"
      @click="rates.load()"
    >
      Try again
    </button>
  </div>
</template>
