#include <cuda_runtime.h>
#include <math.h>

__global__ void evaluatePoints(float* x, float* y, float* out, int n) {
  int idx = blockIdx.x * blockDim.x + threadIdx.x;
  if (idx < n) {
    out[idx] = sinf(x[idx]) + cosf(y[idx]);
  }
}
