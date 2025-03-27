function toggleProfileDropdown() {
            const dropdown = document.getElementById('profileDropdown');
            dropdown.classList.toggle('active');
        }

        function openProfile() {
            window.location.href = 'profile.html';
        }

        function openSettings() {
            window.location.href = 'settings.html';
        }

        function logout() {
            const alert = document.getElementById('cuteAlert');
            alert.style.display = 'block';
            createConfetti(10);

            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }

        function createConfetti(num) {
            const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#1e40af', '#2563eb'];
            
            for (let i = 0; i < num; i++) {
                const confetti = document.createElement('div');
                confetti.classList.add('confetti');
                
                confetti.style.left = `${Math.random() * window.innerWidth}px`;
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                document.body.appendChild(confetti);

                animateConfetti(confetti);
            }
        }

        function animateConfetti(element) {
            const duration = Math.random() * 3000 + 2000;
            const rotation = Math.random() * 360;

            element.animate([
                { 
                    top: '-10px', 
                    opacity: 1,
                    transform: `translateX(0px) rotate(0deg)`
                },
                { 
                    top: `${window.innerHeight}px`, 
                    opacity: 0,
                    transform: `translateX(${(Math.random() - 0.5) * 200}px) rotate(${rotation}deg)`
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
                fill: 'forwards'
            });

            setTimeout(() => {
                element.remove();
            }, duration);
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('profileDropdown');
            const avatarContainer = document.querySelector('.avatar-container');
            
            if (!avatarContainer.contains(event.target)) {
                dropdown.classList.remove('active');
            }
        });