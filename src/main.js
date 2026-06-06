/* ============================================================
   TECHFEST 2026 — COMPLETE JAVASCRIPT
   Three.js 3D scene + GSAP ScrollTrigger animations
   ============================================================ */

/* ============================================================
   1. LOADER ANIMATION
   ============================================================ */
const loaderMessages = [
  'Initializing 3D Engine...',
  'Loading Particle Systems...',
  'Calibrating Orbit Controls...',
  'Building the Universe...',
  'Welcome to Techfest 2026.'
];
const loaderFill = document.getElementById('loader-fill');
const loaderText = document.getElementById('loader-text');
const loader    = document.getElementById('loader');

let loadPct = 0;
let msgIdx  = 0;
const loadInterval = setInterval(() => {
  loadPct += Math.random() * 25 + 5;
  if (loadPct > 100) loadPct = 100;
  loaderFill.style.width = loadPct + '%';
  if (msgIdx < loaderMessages.length - 1 && loadPct > (msgIdx + 1) * 20) {
    msgIdx++;
    loaderText.textContent = loaderMessages[msgIdx];
  }
  if (loadPct >= 100) {
    clearInterval(loadInterval);
    setTimeout(() => {
      gsap.to(loader, {
        opacity: 0, duration: 1, ease: 'power2.inOut',
        onComplete: () => { loader.style.display = 'none'; initAnimations(); }
      });
    }, 500);
  }
}, 300);


/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let   mouseX = 0, mouseY = 0;
let   followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth follower
function animateCursor() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on interactive elements
document.querySelectorAll('a, button, .event-card, .about-card, .sponsor-logo').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform   = 'translate(-50%,-50%) scale(2)';
    cursor.style.background  = 'transparent';
    cursor.style.border      = '1.5px solid var(--purple)';
    follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform   = 'translate(-50%,-50%) scale(1)';
    cursor.style.background  = 'var(--purple)';
    cursor.style.border      = 'none';
    follower.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});


/* ============================================================
   3. NAVBAR — scroll behavior
   ============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});


/* ============================================================
   4. THREE.JS 3D SCENE
   ============================================================ */

// --- Scene Setup ---
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg'),
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0); // transparent background


// --- Particle Globe ---
// 6000 particles randomly placed on a sphere surface using spherical coords
const PARTICLE_COUNT = 6000;
const globeGeo       = new THREE.BufferGeometry();
const positions      = new Float32Array(PARTICLE_COUNT * 3);
const colors         = new Float32Array(PARTICLE_COUNT * 3);
const scales         = new Float32Array(PARTICLE_COUNT);

const color1 = new THREE.Color('#7c6fff');  // purple
const color2 = new THREE.Color('#00e5ff');  // cyan
const color3 = new THREE.Color('#ff4d9e');  // pink

for (let i = 0; i < PARTICLE_COUNT; i++) {
  // Fibonacci sphere algorithm for uniform distribution
  const phi   = Math.acos(1 - 2 * (i / PARTICLE_COUNT));
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  const r     = 2 + (Math.random() - 0.5) * 0.15; // slight variation

  positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = r * Math.cos(phi);
  positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

  // Color gradient from purple to cyan based on Y position
  const t   = (positions[i * 3 + 1] + 2) / 4; // normalize -2..2 to 0..1
  const col = t < 0.5 ? color1.clone().lerp(color2, t * 2) : color2.clone().lerp(color3, (t - 0.5) * 2);
  colors[i * 3]     = col.r;
  colors[i * 3 + 1] = col.g;
  colors[i * 3 + 2] = col.b;

  scales[i] = Math.random() * 2 + 0.5;
}

globeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
globeGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
globeGeo.setAttribute('aScale',   new THREE.BufferAttribute(scales, 1));

const globeMat = new THREE.PointsMaterial({
  size:         0.025,
  vertexColors: true,
  transparent:  true,
  opacity:      0.9,
  sizeAttenuation: true
});

const globe = new THREE.Points(globeGeo, globeMat);
scene.add(globe);


// --- Outer Nebula Cloud (ambient particles) ---
const nebulaCount = 3000;
const nebulaGeo   = new THREE.BufferGeometry();
const nebulaPos   = new Float32Array(nebulaCount * 3);

for (let i = 0; i < nebulaCount; i++) {
  nebulaPos[i * 3]     = (Math.random() - 0.5) * 20;
  nebulaPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
  nebulaPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
}
nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));

const nebulaMat = new THREE.PointsMaterial({
  size:  0.015,
  color: new THREE.Color('#7c6fff'),
  transparent: true,
  opacity: 0.25
});
const nebula = new THREE.Points(nebulaGeo, nebulaMat);
scene.add(nebula);


// --- Ring 1 (equatorial) ---
const ring1Geo = new THREE.TorusGeometry(2.5, 0.008, 16, 200);
const ring1Mat = new THREE.MeshBasicMaterial({
  color:       0x7c6fff,
  transparent: true,
  opacity:     0.25
});
const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
ring1.rotation.x = Math.PI / 2;
scene.add(ring1);

// --- Ring 2 (tilted) ---
const ring2Geo = new THREE.TorusGeometry(2.8, 0.005, 16, 200);
const ring2Mat = new THREE.MeshBasicMaterial({
  color:       0x00e5ff,
  transparent: true,
  opacity:     0.15
});
const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
ring2.rotation.x = Math.PI / 3;
ring2.rotation.y = Math.PI / 6;
scene.add(ring2);


// --- Floating Orbs (small sphere meshes) ---
const orbData = [];
const orbColors = [0x7c6fff, 0x00e5ff, 0xff4d9e, 0xffffff];
for (let i = 0; i < 8; i++) {
  const geo  = new THREE.SphereGeometry(0.04 + Math.random() * 0.06, 16, 16);
  const mat  = new THREE.MeshBasicMaterial({ color: orbColors[i % orbColors.length], transparent: true, opacity: 0.8 });
  const mesh = new THREE.Mesh(geo, mat);
  const angle  = (i / 8) * Math.PI * 2;
  const radius = 2.2 + Math.random() * 0.8;
  mesh.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 2, Math.sin(angle) * radius);
  scene.add(mesh);
  orbData.push({ mesh, angle, speed: 0.003 + Math.random() * 0.004, radius });
}


// --- Lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0x7c6fff, 2, 10);
pointLight.position.set(3, 3, 3);
scene.add(pointLight);
const pointLight2 = new THREE.PointLight(0x00e5ff, 1.5, 10);
pointLight2.position.set(-3, -2, -3);
scene.add(pointLight2);


// --- Mouse Parallax ---
let targetX = 0, targetY = 0;
document.addEventListener('mousemove', e => {
  targetX = (e.clientX / window.innerWidth  - 0.5) * 0.8;
  targetY = (e.clientY / window.innerHeight - 0.5) * 0.5;
});


// --- Resize Handler ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- Animate Loop ---
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  // Rotate globe slowly
  globe.rotation.y  += 0.0015;
  globe.rotation.x  += 0.0003;

  // Rotate nebula opposite direction
  nebula.rotation.y -= 0.0005;
  nebula.rotation.x += 0.0002;

  // Rotate rings
  ring1.rotation.z += 0.002;
  ring2.rotation.z -= 0.0015;

  // Animate orbs around globe
  orbData.forEach(orb => {
    orb.angle += orb.speed;
    orb.mesh.position.x = Math.cos(orb.angle) * orb.radius;
    orb.mesh.position.z = Math.sin(orb.angle) * orb.radius;
    orb.mesh.position.y = Math.sin(elapsed * 0.5 + orb.angle) * 0.4;
  });

  // Mouse parallax on camera
  camera.position.x += (targetX - camera.position.x) * 0.05;
  camera.position.y += (-targetY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  // Pulsing glow effect on globe material
  globeMat.opacity = 0.7 + Math.sin(elapsed * 0.8) * 0.2;

  renderer.render(scene, camera);
}
animate();


/* ============================================================
   5. GSAP SCROLL ANIMATIONS
   (runs after loader finishes)
   ============================================================ */
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // --- Scroll: Camera zoom into globe ---
  gsap.to(camera.position, {
    z: 1.5,
    scrollTrigger: {
      trigger: '#about',
      start:   'top bottom',
      end:     'top top',
      scrub:   2
    }
  });

  // Zoom back out for events
  gsap.to(camera.position, {
    z: 6,
    scrollTrigger: {
      trigger: '#events',
      start:   'top bottom',
      end:     'top top',
      scrub:   2
    }
  });

  // Move globe offscreen left as we scroll past hero
  gsap.to(globe.position, {
    x: -4,
    scrollTrigger: {
      trigger: '#about',
      start:   'top center',
      end:     'top top',
      scrub:   1.5
    }
  });

  // Bring globe back for events
  gsap.to(globe.position, {
    x: 0,
    scrollTrigger: {
      trigger: '#events',
      start:   'top bottom',
      end:     'top center',
      scrub:   1.5
    }
  });

  // Globe spin up on scroll
  gsap.to(globe.rotation, {
    y: Math.PI * 4,
    scrollTrigger: {
      trigger: 'body',
      start:   'top top',
      end:     'bottom bottom',
      scrub:   3
    }
  });


  // --- Counter Animation (hero stats) ---
  const statNums = document.querySelectorAll('.stat-num');
  statNums.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    const obj    = { value: 0 };
    gsap.to(obj, {
      value: target,
      duration: 2,
      delay: 3.4,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.floor(obj.value).toLocaleString(); },
      onComplete: () => { el.textContent = target.toLocaleString(); }
    });
  });


  // --- About cards reveal ---
  const aboutCards = document.querySelectorAll('.about-card');
  const aboutObs   = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-delay') || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        aboutObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  aboutCards.forEach(card => aboutObs.observe(card));


  // --- Event cards reveal ---
  const eventCards = document.querySelectorAll('.event-card');
  const eventObs   = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        eventObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  eventCards.forEach(card => eventObs.observe(card));


  // --- Section headers slide in ---
  document.querySelectorAll('.section-title, .section-tag').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger:  el,
        start:    'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });


  // --- Register box reveal ---
  gsap.from('.register-box', {
    opacity: 0,
    y: 60,
    scale: 0.95,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#register',
      start:   'top 75%',
      toggleActions: 'play none none none'
    }
  });


  // --- Particle explosion on events scroll ---
  let exploded = false;
  ScrollTrigger.create({
    trigger:  '#events',
    start:    'top center',
    onEnter:  () => { if (!exploded) { explodeGlobe(); exploded = true; } }
  });


  // --- Footer fade ---
  gsap.from('.footer', {
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: '.footer',
      start:   'top 90%'
    }
  });
}


/* ============================================================
   6. PARTICLE EXPLOSION EFFECT
   (triggered when user scrolls to events section)
   ============================================================ */
function explodeGlobe() {
  const posAttr = globeGeo.getAttribute('position');
  const count   = posAttr.count;

  // Store original positions for re-implosion
  const origPositions = new Float32Array(posAttr.array);

  // Animate each particle outward
  for (let i = 0; i < count; i++) {
    const ix = i * 3, iy = ix + 1, iz = ix + 2;
    const explodeX = posAttr.array[ix] * (1 + Math.random() * 3);
    const explodeY = posAttr.array[iy] * (1 + Math.random() * 3);
    const explodeZ = posAttr.array[iz] * (1 + Math.random() * 3);

    const obj = {
      x: posAttr.array[ix],
      y: posAttr.array[iy],
      z: posAttr.array[iz]
    };

    gsap.to(obj, {
      x: explodeX, y: explodeY, z: explodeZ,
      duration: 1.2,
      ease: 'power2.out',
      delay: Math.random() * 0.4,
      onUpdate: () => {
        posAttr.array[ix] = obj.x;
        posAttr.array[iy] = obj.y;
        posAttr.array[iz] = obj.z;
        posAttr.needsUpdate = true;
      },
      onComplete: () => {
        // Implode back after 1 second pause
        gsap.to(obj, {
          x: origPositions[ix],
          y: origPositions[iy],
          z: origPositions[iz],
          duration: 1.5,
          ease: 'power3.inOut',
          delay: 0.8 + Math.random() * 0.3,
          onUpdate: () => {
            posAttr.array[ix] = obj.x;
            posAttr.array[iy] = obj.y;
            posAttr.array[iz] = obj.z;
            posAttr.needsUpdate = true;
          }
        });
      }
    });
  }
}


/* ============================================================
   7. REGISTER FORM
   ============================================================ */
function handleRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const event = document.getElementById('reg-event').value;

  if (!name || !email || !event) {
    showToast('Please fill in all fields ✦', true);
    return;
  }
  if (!email.includes('@')) {
    showToast('Enter a valid email address', true);
    return;
  }

  // Success animation
  showToast(`🎉 Welcome, ${name}! You're registered for ${event}`);

  // Clear form
  document.getElementById('reg-name').value  = '';
  document.getElementById('reg-email').value = '';
  document.getElementById('reg-event').value = '';

  // Trigger a small globe burst as celebration
  setTimeout(explodeGlobe, 300);
}

function showToast(msg, isError = false) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.background = isError ? '#ff4d4d' : 'var(--purple)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// Expose to HTML onclick
window.handleRegister = handleRegister;
