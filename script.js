const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const particlesCount = 100;
let particleColor = "#ffffff"; // Default color for particles, set to white
let isRainbowMode = false;
let hue = 0;  // Hue value for the rainbow effect

const mouse = {
    x: undefined,
    y: undefined,
    radius: 150
};

canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

const music = document.getElementById('backgroundMusic');
const startBtn = document.getElementById('startBtn');
const settingsBtn = document.getElementById('settingsBtn');
const colorPicker = document.getElementById('colorPicker');
const rainbowBtn = document.getElementById('rainbowBtn');

startBtn.addEventListener('click', function() {
    init();
    animate();
    music.play();

    canvas.style.opacity = '1'; // Fade in canvas
    startBtn.classList.add('hidden');  // Fade out button
    settingsBtn.style.opacity = '1'; // Show settings button with fade-in effect
    rainbowBtn.style.opacity = '1'; // Show rainbow button with fade-in effect
});

settingsBtn.addEventListener('click', () => {
    colorPicker.click(); // Trigger the hidden color input when settings button is clicked
});

colorPicker.addEventListener('input', (event) => {
    particleColor = event.target.value;
    if (isRainbowMode) {  // If the user changes the color while in rainbow mode, turn off rainbow mode
        isRainbowMode = false;
        rainbowBtn.textContent = "Rainbow Mode: Off";
    }
});

rainbowBtn.addEventListener('click', function() {
    isRainbowMode = !isRainbowMode;  // Toggle the rainbow mode
    
    if (isRainbowMode) {
        rainbowBtn.textContent = "Rainbow Mode: On";
    } else {
        rainbowBtn.textContent = "Rainbow Mode: Off";
    }
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxForce = 5;  
            let force = (mouse.radius - distance) / mouse.radius; 
            let directionX = forceDirectionX * force * maxForce;
            let directionY = forceDirectionY * force * maxForce;

            this.x -= directionX;
            this.y -= directionY;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.01;  // Slow decay for all particles
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        if (isRainbowMode) {
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;  // Use HSL color with changing hue for rainbow effect
            hue += 0.1;  // Decrement to 0.1 for slower hue transition. Adjust as necessary.
            if (hue >= 360) hue = 0;  // Reset hue after a full rotation
        } else {
            ctx.fillStyle = particleColor;
        }
        
        ctx.fill();
    }
}

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 0.2;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }

        if (particlesArray[i].size <= 0.2) {
            particlesArray.splice(i, 1);
            i--;
        }
    }

    while (particlesArray.length < particlesCount) {
        particlesArray.push(new Particle());
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < particlesCount; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}
