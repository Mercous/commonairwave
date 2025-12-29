// Мобильное меню
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Анимация бургера
        const spans = menuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// Анимация статистики
function animateCounter(element, target, duration = 2000) {
    const start = parseInt(element.textContent);
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            clearInterval(timer);
            current = target;
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Запуск анимации статистики при скролле
const stats = document.querySelectorAll('.stat-number[data-count]');
if (stats.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

// VK Audio Player Simulation
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const trackItems = document.querySelectorAll('.track-item');
const currentTitle = document.querySelector('.current-title');
const currentAuthor = document.querySelector('.current-author');
const currentTime = document.querySelector('.current-time');
const totalTime = document.querySelector('.total-time');
const progressFill = document.querySelector('.progress-fill');
const genreFilter = document.getElementById('genreFilter');

let currentTrack = 0;
let isPlaying = false;
let progressInterval;

// Треклист с данными
const tracks = [
    {
        title: '"Хроники Лунного Леса" - Пролог',
        author: 'Студия "Ночной эфир"',
        duration: '12:45',
        genre: 'fantasy'
    },
    {
        title: '"Механические сны" - Глава 1',
        author: 'Проект "Кибертон"',
        duration: '18:30',
        genre: 'scifi'
    },
    {
        title: '"Последнее письмо" - Полная версия',
        author: 'Анна Ветрова',
        duration: '42:15',
        genre: 'drama'
    },
    {
        title: '"Шёпот в тумане" - Часть 1',
        author: 'Григорий Сомов',
        duration: '22:10',
        genre: 'horror'
    },
    {
        title: '"Песнь драконов" - Вступление',
        author: 'Студия "Миф"',
        duration: '15:20',
        genre: 'fantasy'
    }
];

// Инициализация плеера
function initPlayer() {
    updateTrackInfo();
    
    // Обработчики для кнопок
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    
    // Обработчики для кликов по трекам
    trackItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            setActiveTrack(index);
            playTrack();
        });
    });
    
    // Фильтр по жанрам
    if (genreFilter) {
        genreFilter.addEventListener('change', filterTracks);
    }
}

// Обновление информации о текущем треке
function updateTrackInfo() {
    const track = tracks[currentTrack];
    
    if (currentTitle) currentTitle.textContent = track.title;
    if (currentAuthor) currentAuthor.textContent = track.author;
    if (totalTime) totalTime.textContent = track.duration;
    
    // Обновление активного трека в плейлисте
    trackItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentTrack);
    });
}

// Воспроизведение/пауза
function togglePlay() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        playTrack();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        pauseTrack();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// Воспроизведение трека
function playTrack() {
    isPlaying = true;
    
    // Сброс прогресса
    if (progressFill) progressFill.style.width = '0%';
    if (currentTime) currentTime.textContent = '0:00';
    
    // Запуск анимации прогресса
    clearInterval(progressInterval);
    
    const duration = tracks[currentTrack].duration;
    const [minutes, seconds] = duration.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    let currentSeconds = 0;
    
    progressInterval = setInterval(() => {
        if (!isPlaying) return;
        
        currentSeconds++;
        const progress = (currentSeconds / totalSeconds) * 100;
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        
        // Обновление времени
        const currentMinutes = Math.floor(currentSeconds / 60);
        const currentSecs = currentSeconds % 60;
        if (currentTime) {
            currentTime.textContent = `${currentMinutes}:${currentSecs.toString().padStart(2, '0')}`;
        }
        
        // Автопереход к следующему треку
        if (currentSeconds >= totalSeconds) {
            nextTrack();
        }
    }, 1000);
}

// Пауза
function pauseTrack() {
    isPlaying = false;
    clearInterval(progressInterval);
}

// Следующий трек
function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    updateTrackInfo();
    if (isPlaying) playTrack();
}

// Предыдущий трек
function prevTrack() {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    updateTrackInfo();
    if (isPlaying) playTrack();
}

// Установка активного трека
function setActiveTrack(index) {
    currentTrack = index;
    updateTrackInfo();
}

// Фильтрация треков по жанру
function filterTracks() {
    const selectedGenre = genreFilter.value;
    
    trackItems.forEach((item, index) => {
        const itemGenre = item.getAttribute('data-genre');
        
        if (selectedGenre === 'all' || itemGenre === selectedGenre) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Инициализация плеера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (playBtn) {
        initPlayer();
    }
    
    // Анимация появления элементов
    const animatedElements = document.querySelectorAll('.ecosystem-card, .benefit-item, .category-card, .studio-card');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeInObserver.observe(el);
    });
    
    // Параллакс эффект для героя
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
    
    // Изменение навигации при скролле
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            navbar.style.boxShadow = 'none';
        }
    });
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || this.target === '_blank') return;
        
        e.preventDefault();
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Анимация волн в фоне
function animateWaves() {
    const waves = document.querySelectorAll('.sound-wave');
    
    waves.forEach((wave, index) => {
        const delay = index * 5;
        wave.style.animationDelay = `-${delay}s`;
    });
}

// Запуск анимации волн
animateWaves();