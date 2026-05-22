/* ==========================================================================
   AI SAFETY PORTFOLIO - CORE ENGINE (app.js)
   Features: Navigation, Particle Backdrop, Reward Hacking Simulator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. PAGE TABS NAVIGATION & MOBILE MENU
    // ==========================================================================
    const navLinks = document.querySelectorAll('.nav-link, #logo-nav-link, #hero-btn-work, #hero-btn-contact');
    const pages = document.querySelectorAll('.portfolio-page');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    // Switch between pages smoothly
    function navigateToPage(targetId) {
        // Remove active class from all links and pages
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            // Re-activate specific link matching targetId
            if (link.dataset.target === targetId) {
                link.classList.add('active');
            }
        });

        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === `page-${targetId}`) {
                page.classList.add('active');
            }
        });

        // Reset scroll position to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Close mobile nav if open
        if (mainNav.classList.contains('open')) {
            mainNav.classList.remove('open');
            mobileMenuBtn.classList.remove('active');
        }
    }

    // Attach click events to nav links and custom buttons
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.target;
            navigateToPage(targetId);
            
            // Adjust url hash silently
            history.pushState(null, null, `#${targetId}`);
        });
    });

    // Mobile Navigation Drawer Toggle
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        mobileMenuBtn.classList.toggle('active');
    });

    // Check location hash on load to open direct links
    const currentHash = window.location.hash.substring(1);
    const validTabs = ['home', 'about', 'work', 'cool-stuff', 'contact'];
    if (currentHash && validTabs.includes(currentHash)) {
        navigateToPage(currentHash);
    }


    // ==========================================================================
    // 2. INTERACTIVE PARTICLES BACKGROUND
    // ==========================================================================
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const maxParticles = 60;
    const connectionDist = 120;

    // Resize handler
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
            this.size = Math.random() * 2 + 1;
            // Theme accents
            const roll = Math.random();
            if (roll < 0.6) {
                this.color = 'rgba(251, 113, 133, 0.45)'; // Sunset Rose Blush
            } else if (roll < 0.8) {
                this.color = 'rgba(167, 139, 250, 0.45)'; // Lavender
            } else {
                this.color = 'rgba(134, 239, 172, 0.35)'; // Mint Sage
            }
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update & Draw Particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < connectionDist) {
                    const alpha = (1 - dist / connectionDist) * 0.08;
                    ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    animate();


    // ==========================================================================
    // 3. REWARD HACKING SIMULATOR
    // ==========================================================================
    
    // DOM Selectors
    const sliderClean = document.getElementById('reward-clean');
    const sliderVisual = document.getElementById('reward-visual');
    const sliderEffort = document.getElementById('penalty-effort');
    
    const valClean = document.getElementById('val-clean');
    const valVisual = document.getElementById('val-visual');
    const valEffort = document.getElementById('val-effort');
    
    const simGrid = document.getElementById('sim-grid');
    const btnRunSim = document.getElementById('btn-run-sim');
    
    const statDust = document.getElementById('stat-dust');
    const statCamera = document.getElementById('stat-camera');
    const statEnergy = document.getElementById('stat-energy');
    
    const outcomeTitle = document.getElementById('sim-outcome-title');
    const outcomeDesc = document.getElementById('sim-outcome-desc');
    const statusBox = document.getElementById('sim-status-box');

    // Update displayed slider values
    sliderClean.addEventListener('input', () => valClean.textContent = Number(sliderClean.value).toFixed(1));
    sliderVisual.addEventListener('input', () => valVisual.textContent = Number(sliderVisual.value).toFixed(1));
    sliderEffort.addEventListener('input', () => valEffort.textContent = Number(sliderEffort.value).toFixed(1));

    // Simulation Grid Specs
    const GRID_SIZE = 5;
    let gridObjects = {
        robot: { x: 2, y: 2 }, // Center start
        dust: [
            { x: 1, y: 1, active: true },
            { x: 3, y: 1, active: true },
            { x: 1, y: 3, active: true },
            { x: 3, y: 3, active: true }
        ],
        camera: { x: 4, y: 0 }, // Top Right corner
        rug: { x: 0, y: 4 }     // Bottom Left corner
    };

    let isRugStuffed = false;

    // Render static grid initially
    function initGrid() {
        simGrid.innerHTML = '';
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // Add objects based on coordinates
                if (gridObjects.robot.x === x && gridObjects.robot.y === y) {
                    cell.classList.add('cell-robot');
                    if (gridObjects.rug.x === x && gridObjects.rug.y === y) {
                        cell.classList.add('cell-rug');
                    }
                } else if (gridObjects.camera.x === x && gridObjects.camera.y === y) {
                    cell.classList.add('cell-camera');
                } else if (gridObjects.rug.x === x && gridObjects.rug.y === y) {
                    cell.classList.add('cell-rug');
                    if (isRugStuffed) {
                        cell.classList.add('cell-rug-stuffed');
                    }
                } else {
                    const dustObj = gridObjects.dust.find(d => d.x === x && d.y === y);
                    if (dustObj && dustObj.active) {
                        cell.classList.add('cell-dust');
                    }
                }
                simGrid.appendChild(cell);
            }
        }
    }
    
    // Initial Render
    initGrid();

    let simInterval = null;

    // Simulation pathfinding loop
    btnRunSim.addEventListener('click', () => {
        if (btnRunSim.disabled) return;
        
        // Reset grid state
        isRugStuffed = false;
        gridObjects.robot = { x: 2, y: 2 };
        gridObjects.dust.forEach(d => d.active = true);
        initGrid();
        
        // Disable controls during simulation
        btnRunSim.disabled = true;
        sliderClean.disabled = true;
        sliderVisual.disabled = true;
        sliderEffort.disabled = true;
        
        // Read Sliders
        const wClean = parseFloat(sliderClean.value);
        const wVisual = parseFloat(sliderVisual.value);
        const wEffort = parseFloat(sliderEffort.value);
        
        // Clear old intervals
        if (simInterval) clearInterval(simInterval);
        
        // Reset stats UI
        statDust.textContent = '0%';
        statCamera.textContent = '0%';
        statEnergy.textContent = '0%';
        
        statusBox.className = 'sim-feedback-box';
        outcomeTitle.textContent = 'Agent Running...';
        outcomeDesc.textContent = 'The agent is exploring optimal paths based on the parameters set in its reward function.';

        // DETERMINE POLICY ALIGNMENT TYPE
        let policyType = 'aligned';
        
        // Case Analysis:
        // 1. Lazy Agent: High effort cost makes moving not worth any reward
        if (wEffort >= 1.5 && wClean <= 1.0 && wVisual <= 1.0) {
            policyType = 'lazy';
        }
        // 2. Reward Hacking: High visual reward makes masking/gaming lucrative relative to actual cleaning
        else if (wVisual >= 1.5 && wClean < wVisual) {
            // If effort is also relatively high, the robot takes the shortcut: blocks camera.
            if (wEffort >= 1.0) {
                policyType = 'hacked'; // Camera block
            } else {
                policyType = 'rug-hacked'; // Sweeps under rug
            }
        }
        // 3. Aligned Agent: Balanced
        else {
            policyType = 'aligned';
        }

        // Generate Path Steps
        let path = [];
        let cleanLog = []; // track state of dust piles along the steps
        
        if (policyType === 'lazy') {
            // Lazy agent: does not move at all
            path = [{ x: 2, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 2 }];
            cleanLog = [
                [true, true, true, true],
                [true, true, true, true],
                [true, true, true, true]
            ];
        } 
        else if (policyType === 'hacked') {
            // Reward hacked agent: moves directly to camera (4,0) to block sensor, removing no dust.
            // Move: (2,2) -> (2,1) -> (3,0) -> (4,0) (camera)
            path = [
                { x: 2, y: 2 },
                { x: 3, y: 2 },
                { x: 4, y: 1 },
                { x: 4, y: 0 }
            ];
            cleanLog = [
                [true, true, true, true],
                [true, true, true, true],
                [true, true, true, true],
                [true, true, true, true]
            ];
        } 
        else if (policyType === 'rug-hacked') {
            // Reward hacked agent (sweeping under rug): collects all dust and dumps under the rug (0,4)
            // Path: (2,2) -> (1,1) -> (3,1) -> (3,3) -> (1,3) -> (0,4)
            path = [
                { x: 2, y: 2 },
                { x: 1, y: 1 }, // Collect 1
                { x: 3, y: 1 }, // Collect 2
                { x: 3, y: 3 }, // Collect 3
                { x: 1, y: 3 }, // Collect 4
                { x: 0, y: 4 }  // Dump under rug
            ];
            cleanLog = [
                [true, true, true, true],
                [false, true, true, true],
                [false, false, true, true],
                [false, false, true, false],
                [false, false, false, false],
                [false, false, false, false]
            ];
        }
        else {
            // Aligned agent: Cleans dust in sequence
            // Path: (2,2) -> (1,1) -> (3,1) -> (3,3) -> (1,3) -> (2,2)
            path = [
                { x: 2, y: 2 },
                { x: 1, y: 1 }, // Clean dust 1
                { x: 3, y: 1 }, // Clean dust 2
                { x: 3, y: 3 }, // Clean dust 3
                { x: 1, y: 3 }, // Clean dust 4
                { x: 2, y: 2 }  // Return home to rest
            ];
            cleanLog = [
                [true, true, true, true],      // Start
                [false, true, true, true],     // Clean 1
                [false, false, true, true],    // Clean 2
                [false, false, true, false],   // Clean 3 (Cleans 3,3; 1,3 is still active)
                [false, false, false, false],  // Clean 4 (Cleans 1,3)
                [false, false, false, false]   // Home
            ];
        }

        let currentStep = 0;
        
        simInterval = setInterval(() => {
            if (currentStep >= path.length) {
                // Simulation Finished!
                clearInterval(simInterval);
                btnRunSim.disabled = false;
                sliderClean.disabled = false;
                sliderVisual.disabled = false;
                sliderEffort.disabled = false;
                
                // Show final result summaries
                if (policyType === 'lazy') {
                    statDust.textContent = '0%';
                    statCamera.textContent = '0%';
                    statEnergy.textContent = '0%';
                    statusBox.classList.add('lazy');
                    outcomeTitle.textContent = 'System Stalled: Lazy Agent';
                    outcomeDesc.textContent = 'Specification Gaming Result: The energy cost (Effort Penalty) of cleaning outweighs the benefit. The agent computed that the optimal mathematical strategy is to stay completely stationary, letting the room remain dirty.';
                } 
                else if (policyType === 'hacked') {
                    statDust.textContent = '0%';
                    statCamera.textContent = '100%';
                    statEnergy.textContent = '20%';
                    statusBox.classList.add('hacked');
                    outcomeTitle.textContent = 'CRITICAL ALERT: Camera Blocked!';
                    outcomeDesc.textContent = 'Specification Gaming Result: Because "Visual Cleanliness" was highly rewarded but effort penalty was also moderate, the lazy agent chose the lowest-effort path to trick the camera sensor: it drove directly to and blocked the camera lens. Camera reports 100% clean, but actual dust is still 0%.';
                } 
                else if (policyType === 'rug-hacked') {
                    statDust.textContent = '0%';
                    statCamera.textContent = '100%';
                    statEnergy.textContent = '60%';
                    statusBox.classList.add('rug-hacked');
                    outcomeTitle.textContent = 'CRITICAL ALERT: Swept Under the Rug!';
                    outcomeDesc.textContent = 'Specification Gaming Result: Because "Visual Cleanliness" was highly rewarded, actual cleanliness was not, and effort penalty was low, the agent collected all dust piles but simply hid them under the rug (0,4). The camera reports 100% cleanliness, but 0% dust was actually removed from the room!';
                }
                else {
                    statDust.textContent = '100%';
                    statCamera.textContent = '100%';
                    statEnergy.textContent = '50%';
                    statusBox.classList.add('aligned');
                    outcomeTitle.textContent = 'Optimal Alignment Achieved!';
                    outcomeDesc.textContent = 'System Status: Aligned. The agent successfully mapped out all dirt pockets, cleared the room, and returned to a low-energy state to rest. The visual sensor matches the actual clean state.';
                }
                return;
            }

            // Move the robot step-by-step
            const position = path[currentStep];
            gridObjects.robot = { x: position.x, y: position.y };
            
            // Update dust piles state
            const currentDustStates = cleanLog[currentStep];
            for (let i = 0; i < gridObjects.dust.length; i++) {
                gridObjects.dust[i].active = currentDustStates[i];
            }

            // Re-render grid
            initGrid();

            // Highlight special object behaviors during pathing
            if (policyType === 'hacked' && position.x === 4 && position.y === 0) {
                // Flash the camera cell to indicate gaming/blocking
                const camCell = document.querySelector('[data-x="4"][data-y="0"]');
                if (camCell) camCell.style.boxShadow = '0 0 25px #fb7185';
            }

            // Update stats progressively
            if (policyType === 'aligned') {
                const activeCount = currentDustStates.filter(state => !state).length;
                const progressPct = Math.round((activeCount / 4) * 100);
                statDust.textContent = `${progressPct}%`;
                statCamera.textContent = `${progressPct}%`;
                statEnergy.textContent = `${Math.min(currentStep * 10, 50)}%`;
            } else if (policyType === 'rug-hacked') {
                statDust.textContent = '0%';
                const activeCount = currentDustStates.filter(state => !state).length;
                const progressPct = Math.round((activeCount / 4) * 100);
                statCamera.textContent = `${progressPct}%`;
                statEnergy.textContent = `${Math.min(currentStep * 12, 60)}%`;
                
                if (currentStep === 5) {
                    isRugStuffed = true;
                    initGrid();
                    const rugCell = document.querySelector('[data-x="0"][data-y="4"]');
                    if (rugCell) rugCell.style.boxShadow = '0 0 25px #fda4af';
                }
            } else if (policyType === 'hacked') {
                statDust.textContent = '0%';
                // The closer to camera, the visual sensor reads higher (due to proximity/blocking)
                const distToCam = Math.abs(position.x - 4) + Math.abs(position.y - 0);
                const visualScore = Math.max(0, 100 - distToCam * 20);
                statCamera.textContent = `${visualScore}%`;
                statEnergy.textContent = `${currentStep * 5}%`;
            } else {
                statDust.textContent = '0%';
                statCamera.textContent = '0%';
                statEnergy.textContent = '0%';
            }

            currentStep++;
        }, 600); // Step interval timing
    });

});
