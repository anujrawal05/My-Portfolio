document.addEventListener('DOMContentLoaded', () => {

    const isDesktop = window.innerWidth > 968;

    // =========================================
    //   1. CINEMATIC WELCOME POP-UP
    // =========================================
    const welcomeModal = document.getElementById('welcome-ad-popup');
    const closeWelcomeBtn = document.getElementById('close-welcome');

    if (welcomeModal && !sessionStorage.getItem('vankariAdShown')) {
        setTimeout(() => {
            welcomeModal.classList.add('active');
            document.body.style.overflow = 'hidden'; 

            const closeWelcomeAd = () => {
                welcomeModal.classList.remove('active');
                document.body.style.overflow = 'auto'; 
            };

            if(closeWelcomeBtn) closeWelcomeBtn.addEventListener('click', closeWelcomeAd);
            welcomeModal.addEventListener('click', (e) => {
                if(e.target === welcomeModal) closeWelcomeAd();
            });

            sessionStorage.setItem('vankariAdShown', 'true');
        }, 3000); 
    }

    // =========================================
    //   2. TYPEWRITER EFFECT (Only on Home Page)
    // =========================================
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");
    
    if (typedTextSpan && cursorSpan) {
        const textArray = ["an Engineer.", "a Storyteller.", "a Spiritual Thinker.", "a Creative Innovator."];
        const typingDelay = 100;
        const erasingDelay = 50;
        const newTextDelay = 2000; 
        let textArrayIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                cursorSpan.classList.add("typing");
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                cursorSpan.classList.add("typing");
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                textArrayIndex++;
                if(textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 1100);
            }
        }

        setTimeout(type, newTextDelay + 250);
    }

    // =========================================
    //   3. MOBILE MENU LOGIC
    // =========================================
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

    // =========================================
    //   4. 3D BOOK FLIP MODAL (DESKTOP)
    // =========================================
    const modal = document.getElementById('book-modal');
    const triggers = document.querySelectorAll('.book-trigger');
    const closeBtn = document.getElementById('close-book-modal');
    const book = document.getElementById('realistic-book');
    const hintLeft = document.getElementById('hint-left');
    const hintRight = document.getElementById('hint-right');
    const hintZoom = document.getElementById('hint-zoom');
    const popup = document.getElementById('buy-popup');
    const restartBtn = document.getElementById('restart-book');
    
    const zoomOverlay = document.getElementById('zoom-overlay');
    const zoomImg = document.getElementById('zoom-img');
    const zoomClose = document.querySelector('.zoom-close');
    const zoomables = document.querySelectorAll('.zoomable');

    let currentState = 0;
    let isAnimating = false;

    if (modal && isDesktop) {
        function openBookModal() {
            modal.classList.add('active'); 
            document.body.style.overflow = 'hidden'; 
            resetBook();
        }
        
        triggers.forEach(trigger => trigger.addEventListener('click', openBookModal));

        function closeBookModal() {
            modal.classList.remove('active'); 
            document.body.style.overflow = 'auto'; 
            setTimeout(resetBook, 500);
        }
        
        if (closeBtn) closeBtn.addEventListener('click', closeBookModal);

        if (book) {
            const cover = book.querySelector('.leaf-cover');
            if (cover) cover.addEventListener('click', () => { 
                if (currentState === 0) book.classList.toggle('flip-cover'); 
            });
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

        if (zoomClose) zoomClose.addEventListener('click', () => zoomOverlay.classList.remove('active'));
        if (zoomOverlay) zoomOverlay.addEventListener('click', (e) => { 
            if (e.target === zoomOverlay) zoomOverlay.classList.remove('active'); 
        });

        window.addEventListener('wheel', (e) => {
            if (!modal.classList.contains('active') || (zoomOverlay && zoomOverlay.classList.contains('active'))) return;
            handleBookScroll(e.deltaY > 0 ? 1 : -1);
        });

        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; });
        window.addEventListener('touchend', (e) => {
            if (!modal.classList.contains('active') || (zoomOverlay && zoomOverlay.classList.contains('active'))) return;
            if (touchStartY - e.changedTouches[0].clientY > 50) handleBookScroll(1);
            if (e.changedTouches[0].clientY - touchStartY > 50) handleBookScroll(-1);
        });

        function handleBookScroll(direction) {
            if (isAnimating) return;
            const nextState = currentState + direction;
            if (nextState >= 0 && nextState <= 6) {
                currentState = nextState; 
                updateBookState(); 
                isAnimating = true;
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
    }

    // =========================================
    //   5. MOBILE BOOK MODAL
    // =========================================
    const mobileBookModal = document.getElementById('mobile-book-modal');
    const mobileBookClose = document.getElementById('close-mobile-book-modal');
    const mobileBuyBtn = document.getElementById('mobile-buy-btn');

    if (mobileBookModal && !isDesktop) {
        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                mobileBookModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeMobileModal = () => {
            mobileBookModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        if(mobileBookClose) mobileBookClose.addEventListener('click', closeMobileModal);
        if(mobileBuyBtn) mobileBuyBtn.addEventListener('click', closeMobileModal);
    }

    // =========================================
    //   6. 3D FLIP CARDS (PROJECTS)
    // =========================================
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
        btn.addEventListener('click', (e) => { e.stopPropagation(); closeActiveCard(); });
    });
    if(flipOverlay) flipOverlay.addEventListener('click', closeActiveCard);


    // =========================================
    //   7. SANATAN SERIES VIDEO MODAL
    // =========================================
    const openSanatanBtn = document.getElementById('open-sanatan-modal');
    const closeSanatanBtn = document.getElementById('close-sanatan-modal');
    const sanatanModal = document.getElementById('sanatan-video-modal');
    const sanatanIframe = document.getElementById('sanatan-yt-iframe');

    if (openSanatanBtn && sanatanModal) {
        openSanatanBtn.addEventListener('click', () => {
            sanatanModal.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });

        const closeSanatanModal = () => {
            sanatanModal.classList.remove('active');
            document.body.style.overflow = 'auto'; 
            if (sanatanIframe) {
                let currentSrc = sanatanIframe.src;
                sanatanIframe.src = currentSrc; // Pauses YouTube video by resetting iframe
            }
        };

        if(closeSanatanBtn) closeSanatanBtn.addEventListener('click', closeSanatanModal);
        
        const sBackdrop = sanatanModal.querySelector('.modal-backdrop');
        if(sBackdrop) sBackdrop.addEventListener('click', closeSanatanModal);
    }

    // =========================================
    //   8. VANKARI SERIES VIDEO MODAL (LOCAL MP4)
    // =========================================
    const openVankariBtn = document.getElementById('open-vankari-modal');
    const closeVankariBtn = document.getElementById('close-vankari-modal');
    const vankariModal = document.getElementById('vankari-video-modal');
    const vankariVideoPlayer = document.getElementById('vankari-video-player');
    const vankariBackdrop = document.getElementById('vankari-backdrop');

    if (openVankariBtn && vankariModal) {
        openVankariBtn.addEventListener('click', () => {
            vankariModal.classList.add('active');
            document.body.style.overflow = 'hidden'; 
            
            // Auto-play video on open
            if(vankariVideoPlayer) {
                vankariVideoPlayer.currentTime = 0;
                vankariVideoPlayer.play().catch(e => console.log("Autoplay prevented:", e));
            }
        });

        const closeVankariModal = () => {
            vankariModal.classList.remove('active');
            document.body.style.overflow = 'auto'; 
            
            // Pause video on close
            if (vankariVideoPlayer) {
                vankariVideoPlayer.pause(); 
            }
        };

        if(closeVankariBtn) closeVankariBtn.addEventListener('click', closeVankariModal);
        if(vankariBackdrop) vankariBackdrop.addEventListener('click', closeVankariModal);
    }

    // =========================================
    //   9. GLOBAL ESCAPE KEY LISTENER
    // =========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (sanatanModal && sanatanModal.classList.contains('active')) {
                sanatanModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                if (sanatanIframe) sanatanIframe.src = sanatanIframe.src;
            }
            if (vankariModal && vankariModal.classList.contains('active')) {
                vankariModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                if (vankariVideoPlayer) vankariVideoPlayer.pause();
            }
            closeActiveCard();
        }
    });

    // =========================================
    //   10. VANKARI CAVE BACKGROUND SCROLL EFFECT
    // =========================================
    const vankariZone = document.getElementById('vankari-experience-zone');
    const body = document.body;
    
    if (vankariZone) {
        const bassSound = new Audio('/static/audio/vankari-sound.mp3'); 
        bassSound.volume = 0.8; 
        let soundTimeout;

        // SAFE FIX: 15% threshold for ALL devices ensures it never breaks, even on tall sections
        const options = {
            root: null,
            threshold: 0.15, 
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    body.classList.add('vankari-active');

                    if (bassSound.paused) {
                        bassSound.currentTime = 0;
                        bassSound.play().catch(e => console.log("Sound autoplay blocked by browser policy"));
                        
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
                    body.classList.remove('vankari-active');
                    bassSound.pause();
                    bassSound.currentTime = 0;
                    clearTimeout(soundTimeout);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, options);
        observer.observe(vankariZone);
    }
});