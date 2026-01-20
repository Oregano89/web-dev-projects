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
        
        // Render parameters
        this.opacity = 50;
        this.threshold = 50;
        this.isoValue = 100;
        this.brightness = 100;
        this.currentColormap = 'viridis';
        this.currentPreset = 'A';
        
        // Colormap definitions (color gradients)
        this.colormaps = {
            viridis: [0x440154, 0x31688e, 0x35b779, 0xfde724],
            plasma: [0x0d0887, 0x7e03a8, 0xcc4778, 0xf89540, 0xf0f921],
            inferno: [0x000004, 0x420a68, 0x932667, 0xdd513a, 0xfca50a, 0xfcffa4],
            magma: [0x000004, 0x3b0f70, 0x8c2981, 0xde4968, 0xfe9f6d, 0xfcfdbf],
            rainbow: [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x8b00ff],
            cool: [0x00ffff, 0x0080ff, 0x0000ff],
            warm: [0xffff00, 0xff8000, 0xff0000]
        };
        
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
        this.opacity = 50;
        this.threshold = 50;
        this.isoValue = 100;
        this.brightness = 100;
        this.currentColormap = 'viridis';
        this.currentPreset = 'A';
        this.updateCameraPosition();
        this.setObjectScale(1);
        this.updateMaterialProperties();
    }
    
    // Parameter control methods
    setOpacity(value) {
        this.opacity = Math.max(0, Math.min(100, value));
        this.updateMaterialProperties();
    }
    
    setThreshold(value) {
        this.threshold = Math.max(0, Math.min(100, value));
        this.updateMaterialProperties();
    }
    
    setIsoValue(value) {
        this.isoValue = Math.max(0, Math.min(255, value));
        this.updateMaterialProperties();
    }
    
    setBrightness(value) {
        this.brightness = Math.max(0, Math.min(200, value));
        this.updateMaterialProperties();
    }
    
    setColormap(colormapName) {
        if (this.colormaps[colormapName]) {
            this.currentColormap = colormapName;
            this.updateMaterialProperties();
        }
    }
    
    nextColormap() {
        const colormapNames = Object.keys(this.colormaps);
        const currentIndex = colormapNames.indexOf(this.currentColormap);
        const nextIndex = (currentIndex + 1) % colormapNames.length;
        this.setColormap(colormapNames[nextIndex]);
    }
    
    previousColormap() {
        const colormapNames = Object.keys(this.colormaps);
        const currentIndex = colormapNames.indexOf(this.currentColormap);
        const prevIndex = (currentIndex - 1 + colormapNames.length) % colormapNames.length;
        this.setColormap(colormapNames[prevIndex]);
    }
    
    loadPreset(presetName) {
        this.currentPreset = presetName;
        if (presetName === 'A') {
            // Preset A: Bright, high contrast
            this.setOpacity(75);
            this.setThreshold(30);
            this.setIsoValue(150);
            this.setBrightness(120);
            this.setColormap('viridis');
        } else if (presetName === 'B') {
            // Preset B: Soft, low contrast
            this.setOpacity(40);
            this.setThreshold(70);
            this.setIsoValue(80);
            this.setBrightness(90);
            this.setColormap('plasma');
        }
    }
    
    updateMaterialProperties() {
        if (!this.mainObject) return;
        
        const material = this.mainObject.material;
        
        // Apply opacity
        material.opacity = this.opacity / 100;
        material.transparent = this.opacity < 100;
        
        // Apply brightness by modifying emissive intensity
        const brightnessMultiplier = this.brightness / 100;
        material.emissiveIntensity = Math.max(0, brightnessMultiplier - 1);
        
        // Apply colormap - use primary color from colormap
        const colormapColors = this.colormaps[this.currentColormap];
        if (colormapColors && colormapColors.length > 0) {
            const colorIndex = Math.floor((this.threshold / 100) * (colormapColors.length - 1));
            const selectedColor = colormapColors[colorIndex];
            material.color.setHex(selectedColor);
            material.emissive.setHex(selectedColor);
        }
        
        // ISO value affects metalness
        material.metalness = this.isoValue / 255;
        
        // Threshold affects roughness
        material.roughness = 1 - (this.threshold / 100);
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
