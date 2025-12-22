import React, { useEffect, useRef, memo } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false,  // 关闭抗锯齿
      powerPreference: 'high-performance'
    });
    
    const { clientWidth: width, clientHeight: height } = mountRef.current;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // 限制像素比
    mountRef.current.appendChild(renderer.domElement);

    // 优化后的 Shader - 减少 octaves 从 5 到 3
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(width, height) },
        uColor1: { value: new THREE.Color(0xf0f4f8) },
        uColor2: { value: new THREE.Color(0x172554) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;

        float random (in vec2 _st) {
          return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        float noise (in vec2 _st) {
          vec2 i = floor(_st);
          vec2 f = fract(_st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        #define NUM_OCTAVES 3

        float fbm (in vec2 _st) {
          float v = 0.0;
          float a = 0.5;
          vec2 shift = vec2(100.0);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(_st);
            _st = rot * _st * 2.0 + shift;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 st = gl_FragCoord.xy / uResolution.xy;
          st.x *= uResolution.x / uResolution.y;

          vec2 mouse = uMouse * vec2(uResolution.x / uResolution.y, 1.0);
          float dist = distance(st, mouse);
          vec2 interaction = (st - mouse) * (1.0 / (dist + 0.3)) * 0.02;

          vec2 q = vec2(fbm(st + 0.04 * uTime + interaction), fbm(st + vec2(1.0) + interaction));
          vec2 r = vec2(fbm(st + q + vec2(1.7, 9.2) + 0.08 * uTime), fbm(st + q + vec2(8.3, 2.8) + 0.06 * uTime));

          float f = fbm(st + r);
          float ink = smoothstep(0.3, 0.8, f);
          vec3 color = mix(uColor2, uColor1, clamp(ink * 1.8, 0.0, 1.0));

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // 鼠标位置平滑插值
    let currentMouseX = 0.5, currentMouseY = 0.5;
    let targetMouseX = 0.5, targetMouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - (e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Intersection Observer - 视口外停止渲染
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(mountRef.current);

    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // 不可见时跳过渲染
      if (!isVisibleRef.current) return;

      // 平滑插值鼠标位置
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;
      material.uniforms.uMouse.value.set(currentMouseX, currentMouseY);

      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    // 防抖 resize
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (!mountRef.current) return;
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        renderer.setSize(width, height);
        material.uniforms.uResolution.value.set(width, height);
      }, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      observer.disconnect();
      cancelAnimationFrame(animationId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-multiply" />;
};

export default memo(ThreeBackground);
