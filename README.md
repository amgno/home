# Animated Background Startpage

This project creates a visually stunning startpage with an animated background using Three.js. It features a customizable set of quick links and a search functionality, all wrapped in a sleek, modern design.

## 🌟 Features

- **Animated 3D Background**: Mesmerizing particle animation that changes with each page load.
- **Quick Links**: Customizable shortcuts to your favorite websites.
- **Search Functionality**: Integrated search with customizable search engines.
- **Responsive Design**: Looks great on both desktop and mobile devices.
- **Dark/Light Mode**: Automatically adapts to your system preferences.

## 🚀 Getting Started

1. Clone this repository to your local machine.
2. Open `newindex.html` in your web browser.

## 🛠️ Customization

### Modifying Quick Links

Edit the `COMMANDS` map in the `<script>` section of `newindex.html`:


```127:154:newindex.html
    const COMMANDS = new Map([
        ['a', { name: 'Plex', url: 'https://app.plex.tv/desktop/' }],
        ['b', { name: 'Sonarr', url: 'http://ams:8989' }],
        ['c', { name: 'Radarr', url: 'http://ams:7878' }],
        ['i', { name: 'Transmission', url: 'http://ams:9091' }],
        ['f', { name: 'Metube', url: 'http://ams:84' }],
        ['g', { name: 'Jackett', url: 'http://ams:9117' }],
        ['h', { name: 'DNS', url: 'http://ams:8000' }],
        ['d', { name: 'Twitch', url: 'https://twitch.tv' }],
        ['j', { name: 'Twitter', url: 'https://x.com' }],
        ['k', { name: 'Gmail', url: 'https://gmail.com/' }],
        [
            's',
            {
                name: 'YouTube',
                searchTemplate: '/results?search_query={}',
                url: 'https://youtube.com/',
            },
        ],
        [
            'q',
            {
                name: 'Most used',
                searchTemplate: ':{}',
                suggestions: ['web.whatsapp.com', 'anilist.co', 'discord.com/app'],
                url: 'http://localhost:3000',
            },
        ],
```


### Changing Background Animation

Modify the `AnimatedBackground` class in `background.js` to adjust the particle animation:


```3:205:background.js
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
```


### Styling

Adjust the CSS variables in the `<style>` section of `newindex.html` to change colors and fonts:


```95:115:newindex.html
    :root {
        /* --border-radius: 20rem; */
        --color-background: #383838;
        /* 888 before */
        --color-text-subtle: #ffffff; 
        --color-text: #b40000;
        --font-family: -apple-system, Helvetica, sans-serif;
        --font-size: clamp(16px, 1.6vw, 18px);
        --font-weight-bold: 700;
        --font-weight-normal: 400;
        --space: .8rem;
        --transition-speed: 200ms;
    }

    /* @media (prefers-color-scheme: light) {
    :root {
      --color-background: #383838;
      --color-text-subtle: #ffffff;
      --color-text: #ffffff;
    }
  } */
```


## 🎨 Color Scheme

The default color scheme is a dark theme with red accents:

- Background: `#383838`
- Text: `#b40000`
- Subtle Text: `#ffffff`

To change the color scheme, modify the CSS variables in the `:root` selector.

## 🔧 Configuration

Adjust the `CONFIG` object in `newindex.html` to change behavior like opening links in new tabs or changing the default search engine:


```119:125:newindex.html
    const CONFIG = {
        commandPathDelimiter: '/',
        commandSearchDelimiter: ' ',
        defaultSearchTemplate: 'https://www.google.com/search?q={}',
        openLinksInNewTab: false,
        suggestionLimit: 4,
    };
```


## 📱 Responsive Design

The startpage is designed to work well on both desktop and mobile devices. The font size and layout adjust automatically based on the screen size.

## 🌐 Browser Compatibility

This startpage uses modern web technologies and is compatible with the latest versions of major browsers.

## 📜 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgements

- [Three.js](https://threejs.org/) for the 3D animation library
- Inspiration from various startpage designs in the r/startpages community

Enjoy your new animated startpage! 🎉