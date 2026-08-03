import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";

const CONFIG = {
  colors: ["#93C5FD", "#60A5FA", "#3B82F6"],
  count: 400,
  spread: 7,
  speed: 0.12,
  hoverFactor: 0.8,
  alpha: true,
  baseSize: 80,
  sizeRandomness: 0.8,
  cameraDistance: 20,
  pixelRatio: 1,
};

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(hex.slice(0, 6), 16);
  return [
    ((int >> 16) & 255) / 255,
    ((int >> 8) & 255) / 255,
    (int & 255) / 255,
  ];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread;
    pos.z *= 10.0;

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));

    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

export default function Hero() {
  const reduced = useReducedMotion();
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const followRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: CONFIG.pixelRatio,
      depth: false,
      alpha: true,
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, CONFIG.cameraDistance);

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener("resize", resize, false);
    resize();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    if (!reduced) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    const count = reduced ? 0 : CONFIG.count;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      let x, y, z, len;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set(
        [Math.random(), Math.random(), Math.random(), Math.random()],
        i * 4
      );
      colors.set(
        hexToRgb(CONFIG.colors[(Math.random() * CONFIG.colors.length) | 0]),
        i * 3
      );
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: CONFIG.spread },
        uBaseSize: { value: CONFIG.baseSize * CONFIG.pixelRatio },
        uSizeRandomness: { value: CONFIG.sizeRandomness },
        uAlphaParticles: { value: CONFIG.alpha ? 1 : 0 },
      },
      transparent: true,
      depthTest: false,
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId;
    let lastTime = performance.now();
    let elapsed = 0;

    const update = (t) => {
      animationFrameId = requestAnimationFrame(update);
      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * CONFIG.speed;

      program.uniforms.uTime.value = elapsed * 0.001;

      const follow = followRef.current;
      follow.x += (mouseRef.current.x - follow.x) * 0.05;
      follow.y += (mouseRef.current.y - follow.y) * 0.05;

      if (!reduced) {
        particles.position.x = -follow.x * CONFIG.hoverFactor;
        particles.position.y = -follow.y * CONFIG.hoverFactor;
      } else {
        particles.position.x = 0;
        particles.position.y = 0;
        follow.x = 0;
        follow.y = 0;
      }

      particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
      particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
      particles.rotation.z += 0.01 * CONFIG.speed;

      renderer.render({ scene: particles, camera });
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      container.removeChild(gl.canvas);
    };
  }, [reduced]);

  return (
    <section
      id="hero"
      className="relative w-full min-h-[90vh] flex flex-col items-start justify-center px-20 sm:px-28 lg:px-36 overflow-hidden bg-white"
    >
      <div ref={containerRef} className="pointer-events-none absolute inset-0" />

      <div className="relative z-10 max-w-[650px] w-full">
        <h1 style={{fontFamily: "'Poppins', sans-serif"}} className="text-6xl sm:text-7xl font-semibold tracking-tight text-gray-800 mb-6 leading-[1.15]">
          Minimalist{" "}
          <span className="font-medium text-blue-700">Design.</span>
        </h1>

        <p style={{fontFamily: "'Poppins', sans-serif"}} className="text-lg text-gray-400 max-w-[450px] mb-14 leading-relaxed font-normal">
          Crafting digital experiences with precision, elegance, and modern
          simplicity.
        </p>

        <div className="flex items-center gap-10">
          <button className="px-10 py-4 rounded-full border border-gray-900 font-mono text-base text-gray-900 hover:bg-gray-900 hover:text-white transition-colors cursor-pointer">
            View work
          </button>
          <a href="#" className="font-mono text-base text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
            Contact me
          </a>
        </div>
      </div>
    </section>
  );
}