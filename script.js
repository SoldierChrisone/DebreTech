// Production Ready Script - DebreTech
(() => {
    'use strict';

    // Helper: Select elements safely
    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => context.querySelectorAll(selector);

    // --- State Management ---
    const State = {
        theme: localStorage.getItem('theme') || 'dark',
        isMobileMenuOpen: false
    };

    // --- Theme Management ---
    const initTheme = () => {
        const body = document.body;
        const icon = $('.theme-toggle i');
        const toggleBtn = $('.theme-toggle');

        const applyTheme = (theme) => {
            if (theme === 'light') {
                body.classList.add('light-mode');
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                body.classList.remove('light-mode');
                icon.classList.replace('fa-sun', 'fa-moon');
            }
            State.theme = theme;
            localStorage.setItem('theme', theme);
        };

        applyTheme(State.theme);

        toggleBtn.addEventListener('click', () => {
            const newTheme = State.theme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });

        // Accessible keyboard support for toggle
        toggleBtn.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') toggleBtn.click();
        });
    };

    // --- Navigation & Mobile Menu ---
    const initNavigation = () => {
        const hamburger = $('#hamburger');
        const mobileMenu = $('#mobile-menu');

        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            State.isMobileMenuOpen = !State.isMobileMenuOpen;
            document.body.style.overflow = State.isMobileMenuOpen ? 'hidden' : '';
            hamburger.setAttribute('aria-expanded', State.isMobileMenuOpen);
        };

        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', toggleMenu);
            hamburger.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') toggleMenu();
            });

            // Close menu on link click
            $$('a', mobileMenu).forEach(link => {
                link.addEventListener('click', () => {
                    if (State.isMobileMenuOpen) toggleMenu();
                });
            });
        }
    };

    // --- Smooth Scroll ---
    const initSmoothScroll = () => {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = $(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    };

    // --- Project Filtering ---
    const initFiltering = () => {
        const filterBtns = $$('.filter-btn');
        const projectCards = $$('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(' ');
                    const matches = filterValue === 'all' || categories.includes(filterValue);

                    if (matches) {
                        card.style.display = 'block';
                        card.style.animation = 'none';
                        card.offsetHeight; // trigger reflow
                        card.style.animation = 'fadeIn 0.5s ease-out forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    };

    // --- Contact Form Handling ---
    const initContactForm = () => {
        const form = $('.contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = $('button[type="submit"]', form);
            const originalText = btn.innerText;

            // Simulate sending
            btn.disabled = true;
            btn.innerText = 'Küldés...';

            setTimeout(() => {
                btn.innerText = 'Üzenet elküldve! ✅';
                btn.style.background = '#00ff88';
                btn.style.color = '#000';
                form.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 3000);
            }, 1000);
        });
    };

    // --- Copy to Clipboard ---
    const initCopyFunctionality = () => {
        $$('.copy-trigger').forEach(item => {
            item.addEventListener('click', async () => {
                const text = item.getAttribute('data-copy');
                const span = $('span', item);
                const originalText = span.innerText;

                try {
                    await navigator.clipboard.writeText(text);
                    span.innerText = 'Másolva! 📋';
                    item.classList.add('copied');

                    setTimeout(() => {
                        span.innerText = originalText;
                        item.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });

            // Allow keyboard activation
            item.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') item.click();
            });
        });
    };

    // --- Scroll Reveal ---
    const initScrollReveal = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        $$('.bento-card, .skill-category, .project-card, .game-info, .contact-info, .contact-form').forEach(el => {
            el.classList.add('scroll-reveal');
            observer.observe(el);
        });
    };

    // --- Loading Screen ---
    const initLoader = () => {
        window.addEventListener('load', () => {
            const loader = $('#loader');
            if (loader) {
                setTimeout(() => loader.classList.add('hidden'), 500);
            }
        });
    };

    // --- Language Management ---
    // --- Language Management ---
    const Translations = {
        hu: {
            'nav.home': 'Kezdőlap',
            'nav.about': 'Rólam',
            'nav.skills': 'Készségek',
            'nav.contact': 'Kapcsolat',
            'hero.greeting': 'Üdvözöl a',
            'hero.role': 'IT Specialista & Rendszergazda',
            'hero.cta': 'Kapcsolatfelvétel',
            'hero.cv': 'Letölthető CV',
            'about.status': 'IT a munkám és hobbim',
            'section.about': 'Rólam',
            'section.skills': 'Készségek',
            'section.projects': 'Projektek',
            'section.game': 'Játék Sarok',
            'section.contact': 'Kapcsolat',
            'about.bio.title': 'Bemutatkozás',
            'about.bio.text': 'IT specialista vagyok, akit az informatika nem csak munkájában, de hobbijaként is foglalkoztat. Szerverek telepítésétől a hardver optimalizáláson át az AI alkalmazásokig - ha IT, én benne vagyok!',
            'about.tech.title': 'Fő Területek',
            'about.tech.title': 'Fő Területek',
            'projects.filter.all': 'Összes',
            'projects.filter.net': 'Hálózat',
            'projects.filter.hw': 'Hardver',
            'projects.filter.maint': 'Karbantartás',
            'projects.filter.ai': 'AI',
            'game.desc': 'Használd a nyilakat a mozgáshoz!',
            'game.score': 'Pontszám:',
            'game.record': 'Rekord:',
            'contact.header': 'Lépj kapcsolatba!',
            'contact.desc': 'Segítségre van szükséged IT területen? Szerver, VPN, PC optimalizálás vagy AI? Írj bátran!',
            'footer.text': '© 2024 DebreTech. Minden jog fenntartva.',

            // Project & Extra Translations
            'game.start': 'Játék Indítása',
            'project.atak.desc': 'TAK szerver telepítés és üzemeltetés. Android ATAK és Windows WINTAK kliensek konfigurálása és beállítása.',
            'project.vpn.desc': 'VPN szerver telepítés Ubuntu/Rocky Linux-on. Android és Windows kliensek csatlakoztatása a hálózathoz.',
            'project.maint.desc': 'Komplett karbantartás és tisztítás, hardver fejlesztés (RAM, SSD, HDD, CPU). Windows és Linux telepítés.',
            'project.opt.desc': 'ThrottleStop, MSI Afterburner, GPU undervolt. FurMark és egyéb benchmark szoftverekkel tesztelés és finomhangolás.',
            'project.ai.desc': 'Online (Claude, ChatGPT, Gemini) és Lokális (Ollama, Pinokio) AI eszközök használata automatizálásra és tartalomgyártásra.',
            'project.net.desc': 'Vezetékes és vezeték nélküli hálózatok kiépítése. Router és Switch konfigurálás, UTP kábelezés és hibaelhárítás.',

            // Attribute Translations
            'tech.server': 'Szerver Admin',
            'tech.vpn': 'VPN & Biztonság',
            'tech.hw': 'Hardver Optimalizálás',
            'tech.ai': 'AI & Generálás',
            'tech.pc': 'PC Összerakás',
            'tech.net': 'Hálózat',
            'tech.linux': 'Linux',
            'tech.win': 'Windows',
            'form.name': 'Neved',
            'form.email': 'Email címed',
            'form.msg': 'Üzeneted...'
        },
        en: {
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.skills': 'Skills',
            'nav.contact': 'Contact',
            'hero.greeting': 'Welcome to',
            'hero.role': 'IT Specialist & SysAdmin',
            'hero.cta': 'Get in Touch',
            'hero.cv': 'Download CV',
            'about.status': 'IT is my work and passion',
            'section.about': 'About Me',
            'section.skills': 'Technical Skills',
            'section.projects': 'Projects',
            'section.game': 'Game Corner',
            'section.contact': 'Contact',
            'about.bio.title': 'Introduction',
            'about.bio.text': 'I am an IT specialist who is passionate about technology not just as a job, but as a hobby. From server setup to hardware optimization and AI tools - if it\'s IT, I\'m in!',
            'about.tech.title': 'Core Areas',
            'projects.filter.all': 'All',
            'projects.filter.net': 'Network',
            'projects.filter.hw': 'Hardware',
            'projects.filter.maint': 'Maintenance',
            'projects.filter.ai': 'AI',
            'game.desc': 'Use arrow keys to move!',
            'game.score': 'Score:',
            'game.record': 'High Score:',
            'contact.header': 'Get in Touch!',
            'contact.desc': 'Need help with IT? Servers, VPN, PC optimization or AI solutions? Feel free to message me!',
            'footer.text': '© 2024 DebreTech. All rights reserved.',

            // Project & Extra Translations
            'game.start': 'Start Game',
            'project.atak.desc': 'TAK server installation and operation. Configuration of Android ATAK and Windows WINTAK clients.',
            'project.vpn.desc': 'VPN server setup on Ubuntu/Rocky Linux. Connecting Android and Windows clients to the secure network.',
            'project.maint.desc': 'Complete maintenance and cleaning, hardware upgrades (RAM, SSD, HDD, CPU). Windows and Linux installation.',
            'project.opt.desc': 'ThrottleStop, MSI Afterburner, GPU undervolt. Testing and fine-tuning with FurMark and other benchmark software.',
            'project.ai.desc': 'Using Online (Claude, ChatGPT, Gemini) and Local (Ollama, Pinokio) AI tools for automation and content creation.',
            'project.net.desc': 'Building wired and wireless networks. Router and Switch configuration, UTP cabling, and troubleshooting.',

            // Attribute Translations
            'tech.server': 'Server Admin',
            'tech.vpn': 'VPN & Security',
            'tech.hw': 'Hardware Optimization',
            'tech.ai': 'AI & Generation',
            'tech.pc': 'PC Setup',
            'tech.net': 'Network',
            'tech.linux': 'Linux',
            'tech.win': 'Windows',
            'form.name': 'Your Name',
            'form.email': 'Your Email',
            'form.msg': 'Your Message...'
        }
    };

    const initLanguage = () => {
        const langBtn = $('#lang-toggle');
        let currentLang = localStorage.getItem('lang') || 'hu';

        const setLanguage = (lang) => {
            currentLang = lang;
            localStorage.setItem('lang', lang);
            langBtn.innerText = lang === 'hu' ? 'EN' : 'HU';

            $$('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (Translations[lang][key]) {
                    el.innerText = Translations[lang][key];
                }
            });

            // Translate Attributes (Senior Feature: Deep Localization)
            $$('[data-i18n-title]').forEach(el => {
                const key = el.getAttribute('data-i18n-title');
                if (Translations[lang][key]) {
                    el.setAttribute('title', Translations[lang][key]);
                }
            });

            $$('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (Translations[lang][key]) {
                    el.setAttribute('placeholder', Translations[lang][key]);
                }
            });
        };

        setLanguage(currentLang);

        langBtn.addEventListener('click', () => {
            setLanguage(currentLang === 'hu' ? 'en' : 'hu');
        });
    };

    // --- Terminal Easter Egg ---
    const initTerminal = () => {
        const terminal = $('#terminal-overlay');
        const input = $('#terminal-input');
        const output = $('#terminal-output');
        const closeBtn = $('.terminal-close');
        const toggleBtn = $('#terminal-toggle');

        const commands = {
            'help': 'Available commands: help, whoami, skills, contact, clear, exit',
            'whoami': 'DebreTech - IT Specialist, System Administrator, and Tech Enthusiast from Debrecen.',
            'skills': 'Networks (Cisco/Ubiquiti), Linux/Windows Servers, AI Tools, Hardware Optimization.',
            'contact': 'Email: hello@debretech.hu | Phone: +36 30 123 4567',
            'clear': () => output.innerHTML = '',
            'exit': () => toggleTerminal()
        };

        const toggleTerminal = () => {
            terminal.classList.toggle('hidden');
            if (!terminal.classList.contains('hidden')) {
                input.focus();
            }
        };

        const printOutput = (text) => {
            const p = document.createElement('p');
            p.innerText = '> ' + text;
            output.appendChild(p);
            input.value = '';
            output.scrollTop = output.scrollHeight;
        };

        document.addEventListener('keydown', (e) => {
            // Tilde (~) or Ctrl+Alt+T
            if (e.key === '`' || e.key === 'Dead' || (e.ctrlKey && e.altKey && e.key === 't')) {
                e.preventDefault(); // Prevent typing the character
                toggleTerminal();
            }
            if (e.key === 'Escape' && !terminal.classList.contains('hidden')) {
                toggleTerminal();
            }
        });

        closeBtn.addEventListener('click', toggleTerminal);
        if (toggleBtn) toggleBtn.addEventListener('click', toggleTerminal);

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.toLowerCase().trim();
                if (cmd) {
                    printOutput(input.value); // Echo command

                    if (commands[cmd]) {
                        if (typeof commands[cmd] === 'function') {
                            commands[cmd]();
                        } else {
                            const response = document.createElement('p');
                            response.innerText = commands[cmd];
                            response.style.color = '#fff';
                            output.appendChild(response);
                        }
                    } else {
                        const err = document.createElement('p');
                        err.innerText = `Command not found: ${cmd}`;
                        err.style.color = 'red';
                        output.appendChild(err);
                    }
                    output.scrollTop = output.scrollHeight;
                }
            }
        });
    };

    // --- CV Download (Print) ---
    const initCV = () => {
        const cvBtn = $('#cv-btn');
        if (cvBtn) {
            cvBtn.addEventListener('click', () => {
                window.print();
            });
        }
    };

    // --- Initialization ---
    const init = () => {
        initTheme();
        initLanguage();
        initTerminal();
        initCV();
        initNavigation();
        initSmoothScroll();
        initFiltering();
        initContactForm();
        initCopyFunctionality();
        initScrollReveal();
        initLoader();
    };

    init();

})();
