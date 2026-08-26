<template>
  <svg class="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
    <defs>
      <!-- 0: Dots -->
      <pattern id="pattern-dots" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="4" r="1" fill="currentColor" fill-opacity="0.18" />
      </pattern>

      <!-- 1: Diagonal Stripes -->
      <pattern id="pattern-stripes" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.18" />
      </pattern>

      <!-- 2: Waves -->
      <pattern id="pattern-waves" width="12" height="6" patternUnits="userSpaceOnUse">
        <path d="M 0 3 Q 3 0 6 3 T 12 3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.18" />
      </pattern>

      <!-- 3: Crosshatch -->
      <pattern id="pattern-crosshatch" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M 0 0 L 8 8 M 8 0 L 0 8" stroke="currentColor" stroke-width="1" stroke-opacity="0.18" />
      </pattern>

      <!-- 4: Zigzag -->
      <pattern id="pattern-zigzag" width="10" height="6" patternUnits="userSpaceOnUse">
        <path d="M 0 3 L 5 0 L 10 3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.18" />
      </pattern>

      <!-- 5: Rings -->
      <pattern id="pattern-rings" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="3.5" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.18" />
      </pattern>

      <!-- 6: Horizontal Lines -->
      <pattern id="pattern-horizontal" width="6" height="6" patternUnits="userSpaceOnUse">
        <line x1="0" y1="3" x2="6" y2="3" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.18" />
      </pattern>

      <!-- 7: Triangles -->
      <pattern id="pattern-triangles" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M 4 1 L 7 7 L 1 7 Z" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.18" />
      </pattern>

      <!-- 8: Grid -->
      <pattern id="pattern-grid" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="8" height="8" fill="none" stroke="currentColor" stroke-width="0.8" stroke-opacity="0.18" />
      </pattern>

      <!-- 9: Scales -->
      <pattern id="pattern-scales" width="10" height="8" patternUnits="userSpaceOnUse">
        <path d="M 0 4 A 5 4 0 0 0 10 4" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.18" />
      </pattern>

      <!-- 10: Stars -->
      <pattern id="pattern-stars" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 5 1 L 6 4 L 9 5 L 6 6 L 5 9 L 4 6 L 1 5 L 4 4 Z" fill="currentColor" fill-opacity="0.18" />
      </pattern>

      <!-- 11: Diamonds -->
      <pattern id="pattern-diamonds" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 5 0 L 10 5 L 5 10 L 0 5 Z" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.18" />
      </pattern>
    </defs>
  </svg>
</template>
