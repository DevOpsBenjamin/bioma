<template>
  <svg
    viewBox="0 0 48 48"
    class="w-[78%] h-[78%] max-w-[42px] max-h-[42px] drop-shadow-[0_2px_8px_rgba(16,185,129,0.5)] transition-all duration-300 transform scale-100 hover:scale-105 active:scale-95 animate-spring-tree"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Tronc -->
    <path
      d="M22 36H26V42C26 42.5523 25.5523 43 25 43H23C22.4477 43 22 42.5523 22 42V36Z"
      fill="#d97706"
      stroke="#b45309"
      stroke-width="1.2"
    />
    <!-- Étage inférieur -->
    <path
      d="M10 36L24 23L38 36C38 36 32 34 24 34C16 34 10 36 10 36Z"
      fill="url(#treeGradLower)"
      stroke="#34d399"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <!-- Étage moyen -->
    <path
      d="M14 26L24 15L34 26C34 26 29 24.5 24 24.5C19 24.5 14 26 14 26Z"
      fill="url(#treeGradMid)"
      stroke="#6ee7b7"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <!-- Étage supérieur (cime) -->
    <path
      d="M18 17L24 7L30 17C30 17 27 15.8 24 15.8C21 15.8 18 17 18 17Z"
      fill="url(#treeGradTop)"
      stroke="#a7f3d0"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <!-- Étoile d'harmonie au sommet -->
    <circle cx="24" cy="7" r="1.8" fill="#fef08a" />

    <defs>
      <linearGradient id="treeGradLower" x1="24" y1="23" x2="24" y2="36" gradientUnits="userSpaceOnUse">
        <stop stop-color="#10b981" />
        <stop offset="1" stop-color="#047857" />
      </linearGradient>
      <linearGradient id="treeGradMid" x1="24" y1="15" x2="24" y2="26" gradientUnits="userSpaceOnUse">
        <stop stop-color="#34d399" />
        <stop offset="1" stop-color="#059669" />
      </linearGradient>
      <linearGradient id="treeGradTop" x1="24" y1="7" x2="24" y2="17" gradientUnits="userSpaceOnUse">
        <stop stop-color="#6ee7b7" />
        <stop offset="1" stop-color="#10b981" />
      </linearGradient>
    </defs>
  </svg>
</template>

<style scoped>
@keyframes springTree {
  0% {
    transform: scale(0.3) translateY(8px);
    opacity: 0;
  }
  60% {
    transform: scale(1.15) translateY(-2px);
    opacity: 1;
  }
  80% {
    transform: scale(0.95) translateY(1px);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.animate-spring-tree {
  animation: springTree 280ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
