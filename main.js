
        // Intersection Observer for animation on scroll
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = 1;
              entry.target.style.transform = 'translateY(0)';
            }
          });
        }, { threshold: 0.1 });
  
        document.querySelectorAll('.feature-card, .stat-card').forEach((el) => {
          el.style.opacity = 0;
          el.style.transform = 'translateY(20px)';
          el.style.transition = 'all 0.6s ease-out';
          observer.observe(el);
        });
  
        // Autoplay music on page load
        document.addEventListener('DOMContentLoaded', function() {
          const audio = document.getElementById('backgroundMusic');
          const musicControl = document.getElementById('musicControl');
          const musicIcon = musicControl.querySelector('i');
          
          // Try to autoplay music when page loads
          let playPromise = audio.play();
          
          if (playPromise !== undefined) {
            playPromise.then(_ => {
              musicControl.classList.add('playing');
              musicIcon.classList.remove('fa-music');
              musicIcon.classList.add('fa-pause');
            })
            .catch(error => {
              console.log("Autoplay prevented:", error);
              musicIcon.classList.add('fa-music');
              musicControl.classList.remove('playing');
            });
          }
  
          musicControl.addEventListener('click', function() {
            if (audio.paused) {
              audio.play();
              musicControl.classList.add('playing');
              musicIcon.classList.remove('fa-music');
              musicIcon.classList.add('fa-pause');
            } else {
              audio.pause();
              musicControl.classList.remove('playing');
              musicIcon.classList.remove('fa-pause');
              musicIcon.classList.add('fa-music');
            }
          });
        });
  
        let lastScroll = 0;
        const navbar = document.querySelector('.navbar');
  
        window.addEventListener('scroll', () => {
          const currentScroll = window.pageYOffset;
          
          if (currentScroll > lastScroll && currentScroll > 72) {
            navbar.classList.add('navbar-hidden');
          } else {
            navbar.classList.remove('navbar-hidden');
          }
          
          lastScroll = currentScroll;
        });
  
        function animateValue(obj, start, end, duration) {
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            if (end.includes('+')) {
              obj.innerHTML = Math.floor(progress * parseInt(end)) + '+';
            } else if (end.includes('K')) {
              obj.innerHTML = '$' + Math.floor(progress * parseInt(end)) + 'K';
            } else {
              obj.innerHTML = '$' + Math.floor(progress * parseInt(end.replace(/\D/g,'')));
            }
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
  
        const statsObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const value = entry.target.innerText;
              entry.target.innerText = '0';
              setTimeout(() => {
                animateValue(entry.target, 0, value, 1500);
              }, 500);
            }
          });
        }, { threshold: 0.5 });
  
        document.querySelectorAll('.stat-value').forEach((stat) => {
          statsObserver.observe(stat);
        });
  
        document.getElementById('copyContract').addEventListener('click', async function() {
          const contractText = this.querySelector('.contract-text').textContent;
          
          try {
            await navigator.clipboard.writeText(contractText);
            const notification = document.getElementById('copyNotification');
            notification.style.opacity = '1';
            
            setTimeout(() => {
              notification.style.opacity = '0';
            }, 2000);
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        });
  
        function createParticles() {
          const container = document.getElementById('particles');
          
          container.innerHTML = '';
          
          for(let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 5 + 15;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            particle.style.left = Math.random() * 100 + 'vw';
            
            const duration = Math.random() * 10 + 10;
            particle.style.animationDuration = duration + 's';
            
            particle.style.animationDelay = (Math.random() * 10) + 's';
            
            const rotation = Math.random() * 360;
            particle.style.transform = `rotate(${rotation}deg)`;
            
            container.appendChild(particle);
          }
        }
  
        createParticles();
  
        const roadmapObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        }, { threshold: 0.2 });
  
        document.querySelectorAll('.timeline-item').forEach((item) => {
          roadmapObserver.observe(item);
        });
  
        document.querySelectorAll('.timeline-content').forEach((item, index) => {
          item.addEventListener('mouseover', () => {
            item.style.transform = 'translateY(-10px) scale(1.02)';
          });
          
          item.addEventListener('mouseout', () => {
            item.style.transform = 'translateY(0) scale(1)';
          });
        });
  
        const chartScript = document.createElement('script');
        chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        chartScript.onload = initializeChart;
        document.head.appendChild(chartScript);
  
        function initializeChart() {
          const ctx = document.getElementById('distributionChart').getContext('2d');
          const distributionItems = document.querySelectorAll('.distribution-item');
          
          const data = {
            labels: Array.from(distributionItems).map(item => item.querySelector('.item-label').textContent),
            datasets: [{
              data: Array.from(distributionItems).map(item => item.dataset.percentage),
              backgroundColor: ['#3498db', '#2ecc71', '#e4ab1d', '#e74c3c', '#9b59b6'],
              borderWidth: 0,
            }]
          };
  
          const config = {
            type: 'pie',
            data: data,
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.label}: ${context.raw}%`;
                    }
                  }
                }
              },
              animation: {
                animateRotate: true,
                animateScale: true
              }
            }
          };
  
          const chart = new Chart(ctx, config);
          
          distributionItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
              const activeSegments = Array(data.datasets[0].data.length).fill(0.3);
              activeSegments[index] = 1;
              chart.setDatasetVisibility(0, true);
              chart.data.datasets[0].backgroundColor = chart.data.datasets[0].backgroundColor.map((color, i) => 
                i === index ? color : color + '4D'
              );
              chart.update();
            });
  
            item.addEventListener('mouseleave', () => {
              chart.data.datasets[0].backgroundColor = ['#3498db', '#2ecc71', '#e4ab1d', '#e74c3c', '#9b59b6'];
              chart.update();
            });
          });
        }
  
        document.addEventListener('DOMContentLoaded', function() {
          const buyButtons = document.querySelectorAll('a[href*="ston.fi"]');
          const modal = document.getElementById('disclaimerModal');
          const closeBtn = document.querySelector('.close-modal');
          const acceptBtn = document.getElementById('acceptRisks');
          let purchaseUrl = '';
  
          buyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
              e.preventDefault();
              purchaseUrl = this.href;
              modal.style.display = 'flex';
            });
          });
  
          function closeModal() {
            modal.style.display = 'none';
          }
  
          closeBtn.addEventListener('click', closeModal);
  
          modal.addEventListener('click', function(e) {
            if (e.target === modal) {
              closeModal();
            }
          });
  
          acceptBtn.addEventListener('click', function() {
            window.open(purchaseUrl, '_blank');
            closeModal();
          });
  
          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
              closeModal();
            }
          });
        });
  
        document.addEventListener('DOMContentLoaded', function() {
          const navLinks = document.querySelectorAll('.nav-links a');
          
          navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
              e.preventDefault();
              const targetId = this.getAttribute('href').substring(1);
              const targetSection = document.getElementById(targetId);
              
              if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
                });
              }
            });
          });
        });
  
        document.addEventListener('DOMContentLoaded', function() {
          const hamburger = document.querySelector('.hamburger-menu');
          const navLinks = document.querySelector('.nav-links');
          const navLinksItems = document.querySelectorAll('.nav-links a');
  
          navLinks.classList.add('mobile');
  
          hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
          });
  
          navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
              navLinks.classList.remove('active');
              hamburger.classList.remove('active');
              document.body.style.overflow = '';
            });
          });
  
          document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-links') && 
                !event.target.closest('.hamburger-menu') && 
                navLinks.classList.contains('active')) {
              navLinks.classList.remove('active');
              hamburger.classList.remove('active');
              document.body.style.overflow = '';
            }
          });
        });
      