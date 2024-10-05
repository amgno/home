import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

class AnimatedBackground {
    constructor() {
        this.container = document.querySelector('bgelement');
        this.camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.clock = new THREE.Clock();
        this.particles = new THREE.Group();
        this.particleCount = 10000;
        this.seed = Math.random() * 10000; // Seed for this page load
        this.animationParams = this.generateAnimationParams();
        this.timeScale = 3.0; // Increase this value to speed up the entire animation

        this.init();
        this.createParticles();
        this.addEvents();
        this.animate();
    }

    init() {
        this.camera.position.z = 100;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        this.scene.add(this.particles);
    }

    random() {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

    generateAnimationParams() {
        const baseShape = Math.floor(this.random() * 4); // 0: cube, 1: sphere, 2: torus, 3: spiral
        return {
            baseShape: baseShape,
            scaleFreq: 0.2 + this.random() * 0.8,
            scaleAmp: 0.05 + this.random() * 0.2,
            twistFreq: 0.3 + this.random() * 0.7,
            twistAmp: 0.02 + this.random() * 0.08,
            moveFreq: {
                x: 0.4 + this.random() * 0.8,
                y: 0.45 + this.random() * 0.8,
                z: 0.5 + this.random() * 0.8
            },
            moveAmp: 0.3 + this.random() * 0.7,
            sphereFreq: {
                x: 0.3 + this.random() * 0.7,
                y: 0.35 + this.random() * 0.7,
                z: 0.4 + this.random() * 0.7
            },
            rotationSpeed: {
                y: 0.0005 + this.random() * 0.002,
                x: 0.00025 + this.random() * 0.001
            },
            colorShift: this.random() * 0.5,
            pulseFreq: 0.1 + this.random() * 0.4
        };
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);

        for (let i = 0; i < this.particleCount; i++) {
            let x, y, z;
            switch (this.animationParams.baseShape) {
                case 0: // Cube
                    x = (this.random() - 0.5) * 50;
                    y = (this.random() - 0.5) * 50;
                    z = (this.random() - 0.5) * 50;
                    break;
                case 1: // Sphere
                    const theta = this.random() * Math.PI * 2;
                    const phi = Math.acos(2 * this.random() - 1);
                    const radius = 25 + this.random() * 25;
                    x = radius * Math.sin(phi) * Math.cos(theta);
                    y = radius * Math.sin(phi) * Math.sin(theta);
                    z = radius * Math.cos(phi);
                    break;
                case 2: // Torus
                    const u = this.random() * Math.PI * 2;
                    const v = this.random() * Math.PI * 2;
                    const R = 30;
                    const r = 10;
                    x = (R + r * Math.cos(v)) * Math.cos(u);
                    y = (R + r * Math.cos(v)) * Math.sin(u);
                    z = r * Math.sin(v);
                    break;
                case 3: // Spiral
                    const t = this.random() * 10;
                    x = t * Math.cos(t * 2);
                    y = t * 4;
                    z = t * Math.sin(t * 2);
                    break;
            }
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            const color = new THREE.Color();
            color.setHSL(this.random(), 0.7, 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.particles.add(this.particleSystem);
    }

    addEvents() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = this.clock.getElapsedTime() * this.timeScale;
        const params = this.animationParams;

        const positions = this.particleSystem.geometry.attributes.position.array;
        const colors = this.particleSystem.geometry.attributes.color.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];

            const scale = Math.sin(time * params.scaleFreq) * params.scaleAmp + 1.05;
            const twist = Math.sin(time * params.twistFreq) * Math.PI * params.twistAmp;

            let newX = Math.sin(twist) * y * scale + Math.cos(twist) * x * scale;
            let newY = Math.sin(twist) * x * scale + Math.cos(twist) * y * scale;
            let newZ = z * scale;

            // Reduce the movement amplitude
            const moveAmp = params.moveAmp * 0.3;
            newX += Math.sin(time * params.moveFreq.x + i * 0.01) * moveAmp;
            newY += Math.cos(time * params.moveFreq.y + i * 0.01) * moveAmp;
            newZ += Math.sin(time * params.moveFreq.z + i * 0.01) * moveAmp;

            // Add a force that pulls particles back to the center
            const pullStrength = 0.02;
            newX -= x * pullStrength;
            newY -= y * pullStrength;
            newZ -= z * pullStrength;

            const maxDistance = 28;
            const minDistance = 9;
            const distance = Math.sqrt(newX * newX + newY * newY + newZ * newZ);
            if (distance > maxDistance) {
                const factor = maxDistance / distance;
                newX *= factor;
                newY *= factor;
                newZ *= factor;
            } else if (distance < minDistance) {
                const factor = minDistance / distance;
                newX *= factor;
                newY *= factor;
                newZ *= factor;
            }

            positions[i] = newX;
            positions[i + 1] = newY;
            positions[i + 2] = newZ;

            // Color shifting
            const hue = (colors[i] + colors[i + 1] + colors[i + 2]) / 3 + params.colorShift * Math.sin(time * params.pulseFreq + i * 0.01);
            const color = new THREE.Color();
            color.setHSL(hue % 1, 0.7, 0.5);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;

        this.particles.rotation.y += params.rotationSpeed.y;
        this.particles.rotation.x += params.rotationSpeed.x;

        this.renderer.render(this.scene, this.camera);
    }
}

new AnimatedBackground();