<template>
  <div class="grid max-w-[1440px] grid-cols-1 items-start gap-[18px] px-5 pt-[30px] desk:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] desk:gap-6 desk:px-16">
    <div class="flex flex-col gap-[18px]">
      <div class="rounded-card border border-ink/8 bg-card px-[30px] py-8">
        <div class="skeleton h-3 w-[90px] rounded-[6px]" />
        <div class="skeleton mt-5 h-16 w-[230px] rounded-input" />
        <div class="skeleton mt-[18px] h-[11px] w-[170px] rounded-[6px]" />
      </div>
      <div class="rounded-card border border-ink/8 bg-card px-[30px] py-8">
        <div class="skeleton h-3 w-[70px] rounded-[6px]" />
        <div class="skeleton mt-5 h-[130px] rounded-input" />
      </div>
    </div>
    <div class="rounded-card border border-ink/8 bg-card px-[30px] py-8">
      <div class="skeleton h-[200px] rounded-input" />
    </div>
  </div>
</template>
