<script setup lang="ts">
const { status } = useRates()
</script>

<template>
  <!-- Committed lime band, Wise-style: the one loud moment before the calm page. -->
  <header class="bg-lime">
    <div class="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 desk:px-16">
      <div class="flex items-center gap-[10px]">
        <!-- logomark: same mark as the favicon -->
        <svg viewBox="0 0 64 64" class="size-[28px]" aria-hidden="true">
          <rect width="64" height="64" rx="14" class="fill-ink" />
          <path d="M54 12 15 25.5l10.6 5.1L48 17 29.8 33.4l1.9 12.1 5.6-8.2 9.5 4.4z" class="fill-lime" />
          <circle cx="17" cy="47" r="9" class="fill-lime" />
          <circle cx="17" cy="47" r="4.6" fill="none" class="stroke-ink" stroke-width="2.4" />
        </svg>
        <span class="font-display text-[20px] font-semibold tracking-[-0.01em] text-lime-ink">Trip Money</span>
      </div>

      <div class="inline-flex items-center gap-2 rounded-full border border-lime-ink/25 px-3 py-[6px]">
        <span class="inline-block size-[6px] rounded-full" :class="status === 'error' ? 'bg-negative' : 'bg-lime-ink'" />
        <span class="font-mono text-[10px] uppercase tracking-[0.08em] text-lime-ink/70">rates by BNM</span>
      </div>
    </div>
  </header>
</template>
