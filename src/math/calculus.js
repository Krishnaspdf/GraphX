export function numericalDiff(f, x, h = 1e-4) {
  return (f(x + h) - f(x - h)) / (2 * h);
}

export function numericalIntegrate(f, a, b, n = 500) {
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    sum += 2 * f(a + i * h);
  }
  return (sum * h) / 2;
}

export function bisectionRoot(f, a, b, tol = 1e-5, maxIter = 50) {
  let fa = f(a), fb = f(b);
  if (fa * fb > 0) throw new Error('Root not bracketed');
  for (let i = 0; i < maxIter; i++) {
    const c = (a + b) / 2;
    const fc = f(c);
    if (Math.abs(fc) < tol || (b - a) / 2 < tol) return c;
    if (fa * fc < 0) { b = c; fb = fc; } else { a = c; fa = fc; }
  }
  return (a + b) / 2;
}
