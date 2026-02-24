// Starry background effect with continuous drift and mouse parallax

document.addEventListener('DOMContentLoaded', () => {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 200;
    const stars = [];

    // Mouse position tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    // Window dimensions
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowHalfX = windowWidth / 2;
    let windowHalfY = windowHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - windowHalfX);
        mouseY = (e.clientY - windowHalfY);
    });

    window.addEventListener('resize', () => {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        windowHalfX = windowWidth / 2;
        windowHalfY = windowHeight / 2;
    });

    // Generate stars
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Random starting position (pixels)
        const x = Math.random() * windowWidth;
        const y = Math.random() * windowHeight;
        const size = Math.random() * 2 + 1;

        // Set styles
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = Math.random() * 0.7 + 0.3;

        // Initial position set to 0, transform controls all movement
        star.style.left = '0px';
        star.style.top = '0px';

        // Custom properties for animation
        // Random velocity (drift)
        const speedMultiplier = 0.5; // Adjustable speed
        const vx = (Math.random() - 0.5) * speedMultiplier;
        const vy = (Math.random() - 0.5) * speedMultiplier;
        const depth = Math.random(); // Parallax depth

        stars.push({
            element: star,
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            depth: depth
        });

        starsContainer.appendChild(star);
    }

    function animate() {
        // Smooth mouse follow
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        stars.forEach(star => {
            // Apply velocity (Drift)
            star.x += star.vx;
            star.y += star.vy;

            // Screen wrapping
            if (star.x < 0) star.x = windowWidth;
            if (star.x > windowWidth) star.x = 0;
            if (star.y < 0) star.y = windowHeight;
            if (star.y > windowHeight) star.y = 0;

            // Mouse parallax effect calculation
            const parallaxX = targetX * star.depth * 0.1;
            const parallaxY = targetY * star.depth * 0.1;

            // Combine actual position with parallax offset
            star.element.style.transform = `translate(${star.x - parallaxX}px, ${star.y - parallaxY}px)`;
        });

        requestAnimationFrame(animate);
    }

    animate();

    // --- Tab Switching Logic ---
    const segmentCards = document.querySelectorAll('.segment-card');
    const serviceBlocks = document.querySelectorAll('.service-block');

    segmentCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all cards
            segmentCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            card.classList.add('active');

            const targetId = card.dataset.target;

            // 1. SERVICES: Hide all, Show target
            serviceBlocks.forEach(block => block.classList.add('hidden'));
            const targetBlock = document.getElementById(targetId);
            if (targetBlock) {
                targetBlock.classList.remove('hidden');
            }

            // 2. BENEFITS: Hide all, Show target
            const benefitBlocks = document.querySelectorAll('.benefits-block');
            benefitBlocks.forEach(b => b.classList.add('hidden'));
            const targetBenefit = document.getElementById(`benefits-${targetId}`);
            if (targetBenefit) {
                targetBenefit.classList.remove('hidden');
            }
        });
    });
});
