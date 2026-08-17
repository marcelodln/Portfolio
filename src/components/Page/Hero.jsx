import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";
import InteractiveHoverButton from "../UI/InteractiveHoverButton.jsx";

const CONFIG = {
  colors: ["#ffffff", "#bfdbfe", "#aacefa"], // Tonos azules para las estrellas
  count: 1500,
  spread: 15.5,
  speed: 0.01,
  maxSize: 400,
  hoverFactor: 0.1,
  followFactor: 0.02,
  planetParallaxFactor: 0.008,
  alpha: false,
  baseSize: 200,
  sizeRandomness: 1,
  cameraDistance: 25,
  pixelRatio: 3,
};

// 1. AJUSTES DE PLANETAS BASADOS EN TUS REFERENCIAS
const PLANETS = [
  {
    size: "35vw", // Ligeramente más grande para dar protagonismo
    maxSize: 850,
    bottom: "0%",
    left: "70%",
    // Un degradado radial que simula el rebote de luz azul en la curvatura
    core: "radial-gradient(circle at 30% 20%, #0c1a3a 0%, #02040d 50%, #000000 100%)",
    rim: "#54eded", // Azul cielo vibrante
    rimFrom: "320deg", // Luz viene de arriba a la izquierda
    atmosphere: "radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 65%)",
  },
  {
    size: "20vw",
    maxSize: 650,
    bottom: "0%",
    right: "80%",
    // Degradado radial oscuro
    core: "radial-gradient(circle at 70% 20%, #0a1930 0%, #02040d 50%, #000000 100%)",
    rim: "#3a7bb7", // Azul suave
    rimFrom: "40deg", // Luz viene de arriba a la derecha
    atmosphere: "radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 65%)",
  },
];

// 2. SUAVIZAR LA MÁSCARA ANGULAR
const buildLimbMask = (centerDeg) => {
  const center = parseFloat(centerDeg);
  const from = center - 180;
  // Ampliamos el rango de los 'transparent' para un degradado más suave en las esquinas
  return `conic-gradient(from ${from}deg at center,
    transparent 0deg,
    transparent 100deg,
    white 180deg,
    transparent 260deg,
    transparent 360deg)`;
};

// Clase base para la atmósfera (quitamos el color fijo de Tailwind para hacerlo dinámico)
const ATMOSPHERE_BASE_CLASSES =
  "absolute -inset-[25%] rounded-full blur-3xl opacity-70";

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
    pos.z *= 1.5;

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

  const float STAR_SHARPNESS = 0.45;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    vec2 centered = uv - vec2(0.5);
    float angle = atan(centered.y, centered.x);
    float starRadius = pow(pow(abs(cos(angle)), STAR_SHARPNESS) + pow(abs(sin(angle)), STAR_SHARPNESS), -1.0 / STAR_SHARPNESS);
    float d = length(centered) / starRadius;

    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor, 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor, circle);
    }
  }
`;

export default function Hero() {
  const reduced = useReducedMotion();
  const containerRef = useRef(null);
  const planetsRef = useRef([]);
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
    gl.canvas.style.position = "absolute";
    gl.canvas.style.inset = "0";
    gl.canvas.style.zIndex = "0";
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, CONFIG.cameraDistance);

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
      vw = window.innerWidth;
      vh = window.innerHeight;
    };
    window.addEventListener("resize", resize, false);
    resize();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

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
      follow.x += (mouseRef.current.x - follow.x) * CONFIG.followFactor;
      follow.y += (mouseRef.current.y - follow.y) * CONFIG.followFactor;

      particles.position.x = -follow.x * CONFIG.hoverFactor;
      particles.position.y = -follow.y * CONFIG.hoverFactor;
      planetsRef.current.forEach((el) => {
        if (el) {
          el.style.transform = `translate3d(${-follow.x * CONFIG.planetParallaxFactor * vw}px, ${-follow.y * CONFIG.planetParallaxFactor * vh}px, 0)`;
        }
      });

      particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
      particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
      particles.rotation.z += 0.01 * CONFIG.speed;

      renderer.render({ scene: particles, camera });
    };

    if (!reduced) {
      animationFrameId = requestAnimationFrame(update);
    } else {
      planetsRef.current.forEach((el) => {
        if (el) el.style.transform = "";
      });
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      container.removeChild(gl.canvas);
    };
  }, [reduced]);

  return (
    <section
      id="hero"
      className="relative w-full min-h-[90vh] flex flex-col items-start justify-center px-20 sm:px-28 lg:px-36 overflow-hidden bg-[#02040D]" // Fondo base azul oscuro
    >
      <div className="pointer-events-none absolute inset-0 z-50 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
            }}
      />
      <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0" />

      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
        {PLANETS.map((planet, i) => (
          <div
            key={i}
            ref={(el) => {
              planetsRef.current[i] = el;
              return () => {
                planetsRef.current[i] = null;
              };
            }}
            className="absolute rounded-full"
            style={{
              width: `min(${planet.size}, ${planet.maxSize}px)`,
              height: `min(${planet.size}, ${planet.maxSize}px)`,
              top: planet.top,
              right: planet.right,
              bottom: planet.bottom,
              left: planet.left,
            }}
          >
            {/* Halo atmosférico grande y dinámico en color */}
            <div 
              className={ATMOSPHERE_BASE_CLASSES} 
              style={{ background: planet.atmosphere }} 
            />

            {/* Cuerpo del planeta con volumen 3D */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: planet.core }}
            />

            {/* 3. Limb glow: Ampliado y suavizado */}
            <div
              className="absolute inset-0 rounded-full blur-[4px]"
              style={{
                background: `radial-gradient(circle closest-side at center, transparent 0%, transparent 88%, ${planet.rim} 98%, transparent 100%)`,
                maskImage: buildLimbMask(planet.rimFrom),
                WebkitMaskImage: buildLimbMask(planet.rimFrom),
              }}
            />

            {/* Bloom exterior expansivo */}
            <div
              className="absolute -inset-[8%] rounded-full blur-[20px] opacity-80"
              style={{
                background: `radial-gradient(circle closest-side at center, transparent 0%, transparent 80%, ${planet.rim} 96%, transparent 100%)`,
                maskImage: buildLimbMask(planet.rimFrom),
                WebkitMaskImage: buildLimbMask(planet.rimFrom),
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-[650px] w-full">
        <h1 className="font-poppins text-6xl sm:text-7xl font-semibold tracking-tight text-gray-100 mb-6 leading-[1.15]">
          Portfolio{" "}
          <span className="font-medium text-blue-400">React.</span>
        </h1>

        <p className="font-poppins text-lg text-gray-300 max-w-[450px] mb-14 leading-relaxed font-normal">
          This portfolio is still under development.
        </p>

        <div className="flex items-center gap-10">
          <InteractiveHoverButton text="View work" />
          <InteractiveHoverButton text="Contact me" />
        </div>
      </div>
    </section>
  );
}