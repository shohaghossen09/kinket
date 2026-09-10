"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Shaders                                                            */
/* ------------------------------------------------------------------ */

const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
    + i.y+vec4(0.0,i1.y,i2.y,1.0))
    + i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const SCULPTURE_VERT = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
varying float vNoise;
varying vec3 vNormalV;
varying vec3 vViewDirV;
${SIMPLEX}
void main(){
  float t = uTime * 0.32;
  float n1 = snoise(position * uFreq + vec3(t, t * 0.8, -t * 0.6));
  float n2 = snoise(position * uFreq * 2.4 - vec3(t * 1.4, -t, t * 0.7)) * 0.34;
  float disp = (n1 + n2) * uAmp;
  vNoise = n1 + n2;
  vec3 pos = position + normal * disp;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vViewDirV = normalize(-mv.xyz);
  vNormalV = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}`;

const SCULPTURE_FRAG = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
varying float vNoise;
varying vec3 vNormalV;
varying vec3 vViewDirV;
void main(){
  vec3 N = normalize(vNormalV);
  vec3 V = normalize(vViewDirV);
  float fresnel = pow(1.0 - max(dot(V, N), 0.0), 2.2);

  vec3 deep  = vec3(0.055, 0.055, 0.066);
  vec3 amber = vec3(1.000, 0.760, 0.295);
  vec3 coral = vec3(1.000, 0.415, 0.240);
  vec3 rose  = vec3(0.910, 0.365, 0.460);

  float n = smoothstep(-0.65, 0.95, vNoise);
  vec3 col = mix(deep, amber * 0.85, n * 0.9);
  col = mix(col, coral, smoothstep(0.22, 0.85, fresnel * 0.75 + n * 0.35));
  col = mix(col, rose, pow(fresnel, 1.5));

  // slow energy pulse travelling across the surface
  float band = sin(vNoise * 5.0 + uTime * 0.7) * 0.5 + 0.5;
  col += amber * band * band * 0.05;

  // soft facing light
  float core = pow(max(dot(V, N), 0.0), 3.0);
  col += vec3(0.10, 0.09, 0.11) * core;

  gl_FragColor = vec4(col, uOpacity);
}`;

const PARTICLES_VERT = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixelRatio;
uniform float uWarp;
varying vec3 vColor;
varying float vTwinkle;
void main(){
  vColor = aColor;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float tw = sin(uTime * 1.5 + aPhase);
  vTwinkle = 0.55 + 0.45 * tw;
  gl_PointSize = aSize * uPixelRatio * (150.0 / -mv.z) * (0.82 + 0.18 * tw) * (1.0 + uWarp * 1.15);
  gl_Position = projectionMatrix * mv;
}`;

const PARTICLES_FRAG = /* glsl */ `
uniform float uOpacity;
varying vec3 vColor;
varying float vTwinkle;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.04, d);
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(vColor, alpha * vTwinkle * uOpacity);
}`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface SceneApi {
  enter: () => void;
  dispose: () => void;
}

/**
 * Hero WebGL scene — a continuously morphing "liquid light" sculpture.
 *
 * - Icosahedron displaced by layered simplex noise (custom ShaderMaterial),
 *   fresnel-lit in the studio's amber → coral → rose spectrum.
 * - Gyroscope wire cage + two orbit rings counter-rotating around it.
 * - ~2600-point galaxy (soft round additive particles) with per-point twinkle.
 * - GSAP: entrance dolly (camera z 11 → 6.2, amplitude ramp) once the
 *   preloader finishes; ScrollTrigger scrubs camera pull-back + tilt while
 *   the hero scrolls away. Mouse parallax with damped lerp.
 * - Always animating (time-driven), paused off-screen / on hidden tabs,
 *   single static frame under prefers-reduced-motion, full disposal on unmount.
 */
export function HeroScene({ ready, className }: { ready: boolean; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<SceneApi | null>(null);

  /* ---------------- scene bootstrap (once) ---------------- */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // no WebGL — CSS gradient fallback stays visible behind
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    const world = new THREE.Group(); // everything rotates/tilts together
    scene.add(world);

    /* --- sculpture --- */
    const detail = isMobile ? 28 : 56;
    const sculptureGeo = new THREE.IcosahedronGeometry(1.9, detail);
    const sculptureMat = new THREE.ShaderMaterial({
      vertexShader: SCULPTURE_VERT,
      fragmentShader: SCULPTURE_FRAG,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 0 },
        uFreq: { value: 0.62 },
        uOpacity: { value: 1 },
      },
    });
    const sculpture = new THREE.Mesh(sculptureGeo, sculptureMat);
    world.add(sculpture);

    /* --- wire cage --- */
    const cageGeo = new THREE.IcosahedronGeometry(2.85, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xffc24b,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    world.add(cage);

    /* --- gyroscope rings --- */
    const ringMatA = new THREE.MeshBasicMaterial({
      color: 0xff6a3d,
      transparent: true,
      opacity: 0,
    });
    const ringMatB = new THREE.MeshBasicMaterial({
      color: 0xe85d75,
      transparent: true,
      opacity: 0,
    });
    const ringGeo = new THREE.TorusGeometry(3.35, 0.0075, 8, 160);
    const ringA = new THREE.Mesh(ringGeo, ringMatA);
    ringA.rotation.set(Math.PI / 2.6, 0.4, 0);
    const ringB = new THREE.Mesh(ringGeo, ringMatB);
    ringB.rotation.set(-Math.PI / 3.1, -0.6, 0.8);
    world.add(ringA, ringB);

    /* --- particle galaxy --- */
    const COUNT = isMobile ? 1300 : 2600;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    const palette = [
      new THREE.Color(0xf4f3ef), // bone
      new THREE.Color(0xffc24b), // amber
      new THREE.Color(0xff6a3d), // coral
      new THREE.Color(0xe85d75), // rose
    ];
    for (let i = 0; i < COUNT; i++) {
      const disc = i < COUNT * 0.62;
      if (disc) {
        // flattened orbiting disc around the sculpture
        const r = 2.7 + Math.random() * 3.1;
        const a = Math.random() * Math.PI * 2;
        positions[i * 3] = Math.cos(a) * r;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1.5 * (1 - (r - 2.7) / 4);
        positions[i * 3 + 2] = Math.sin(a) * r;
      } else {
        // outer halo sphere for depth
        const r = 5.5 + Math.random() * 5.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.cos(phi) * 0.72;
        positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      const c = palette[Math.random() < 0.55 ? 0 : 1 + Math.floor(Math.random() * 3)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = 0.5 + Math.random() * 2.1;
      phases[i] = Math.random() * Math.PI * 2;
    }
    const galaxyGeo = new THREE.BufferGeometry();
    galaxyGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    galaxyGeo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    galaxyGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    galaxyGeo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    const galaxyMat = new THREE.ShaderMaterial({
      vertexShader: PARTICLES_VERT,
      fragmentShader: PARTICLES_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uOpacity: { value: 0 },
        uWarp: { value: 0 },
      },
    });
    const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
    world.add(galaxy);

    /* --- animation state (mutated by GSAP + events, read by RAF) --- */
    const state = {
      time: 0,
      amp: 0,
      camZ: 11,
      particles: 0,
      cageOpacity: 0,
      ringOpacity: 0,
      scroll: 0,
      mouseX: 0,
      mouseY: 0,
      curX: 0,
      curY: 0,
      running: true,
      inView: true,
      entered: false,
    };

    /* --- renderer setup --- */
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    galaxyMat.uniforms.uPixelRatio.value = dpr;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* --- render loop --- */
    let lastTime = performance.now();
    let rafId = 0;

    const renderFrame = (dt: number) => {
      if (!reduced) state.time += dt;

      // continuous motion — the scene is always alive
      const s = state.scroll; // 0 → 1 across the pinned hero sequence
      world.rotation.y += dt * (0.1 + s * 0.55);
      sculpture.rotation.y -= dt * 0.05;
      cage.rotation.y += dt * 0.03;
      cage.rotation.x -= dt * 0.012;
      ringA.rotation.z += dt * (0.22 + s * 0.5);
      ringB.rotation.z -= dt * (0.16 + s * 0.4);
      galaxy.rotation.y += dt * (0.016 + s * 0.3);

      // breathing + warp expansion as the camera dives through
      const breathe = 1 + Math.sin(state.time * 0.55) * 0.012;
      sculpture.scale.setScalar(breathe * (1 + s * 1.5));

      // damped mouse parallax
      state.curX += (state.mouseX - state.curX) * 0.045;
      state.curY += (state.mouseY - state.curY) * 0.045;

      // scroll choreography: dive THROUGH the sculpture into warp
      camera.position.z = state.camZ - s * 5.2;
      world.rotation.x = s * 0.85;
      world.position.y = s * 0.6;

      camera.position.x = state.curX * 0.9;
      camera.position.y = -state.curY * 0.6;
      camera.lookAt(0, s * 0.5, 0);

      // sculpture swells then dissolves as we pass through it
      const dissolve = THREE.MathUtils.smoothstep(s, 0.38, 0.72);
      sculptureMat.uniforms.uTime.value = state.time;
      sculptureMat.uniforms.uAmp.value = state.amp * (1 + s * 0.9);
      sculptureMat.uniforms.uOpacity.value = 1 - dissolve;
      galaxyMat.uniforms.uTime.value = state.time;
      galaxyMat.uniforms.uOpacity.value =
        state.particles * (1 - THREE.MathUtils.smoothstep(s, 0.8, 0.97) * 0.9);
      galaxyMat.uniforms.uWarp.value = s;
      cageMat.opacity = state.cageOpacity * Math.max(0, 1 - s * 2.4);
      ringMatA.opacity = state.ringOpacity * Math.max(0, 1 - s * 2.4);
      ringMatB.opacity = state.ringOpacity * 0.85 * Math.max(0, 1 - s * 2.4);

      renderer.render(scene, camera);
    };

    if (reduced) {
      // static composition for reduced-motion users
      state.time = 12.5;
      state.amp = 0.5;
      state.camZ = 6.4;
      state.particles = 0.85;
      state.cageOpacity = 0.07;
      state.ringOpacity = 0.3;
      renderFrame(0.016);
    } else {
      rafId = requestAnimationFrame(function loop() {
        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        if (state.running && state.inView && !document.hidden) renderFrame(dt);
        rafId = requestAnimationFrame(loop);
      });
    }

    /* --- GSAP entrance (triggered when preloader completes) --- */
    const enterTl = gsap.timeline({ paused: true });
    enterTl
      .to(state, { camZ: 6.2, duration: 2.6, ease: "expo.out" }, 0)
      .to(state, { amp: 0.5, duration: 2.2, ease: "power2.out" }, 0.15)
      .to(state, { particles: 0.95, duration: 1.8, ease: "power2.out" }, 0.45)
      .to(state, { cageOpacity: 0.07, duration: 1.4, ease: "power2.out" }, 0.7)
      .to(state, { ringOpacity: 0.32, duration: 1.4, ease: "power2.out" }, 0.85);

    /* --- scroll-linked camera (GSAP ScrollTrigger, scrubbed) ---
       The hero section is a 320vh pin; the sticky window ends exactly
       when the section bottom meets the viewport bottom. */
    const st = ScrollTrigger.create({
      trigger: host.closest("section") ?? host,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        state.scroll = self.progress;
      },
    });

    /* --- listeners --- */
    const onMouse = (e: MouseEvent) => {
      state.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      state.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduced) window.addEventListener("mousemove", onMouse, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        state.inView = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(host);

    apiRef.current = {
      enter: () => {
        if (state.entered) return;
        state.entered = true;
        if (reduced) return;
        enterTl.play();
      },
      dispose: () => {
        cancelAnimationFrame(rafId);
        enterTl.kill();
        st.kill();
        window.removeEventListener("mousemove", onMouse);
        io.disconnect();
        ro.disconnect();
        sculptureGeo.dispose();
        sculptureMat.dispose();
        cageGeo.dispose();
        cageMat.dispose();
        ringGeo.dispose();
        ringMatA.dispose();
        ringMatB.dispose();
        galaxyGeo.dispose();
        galaxyMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      },
    };

    return () => {
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, []);

  /* ---------------- entrance trigger ---------------- */
  useEffect(() => {
    if (ready) apiRef.current?.enter();
  }, [ready]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
