<script setup lang="ts">
const { status } = useRates()
</script>

<template>
  <header class="flex items-center justify-between px-5 pt-[26px] desk:px-16">
    <div class="flex items-center gap-[10px]">
      <!-- logomark: same lime boarding pass as the favicon -->
      <svg viewBox="0 0 64 64" class="size-[26px]" aria-hidden="true">
        <rect width="64" height="64" rx="14" class="fill-ink" />
        <rect x="10" y="20" width="44" height="24" rx="5" class="fill-lime" />
        <circle cx="17" cy="32" r="2.2" class="fill-lime-ink" />
        <path d="M20.5 32h11" class="stroke-lime-ink" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="2.6 2.2" fill="none" />
        <path d="M33 28.6 37.4 32 33 35.4z" class="fill-lime-ink" />
        <circle cx="42" cy="20" r="3.4" class="fill-ink" />
        <circle cx="42" cy="44" r="3.4" class="fill-ink" />
        <rect x="46.5" y="26.5" width="2" height="11" rx="0.8" class="fill-lime-ink" />
        <rect x="50.2" y="26.5" width="1.4" height="11" rx="0.7" class="fill-lime-ink" />
      </svg>
      <span class="font-display text-[20px] font-semibold tracking-[-0.01em]">Trip Money</span>
    </div>

    <div class="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-card px-3 py-[6px]">
      <span class="inline-block size-[6px] rounded-full" :class="status === 'error' ? 'bg-negative' : 'bg-positive'" />
      <span class="font-mono text-[10px] uppercase tracking-[0.08em] text-ink/45">rates by BNM</span>
    </div>
  </header>
</template>
