<template>
  <!-- Forest band bookending the hero; credit row separated from the honesty
       lines by a hairline. -->
  <footer class="mt-14 bg-pass-panel">
    <div class="mx-auto max-w-[1440px] px-5 py-9 desk:px-16">
      <div class="flex flex-col items-baseline justify-between gap-2 desk:flex-row desk:gap-6">
        <div class="text-[13px] text-pass-paper/75">
          Built by Qie ·
          <a
            href="https://axelnovaventures.com"
            target="_blank"
            rel="noopener"
            class="underline decoration-pass-paper/30 underline-offset-2 [transition:color_150ms_ease] hover:text-lime"
          >Axel Nova Ventures</a>
        </div>
        <div class="font-mono text-[10.5px] text-pass-paper/50">Rates: BNM via data.gov.my (PasarAPI.xyz)</div>
      </div>

      <div class="mt-5 flex flex-col items-baseline justify-between gap-2 border-t border-pass-paper/12 pt-5 desk:flex-row desk:gap-6">
        <div class="text-[12px] text-pass-paper/55 text-pretty">BNM middle rate. Money changers will quote slightly different rates.</div>
        <div class="text-[12px] text-pass-paper/55 text-pretty">Historical comparison only, not financial advice.</div>
      </div>
    </div>
  </footer>
</template>
