// Three.js Scene Manager
class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mainObject = null;
        this.animationId = null;
        
        // Camera parameters
        this.cameraDistance = 5;
        this.cameraRotationAngle = 0;
        this.cameraHeight = 5;
        
        // Object parameters
        this.objectScale = 1;
        this.rotationSpeed = 1;
        
        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);

        // Camera setup
        const canvas = document.getElementById('threeCanvas');
        const aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.updateCameraPosition();

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true 
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x00ffff, 0.5);
        pointLight.position.set(-5, 3, -5);
        this.scene.add(pointLight);

        // Create main object (a torus knot)
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x00ff88,
            roughness: 0.3,
            metalness: 0.8
        });
        this.mainObject = new THREE.Mesh(geometry, material);
        this.scene.add(this.mainObject);

        // Add grid helper
        const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
        this.scene.add(gridHelper);

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation
        this.animate();
    }

    updateCameraPosition() {
        const angle = this.cameraRotationAngle * (Math.PI / 180);
        this.camera.position.x = Math.sin(angle) * this.cameraDistance;
        this.camera.position.z = Math.cos(angle) * this.cameraDistance;
        this.camera.position.y = this.cameraHeight;
        this.camera.lookAt(0, 0, 0);
    }

    setCameraDistance(distance) {
        this.cameraDistance = Math.max(2, Math.min(20, distance));
        this.updateCameraPosition();
    }

    setCameraRotation(angle) {
        this.cameraRotationAngle = angle % 360;
        this.updateCameraPosition();
    }

    setCameraHeight(height) {
        this.cameraHeight = Math.max(-10, Math.min(10, height));
        this.updateCameraPosition();
    }

    setObjectScale(scale) {
        this.objectScale = Math.max(0.1, Math.min(3, scale));
        this.mainObject.scale.set(this.objectScale, this.objectScale, this.objectScale);
    }

    setRotationSpeed(speed) {
        this.rotationSpeed = Math.max(0, Math.min(5, speed));
    }

    zoomIn(amount = 1) {
        this.setCameraDistance(this.cameraDistance - amount);
    }

    zoomOut(amount = 1) {
        this.setCameraDistance(this.cameraDistance + amount);
    }

    orbitLeft(degrees = 15) {
        this.setCameraRotation(this.cameraRotationAngle - degrees);
    }

    orbitRight(degrees = 15) {
        this.setCameraRotation(this.cameraRotationAngle + degrees);
    }

    orbitUp(amount = 1) {
        this.setCameraHeight(this.cameraHeight + amount);
    }

    orbitDown(amount = 1) {
        this.setCameraHeight(this.cameraHeight - amount);
    }

    reset() {
        this.cameraDistance = 5;
        this.cameraRotationAngle = 0;
        this.cameraHeight = 5;
        this.objectScale = 1;
        this.rotationSpeed = 1;
        this.updateCameraPosition();
        this.setObjectScale(1);
    }

    onWindowResize() {
        const canvas = document.getElementById('threeCanvas');
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Rotate the object
        this.mainObject.rotation.x += 0.005 * this.rotationSpeed;
        this.mainObject.rotation.y += 0.01 * this.rotationSpeed;

        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.renderer.dispose();
    }
}
