// Check if Three.js is loaded
if (typeof THREE !== 'undefined') {
    init3DHero();
} else {
    console.error('Three.js not loaded');
}

function init3DHero() {
    const container = document.querySelector('.hero-visual');

    // Clear existing content (CSS shape)
    container.innerHTML = '';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(400, 400); // Fixed size to match CSS shape
    container.appendChild(renderer.domElement);

    // Geometry: Icosahedron
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);

    // Material: Wireframe with neon colors
    const material = new THREE.MeshBasicMaterial({
        color: 0x00f2ff, // Neon Cyan
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });

    // Secondary shape inside
    const innerGeometry = new THREE.IcosahedronGeometry(0.8, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x7000ff, // Neon Purple
        wireframe: true
    });

    const sphere = new THREE.Mesh(geometry, material);
    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);

    scene.add(sphere);
    scene.add(innerSphere);

    camera.position.z = 4;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);

        // Constant rotation
        sphere.rotation.x += 0.005;
        sphere.rotation.y += 0.005;

        innerSphere.rotation.x -= 0.005;
        innerSphere.rotation.y -= 0.005;

        // Mouse interaction influence
        sphere.rotation.x += mouseY * 0.01;
        sphere.rotation.y += mouseX * 0.01;

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        // Keep fixed size for the visual container, no need for complex resize logic here
        // as the canvas size is fixed in CSS/JS
    });
}
