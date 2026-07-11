import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-11',
  typescript: { strict: true },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  nitro: { preset: 'cloudflare-pages' },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Trip Money · see what your ringgit is really worth',
      meta: [
        {
          name: 'description',
          content:
            'See what your ringgit is really worth at your destination, and where it is worth the most, using official BNM rates.',
        },
        { name: 'theme-color', content: '#faf9f4' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },
})
