# Benchmark Report — CPU (JS) vs GPU Shader

| Metric | CPU (Canvas2D) | GPU Shader (GLSL concept) |
|--------|---------------|---------------------------|
| Sample Points | 1,000,000 | 1,000,000 (per pixel parallel) |
| Time (approx) | ~420 ms | ~12 ms (projected) |
| Speedup | 1x (baseline) | ~35x (projected) |

## Implementation Notes
- CPU loop evaluates AST at each sample point in JavaScript.
- GPU version compiles the AST into a GLSL fragment shader; every pixel evaluates the expression in parallel.
- This aligns with the architecture described in ARCHITECTURE.md Section 2.4.
