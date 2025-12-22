import React, { useEffect, useRef, memo } from 'react';
import * as THREE from 'three';

// 导出坐标转换函数用于测试
export const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  return new THREE.Vector3(x, y, z);
};

// 南通坐标常量
export const NANTONG_COORDS = { lat: 31.23, lon: 121.47 } as const;

// 导出城市坐标配置用于测试 - 聚焦欧洲和东南亚市场
export const getCityCoordinates = (radius: number = 5) => ({
  nantong: latLonToVector3(NANTONG_COORDS.lat, NANTONG_COORDS.lon, radius), // 南通 - 蓝印花布发源地
  
  // 欧洲市场
  london: latLonToVector3(51.50, -0.12, radius),      // 伦敦
  paris: latLonToVector3(48.85, 2.35, radius),        // 巴黎
  berlin: latLonToVector3(52.52, 13.40, radius),      // 柏林
  amsterdam: latLonToVector3(52.37, 4.89, radius),    // 阿姆斯特丹
  rome: latLonToVector3(41.90, 12.49, radius),        // 罗马
  madrid: latLonToVector3(40.42, -3.70, radius),      // 马德里
  
  // 东南亚市场
  singapore: latLonToVector3(1.35, 103.81, radius),   // 新加坡
  bangkok: latLonToVector3(13.75, 100.50, radius),    // 曼谷
  jakarta: latLonToVector3(-6.21, 106.85, radius),    // 雅加达
  manila: latLonToVector3(14.60, 120.98, radius),     // 马尼拉
  kualalumpur: latLonToVector3(3.14, 101.69, radius), // 吉隆坡
  hanoi: latLonToVector3(21.03, 105.85, radius),      // 河内
  hochiminh: latLonToVector3(10.82, 106.63, radius),  // 胡志明市
});

// 导出贸易路线配置用于测试 - 连接欧洲和东南亚市场
export const getTradeRouteConnections = (): [string, string][] => [
  // 南通到欧洲
  ['nantong', 'london'], ['nantong', 'paris'], ['nantong', 'berlin'],
  ['nantong', 'amsterdam'], ['nantong', 'rome'], ['nantong', 'madrid'],
  
  // 南通到东南亚
  ['nantong', 'singapore'], ['nantong', 'bangkok'], ['nantong', 'jakarta'],
  ['nantong', 'manila'], ['nantong', 'kualalumpur'], ['nantong', 'hanoi'],
  ['nantong', 'hochiminh'],
  
  // 欧洲内部连接
  ['london', 'paris'], ['paris', 'berlin'], ['berlin', 'amsterdam'],
  
  // 东南亚内部连接
  ['singapore', 'bangkok'], ['singapore', 'jakarta'], ['bangkok', 'hanoi'],
];

const Globe3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // 确保容器有尺寸
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    // Camera - 调整位置以更好地展示欧洲
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 18); // 稍微降低Y轴位置
    camera.lookAt(0, 0, 0);

    // Renderer - 优化性能
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false, // 关闭抗锯齿提升性能
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // 限制像素比
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); 
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x60a5fa, 1.8); 
    pointLight.position.set(20, 20, 20);
    scene.add(pointLight);
    
    const backLight = new THREE.PointLight(0xffffff, 0.8);
    backLight.position.set(-20, 10, -30);
    scene.add(backLight);

    // --- Globe Group ---
    const globeGroup = new THREE.Group();
    // 初始旋转：让欧洲面向用户
    // 欧洲经度约0-40度，中国约100-120度，需要向左旋转约100度
    // Y轴旋转控制经度（正值向左转），X轴旋转控制纬度
    globeGroup.rotation.y = Math.PI * 0.55; // 向左旋转约100度，让欧洲居中
    globeGroup.rotation.x = 0.2;  // 轻微向下倾斜，显示欧洲纬度（40-60度）
    scene.add(globeGroup);

    // 1. Earth Sphere
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    
    // 加载纹理
    const earthMap = textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
      () => renderer.render(scene, camera) // 纹理加载后重新渲染
    );
    const earthSpecular = textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
    );
    const earthNormal = textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg'
    );
    
    const material = new THREE.MeshPhongMaterial({
      map: earthMap,
      specularMap: earthSpecular,
      normalMap: earthNormal,
      specular: new THREE.Color(0x333333),
      shininess: 15,
      color: 0xecfeff, // Cyan tint
      emissive: new THREE.Color(0x112244), // Deep blue glow
      emissiveIntensity: 0.5,
    });
    
    const earth = new THREE.Mesh(geometry, material);
    globeGroup.add(earth);

    // 2. Atmosphere Glow
    const atmosGeo = new THREE.SphereGeometry(5.2, 64, 64);
    const atmosMat = new THREE.MeshPhongMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosphere);

    // 3. Trade Routes Logic
    const cities = getCityCoordinates(5);
    const connections = getTradeRouteConnections();

    const routeObjects: { line: THREE.Line, curve: THREE.QuadraticBezierCurve3, particles: any[] }[] = [];

    const createRoute = (p1: THREE.Vector3, p2: THREE.Vector3) => {
      const dist = p1.distanceTo(p2);
      const heightScale = Math.max(1, dist * 0.5); // Higher arch for longer distance
      
      const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(5 + heightScale);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(50);
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x93c5fd, // Light blue
        transparent: true, 
        opacity: 0.15 
      });
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      
      // Particles - 减少粒子数量提升性能
      const particles = [];
      const particleCount = Math.floor(dist * 0.4) + 1; // 减少粒子数量
      
      for(let i=0; i<particleCount; i++) {
        const pGeo = new THREE.SphereGeometry(0.06, 4, 4);
        const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(pGeo, pMat);
        // Random start time/speed
        particles.push({ 
            mesh, 
            progress: Math.random(), 
            speed: 0.002 + Math.random() * 0.004 
        });
      }

      return { line, curve, particles };
    };

    connections.forEach(([c1, c2]) => {
      if (cities[c1] && cities[c2]) {
        const route = createRoute(cities[c1], cities[c2]);
        globeGroup.add(route.line);
        route.particles.forEach(p => globeGroup.add(p.mesh));
        routeObjects.push(route);
      }
    });

    // Add City Markers with special styling for Nantong
    Object.entries(cities).forEach(([cityName, pos]) => {
        const isNantong = cityName === 'nantong';
        const marker = new THREE.Mesh(
            new THREE.SphereGeometry(isNantong ? 0.12 : 0.08, 8, 8), // 南通标记更大
            new THREE.MeshBasicMaterial({ 
              color: isNantong ? 0x1e3a8a : 0x60a5fa // 南通使用深靛蓝色
            })
        );
        marker.position.copy(pos);
        globeGroup.add(marker);
        
        // 为南通添加光晕效果
        if (isNantong) {
          const glowGeo = new THREE.SphereGeometry(0.18, 8, 8);
          const glowMat = new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.3,
          });
          const glow = new THREE.Mesh(glowGeo, glowMat);
          glow.position.copy(pos);
          globeGroup.add(glow);
        }
    });

    // --- Interaction ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.0003;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.0003;
    };
    document.addEventListener('mousemove', handleMouseMove);

    // Intersection Observer - 视口外停止渲染
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(container);

    // --- Animation Loop ---
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // 不可见时跳过渲染
      if (!isVisibleRef.current) return;
      
      // Auto rotate
      globeGroup.rotation.y += 0.0008;

      // Mouse Interaction with damping
      targetRotationX = mouseY * 1.5;
      targetRotationY = mouseX * 1.5;
      
      globeGroup.rotation.x += 0.03 * (targetRotationX - globeGroup.rotation.x);
      globeGroup.rotation.y += 0.03 * (targetRotationY - globeGroup.rotation.y);

      // Animate particles
      routeObjects.forEach(r => {
        r.particles.forEach(p => {
            p.progress += p.speed;
            if (p.progress > 1) p.progress = 0;
            const point = r.curve.getPoint(p.progress);
            p.mesh.position.set(point.x, point.y, point.z);
            
            // Fade in/out at ends
            const opacity = Math.sin(p.progress * Math.PI);
            p.mesh.scale.setScalar(opacity);
        });
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationIdRef.current);
      
      // 清理场景
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // 清理几何体和材质
      geometry.dispose();
      material.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      
      // 清理路线和粒子
      routeObjects.forEach(route => {
        route.line.geometry.dispose();
        (route.line.material as THREE.Material).dispose();
        route.particles.forEach(p => {
          p.mesh.geometry.dispose();
          (p.mesh.material as THREE.Material).dispose();
        });
      });
      
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};

export default memo(Globe3D);
