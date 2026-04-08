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

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
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
       Dynamic Galleries Loader & Scroller
       ============================== */
    function loadGallery(folderPath, containerSelector, speed) {
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
                    // Duplicate elements to allow seamless infinite auto-scroll illusion
                    const currentItems = Array.from(track.children);
                    currentItems.forEach(item => {
                        const clone = item.cloneNode(true);
                        track.appendChild(clone);
                    });
                    makeTrackDraggableAndAutoScroll(track.parentElement, speed);
                }
            };
        }

        tryLoadImage();
    }

    function makeTrackDraggableAndAutoScroll(slider, speed) {
        // Enforce LTR rendering on the slider so scrollLeft mathematics are standardized
        // across all browsers (stops RTL scroll logic clamping bugs)
        slider.setAttribute('dir', 'ltr');

        let isDown = false;
        let startX;
        let scrollLeft;
        let animationId;

        if (speed < 0) {
            slider.scrollLeft = slider.scrollWidth / 2;
        } else {
            slider.scrollLeft = 0;
        }

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            cancelAnimationFrame(animationId);
        });

        const startOver = () => {
            isDown = false;
            slider.style.cursor = 'grab';
            play();
        };

        slider.addEventListener('mouseleave', startOver);
        slider.addEventListener('mouseup', startOver);

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });

        slider.addEventListener('touchstart', () => cancelAnimationFrame(animationId), { passive: true });
        slider.addEventListener('touchend', startOver, { passive: true });

        function play() {
            cancelAnimationFrame(animationId);
            function scroll() {
                if (speed > 0 && slider.scrollLeft >= slider.scrollWidth / 2) {
                    slider.scrollLeft -= slider.scrollWidth / 2;
                } else if (speed < 0 && slider.scrollLeft <= 0) {
                    slider.scrollLeft += slider.scrollWidth / 2;
                }

                slider.scrollLeft += speed;
                animationId = requestAnimationFrame(scroll);
            }
            animationId = requestAnimationFrame(scroll);
        }

        slider.style.cursor = 'grab';
        play();
    }

    loadGallery('Gallery', '#gallery .gallery-track', 1);
    loadGallery('Testimonials', '#testimonials .gallery-track', -1);
});
