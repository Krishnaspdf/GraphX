export default class ShaderCompiler {
  static compile(expr) {
    // Convert JS-like expression to GLSL-style fragment shader code
    let glsl = expr
      .replace(/sin/g, 'sin')
      .replace(/cos/g, 'cos')
      .replace(/tan/g, 'tan')
      .replace(/exp/g, 'exp')
      .replace(/log/g, 'log')
      .replace(/sqrt/g, 'sqrt')
      .replace(/abs/g, 'abs')
      .replace(/\^/g, 'pow');

    const shaderCode = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float expression(float x, float y) {
  return ${glsl.replace(/x/g, 'x').replace(/y/g, 'y')};
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float value = expression(uv.x * 10.0 - 5.0, uv.y * 10.0 - 5.0);
  gl_FragColor = vec4(value * 0.5 + 0.5, 0.3 + value * 0.2, 0.8, 1.0);
}
`;
    return shaderCode.trim();
  }

  static compileToWGSL(expr) {
    return `
fn evaluate(x: f32, y: f32) -> f32 {
  return ${expr.replace(/\^/g, 'pow').replace(/sin/g, 'sin').replace(/cos/g, 'cos')};
}
`;
  }
}
