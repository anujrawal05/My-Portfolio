document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    //   CINEMATIC WELCOME POP-UP (NO TIMER)
    // =========================================
    const welcomeModal = document.getElementById('welcome-ad-popup');
    const closeWelcomeBtn = document.getElementById('close-welcome');

    if (welcomeModal && !sessionStorage.getItem('vankariAdShown')) {
        
        // Appear 3 seconds after page load
        setTimeout(() => {
            welcomeModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling

            const closeWelcomeAd = () => {
                welcomeModal.classList.remove('active');
                document.body.style.overflow = 'auto'; // Re-enable scrolling
            };

            // Close on 'X' click
            if(closeWelcomeBtn) closeWelcomeBtn.addEventListener('click', closeWelcomeAd);
            
            // Close when clicking outside the pop-up
            welcomeModal.addEventListener('click', (e) => {
                if(e.target === welcomeModal) closeWelcomeAd();
            });

            // Prevent showing again during this session
            sessionStorage.setItem('vankariAdShown', 'true');

        }, 3000); 
    }
    
    const isDesktop = window.innerWidth > 968;

    // --- TYPEWRITER EFFECT ---
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");
    const textArray = ["an Engineer.", "a Storyteller.", "a Spiritual Thinker.", "a Creative Innovator."];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; 
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if(cursorSpan) cursorSpan.classList.add("typing");
            if(typedTextSpan) typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            if(cursorSpan) cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if(cursorSpan) cursorSpan.classList.add("typing");
            if(typedTextSpan) typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            if(cursorSpan) cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if(textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (typedTextSpan) setTimeout(type, newTextDelay + 250);


    // --- DESKTOP SPECIFIC LOGIC ---
    if (isDesktop) {
        setTimeout(() => {
            document.querySelectorAll('.flash-message').forEach(msg => {
                msg.style.transition = "opacity 0.5s ease"; msg.style.opacity = '0';
                setTimeout(() => msg.remove(), 500);
            });
        }, 5000);

        const p2Slider = document.getElementById('project2-slider');
        if (p2Slider) {
            const images = [
                p2Slider.getAttribute('data-img1'),
                p2Slider.getAttribute('data-img2'),
                p2Slider.getAttribute('data-img3')
            ].filter(url => url != null);

            if (images.length > 1) {
                let currentIndex = 0;
                setInterval(() => {
                    currentIndex = (currentIndex + 1) % images.length;
                    p2Slider.src = images[currentIndex];
                }, 1000);
            }
        }

        const modal = document.getElementById('book-modal');
        const triggers = document.querySelectorAll('.book-trigger');
        const closeBtn = document.getElementById('close-book-modal');
        const book = document.getElementById('realistic-book');
        const hintLeft = document.getElementById('hint-left'), hintRight = document.getElementById('hint-right'), hintZoom = document.getElementById('hint-zoom');
        const popup = document.getElementById('buy-popup');
        const restartBtn = document.getElementById('restart-book');
        
        const zoomOverlay = document.getElementById('zoom-overlay');
        const zoomImg = document.getElementById('zoom-img');
        const zoomClose = document.querySelector('.zoom-close');
        const zoomables = document.querySelectorAll('.zoomable');

        let currentState = 0;
        let isAnimating = false;

        function openBookModal() {
            if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; resetBook(); }
        }
        triggers.forEach(trigger => trigger.addEventListener('click', openBookModal));

        function closeBookModal() {
            if (modal) { modal.classList.remove('active'); document.body.style.overflow = 'auto'; setTimeout(resetBook, 500); }
        }
        if (closeBtn) closeBtn.addEventListener('click', closeBookModal);

        if (book) {
            const cover = book.querySelector('.leaf-cover');
            if (cover) cover.addEventListener('click', () => { if (currentState === 0) book.classList.toggle('flip-cover'); });
        }

        zoomables.forEach(el => {
            el.addEventListener('click', (e) => {
                if (currentState >= 1 && currentState <= 5) {
                    e.stopPropagation();
                    if (currentState === 5 && !el.classList.contains('final-back-cover')) return;
                    zoomImg.src = el.tagName === 'IMG' ? el.src : el.querySelector('img').src;
                    zoomOverlay.classList.add('active');
                }
            });
        });

        function closeZoom() { zoomOverlay.classList.remove('active'); }
        if (zoomClose) zoomClose.addEventListener('click', closeZoom);
        
        if (zoomOverlay) {
            zoomOverlay.addEventListener('click', (e) => {
                if (e.target === zoomOverlay) closeZoom();
            });
        }
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeZoom(); });

        window.addEventListener('wheel', (e) => {
            if (!modal || !modal.classList.contains('active') || (zoomOverlay && zoomOverlay.classList.contains('active'))) return;
            handleBookScroll(e.deltaY > 0 ? 1 : -1);
        });

        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; });
        window.addEventListener('touchend', (e) => {
            if (!modal || !modal.classList.contains('active') || (zoomOverlay && zoomOverlay.classList.contains('active'))) return;
            if (touchStartY - e.changedTouches[0].clientY > 50) handleBookScroll(1);
            if (e.changedTouches[0].clientY - touchStartY > 50) handleBookScroll(-1);
        });

        function handleBookScroll(direction) {
            if (isAnimating) return;
            const nextState = currentState + direction;
            if (nextState >= 0 && nextState <= 6) {
                currentState = nextState; updateBookState(); isAnimating = true;
                setTimeout(() => isAnimating = false, 1000);
            }
        }

        function updateBookState() {
            if (!book) return;
            book.setAttribute('data-state', currentState >= 5 ? 5 : currentState);
            
            if (currentState === 0) {
                if(hintLeft) { hintLeft.innerHTML = '<i class="fas fa-hand-pointer"></i> Click cover to flip'; hintLeft.style.opacity = 1; }
                if(hintRight) { hintRight.innerHTML = 'Scroll to Open <i class="fas fa-arrow-down"></i>'; hintRight.style.opacity = 1; }
                if(hintZoom) hintZoom.style.opacity = 0;
            } else if (currentState >= 1 && currentState <= 4) {
                if(hintLeft) hintLeft.style.opacity = 0;
                if(hintRight) hintRight.innerHTML = 'Scroll to Turn Page <i class="fas fa-arrow-down"></i>';
                if(hintZoom) hintZoom.style.opacity = 1; 
            } else if (currentState === 5) {
                 if(hintRight) hintRight.style.opacity = 0;
                 if(hintZoom) hintZoom.innerHTML = '<i class="fas fa-search-plus"></i> Click to Zoom Cover';
                 if(hintZoom) hintZoom.style.opacity = 1;
            } else {
                if(hintLeft) hintLeft.style.opacity = 0;
                if(hintRight) hintRight.style.opacity = 0;
                if(hintZoom) hintZoom.style.opacity = 0;
            }

            book.querySelectorAll('.book-page').forEach((page, index) => {
                if (currentState > index + 1) page.classList.add('turned'); else page.classList.remove('turned');
            });

            if (popup) currentState === 6 ? popup.classList.add('active') : popup.classList.remove('active');
        }

        function resetBook() {
            currentState = 0;
            if(book) book.classList.remove('flip-cover');
            if(popup) popup.classList.remove('active');
            if(zoomOverlay) zoomOverlay.classList.remove('active');
            updateBookState();
        }
        if (restartBtn) restartBtn.addEventListener('click', resetBook);

    } else {
        // --- MOBILE-ONLY JAVASCRIPT ---
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.querySelector('.nav-menu');
        if (mobileMenu && navMenu) {
            mobileMenu.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }));
        }

        const mobileBookModal = document.getElementById('mobile-book-modal');
        const mobileBookTriggers = document.querySelectorAll('.book-trigger');
        const mobileBookClose = document.getElementById('close-mobile-book-modal');
        const mobileBuyBtn = document.getElementById('mobile-buy-btn');

        if (mobileBookModal) {
            mobileBookTriggers.forEach(trigger => {
                trigger.addEventListener('click', () => {
                    mobileBookModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });

            const closeMobileModal = () => {
                mobileBookModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            mobileBookClose.addEventListener('click', closeMobileModal);
            mobileBuyBtn.addEventListener('click', closeMobileModal);
        }

        setTimeout(() => {
            document.querySelectorAll('.flash-message').forEach(msg => {
                msg.style.transition = "opacity 0.5s ease"; msg.style.opacity = '0';
                setTimeout(() => msg.remove(), 500);
            });
        }, 5000);
    }

    // --- 3D FLIP CARD LOGIC (WORKS ON ALL DEVICES) ---
    const flipTriggers = document.querySelectorAll('.flip-trigger');
    const closeFlipBtns = document.querySelectorAll('.close-card');
    const flipOverlay = document.getElementById('flip-overlay');
    let activeCard = null;

    flipTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = trigger.closest('.flippable-card');
            const placeholder = card.closest('.project-card-placeholder');
            
            if (!card.classList.contains('active')) {
                card.classList.add('active');
                if (placeholder) placeholder.classList.add('active');
                if(flipOverlay) flipOverlay.classList.add('active');
                activeCard = card;
            }
        });
    });

    function closeActiveCard() {
        if (activeCard) {
            const cardToReset = activeCard;
            const placeholderToReset = activeCard.closest('.project-card-placeholder');

            activeCard.classList.remove('active');
            if(flipOverlay) flipOverlay.classList.remove('active');
            
            setTimeout(() => {
                 if (placeholderToReset) placeholderToReset.classList.remove('active');
                 if (activeCard === cardToReset) activeCard = null;
            }, 900);
        }
    }

    closeFlipBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeActiveCard();
        });
    });

    if(flipOverlay) {
        flipOverlay.addEventListener('click', closeActiveCard);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeActiveCard();
    });

    // =========================================
    //   VANKARI IMMERSIVE EXPERIENCE & SOUND
    // =========================================
    const vankariZone = document.getElementById('vankari-experience-zone');
    const body = document.body;
    
    if (vankariZone) {
        // Path check zarur kar lena apni audio file ka
        const bassSound = new Audio('/static/audio/vankari-sound.mp3'); 
        bassSound.volume = 0.8; 
        let soundTimeout;

        const options = {
            root: null,
            threshold: 0.6, 
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Dark theme activate
                    body.classList.add('vankari-active');

                    // Sound Play karna
                    if (bassSound.paused) {
                        bassSound.currentTime = 0;
                        bassSound.play().catch(e => console.log("Browser blocked autoplay:", e));
                        
                        clearTimeout(soundTimeout);
                        soundTimeout = setTimeout(() => {
                            let vol = bassSound.volume;
                            let fadeOut = setInterval(() => {
                                if (vol > 0.05) {
                                    vol -= 0.05;
                                    bassSound.volume = vol;
                                } else {
                                    clearInterval(fadeOut);
                                    bassSound.pause();
                                    bassSound.volume = 0.8; 
                                }
                            }, 50);
                        }, 2500); 
                    }

                } else {
                    // Dark theme deactivate
                    body.classList.remove('vankari-active');
                    
                    // Sound stop
                    bassSound.pause();
                    bassSound.currentTime = 0;
                    clearTimeout(soundTimeout);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, options);
        observer.observe(vankariZone);
    }
    // =========================================
    //   SANATAN SERIES VIDEO MODAL LOGIC
    // =========================================
    const openSanatanBtn = document.getElementById('open-sanatan-modal');
    const closeSanatanBtn = document.getElementById('close-sanatan-modal');
    const sanatanModal = document.getElementById('sanatan-video-modal');
    const sanatanIframe = document.getElementById('sanatan-yt-iframe');
    const modalBackdrop = document.querySelector('.modal-backdrop');

    if (openSanatanBtn && sanatanModal) {
        // Modal open karna
        openSanatanBtn.addEventListener('click', () => {
            sanatanModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Pichle page ka scroll band karna
        });

        // Modal close karna function
        const closeSanatanModal = () => {
            sanatanModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Scroll wapas on karna
            
            // Video ko pause karne ki Ninja trick (iframe ka source refresh kar dena)
            if (sanatanIframe) {
                let currentSrc = sanatanIframe.src;
                sanatanIframe.src = currentSrc; 
            }
        };

        // Cross (X) par click karke band karna
        closeSanatanBtn.addEventListener('click', closeSanatanModal);
        
        // Bahar dark area par click karke band karna
        modalBackdrop.addEventListener('click', closeSanatanModal);

        // Escape (Esc) button dabane par band karna
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sanatanModal.classList.contains('active')) {
                closeSanatanModal();
            }
        });
    }
});
