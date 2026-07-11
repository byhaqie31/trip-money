<script setup lang="ts">
const { destination } = useTrip()
</script>

<template>
  <section class="max-w-[900px] px-5 pb-[26px] pt-10 desk:px-16 desk:pt-16">
    <p class="mb-3 font-mono text-[12px] text-ink/50">berapa rate hari ni?</p>
    <h1 class="font-display text-[36px] font-semibold leading-[1.12] tracking-[-0.02em] text-pretty desk:text-[60px]">
      Your ringgit, translated for
      <span class="rounded-[8px] bg-lime px-[10px] text-lime-ink [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">{{ destination.city }}</span>
    </h1>
  </section>
</template>
