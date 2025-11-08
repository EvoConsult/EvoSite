document.addEventListener('DOMContentLoaded', function() {

    // --- Library Check ---
    if (typeof gsap === 'undefined' || typeof THREE === 'undefined') {
        console.error('GSAP or Three.js not loaded');
        return;
    }

    // --- Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const interactiveElements = document.querySelectorAll('a, button, .service-card');

    window.addEventListener('mousemove', e => {
        gsap.to(cursor, { duration: 0.2, x: e.clientX, y: e.clientY });
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-pointer'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-pointer'));
    });

    // --- GSAP Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl.from('.hero h1', { duration: 1, y: 50, opacity: 0, ease: 'power3.out' })
          .from('.hero p', { duration: 1, y: 30, opacity: 0, ease: 'power3.out' }, '-=0.8')
          .from('.hero .btn', { duration: 1, y: 20, opacity: 0, ease: 'power3.out' }, '-=0.8');

    // General Section Animation
    gsap.utils.toArray('.section').forEach(section => {
        const title = section.querySelector('.section-title');
        const content = section.querySelectorAll(":scope > .container > *:not(.section-title), :scope > .container > .row > .col-md-4");

        const tl = gsap.timeline({ 
            scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' }
        });

        if (title) {
            tl.from(title, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })
              .from(title.querySelector('::after'), { scaleX: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
        }
        if (content.length > 0) {
            tl.from(content, { y: 40, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, '-=0.5');
        }
    });

    // --- Three.js Wavy Background ---
    let scene, camera, renderer, material, mesh;
    const canvas = document.getElementById('hero-canvas');

    function initThree() {
        if (!canvas) return;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const geometry = new THREE.PlaneGeometry(window.innerWidth / 100, window.innerHeight / 100, 100, 100);
        material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_mouse: { value: new THREE.Vector2(0, 0) },
                u_color1: { value: new THREE.Color(0x1A237E) }, // primary-color
                u_color2: { value: new THREE.Color(0x5C6BC0) }  // secondary-color
            },
            vertexShader: `
                uniform float u_time;
                varying float v_noise;
                
                // 2D Random function
                float random (vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                // 2D Noise based on Morgan McGuire @morgan3d
                float noise (in vec2 st) {
                    vec2 i = floor(st);
                    vec2 f = fract(st);

                    float a = random(i);
                    float b = random(i + vec2(1.0, 0.0));
                    float c = random(i + vec2(0.0, 1.0));
                    float d = random(i + vec2(1.0, 1.0));

                    vec2 u = f*f*(3.0-2.0*f);
                    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
                }

                void main() {
                    vec3 pos = position;
                    float noise_freq = 2.5;
                    float noise_amp = 0.15;
                    v_noise = noise(vec2(pos.x * noise_freq + u_time * 0.1, pos.y * noise_freq));
                    pos.z += v_noise * noise_amp;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 u_color1;
                uniform vec3 u_color2;
                varying float v_noise;

                void main() {
                    vec3 color = mix(u_color1, u_color2, v_noise * 2.0 + 0.5);
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        camera.position.z = 20;

        animate();
    }

    function animate() {
        requestAnimationFrame(animate);
        material.uniforms.u_time.value += 0.01;
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize, false);

    initThree();
});
