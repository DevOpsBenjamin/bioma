<template>
  <svg
    viewBox="0 0 36 36"
    class="w-[58%] h-[58%] max-w-[32px] max-h-[32px] opacity-75 animate-fade-root text-emerald-400/80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Entrelacs racinaires -->
    <path
      d="M18 6C18 12 14 16 10 18M18 6C18 13 22 17 26 18M18 18V30M18 22C14 25 11 27 8 28M18 24C22 26 25 28 28 29"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Petite feuille / pousse en germination -->
    <circle cx="18" cy="6" r="2.2" fill="currentColor" fill-opacity="0.9" />
  </svg>
</template>

<style scoped>
@keyframes fadeRoot {
  0% {
    opacity: 0;
    transform: scale(0.6);
  }
  100% {
    opacity: 0.75;
    transform: scale(1);
  }
}

.animate-fade-root {
  animation: fadeRoot 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
