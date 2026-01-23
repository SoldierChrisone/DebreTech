const particleCanvas = document.getElementById('bg-particles');
if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let particlesArray;

    // Set canvas size
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.directionX = (Math.random() * 0.4) - 0.2;
            this.directionY = (Math.random() * 0.4) - 0.2;
            this.size = Math.random() * 2 + 1; // Size between 1 and 3
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            // Use CSS variable colors if possible, else fallback
            const isLight = document.body.classList.contains('light-mode');
            ctx.fillStyle = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
            ctx.fill();
        }

        update() {
            if (this.x > particleCanvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > particleCanvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (particleCanvas.height * particleCanvas.width) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }

        connectParticles();
    }

    function connectParticles() {
        const isLight = document.body.classList.contains('light-mode');
        const color = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                    + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                if (distance < (particleCanvas.width / 7) * (particleCanvas.height / 7)) {
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', () => {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
        initParticles();
    });

    initParticles();
    animateParticles();
}
