document.addEventListener('DOMContentLoaded', () => {

    /* ==============================
       Mobile Navigation Menu
       ============================== */
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    /* ==============================
       Scroll Observer for Fade-in Animations
       ============================== */
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    /* ==============================
       Active Nav Link on Scroll
       ============================== */
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    /* ==============================
       Dynamic Galleries Loader
       ============================== */
    function loadGallery(folderPath, containerSelector) {
        const track = document.querySelector(containerSelector);
        if (!track) return;
        
        let i = 1;
        track.innerHTML = ''; // Clear hardcoded emojis

        function tryLoadImage() {
            const img = new Image();
            img.src = `${folderPath}/${i}.jpg`;
            img.className = 'gallery-item';
            
            img.onload = () => {
                track.appendChild(img);
                i++;
                tryLoadImage();
            };

            img.onerror = () => {
                if (i > 1) {
                    // Duplicate for infinite CSS scrolling
                    const currentItems = Array.from(track.children);
                    currentItems.forEach(item => {
                        const clone = item.cloneNode(true);
                        track.appendChild(clone);
                    });
                }
            };
        }

        tryLoadImage();
    }

    loadGallery('Gallery', '#gallery .gallery-track');
    loadGallery('Testimonials', '#testimonials .gallery-track');

});
