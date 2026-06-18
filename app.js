// --- Firebase Configuration ---
// استبدل الإعدادات أدناه من مشروعك في Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyBnaCO886pZQWvmFS8DKrqC1jqDrdT9_CM",
    authDomain: "siond-a6c34.firebaseapp.com",
    projectId: "siond-a6c34",
    storageBucket: "siond-a6c34.firebasestorage.app",
    messagingSenderId: "875547108455",
    appId: "1:875547108455:web:47c497591012e6299be0c2",
    measurementId: "G-4L30TTMCT3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const MATH_BRANCHES = ['الكل', 'الجبر', 'الإحصاء', 'حساب المثلثات', 'الهندسة', 'التفاضل والتكامل', 'الاستاتيكا', 'الديناميكا', 'تطبيقية', 'متجهات', 'جبر وإحتمالات', 'تأسيس'];

// --- Cloudinary Configuration (Unsigned Upload) ---
const CLOUDINARY_CLOUD_NAME = 'dwrhl6gjf';
const CLOUDINARY_UPLOAD_PRESET = 'asr-kareem';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * يرفع ملف صورة إلى Cloudinary ويرجع رابط الصورة النهائي (secure_url).
 * يستخدم في: صور الباقات، صور المراحل التعليمية، صور الدروس، صور الأسئلة.
 * @param {File} file - ملف الصورة المختار من input[type=file]
 * @returns {Promise<string|null>} رابط الصورة على Cloudinary أو null عند الفشل
 */
async function uploadToCloudinary(file) {
    if (!file) return null;
    if (!file.type.startsWith('image/')) {
        alert('برجاء اختيار ملف صورة فقط');
        return null;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.secure_url) {
            return data.secure_url;
        } else {
            console.error('Cloudinary upload error:', data);
            alert('فشل رفع الصورة، برجاء المحاولة مرة أخرى');
            return null;
        }
    } catch (error) {
        console.error('Cloudinary upload exception:', error);
        alert('حدث خطأ في الاتصال أثناء رفع الصورة');
        return null;
    }
}

/**
 * دالة مساعدة عامة: تربط input[type=file] برفع تلقائي على Cloudinary،
 * وتعرض حالة تحميل + معاينة الصورة بعد الرفع داخل عنصر معاينة محدد.
 * @param {HTMLInputElement} inputEl - عنصر input الذي تغيّر
 * @param {string} previewElId - id لعنصر المعاينة (سيتم وضع <img> بداخله)
 * @param {Function} onUploaded - callback يستقبل الرابط النهائي بعد الرفع
 */
async function handleImageInputUpload(inputEl, previewElId, onUploaded) {
    const file = inputEl.files && inputEl.files[0];
    if (!file) return;
    const preview = document.getElementById(previewElId);
    if (preview) {
        preview.innerHTML = `<div style="padding:10px; color:var(--text-muted); font-size:0.85rem;"><i class="fas fa-spinner fa-spin"></i> جاري رفع الصورة...</div>`;
    }
    const url = await uploadToCloudinary(file);
    if (url) {
        if (preview) {
            preview.innerHTML = `
                <div style="position:relative; display:inline-block;">
                    <img src="${url}" style="max-width:200px; max-height:140px; border-radius:8px; border:1px solid var(--glass-border); display:block;">
                    <button type="button" class="btn-primary" style="position:absolute; top:5px; right:5px; background:#ef4444; padding:3px 8px; font-size:0.7rem; border-radius:6px;" onclick="this.closest('div[style*=relative]').parentElement.dataset.uploadedUrl=''; this.closest('div[style*=relative]').remove();">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            preview.dataset.uploadedUrl = url;
        }
        if (typeof onUploaded === 'function') onUploaded(url);
    } else if (preview) {
        preview.innerHTML = '';
    }
}

// Initial Data Structure
let appData = {
    grades: {
        '1mid': {
            title: 'الصف الأول الإعدادي',
            desc: 'تأسيس قوي في الرياضيات',
            icon: 'fa-book-open',
            imageUrl: null,
            groups: ['مجموعة 1'],
            branches: ['الكل', 'جبر', 'هندسة']
        },
        '2mid': {
            title: 'الصف الثاني الإعدادي',
            desc: 'تكملة رحلة التفوق',
            icon: 'fa-divide',
            imageUrl: null,
            groups: ['مجموعة 1'],
            branches: ['الكل', 'جبر', 'هندسة']
        },
        '3mid': {
            title: 'الصف الثالث الإعدادي',
            desc: 'تأسيس متين للثانوية العامة',
            icon: 'fa-school',
            imageUrl: null,
            groups: ['مجموعة 1', 'مجموعة 2'],
            branches: ['الكل', 'جبر وإحتمالات', 'هندسة']
        },
        '1sec': {
            title: 'الصف الأول الثانوي',
            desc: 'بناء المفاهيم المتقدمة',
            icon: 'fa-1',
            imageUrl: null,
            groups: ['مجموعة 1', 'مجموعة 2'],
            branches: ['الكل', 'الجبر', 'الهندسة', 'حساب المثلثات', 'متجهات']
        },
        '2sec': {
            title: 'الصف الثاني الثانوي',
            desc: 'تعميق المهارات الرياضية',
            icon: 'fa-2',
            imageUrl: null,
            groups: ['مجموعة 1', 'مجموعة 2'],
            branches: ['الكل', 'الجبر', 'التفاضل والتكامل', 'حساب المثلثات', 'تطبيقية']
        },
        '3sec-sci': {
            title: 'الصف الثالث الثانوي (علمي)',
            desc: 'تخصص العلوم والرياضيات',
            icon: 'fa-microscope',
            imageUrl: null,
            groups: ['مجموعة 1', 'مجموعة 2'],
            branches: ['الكل', 'تطبيقية', 'الجبر', 'التفاضل والتكامل', 'حساب المثلثات']
        },
        '3sec-lit': {
            title: 'الصف الثالث الثانوي (أدبي)',
            desc: 'تخصص الشريعة والأدب',
            icon: 'fa-book',
            imageUrl: null,
            groups: ['مجموعة 1'],
            branches: ['الكل', 'الجبر', 'التفاضل والتكامل']
        }
    },
    lessons: [],
    exams: [],
    files: [],
    vouchers: [],
    packages: [],
    packageVouchers: [],
    students: [],
    visits: [],
    results: [],
    settings: {
        teacherName: 'أحمد جمال رضوان',
        slogan: 'عبقرية الرياضيات x قوة التكنولوجيا',
        whatsapp: '201028164601',
        phone: '01028164601',
        facebook: 'https://www.facebook.com/share/16wKXQnhRW/',
        youtube: 'https://www.youtube.com/@mr.ahmedgamal4179',
        tiktok: 'https://www.tiktok.com/@ahmed_gamal813',
        heroTitle: 'مع الأستاذ أحمد جمال رضوان',
        heroSubtitle: 'نفهم الرياضيات بعمق، لنتفوق بذكاء'
    }
};


// State
let currentState = {
    selectedGrade: null,
    selectedBranch: 'الكل',
    isAdmin: false,
    editingPackageId: null,
    editingExamId: null
};

const PACKAGE_IMAGES = [
    { id: 'full_term', name: 'ترم كامل', url: 'full_term.jpg' },
    { id: 'month_2', name: 'شهر 2', url: 'month_2.jpg' }
];

// YouTube Players Management
let ytPlayers = {};
let isYouTubeAPIReady = (window.YT && window.YT.Player) ? true : false;

window.onYouTubeIframeAPIReady = function () {
    isYouTubeAPIReady = true;
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Show splash screen for at least 1.5s
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) loader.style.display = 'none';
        }, 500);
    }, 1500);

    initTheme();
    await loadInitialData();
    initEventListeners();
    initScrollReveal();
});

// ==== THEME (Dark / Light Mode) ====
function initTheme() {
    const savedTheme = localStorage.getItem('siteTheme') || 'light';
    applyTheme(savedTheme, false);

    window.addEventListener('resize', adjustThemeBarPosition);
    window.addEventListener('load', adjustThemeBarPosition);
    adjustThemeBarPosition();
}

function applyTheme(theme, animate = true) {
    const root = document.documentElement;
    const icon = document.getElementById('theme-toggle-icon');
    const label = document.getElementById('theme-toggle-label');
    const adminIcon = document.getElementById('admin-theme-toggle-icon');
    const adminLabel = document.getElementById('admin-theme-toggle-label');

    if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        if (icon) icon.className = 'fas fa-sun';
        if (label) label.textContent = 'الوضع الصباحي';
        if (adminIcon) adminIcon.className = 'fas fa-sun';
        if (adminLabel) adminLabel.textContent = 'الوضع الصباحي';
    } else {
        root.removeAttribute('data-theme');
        if (icon) icon.className = 'fas fa-moon';
        if (label) label.textContent = 'الوضع الليلي';
        if (adminIcon) adminIcon.className = 'fas fa-moon';
        if (adminLabel) adminLabel.textContent = 'الوضع الليلي';
    }
    localStorage.setItem('siteTheme', theme);
    setTimeout(adjustThemeBarPosition, animate ? 50 : 0);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

function adjustThemeBarPosition() {
    const nav = document.getElementById('main-nav');
    const bar = document.getElementById('theme-toggle-bar');
    if (!nav || !bar) return;
    const navHeight = nav.offsetHeight || 64;
    bar.style.top = navHeight + 'px';

    // Keep native anchor links (<a href="#section">) aligned below the fixed nav + theme bar too
    document.documentElement.style.scrollPaddingTop = (navHeight + bar.offsetHeight + 10) + 'px';

    // The hero section already has a fixed padding-top sized for #main-nav alone.
    // We only need to push it down by the theme bar's own height (added on top of the original padding).
    const home = document.getElementById('home');
    if (home) {
        if (!home.dataset.basePaddingTop) {
            const computed = window.getComputedStyle(home).paddingTop;
            home.dataset.basePaddingTop = parseFloat(computed) || 160;
        }
        const basePadding = parseFloat(home.dataset.basePaddingTop);
        home.style.paddingTop = (basePadding + bar.offsetHeight) + 'px';
    }
}

function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    revealElements.forEach(el => observer.observe(el));
}

function checkStudentSession() {
    const session = localStorage.getItem('studentSession');
    const subscribeBtn = document.getElementById('subscribe-btn');
    if (session) {
        const student = JSON.parse(session);
        // Find latest student data to sync unlocked items from Firestore
        if (appData.students && appData.students.length > 0) {
            const latest = appData.students.find(s => s.phone === student.phone || s.id === student.id);
            if (latest) {
                localStorage.setItem('studentSession', JSON.stringify(latest));
                // Sync unlocked grades
                if (latest.unlockedGrades) {
                    latest.unlockedGrades.forEach(g => localStorage.setItem(`unlocked_${g}`, 'true'));
                }
                // Sync unlocked packages
                if (latest.unlockedPackages) {
                    latest.unlockedPackages.forEach(pId => localStorage.setItem(`pkg_unlocked_${pId}`, 'true'));
                }
            }
            logVisit(student);
        }
        if (subscribeBtn) subscribeBtn.style.display = 'none';
    } else {
        if (subscribeBtn) subscribeBtn.style.display = 'block';
    }
}

function openSubscriptionModal(mandatory = false) {
    const modal = document.getElementById('student-login-modal');
    const gradeInput = document.getElementById('student-grade');
    const gradeText = document.getElementById('grade-auto-text');

    // Set the grade automatically from the currently selected grade
    if (currentState.selectedGrade) {
        gradeInput.value = currentState.selectedGrade;
        const gradeTitle = appData.grades[currentState.selectedGrade]?.title || currentState.selectedGrade;
        if (gradeText) gradeText.textContent = gradeTitle;
    } else {
        gradeInput.value = '';
        if (gradeText) gradeText.textContent = 'سيتم تحديدها تلقائياً';
    }

    document.getElementById('registration-step').style.display = 'block';
    document.getElementById('voucher-step').style.display = 'none';
    const subtitle = document.getElementById('registration-modal-subtitle');
    if (subtitle) subtitle.textContent = 'سجّل بياناتك لتتمكن من الوصول للمحتوى التعليمي';

    // Control close button visibility based on mandatory flag
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.style.display = mandatory ? 'none' : 'flex';

    // Store mandatory state
    modal.dataset.mandatory = mandatory ? 'true' : 'false';

    modal.style.display = 'flex';
}

function closeLoginModalIfAllowed() {
    const modal = document.getElementById('student-login-modal');
    if (!modal) return;
    // If mandatory (student must register), don't allow closing
    if (modal.dataset.mandatory === 'true') {
        // Shake animation to indicate can't close
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.style.animation = 'none';
            content.offsetHeight; // reflow
            content.style.animation = 'shake 0.4s ease';
            setTimeout(() => content.style.animation = '', 500);
        }
        return;
    }
    modal.style.display = 'none';
}


async function loadInitialData() {
    try {

        db.collection('lessons').orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                appData.lessons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if (currentState.selectedGrade) renderContent();
            });

        db.collection('exams').orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                appData.exams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if (currentState.selectedGrade) renderContent();
            });

        db.collection('files').orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                appData.files = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if (currentState.selectedGrade) renderContent();
            });

        db.collection('results').orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                appData.results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            });

        db.collection('vouchers').orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                appData.vouchers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const activeSection = document.querySelector('.admin-nav li.active')?.dataset.section;
                if (currentState.isAdmin && activeSection === 'vouchers') {
                    renderAdminSection(activeSection);
                }
            });

        db.collection('students').orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                appData.students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const activeSection = document.querySelector('.admin-nav li.active')?.dataset.section;
                if (currentState.isAdmin && (activeSection === 'dashboard' || activeSection === 'students-list')) {
                    renderAdminSection(activeSection);
                }
                // Refresh session if logged in to sync unlocked content
                if (localStorage.getItem('studentSession')) {
                    checkStudentSession();
                    if (currentState.selectedGrade) renderContent();
                }
            });

        db.collection('visits').orderBy('timestamp', 'desc')
            .onSnapshot(snapshot => {
                appData.visits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const activeSection = document.querySelector('.admin-nav li.active')?.dataset.section;
                if (currentState.isAdmin && (activeSection === 'dashboard' || activeSection === 'visits-log')) {
                    renderAdminSection(activeSection);
                }
            });

        db.collection('packages').orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                appData.packages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if (currentState.selectedGrade) renderPackages();
                const activeSection = document.querySelector('.admin-nav li.active')?.dataset.section;
                if (currentState.isAdmin && activeSection === 'add-package') renderAdminSection('add-package');
            });

        db.collection('packageVouchers').orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                appData.packageVouchers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            });

        db.collection('settings').doc('branding')
            .onSnapshot(doc => {
                if (doc.exists()) {
                    appData.settings = { ...appData.settings, ...doc.data() };
                    updateBrandingUI();
                }
            });

        db.collection('settings').doc('gradesImages')
            .onSnapshot(doc => {
                if (doc.exists()) {
                    const imagesMap = doc.data() || {};
                    Object.keys(imagesMap).forEach(gradeId => {
                        if (appData.grades[gradeId]) {
                            appData.grades[gradeId].imageUrl = imagesMap[gradeId] || null;
                        }
                    });
                }
                renderGradesGrid();
            });

        renderGradesGrid();
        updateBrandingUI();
    } catch (error) {
        console.error("Error loading data from Firebase:", error);
    }
}


function initEventListeners() {
    const adminBtn = document.getElementById('admin-login-btn');
    const modal = document.getElementById('admin-modal');
    const closeBtn = document.querySelector('.close-modal');

    adminBtn.onclick = () => {
        if (currentState.isAdmin) {
            showAdminDashboard();
        } else {
            modal.style.display = 'flex';
        }
    };
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target == modal) modal.style.display = 'none';
        // Prevent closing mandatory student login modal by clicking outside
        const loginModal = document.getElementById('student-login-modal');
        if (loginModal && e.target == loginModal && loginModal.dataset.mandatory !== 'true') {
            loginModal.style.display = 'none';
        }
    };

    document.getElementById('login-confirm').onclick = checkLogin;

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.onclick = () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const target = btn.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`${target}-tab`).classList.add('active');
            if (target === 'packages') renderPackages();
        };
    });

    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.onclick = () => {
            const isActive = navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (isActive) {
                icon.classList.replace('fa-bars', 'fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
                document.body.style.overflow = '';
            }
        };

        navLinks.querySelectorAll('a').forEach(link => {
            link.onclick = () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
                document.body.style.overflow = '';
            };
        });
    }
}

function renderGradesGrid() {
    const container = document.getElementById('grades-grid-container');
    if (!container) return;
    container.innerHTML = Object.entries(appData.grades).map(([gradeId, grade]) => `
        <div class="grade-card" onclick="selectGrade('${gradeId}')">
            ${grade.imageUrl
            ? `<div class="grade-icon" style="overflow:hidden; padding:0; width:100%; height:120px; border-radius:14px;">
                    <img src="${grade.imageUrl}" alt="${grade.title}" style="width:100%; height:100%; object-fit:cover; display:block;">
                </div>`
            : `<div class="grade-icon"><i class="fas ${grade.icon || 'fa-graduation-cap'}"></i></div>`
        }
            <h3>${grade.title}</h3>
            <p>${grade.desc || ''}</p>
            <button class="btn-card">دخول <i class="fas fa-arrow-left"></i></button>
        </div>
    `).join('');
}

function selectGrade(gradeId) {
    currentState.selectedGrade = gradeId;
    currentState.selectedBranch = 'الكل';
    document.getElementById('grades').classList.add('hidden');
    document.getElementById('content-display').classList.remove('hidden');
    document.getElementById('current-grade-title').textContent = appData.grades[gradeId]?.title || gradeId;

    // Show/Hide Subscribe button based on session
    const session = localStorage.getItem('studentSession');
    const subscribeBtn = document.getElementById('subscribe-btn');
    if (subscribeBtn) {
        subscribeBtn.style.display = session ? 'none' : 'block';
    }

    // Mandatory Registration: must register before viewing content
    if (!session) {
        openSubscriptionModal(true); // true = mandatory (no close)
    }

    renderBranchSelection();
    renderContent();
    scrollToSection('content-display');
}

function renderBranchSelection() {
    const container = document.getElementById('branch-selection');
    if (!container) return;
    container.innerHTML = '';

    // Get branches for the current grade
    const branches = appData.grades[currentState.selectedGrade]?.branches || MATH_BRANCHES;

    branches.forEach(branch => {
        const btn = document.createElement('button');
        btn.className = `branch-tab-btn ${currentState.selectedBranch === branch ? 'active' : ''}`;
        btn.textContent = branch;
        btn.onclick = () => {
            currentState.selectedBranch = branch;
            renderBranchSelection();
            renderContent();
        };
        container.appendChild(btn);
    });
}


function goBackToGrades() {
    document.getElementById('content-display').classList.add('hidden');
    document.getElementById('grades').classList.remove('hidden');
    currentState.selectedGrade = null;
    currentState.selectedGroup = null;
    scrollToSection('grades');
}

function renderContent() {
    const lessonsList = document.getElementById('lessons-list');
    const examsList = document.getElementById('exams-list');
    const filesList = document.getElementById('files-list');

    const isSystemUnlocked = localStorage.getItem('isSystemUnlocked') === 'true';

    // Helper for branch filtering
    const branchFilter = (item) => {
        const matchesGrade = item.grade === currentState.selectedGrade;
        const matchesBranch = currentState.selectedBranch === 'الكل' || item.branch === currentState.selectedBranch;
        return matchesGrade && matchesBranch;
    };

    // Lessons
    const filteredLessons = appData.lessons.filter(branchFilter);
    lessonsList.innerHTML = filteredLessons.length ? '' : '<p class="empty-msg">لا يوجد دروس مضافة في هذا الفرع حالياً</p>';

    // Check if THIS SPECIFIC GRADE is unlocked
    const isGradeUnlocked = localStorage.getItem(`unlocked_${currentState.selectedGrade}`) === 'true';

    filteredLessons.forEach(lesson => {
        const wrapperId = `vid-wrapper-${lesson.id}`;
        const playerId = `player-${lesson.id}`;
        const ytId = getYouTubeId(lesson.url);
        const thumbUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

        // Check if grade is unlocked
        const isGradeUnlocked = localStorage.getItem(`unlocked_${currentState.selectedGrade}`) === 'true';

        // Check if exam-locked
        let isExamLocked = false;
        let lockReason = "";

        if (lesson.requiredExamId) {
            const studentSession = localStorage.getItem('studentSession');
            if (studentSession) {
                const student = JSON.parse(studentSession);
                const studentResults = appData.results
                    .filter(r => r.examId === lesson.requiredExamId && r.studentPhone === student.phone);
                const bestResult = studentResults.sort((a, b) => (b.percentage ?? b.score) - (a.percentage ?? a.score))[0];

                const requiredExam = appData.exams.find(e => e.id === lesson.requiredExamId);
                const passedByPercent = bestResult && bestResult.percentage !== undefined
                    ? bestResult.isPassed
                    : (bestResult && bestResult.score >= (lesson.minScore || 0));

                if (!bestResult || !passedByPercent) {
                    isExamLocked = true;
                    const reqLabel = lesson.minScore ? `بدرجة ${lesson.minScore} على الأقل` : `بنسبة ${requiredExam?.minPassPercent || 50}% على الأقل`;
                    lockReason = `يجب اجتياز ${requiredExam?.title || 'الاختبار'} ${reqLabel} لفتح هذا الدرس`;
                }
            } else {
                isExamLocked = true;
                lockReason = "يجب تسجيل الدخول أولاً";
            }
        }

        if (isGradeUnlocked && !isExamLocked) {
            let videoHtml = '';
            if (ytId) {
                videoHtml = `<div id="${playerId}"></div>`;
            } else {
                // Check if it's a direct video file or something else
                const isDirectVideo = lesson.url.match(/\.(mp4|webm|ogg)$/i);
                if (isDirectVideo) {
                    videoHtml = `<video src="${lesson.url}" controls style="width:100%; height:100%; border-radius:20px;"></video>`;
                } else {
                    // Fallback to iframe (Google Drive, Vimeo, etc.)
                    videoHtml = `<iframe src="${lesson.url}" style="width:100%; height:100%; border:none; border-radius:20px;" allowfullscreen></iframe>`;
                }
            }

            lessonsList.innerHTML += `
                <div class="item-card">
                    <div class="video-preview-wrapper" id="${wrapperId}">
                        ${videoHtml}
                        ${ytId ? `
                        <div class="video-overlay-shield total-shield" onclick="togglePlayPause('${lesson.id}')" ondblclick="toggleFullscreen('${wrapperId}')">
                            <div class="play-overlay">
                                <i class="fas fa-play"></i>
                            </div>
                            <div class="shield-top"></div>
                            <div class="shield-center-top"></div>
                            <div class="shield-bottom-right"></div>
                            <div class="shield-bottom-left"></div>
                            <div class="custom-controls">
                                <button class="custom-seek-btn" onclick="event.stopPropagation(); seek('${lesson.id}', -10)" title="تراجع 10 ثواني">
                                    <i class="fas fa-undo"></i>
                                </button>
                                <div class="progress-container" onclick="event.stopPropagation(); handleSeek(event, '${lesson.id}')">
                                    <div class="progress-bar" id="progress-${lesson.id}"></div>
                                </div>
                                <button class="custom-seek-btn" onclick="event.stopPropagation(); seek('${lesson.id}', 10)" title="تقدم 10 ثواني">
                                    <i class="fas fa-redo"></i>
                                </button>
                                <button class="custom-fs-btn" title="تكبير الشاشة" onclick="event.stopPropagation(); toggleFullscreen('${wrapperId}')">
                                    <i class="fas fa-expand"></i>
                                </button>
                            </div>
                        </div>` : ''}
                    </div>
                    <div class="item-info">
                        <h4>${lesson.title}</h4>
                        <p>${lesson.desc}</p>
                    </div>
                </div>
            `;
            // Initialize player after element is in DOM (only for YouTube)
            if (ytId) {
                setTimeout(() => initYTPlayer(lesson.id, ytId), 150);
            }
        } else {
            // Show locked view (image stays fully visible, only a small lock badge overlays it)
            const lessonThumb = lesson.imageUrl || thumbUrl;
            lessonsList.innerHTML += `
                <div class="item-card locked-card" style="position: relative; cursor: default;">
                    <div class="video-preview-wrapper" style="position: relative; overflow: hidden; min-height: 200px; background: #0a0a0a;">
                        <img src="${lessonThumb}" alt="${lesson.title}" 
                             style="width: 100%; height: 100%; object-fit: cover; display: block;">
                        <div style="position: absolute; top:12px; left:12px; background: rgba(0,0,0,0.65); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-lock" style="font-size: 1rem; color: #fff;"></i>
                        </div>
                        <div style="position: absolute; left:0; right:0; bottom:0; background:linear-gradient(transparent, rgba(0,0,0,0.75)); padding:14px; text-align:center;">
                            <p style="color: #fff; font-size: 0.9rem; font-weight: 600; margin: 0 0 8px;">${isExamLocked ? lockReason : 'اشترك لمشاهدة الدرس'}</p>
                            ${isExamLocked && lesson.requiredExamId ? `
                                <button class="btn-primary" style="font-size: 0.8rem; padding: 8px 15px;" onclick="startExam('${lesson.requiredExamId}')">
                                    <i class="fas fa-file-alt"></i> اذهب للاختبار الآن
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="item-info">
                        <h4>${lesson.title}</h4>
                        <p>${lesson.desc || 'درس فيديو توضيحي'}</p>
                        ${!isGradeUnlocked ? `
                            <button class="btn-primary w-100" style="margin-top: 8px;" onclick="openSubscriptionModal()">
                                <i class="fas fa-star"></i> اشترك الآن لمشاهدة الدرس
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    });

    // Exams
    const takenExamsMap = JSON.parse(localStorage.getItem('takenExams') || '{}');
    const filteredExams = appData.exams.filter(branchFilter);
    examsList.innerHTML = filteredExams.length ? '' : '<p class="empty-msg">لا يوجد اختبارات مضافة في هذا الفرع حالياً</p>';
    filteredExams.forEach(exam => {
        const taken = takenExamsMap[exam.id];
        examsList.innerHTML += `
            <div class="item-card exam-card">
                <div class="item-icon"><i class="fas fa-file-signature"></i></div>
                <div class="item-info">
                    <h4>${exam.title}</h4>
                    <p>${exam.questions.length} سؤال • ${exam.duration || 15} دقيقة</p>
                    ${taken ? `
                        <div style="background: ${taken.isPassed ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'}; color: ${taken.isPassed ? '#4ade80' : '#f87171'}; padding: 8px; border-radius: 8px; text-align:center; font-size:0.85rem; font-weight:bold;">
                            ${taken.isPassed ? 'تم الاجتياز ✅' : 'لم يتم الاجتياز ❌'} — ${taken.score}/${taken.total}${taken.percentage !== undefined ? ` (${taken.percentage}%)` : ''}
                        </div>
                    ` : `<button class="btn-primary w-100" onclick="startExam('${exam.id}')">بدأ الاختبار</button>`}
                </div>
            </div>
        `;
    });

    // Files
    const filteredFiles = appData.files.filter(branchFilter);
    filesList.innerHTML = filteredFiles.length ? '' : '<p class="empty-msg">لا يوجد مذكرات مضافة في هذا الفرع حالياً</p>';
    filteredFiles.forEach(file => {
        filesList.innerHTML += `
            <div class="item-card">
                <div class="item-icon" style="height: 150px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05);">
                    <i class="fas fa-file-pdf" style="font-size: 3rem; color: var(--primary-light);"></i>
                </div>
                <div class="item-info">
                    <h4>${file.title}</h4>
                    <p>متوفر الآن للتحميل أو العرض</p>
                    <a href="${file.url}" target="_blank" class="btn-primary w-100" style="text-decoration: none; display: block; text-align: center;">تحميل / عرض</a>
                </div>
            </div>
        `;
    });
}

function getYouTubeId(url) {
    if (!url || typeof url !== 'string') return null;
    url = url.trim();
    if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    const regExp = /^.*(?:youtu.be\/|v\/|vi\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([a-zA-Z0-9_-]{11}).*/i;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
}

let currentExamData = null;
let userAnswers = [];
let examTimer = null;

function startExam(id) {
    const exam = appData.exams.find(e => e.id === id);
    if (!exam || !exam.questions || exam.questions.length === 0) return alert('هذا الاختبار لا يحتوي على أسئلة');

    // Security: One-time access check
    const takenExams = JSON.parse(localStorage.getItem('takenExams') || '{}');
    if (takenExams[id]) {
        return alert('عذراً، لا يمكنك دخول هذا الاختبار مرة أخرى. لقد استنفدت فرصتك الوحيدة.');
    }

    currentExamData = exam;
    userAnswers = new Array(exam.questions.length).fill(null);

    const modal = document.createElement('div');
    modal.id = 'exam-taking-modal';
    modal.className = 'exam-overlay';
    modal.innerHTML = `
        <div class="exam-container glass" style="max-width: 950px; width: 95%; height: 95vh; display: flex; flex-direction: column;">
            <div class="exam-header" style="flex-shrink: 0; padding: 15px 25px; border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; background: var(--input-bg);">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <h3 style="margin: 0; color: var(--primary-light); font-size: 1.3rem;"><i class="fas fa-file-signature"></i> ${exam.title}</h3>
                    <div id="exam-timer" style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); color: #818cf8; padding: 6px 15px; border-radius: 8px; font-weight: bold; font-family: monospace; font-size: 1.1rem; min-width: 100px; text-align: center;">
                        00:00
                    </div>
                    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;">
                        <i class="fas fa-shield-alt"></i> حماية مفعلة: الخروج ينهي الاختبار
                    </div>
                </div>
                <span class="close-exam" onclick="closeExam()" style="cursor: pointer; font-size: 1.5rem; color: var(--text-muted);">&times;</span>
            </div>

            <div id="exam-question-grid" style="flex-shrink:0; display:flex; gap:6px; flex-wrap:wrap; padding:12px 25px; border-bottom:1px solid var(--glass-border); background: rgba(0,0,0,0.15);"></div>
            
            <div style="flex-grow: 1; overflow-y: auto; padding: 25px; scrollbar-width: thin;">
                ${exam.sheetImageUrl ? `
                    <div style="margin-bottom: 30px; border-radius: 12px; overflow: hidden; border: 1.5px solid var(--glass-border); background: #000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <img src="${exam.sheetImageUrl}" alt="Exam Sheet" style="width: 100%; height: auto; display: block;">
                    </div>
                ` : ''}
                
                <div id="exam-questions-list"></div>
            </div>

            <div class="exam-footer" style="flex-shrink: 0; padding: 20px; border-top: 1px solid var(--glass-border); background: var(--input-bg); display: flex; align-items: center; justify-content: space-between; gap: 20px;">
                <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem;"><i class="fas fa-info-circle"></i> تنبيه: سيتم الإغلاق تلقائياً عند انتهاء الوقت</p>
                <button class="btn-primary" style="padding: 12px 40px; font-size: 1.1rem; min-width: 250px;" onclick="submitExam()">إنهاء الاختبار</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    renderExamQuestions();
    renderExamQuestionGrid();

    // Timer Logic
    let timeLeft = (exam.duration || 15) * 60;
    const timerDisplay = document.getElementById('exam-timer');

    examTimer = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        if (timerDisplay) timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(examTimer);
            alert('انتهى الوقت! سيتم تسليم إجاباتك الآن.');
            submitExam(true);
        }
    }, 1000);

    // Anti-Cheat: Lost focus detector
    window.addEventListener('blur', handleExamCheat);
    // Anti-Cheat: Tab switch detector
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') handleExamCheat();
    });
}

function renderExamQuestionGrid() {
    const grid = document.getElementById('exam-question-grid');
    if (!grid || !currentExamData) return;
    grid.innerHTML = currentExamData.questions.map((q, idx) => `
        <div id="grid-q-${idx}" onclick="document.getElementById('exam-q-row-${idx}')?.scrollIntoView({behavior:'smooth', block:'center'});"
             style="width:34px; height:34px; display:flex; align-items:center; justify-content:center; border-radius:8px; border:1.5px solid var(--glass-border); cursor:pointer; font-size:0.85rem; font-weight:bold; ${userAnswers[idx] !== null ? 'background:var(--primary-color); color:#000; border-color:var(--primary-color);' : ''}">
            ${idx + 1}
        </div>
    `).join('');
}

function handleExamCheat() {
    if (document.getElementById('exam-taking-modal')) {
        alert('🚨 تحذير: لقد حاولت الخروج من صفحة الاختبار! تم إنهاء الاختبار تلقائياً لحفظ نزاهة التقييم.');
        submitExam(true); // Forced submit
    }
}

function renderExamQuestions() {
    const list = document.getElementById('exam-questions-list');
    if (!list) return;
    list.innerHTML = '';

    if (currentExamData.sheetImageUrl) {
        // Choice grid for image-sheet exams
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
        grid.style.gap = '20px';

        currentExamData.questions.forEach((q, idx) => {
            grid.innerHTML += `
                <div class="exam-q-block" id="exam-q-row-${idx}" style="padding: 18px; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 12px; transition: 0.3s;">
                    <p style="margin-bottom: 12px; font-weight: bold; color: var(--primary-light); display: flex; justify-content: space-between;">
                        <span>سؤال ${idx + 1}</span>
                        <span id="q-status-${idx}" style="font-size: 0.7rem; color: #6366f1; opacity: 0;"><i class="fas fa-check"></i> تم الاختيار</span>
                    </p>
                    <div style="display: flex; gap: 8px;">
                        ${[1, 2, 3, 4].map(num => `
                            <label style="flex: 1; text-align: center; cursor: pointer; padding: 10px 5px; border: 1.5px solid var(--glass-border); border-radius: 8px; transition: 0.3s; font-weight: bold;" id="label-q${idx}-opt${num}">
                                <input type="radio" name="q${idx}" value="${num}" style="display:none;" onchange="handleAnswerChange(${idx}, ${num - 1})">
                                ${num}
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        list.appendChild(grid);
    } else {
        // Interactive questions: mcq / tf, optionally with per-question image
        currentExamData.questions.forEach((q, idx) => {
            const isTf = q.type === 'tf';
            const opts = isTf ? ['صح', 'خطأ'] : q.opts;
            list.innerHTML += `
                <div class="exam-q-block glass" id="exam-q-row-${idx}" style="margin-bottom: 25px; padding: 25px; border-radius: 15px; border: 1px solid var(--glass-border);">
                    <p class="q-title" style="font-size: 1.15rem; margin-bottom: 15px; line-height: 1.5; display:flex; justify-content:space-between; gap:10px;">
                        <span>${idx + 1}. ${q.text}</span>
                        <span style="font-size:0.8rem; color: var(--text-muted); white-space:nowrap;">${q.points || 1} درجة</span>
                    </p>
                    ${q.imageUrl ? `<div style="margin-bottom:18px;"><img src="${q.imageUrl}" style="max-width:100%; border-radius:10px; border:1px solid var(--glass-border);"></div>` : ''}
                    <div class="exam-options" style="display: grid; grid-template-columns: ${isTf ? '1fr 1fr' : '1fr 1fr'}; gap: 12px;">
                        ${opts.map((opt, oIdx) => `
                            <label id="label-q${idx}-opt${oIdx + 1}" style="display: flex; align-items: center; gap: 12px; padding: 15px; background: rgba(255,255,255,0.03); border: 1.5px solid var(--glass-border); border-radius: 10px; cursor: pointer; transition: 0.3s;">
                                <input type="radio" name="q${idx}" value="${oIdx}" onchange="handleAnswerChange(${idx}, ${oIdx})" style="accent-color: var(--primary-color);">
                                <span style="font-size: 1rem;">${opt}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        });
    }
}

function handleAnswerChange(qIdx, optIdx) {
    userAnswers[qIdx] = optIdx;

    // UI Feedback
    const status = document.getElementById(`q-status-${qIdx}`);
    if (status) status.style.opacity = '1';

    // Highlight selected option (labels are 1-indexed in their element id, optIdx is 0-indexed)
    const isSheet = !!currentExamData.sheetImageUrl;
    const max = isSheet ? 4 : currentExamData.questions[qIdx].opts.length;
    for (let i = 1; i <= max; i++) {
        const label = document.getElementById(`label-q${qIdx}-opt${i}`);
        if (label) {
            if ((i - 1) === optIdx) {
                label.style.background = 'var(--primary-color)';
                label.style.borderColor = 'var(--primary-color)';
                label.style.color = '#000';
            } else {
                label.style.background = 'rgba(255,255,255,0.03)';
                label.style.borderColor = 'var(--glass-border)';
                label.style.color = 'inherit';
            }
        }
    }

    const gridCell = document.getElementById(`grid-q-${qIdx}`);
    if (gridCell) {
        gridCell.style.background = 'var(--primary-color)';
        gridCell.style.color = '#000';
        gridCell.style.borderColor = 'var(--primary-color)';
    }
}

async function submitExam(isForced = false) {
    if (!isForced && userAnswers.some(a => a === null)) {
        if (!confirm('لم تقم بالإجابة على جميع الأسئلة، هل تريد الإنهاء فعلاً؟')) return;
    }

    let score = 0;
    let total = 0;
    currentExamData.questions.forEach((q, idx) => {
        const points = q.points || 1;
        total += points;
        if (parseInt(q.correct, 10) === userAnswers[idx]) score += points;
    });

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const isPassed = percentage >= (currentExamData.minPassPercent || 0);

    const studentSession = localStorage.getItem('studentSession');
    const student = studentSession ? JSON.parse(studentSession) : null;

    // Save result to Firebase
    const resultData = {
        examId: currentExamData.id,
        examTitle: currentExamData.title,
        studentName: student ? student.name : 'طالب زائر',
        studentPhone: student ? student.phone : 'N/A',
        studentGrade: student ? student.grade : 'N/A',
        score: score,
        total: total,
        percentage: percentage,
        isPassed: isPassed,
        answers: userAnswers,
        createdAt: new Date().toISOString()
    };

    try {
        const docRef = await db.collection('results').add(resultData);
        resultData.id = docRef.id;
        appData.results.push(resultData);
    } catch (e) {
        console.error("Error saving result:", e);
    }

    // Mark as taken in local storage for instant feedback
    const takenExams = JSON.parse(localStorage.getItem('takenExams') || '{}');
    takenExams[currentExamData.id] = {
        score: score,
        total: total,
        percentage: percentage,
        isPassed: isPassed,
        time: new Date().toISOString()
    };
    localStorage.setItem('takenExams', JSON.stringify(takenExams));

    const examQuestionsSnapshot = currentExamData.questions;
    const answersSnapshot = userAnswers.slice();
    closeExam();
    showExamReview(resultData, examQuestionsSnapshot, answersSnapshot);
}

function showExamReview(result, questions, answers) {
    const modal = document.createElement('div');
    modal.id = 'exam-review-modal';
    modal.className = 'exam-overlay';
    modal.innerHTML = `
        <div class="exam-container glass" style="max-width: 800px; width: 95%; max-height: 90vh; display: flex; flex-direction: column;">
            <div class="exam-header" style="flex-shrink:0; padding: 20px 25px; border-bottom: 1px solid var(--glass-border); text-align:center; background: var(--input-bg);">
                <div style="font-size: 3rem; margin-bottom: 10px;">${result.isPassed ? '🎉' : '📝'}</div>
                <h3 style="margin:0 0 5px; color: var(--primary-light);">${result.isPassed ? 'تهانينا، لقد نجحت!' : 'حاول مرة أخرى في المرة القادمة'}</h3>
                <p style="margin:0; color: var(--text-muted);">درجتك: <strong style="color:var(--text-primary);">${result.score} / ${result.total}</strong> (${result.percentage}%)</p>
            </div>
            <div style="flex-grow:1; overflow-y:auto; padding: 25px;">
                ${questions.map((q, idx) => {
        const isTf = q.type === 'tf';
        const opts = isTf ? ['صح', 'خطأ'] : q.opts;
        const userAns = answers[idx];
        const correctAns = parseInt(q.correct, 10);
        const wasCorrect = userAns === correctAns;
        return `
                        <div class="exam-q-block glass" style="margin-bottom:18px; padding:18px; border-radius:12px; border: 1.5px solid ${wasCorrect ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'};">
                            <p style="font-weight:bold; margin-bottom:12px;">${idx + 1}. ${q.text} <span style="font-size:0.8rem; color:var(--text-muted);">(${q.points || 1} درجة)</span></p>
                            ${q.imageUrl ? `<img src="${q.imageUrl}" style="max-width:100%; border-radius:8px; margin-bottom:12px;">` : ''}
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                                ${opts.map((opt, oIdx) => {
            let style = 'padding:10px; border-radius:8px; border:1px solid var(--glass-border); font-size:0.9rem;';
            if (oIdx === correctAns) style += 'background:rgba(34,197,94,0.15); border-color:#22c55e;';
            else if (oIdx === userAns && !wasCorrect) style += 'background:rgba(239,68,68,0.15); border-color:#ef4444;';
            return `<div style="${style}">${opt} ${oIdx === correctAns ? '<i class="fas fa-check" style="color:#22c55e;"></i>' : (oIdx === userAns ? '<i class="fas fa-times" style="color:#ef4444;"></i>' : '')}</div>`;
        }).join('')}
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
            <div style="flex-shrink:0; padding:20px; border-top:1px solid var(--glass-border); text-align:center;">
                <button class="btn-primary" style="padding:12px 40px;" onclick="document.getElementById('exam-review-modal').remove();">إغلاق</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeExam() {
    const modal = document.getElementById('exam-taking-modal');
    if (modal) {
        if (examTimer) clearInterval(examTimer);
        window.removeEventListener('blur', handleExamCheat);
        modal.remove();
    }
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.getElementById('main-nav');
    const bar = document.getElementById('theme-toggle-bar');
    const offset = (nav ? nav.offsetHeight : 0) + (bar ? bar.offsetHeight : 0) + 10;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
}

function scrollToGrades() {
    scrollToSection('grades');
}

function checkLogin() {
    const pass = document.getElementById('admin-password').value;
    if (pass === '010qwe') {
        currentState.isAdmin = true;
        document.getElementById('admin-modal').style.display = 'none';
        showAdminDashboard();
    } else {
        alert('كلمة المرور غير صحيحة');
    }
}

function showAdminDashboard() {
    const dashboard = document.getElementById('admin-dashboard');
    dashboard.classList.remove('hidden');
    const navItems = document.querySelectorAll('.admin-nav li');
    navItems.forEach(item => {
        item.onclick = () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderAdminSection(item.dataset.section);

            // Close sidebar on mobile after selection
            if (window.innerWidth <= 968) {
                toggleAdminSidebar();
            }
        };
    });
    renderAdminSection('dashboard');
}

function toggleAdminSidebar(btn) {
    const sidebar = document.getElementById('admin-sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('active');

    // If btn is passed (mobile toggle), update its icon
    if (btn) {
        const icon = btn.querySelector('i');
        if (icon) {
            if (sidebar.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        }
    }
}

function renderAdminSection(section) {
    const main = document.getElementById('admin-content-area');
    if (section === 'dashboard') {
        const usedVouchers = appData.vouchers.filter(v => v.isUsed);
        const revenue = usedVouchers.length * 50;
        const studentCount = appData.students.length;
        const totalVisits = appData.visits.length;

        main.innerHTML = `
            <h3>لوحة التحكم والإحصائيات 📊</h3>
            
            <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                <div class="stat-item glass">
                    <div class="stat-icon-wrapper" style="width: 50px; height: 50px; background: rgba(34, 197, 94, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                        <i class="fas fa-wallet" style="color: #22c55e; font-size: 1.5rem;"></i>
                    </div>
                    <h4>${revenue} ج.م</h4>
                    <p>إجمالي الإيرادات</p>
                </div>
                <div class="stat-item glass">
                    <div class="stat-icon-wrapper" style="width: 50px; height: 50px; background: rgba(212, 175, 55, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                        <i class="fas fa-user-graduate" style="color: var(--primary-light); font-size: 1.5rem;"></i>
                    </div>
                    <h4>${studentCount}</h4>
                    <p>الطلاب المسجلين</p>
                </div>
                <div class="stat-item glass">
                    <div class="stat-icon-wrapper" style="width: 50px; height: 50px; background: rgba(59, 130, 246, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                        <i class="fas fa-eye" style="color: #3b82f6; font-size: 1.5rem;"></i>
                    </div>
                    <h4>${totalVisits}</h4>
                    <p>إجمالي الزيارات</p>
                </div>
                <div class="stat-item glass">
                    <div class="stat-icon-wrapper" style="width: 50px; height: 50px; background: rgba(99, 102, 241, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                        <i class="fas fa-file-video" style="color: #6366f1; font-size: 1.5rem;"></i>
                    </div>
                    <h4>${appData.lessons.length}</h4>
                    <p>فيديو تعليمي</p>
                </div>
            </div>

            <!-- Grade Breakdown -->
            <div class="stats-grid" style="margin-top: 30px; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
                <div class="stat-item glass type-mini">
                    <span style="font-size: 2rem; color: var(--primary-light);">3</span>
                    <h4>${appData.students.filter(s => s.grade === '3mid').length} طالب</h4>
                    <p>الشهادة الإعدادية</p>
                </div>
                <div class="stat-item glass type-mini">
                    <span style="font-size: 2rem; color: #6366f1;">1</span>
                    <h4>${appData.students.filter(s => s.grade === '1sec').length} طالب</h4>
                    <p>أولى ثانوي</p>
                </div>
                <div class="stat-item glass type-mini">
                    <span style="font-size: 2rem; color: #22c55e;">2</span>
                    <h4>${appData.students.filter(s => s.grade === '2sec').length} طالب</h4>
                    <p>تانية ثانوي</p>
                </div>
                <div class="stat-item glass type-mini">
                    <span style="font-size: 2rem; color: #f59e0b;">3</span>
                    <h4>${appData.students.filter(s => s.grade === '3sec').length} طالب</h4>
                    <p>تالتة ثانوي</p>
                </div>
            </div>

            <div class="contact-wrapper" style="margin-top: 30px;">
                <div class="contact-form-container glass">
                    <h4>إحصائيات المتابعة (Engagement) 📈</h4>
                    <div style="margin-top: 20px;">
                        <div class="feature-line">
                            <span>نسبة مشاهدة الفيديوهات:</span>
                            <div style="flex: 1; height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; margin: 0 15px; position: relative; overflow: hidden;">
                                <div style="width: 85%; height: 100%; background: var(--gradient-1);"></div>
                            </div>
                            <span>85%</span>
                        </div>
                        <div class="feature-line" style="margin-top: 15px;">
                            <span>معدل إكمال الدروس:</span>
                            <div style="flex: 1; height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; margin: 0 15px; position: relative; overflow: hidden;">
                                <div style="width: 62%; height: 100%; background: #6366f1;"></div>
                            </div>
                            <span>62%</span>
                        </div>
                    </div>
                </div>

                <div class="contact-form-container glass">
                    <h4>وقت الذروة للمذاكرة ⏰</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted);">أفضل أوقات تواجد الطلاب (للبث المباشر)</p>
                    <div style="height: 150px; display: flex; align-items: flex-end; gap: 10px; margin-top: 20px; padding: 10px; border-bottom: 2px solid var(--glass-border);">
                        <div style="flex: 1; height: 30%; background: var(--glass-border); border-radius: 5px 5px 0 0;" title="صياحاً"></div>
                        <div style="flex: 1; height: 50%; background: var(--glass-border); border-radius: 5px 5px 0 0;" title="ظهراً"></div>
                        <div style="flex: 1; height: 90%; background: var(--gradient-1); border-radius: 5px 5px 0 0;" title="مساءً (الذروة)"></div>
                        <div style="flex: 1; height: 70%; background: var(--glass-border); border-radius: 5px 5px 0 0;" title="ليلاً"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">
                        <span>صباحاً</span>
                        <span>ظهراً</span>
                        <span>مساءً</span>
                        <span>ليلاً</span>
                    </div>
                </div>
            </div>

            <div class="vouchers-table-container" style="margin-top: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px;">
                    <h4 style="margin: 0;">النمو المالي والطلابي (آخر 30 يوم) 📅</h4>
                    <button class="btn-primary" style="background: #ef4444; font-size: 0.9rem;" onclick="resetStatistics()">
                        <i class="fas fa-undo"></i> تصفير الإحصائيات (الزيارات والطلاب)
                    </button>
                </div>
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>الفترة</th>
                            <th>الطلاب الجدد</th>
                            <th>الكورسات الأكثر طلباً</th>
                            <th>الإيرادات</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>اليوم</td>
                            <td>+${Math.floor(Math.random() * 10)}</td>
                            <td>ثالثة ثانوي - جبر</td>
                            <td>${Math.floor(Math.random() * 500)} ج.م</td>
                        </tr>
                        <tr>
                            <td>هذا الأسبوع</td>
                            <td>+${Math.floor(Math.random() * 50) + 10}</td>
                            <td>تفاضل وتكامل</td>
                            <td>${Math.floor(Math.random() * 2000) + 1000} ج.م</td>
                        </tr>
                        <tr>
                            <td>هذا الشهر</td>
                            <td>+${usedVouchers.length}</td>
                            <td>المراجعة النهائية</td>
                            <td>${revenue} ج.م</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        `;
    } else if (section === 'add-lesson') {
        main.innerHTML = `
            <h3>إضافة درس جديد</h3>
            <div class="admin-form-container">
                <div class="form-group">
                    <label>رابط اليوتيوب</label>
                    <input type="text" id="lesson-url" placeholder="https://youtube.com/...">
                </div>
                <div class="form-group">
                    <label>عنوان الدرس</label>
                    <input type="text" id="lesson-title" placeholder="أدخل عنوان الفيديو">
                </div>
                <div class="form-group">
                    <label>وصف الفيديو / رقم الوحدة</label>
                    <input type="text" id="lesson-desc" placeholder="مثلاً: شرح الوحدة الأولى">
                </div>
                <div class="form-group">
                    <label>الفرع / المادة</label>
                    <select id="lesson-branch">
                        ${MATH_BRANCHES.filter(b => b !== 'الكل').map(b => `<option value="${b}">${b}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>المرحلة</label>
                    <select id="lesson-grade" onchange="updateAdminBranches('lesson')">
                        <option value="3mid">الصف الثالث الإعدادي</option>
                        <option value="1sec">الصف الأول الثانوي</option>
                        <option value="2sec">الصف الثاني الثانوي</option>
                        <option value="3sec-sci">الصف الثالث الثانوي (علمي)</option>
                        <option value="3sec-lit">الصف الثالث الثانوي (أدبي)</option>
                    </select>
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                    <label><i class="fas fa-image"></i> صورة مصغرة للدرس (Thumbnail) - اختياري</label>
                    <input type="file" id="lesson-image-input" accept="image/*" onchange="handleImageInputUpload(this, 'lesson-image-preview')">
                    <div id="lesson-image-preview" style="margin-top:10px;" data-uploaded-url=""></div>
                </div>
                <div class="form-group" style="grid-column: 1 / -1; background: rgba(99, 102, 241, 0.05); padding: 15px; border-radius: 10px; border: 1px dashed #6366f1;">
                    <label style="color: #818cf8;"><i class="fas fa-lock"></i> قفل الدرس خلف اختبار (اختياري)</label>
                    <div style="display: flex; gap: 15px; margin-top: 10px;">
                        <select id="lesson-required-exam" style="flex: 2;">
                            <option value="">بدون اختبار (مفتوح)</option>
                            ${appData.exams.map(e => `<option value="${e.id}">${e.title} (${appData.grades[e.grade]?.title})</option>`).join('')}
                        </select>
                        <input type="number" id="lesson-min-score" placeholder="أقل درجة للفتح" style="flex: 1;">
                    </div>
                </div>
            </div>
            <button class="btn-primary" onclick="saveNewLesson()">
                <i class="fas fa-save"></i> حفظ الدرس
            </button>

            <hr style="margin: 40px 0; border: 1px solid var(--glass-border);">
            
            <h3>إدارة الدروس المضافة</h3>
            <div class="vouchers-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>الصورة</th>
                            <th>العنوان</th>
                            <th>المرحلة</th>
                            <th>الفرع</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${appData.lessons.slice().reverse().map(l => `
                            <tr>
                                <td>${l.imageUrl ? `<img src="${l.imageUrl}" style="width:60px;height:40px;object-fit:cover;border-radius:6px;">` : '<span style="color:var(--text-muted);font-size:0.8rem;">—</span>'}</td>
                                <td>${l.title}</td>
                                <td>${appData.grades[l.grade]?.title || l.grade}</td>
                                <td>${l.branch}</td>
                                <td>
                                    <div style="display: flex; gap: 5px;">
                                        <a href="${l.url}" target="_blank" class="btn-primary" style="background: #3b82f6; padding: 5px 10px; text-decoration: none; font-size: 0.8rem;">
                                            <i class="fas fa-external-link-alt"></i> معاينة
                                        </a>
                                        <button class="btn-primary" style="background: #ef4444; padding: 5px 10px; font-size: 0.8rem;" onclick="deleteItem('lessons', '${l.id}')">
                                            <i class="fas fa-trash"></i> حذف
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else if (section === 'add-exam') {
        const editingExam = currentState.editingExamId ? appData.exams.find(e => e.id === currentState.editingExamId) : null;
        main.innerHTML = `
            <h3>${editingExam ? 'تعديل اختبار' : 'إضافة اختبار جديد'} 📝</h3>
            <input type="hidden" id="exam-edit-id" value="${editingExam ? editingExam.id : ''}">
            <div class="admin-form-container glass" style="padding: 20px; border-radius: 15px; margin-bottom: 30px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="form-group">
                        <label>عنوان الاختبار</label>
                        <input type="text" id="exam-title" placeholder="مثلاً: اختبار الجبر الشامل" value="${editingExam ? editingExam.title : ''}">
                    </div>
                    <div class="form-group">
                        <label>الفرع / المادة</label>
                        <select id="exam-branch">
                            ${MATH_BRANCHES.filter(b => b !== 'الكل').map(b => `<option value="${b}" ${editingExam && editingExam.branch === b ? 'selected' : ''}>${b}</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 15px;">
                    <div class="form-group">
                        <label>المرحلة</label>
                        <select id="exam-grade">
                            <option value="3mid" ${editingExam?.grade === '3mid' ? 'selected' : ''}>الصف الثالث الإعدادي</option>
                            <option value="1sec" ${editingExam?.grade === '1sec' ? 'selected' : ''}>الصف الأول الثانوي</option>
                            <option value="2sec" ${editingExam?.grade === '2sec' ? 'selected' : ''}>الصف الثاني الثانوي</option>
                            <option value="3sec-sci" ${editingExam?.grade === '3sec-sci' ? 'selected' : ''}>الصف الثالث الثانوي (علمي)</option>
                            <option value="3sec-lit" ${editingExam?.grade === '3sec-lit' ? 'selected' : ''}>الصف الثالث الثانوي (أدبي)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>نسبة النجاح % (لفتح الدروس المرتبطة)</label>
                        <input type="number" id="exam-min-pass-score" placeholder="مثلاً: 50" min="0" max="100" value="${editingExam ? (editingExam.minPassPercent ?? '') : ''}">
                    </div>
                    <div class="form-group">
                        <label>مدة الاختبار (بالدقائق)</label>
                        <input type="number" id="exam-duration" placeholder="مثلاً: 15" value="${editingExam ? editingExam.duration : ''}">
                    </div>
                </div>

                <div style="margin-top: 25px; padding: 15px; background: rgba(212, 175, 55, 0.05); border: 1px dashed var(--primary-color); border-radius: 12px;">
                    <h4 style="color: var(--primary-light); margin-bottom: 15px;"><i class="fas fa-image"></i> خيار: اختبار عبر صورة واحدة (مناسب للرياضيات)</h4>
                    <div class="form-group">
                        <label>رابط صورة الامتحان (من جوجل درايف أو غيره)</label>
                        <input type="text" id="exam-image-url" placeholder="ضع رابط الصورة هنا..." value="${editingExam && editingExam.sheetImageUrl ? editingExam.sheetImageUrl : ''}">
                    </div>
                    <div class="form-group" style="margin-top: 10px;">
                        <label>عدد الأسئلة في الصورة</label>
                        <input type="number" id="exam-image-q-count" placeholder="مثلاً: 10" value="${editingExam && editingExam.sheetImageUrl ? editingExam.questions.length : ''}" oninput="renderImageAnswersGrid()">
                    </div>
                    <div id="image-answers-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-top: 15px;"></div>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 10px;"><i class="fas fa-info-circle"></i> هذا الخيار يستبعد الأسئلة النصية أدناه. استخدم نوعاً واحداً فقط لكل اختبار.</p>
                </div>

                <div id="traditional-questions-section" style="margin-top: 30px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4 style="margin: 0;">أو: أسئلة تفاعلية (اختياري)</h4>
                        <div style="display:flex; gap:10px;">
                            <span id="exam-questions-summary" style="font-size: 0.85rem; color: var(--text-muted); align-self:center;">0 سؤال | 0 درجة</span>
                        </div>
                    </div>
                    <div id="questions-container"></div>
                    <button class="btn-primary" style="background: #3b82f6;" onclick="addNewQuestionBlock()">
                        <i class="fas fa-plus"></i> إضافة سؤال جديد
                    </button>
                </div>
            </div>
            
            <div style="display:flex; gap:10px;">
                <button class="btn-primary w-100" style="padding: 15px; font-size: 1.1rem;" onclick="saveNewExam()">
                    <i class="fas fa-save"></i> ${editingExam ? 'حفظ التعديلات' : 'حفظ الاختبار ونشره'}
                </button>
                ${editingExam ? `<button class="btn-primary" style="background:#64748b; padding:15px 25px;" onclick="currentState.editingExamId = null; renderAdminSection('add-exam');"><i class="fas fa-times"></i> إلغاء</button>` : ''}
            </div>

            <hr style="margin: 40px 0; border: 1px solid var(--glass-border);">
            
            <h3>إدارة الاختبارات المضافة</h3>
            <div class="vouchers-table-container">
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>العنوان</th>
                            <th>المرحلة</th>
                            <th>الفرع</th>
                            <th>النوع</th>
                            <th>عدد الأسئلة</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${appData.exams.slice().reverse().map(e => `
                            <tr>
                                <td>${e.title}</td>
                                <td>${appData.grades[e.grade]?.title || e.grade}</td>
                                <td>${e.branch}</td>
                                <td>${e.sheetImageUrl ? 'صورة' : 'تفاعلي'}</td>
                                <td>${(e.questions || []).length}</td>
                                <td>
                                    <div style="display:flex; gap:5px;">
                                        <button class="btn-primary" style="background: #7c3aed; padding: 5px 10px; font-size: 0.8rem;" onclick="openExamResultsModal('${e.id}')">
                                            <i class="fas fa-poll"></i> النتائج
                                        </button>
                                        <button class="btn-primary" style="background: #0077b6; padding: 5px 10px; font-size: 0.8rem;" onclick="currentState.editingExamId='${e.id}'; renderAdminSection('add-exam');">
                                            <i class="fas fa-edit"></i> تعديل
                                        </button>
                                        <button class="btn-primary" style="background: #ef4444; padding: 5px 10px; font-size: 0.8rem;" onclick="deleteItem('exams', '${e.id}')">
                                            <i class="fas fa-trash"></i> حذف
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Exam Results Modal -->
            <div id="exam-results-modal" class="exam-overlay" style="display:none;">
                <div class="exam-container glass" style="max-width: 1000px; width: 95%; max-height: 90vh; display:flex; flex-direction:column;">
                    <div class="exam-header" style="flex-shrink:0; padding:15px 25px; border-bottom:1px solid var(--glass-border); display:flex; justify-content:space-between; align-items:center;">
                        <h3 id="exam-results-title" style="margin:0; color: var(--primary-light);"><i class="fas fa-poll"></i> نتائج الاختبار</h3>
                        <span onclick="document.getElementById('exam-results-modal').style.display='none';" style="cursor:pointer; font-size:1.5rem; color:var(--text-muted);">&times;</span>
                    </div>
                    <div style="padding:20px; overflow-y:auto;">
                        <div class="stats-grid" id="exam-results-stats" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); margin-bottom:20px;"></div>
                        <div class="vouchers-table-container">
                            <table style="width:100%;">
                                <thead>
                                    <tr>
                                        <th>الطالب</th>
                                        <th>الهاتف</th>
                                        <th>الدرجة</th>
                                        <th>النسبة</th>
                                        <th>الحالة</th>
                                        <th>الوقت</th>
                                        <th>إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody id="exam-results-tbody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
        renderExamQuestionBlocks(editingExam);
        if (editingExam && editingExam.sheetImageUrl) renderImageAnswersGrid(editingExam);
    } else if (section === 'add-file') {
        main.innerHTML = `
            <h3>إضافة ملف أو مذكرة جديدة</h3>
            <div class="admin-form-container">
                <div class="form-group">
                    <label>رابط الملف (Google Drive/Dropbox)</label>
                    <input type="text" id="file-url" placeholder="https://drive.google.com/...">
                </div>
                <div class="form-group">
                    <label>عنوان الملف</label>
                    <input type="text" id="file-title" placeholder="أدخل اسم المذكرة">
                </div>
                <div class="form-group">
                    <label>الفرع / المادة</label>
                    <select id="file-branch">
                        ${MATH_BRANCHES.filter(b => b !== 'الكل').map(b => `<option value="${b}">${b}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>المرحلة</label>
                    <select id="file-grade" onchange="updateAdminBranches('file')">
                        <option value="3mid">الصف الثالث الإعدادي</option>
                        <option value="1sec">الصف الأول الثانوي</option>
                        <option value="2sec">الصف الثاني الثانوي</option>
                        <option value="3sec-sci">الصف الثالث الثانوي (علمي)</option>
                        <option value="3sec-lit">الصف الثالث الثانوي (أدبي)</option>
                    </select>
                </div>
            </div>
            <button class="btn-primary" onclick="saveNewFile()">
                <i class="fas fa-save"></i> حفظ الملف
            </button>

            <hr style="margin: 40px 0; border: 1px solid var(--glass-border);">
            
            <h3>إدارة المذكرات المضافة</h3>
            <div class="vouchers-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>العنوان</th>
                            <th>المرحلة</th>
                            <th>الفرع</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${appData.files.slice().reverse().map(f => `
                            <tr>
                                <td>${f.title}</td>
                                <td>${appData.grades[f.grade]?.title || f.grade}</td>
                                <td>${f.branch}</td>
                                <td>
                                    <button class="btn-primary" style="background: #ef4444; padding: 5px 10px;" onclick="deleteItem('files', '${f.id}')">
                                        <i class="fas fa-trash"></i> حذف
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else if (section === 'vouchers') {
        const unusedCount = appData.vouchers.filter(v => !v.isUsed).length;

        // Detailed breakdown
        const stats = {
            '3mid': appData.vouchers.filter(v => v.grade === '3mid').length,
            '1sec': appData.vouchers.filter(v => v.grade === '1sec').length,
            '2sec': appData.vouchers.filter(v => v.grade === '2sec').length,
            '3sec': appData.vouchers.filter(v => v.grade === '3sec').length,
        };

        main.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3>نظام أكواد التفعيل المتخصصة 🔑</h3>
                <div style="display: flex; gap: 10px;">
                    <select id="voucher-grade-filter" style="width: auto; margin-top: 0; padding: 5px 15px;" onchange="filterVouchersByGrade(this.value)">
                        <option value="all">كل المراحل</option>
                        <option value="3mid">3 إعدادي (${stats['3mid']})</option>
                        <option value="1sec">1 ثانوي (${stats['1sec']})</option>
                        <option value="2sec">2 ثانوي (${stats['2sec']})</option>
                        <option value="3sec">3 ثانوي (${stats['3sec']})</option>
                    </select>
                </div>
            </div>

            <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); margin-bottom: 30px;">
                <div class="stat-item glass">
                    <h4 style="color: var(--primary-light);">${appData.vouchers.length}</h4>
                    <p>الإجمالي</p>
                </div>
                <div class="stat-item glass">
                    <h4 style="color: #22c55e;">${unusedCount}</h4>
                    <p>أكواد متاحة</p>
                </div>
                  <div class="stat-item glass">
                    <h4 style="color: #6366f1;">${stats['3mid']}</h4>
                    <p>3 إعدادي</p>
                </div>
                <div class="stat-item glass">
                    <h4 style="color: #f59e0b;">${stats['1sec']}</h4>
                    <p>1 ثانوي</p>
                </div>
                <div class="stat-item glass">
                    <h4 style="color: #ef4444;">${stats['2sec']}</h4>
                    <p>2 ثانوي</p>
                </div>
                <div class="stat-item glass">
                    <h4 style="color: #a855f7;">${stats['3sec']}</h4>
                    <p>3 ثانوي</p>
                </div>
            </div>
            
            <div class="hero-btns" style="margin-bottom: 30px;">
                <button class="btn-primary" onclick="generateVouchers()">
                    <i class="fas fa-magic"></i> توليد 1000 كود جديد
                </button>
            </div>

            <div class="vouchers-table-container">
                <table id="vouchers-main-table">
                    <thead>
                        <tr>
                            <th style="width: 50px;">م</th>
                            <th>الكود</th>
                            <th>المرحلة</th>
                            <th>اسم الطالب/ملاحظة</th>
                            <th>الحالة</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody id="vouchers-table-body">
                        ${renderVoucherRows(appData.vouchers)}
                    </tbody>
                </table>
            </div>
        `;
    } else if (section === 'students-list') {
        main.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                <h3>قائمة الطلاب المسجلين 🎓 <span style="font-size:0.9rem; color: var(--text-muted); font-weight: 400;">(${appData.students.length} طالب)</span></h3>
                <button class="btn-primary" onclick="printStudentsList()">
                    <i class="fas fa-print"></i> طباعة القائمة
                </button>
            </div>
            
            <div class="vouchers-table-container">
                <table id="printable-students-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>الاسم الرباعي</th>
                            <th>المحافظة</th>
                            <th>رقم الطالب</th>
                            <th>رقم ولي الأمر</th>
                            <th>المرحلة الدراسية</th>
                            <th>تاريخ التسجيل</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${appData.students.map((s, idx) => `
                            <tr>
                                <td style="color: var(--text-muted); font-size: 0.85rem;">${idx + 1}</td>
                                <td style="font-weight: 600;">${s.name}</td>
                                <td>${s.governorate || '-'}</td>
                                <td style="font-family: monospace; direction: ltr; text-align: right;">${s.phone || 'N/A'}</td>
                                <td style="font-family: monospace; direction: ltr; text-align: right;">${s.parentPhone || '-'}</td>
                                <td><span style="background: rgba(99,102,241,0.15); color: #a5b4fc; padding: 3px 8px; border-radius: 6px; font-size: 0.82rem;">${appData.grades[s.grade]?.title || s.grade}</span></td>
                                <td style="font-size: 0.85rem;">${new Date(s.createdAt).toLocaleDateString('ar-EG')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else if (section === 'visits-log') {
        main.innerHTML = `
            <h3>سجل الزيارات اليومية 🕒</h3>
            <p style="color: var(--text-muted); margin-bottom: 20px;">متابعة لحظية لدخول الطلاب للمنصة</p>
            
            <div class="vouchers-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>الطالب</th>
                            <th>المرحلة</th>
                            <th>وقت الزيارة</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${appData.visits.map(v => `
                            <tr>
                                <td>${v.studentName}</td>
                                <td>${appData.grades[v.grade]?.title || v.grade}</td>
                                <td style="direction: ltr; text-align: right;">${new Date(v.timestamp).toLocaleString('ar-EG')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else if (section === 'manage-groups') {
        main.innerHTML = `<h3>إدارة المجموعات</h3><p>يمكنك تعديل أسماء المجموعات من خلال مصفوفة appData في ملف app.js حالياً.</p>`;
    } else if (section === 'add-package') {
        renderAddPackageSection(main);
    } else if (section === 'manage-grades') {
        renderManageGradesSection(main);
    } else if (section === 'settings') {
        main.innerHTML = `
            <h3>إعدادات المنصة والهوية 🎨</h3>
            <div class="admin-form-container glass" style="padding: 25px; border-radius: 15px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="form-group">
                        <label>اسم الأستاذ</label>
                        <input type="text" id="set-teacher-name" value="${appData.settings.teacherName}">
                    </div>
                    <div class="form-group">
                        <label>شعار المنصة (Slogan)</label>
                        <input type="text" id="set-slogan" value="${appData.settings.slogan}">
                    </div>
                    <div class="form-group">
                        <label>رابط صورة الأستاذ (Hero Image)</label>
                        <input type="text" id="set-hero-img" value="${appData.settings.heroImg || 'teacher.jpg'}">
                    </div>
                    <div class="form-group">
                        <label>رابط اللوجو (Logo Image)</label>
                        <input type="text" id="set-logo-img" value="${appData.settings.logoImg || ''}" placeholder="اتركه فارغاً لاستخدام الأيقونة الافتراضية">
                    </div>
                    <div class="form-group">
                        <label>رقم الواتساب (بالكود الدولي)</label>
                        <input type="text" id="set-whatsapp" value="${appData.settings.whatsapp}">
                    </div>
                    <div class="form-group">
                        <label>رقم الهاتف للاتصال</label>
                        <input type="text" id="set-phone" value="${appData.settings.phone}">
                    </div>
                    <div class="form-group">
                        <label>رابط فيسبوك</label>
                        <input type="text" id="set-facebook" value="${appData.settings.facebook}">
                    </div>
                    <div class="form-group">
                        <label>رابط يوتيوب</label>
                        <input type="text" id="set-youtube" value="${appData.settings.youtube}">
                    </div>
                    <div class="form-group">
                        <label>رابط تيك توك</label>
                        <input type="text" id="set-tiktok" value="${appData.settings.tiktok}">
                    </div>
                    <div class="form-group">
                        <label>عنوان الهيرو (Hero Title)</label>
                        <input type="text" id="set-hero-title" value="${appData.settings.heroTitle}">
                    </div>
                </div>
                <div class="form-group" style="margin-top:15px;">
                    <label>وصف الهيرو (Hero Subtitle)</label>
                    <textarea id="set-hero-subtitle" style="height:60px; width:100%; background:var(--input-bg); border:1px solid var(--glass-border); border-radius:8px; color:var(--text-primary); padding:10px;">${appData.settings.heroSubtitle}</textarea>
                </div>
                
                <button class="btn-primary w-100" style="margin-top:25px; padding:15px;" onclick="saveBrandingSettings()">
                    <i class="fas fa-save"></i> حفظ الإعدادات وتحديث الموقع فوراً
                </button>
            </div>
        `;
    } else if (section === 'reset-system') {
        main.innerHTML = `
            <div class="glass" style="padding: 40px; border: 1px solid #ef4444; text-align: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #ef4444; margin-bottom: 20px;"></i>
                <h2 style="color: #ef4444; margin-bottom: 20px;">تصفير النظام بالكامل</h2>
                <p style="font-size: 1.2rem; margin-bottom: 30px;">
                    انتبه! هذه العملية ستقوم بحذف <b>كل شيء</b> قمت بإضافته (الدروس، الاختبارات، المذكرات، الطلاب، سجلات الزيارات، وأكواد التفعيل).
                    <br>
                    استخدم هذا الخيار فقط إذا كنت مستعداً لبدء العمل الرسمي وتصفير بيانات التدريب السابقة.
                </p>
                <div style="display: flex; gap: 20px; justify-content: center;">
                    <button class="btn-primary" style="background: #ef4444; padding: 15px 40px; font-size: 1.1rem;" onclick="resetFullSystem()">
                        <i class="fas fa-trash-alt"></i> نعم، قم بتصفير النظام الآن
                    </button>
                    <button class="btn-primary" style="background: #6366f1; padding: 15px 40px; font-size: 1.1rem;" onclick="renderAdminSection('dashboard')">
                        إلغاء والعودة
                    </button>
                </div>
            </div>
        `;
    } else if (section === 'student-results') {
        main.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3>نتائج الاختبارات والتقييمات 📊</h3>
                <button class="btn-primary" onclick="printStudentResults()">
                    <i class="fas fa-print"></i> طباعة النتائج
                </button>
            </div>

            <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 30px;">
                <div class="stat-item glass">
                    <h4 style="color: var(--primary-light);">${appData.results.length}</h4>
                    <p>إجمالي التقدم للامتحانات</p>
                </div>
                <div class="stat-item glass">
                    <h4 style="color: #22c55e;">${appData.results.filter(r => r.isPassed).length}</h4>
                    <p>طلاب اجتازوا</p>
                </div>
            </div>

            <div class="vouchers-table-container">
                <table id="printable-results-table">
                    <thead>
                        <tr>
                            <th>الطالب</th>
                            <th>المرحلة</th>
                            <th>الامتحان</th>
                            <th>الدرجة</th>
                            <th>النسبة</th>
                            <th>الحالة</th>
                            <th>الوقت</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${appData.results.map(r => {
            const percent = Math.round((r.score / r.total) * 100);
            return `
                                <tr>
                                    <td style="font-weight: 600;">${r.studentName} <br> <span style="font-size:0.75rem; color:var(--text-muted);">${r.studentPhone}</span></td>
                                    <td>${appData.grades[r.studentGrade]?.title || r.studentGrade}</td>
                                    <td>${r.examTitle}</td>
                                    <td style="font-weight: bold;">${r.score} / ${r.total}</td>
                                    <td>${percent}%</td>
                                    <td>
                                        <span style="background: ${r.isPassed ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; 
                                              color: ${r.isPassed ? '#4ade80' : '#f87171'}; 
                                              padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;">
                                            ${r.isPassed ? 'اجتاز ✅' : 'لم يجتز ❌'}
                                        </span>
                                    </td>
                                    <td style="font-size: 0.82rem;">${new Date(r.createdAt).toLocaleString('ar-EG')}</td>
                                </tr>
                            `;
        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    if (section === 'add-lesson') updateAdminBranches('lesson');
    if (section === 'add-exam') updateAdminBranches('exam');
    if (section === 'add-file') updateAdminBranches('file');
}

async function saveBrandingSettings() {
    const settings = {
        teacherName: document.getElementById('set-teacher-name').value,
        slogan: document.getElementById('set-slogan').value,
        heroImg: document.getElementById('set-hero-img').value,
        logoImg: document.getElementById('set-logo-img').value,
        whatsapp: document.getElementById('set-whatsapp').value,
        phone: document.getElementById('set-phone').value,
        facebook: document.getElementById('set-facebook').value,
        youtube: document.getElementById('set-youtube').value,
        tiktok: document.getElementById('set-tiktok').value,
        heroTitle: document.getElementById('set-hero-title').value,
        heroSubtitle: document.getElementById('set-hero-subtitle').value
    };

    try {
        await db.collection('settings').doc('branding').set(settings);
        alert('تم تحديث إعدادات المنصة بنجاح ✅');
    } catch (error) {
        console.error("Error saving settings:", error);
        alert('فشل حفظ الإعدادات');
    }
}

function updateBrandingUI() {
    const s = appData.settings;

    // Update Text
    document.title = `منصة الأستاذ ${s.teacherName} | رياضيات`;

    const nameEls = document.querySelectorAll('.dynamic-teacher-name');
    nameEls.forEach(el => el.textContent = s.teacherName);

    const sloganEls = document.querySelectorAll('.dynamic-slogan');
    sloganEls.forEach(el => el.textContent = s.slogan);

    const heroTitle = document.getElementById('hero-main-title');
    if (heroTitle) heroTitle.textContent = s.heroTitle;

    const heroSub = document.getElementById('hero-sub-desc');
    if (heroSub) heroSub.textContent = s.heroSubtitle;

    // Update Images
    const heroImg = document.getElementById('hero-teacher-img');
    if (heroImg) heroImg.src = s.heroImg || 'teacher.jpg';

    const logoImg = document.getElementById('dynamic-logo-img');
    const logoIcon = document.getElementById('dynamic-logo-icon');
    if (s.logoImg) {
        if (logoImg) { logoImg.src = s.logoImg; logoImg.style.display = 'block'; }
        if (logoIcon) logoIcon.style.display = 'none';
    } else {
        if (logoImg) logoImg.style.display = 'none';
        if (logoIcon) logoIcon.style.display = 'flex';
    }

    // Update Links
    const waLink = document.getElementById('wa-contact-link');
    if (waLink) waLink.href = `https://wa.me/${s.whatsapp}`;

    const fbLink = document.getElementById('fb-social-link');
    if (fbLink) fbLink.href = s.facebook;

    const ytLink = document.getElementById('yt-social-link');
    if (ytLink) ytLink.href = s.youtube;

    const tkLink = document.getElementById('tk-social-link');
    if (tkLink) tkLink.href = s.tiktok;
}

function printStudentResults() {
    const table = document.getElementById('printable-results-table').outerHTML;
    const win = window.open('', '', 'height=700,width=900');
    win.document.write('<html><head><title>نتائج الطلاب - المنصة التعليمية</title>');
    win.document.write('<style>body{direction:rtl;font-family:sans-serif;padding:20px;} table{width:100%;border-collapse:collapse;margin-top:20px;} th,td{border:1px solid #ddd;padding:12px;text-align:right;} th{background:#f4f4f4;}</style>');
    win.document.write('</head><body>');
    win.document.write('<h2>سجل درجات ونتائج الطلاب</h2>');
    win.document.write(table);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
}

// ==== EXAM QUESTIONS BUILDER (Interactive) ====
function renderExamQuestionBlocks(editingExam) {
    const container = document.getElementById('questions-container');
    if (!container) return;
    container.innerHTML = '';
    if (editingExam && editingExam.questions && editingExam.questions.length && !editingExam.sheetImageUrl) {
        editingExam.questions.forEach(q => addNewQuestionBlock(q));
    } else {
        addNewQuestionBlock();
    }
}

function addNewQuestionBlock(qData = null) {
    const container = document.getElementById('questions-container');
    if (!container) return;
    const qType = qData ? (qData.type || 'mcq') : 'mcq';
    const imageUrl = qData ? (qData.imageUrl || '') : '';

    const block = document.createElement('div');
    block.className = 'question-block glass';
    block.style.cssText = 'margin-bottom: 15px; padding: 15px; border-radius: 12px; position: relative;';
    block.dataset.imageUrl = imageUrl;

    block.innerHTML = `
        <button type="button" class="btn-primary" style="position:absolute; left:12px; top:12px; background:#ef4444; padding:4px 10px; font-size:0.75rem;" onclick="this.closest('.question-block').remove(); refreshExamQuestionsSummary();">
            <i class="fas fa-times"></i> حذف
        </button>
        <div class="form-group">
            <label>نص السؤال</label>
            <textarea class="q-text" placeholder="أدخل نص السؤال" oninput="refreshExamQuestionsSummary()">${qData ? escapeForAttr(qData.text || '') : ''}</textarea>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
            <div class="form-group" style="margin:0;">
                <label>نوع السؤال</label>
                <select class="q-type" onchange="toggleQuestionTypeFields(this)">
                    <option value="mcq" ${qType === 'mcq' ? 'selected' : ''}>اختيار من متعدد</option>
                    <option value="tf" ${qType === 'tf' ? 'selected' : ''}>صح وخطأ</option>
                </select>
            </div>
            <div class="form-group" style="margin:0;">
                <label>درجة السؤال</label>
                <input type="number" class="q-points" min="1" value="${qData ? (qData.points || 1) : 1}" oninput="refreshExamQuestionsSummary()">
            </div>
        </div>
        <div class="q-options-wrap" style="margin-top:10px;"></div>
        <div style="margin-top:12px;">
            <label style="font-size:0.85rem; color: var(--text-muted);"><i class="fas fa-image"></i> صورة للسؤال (اختياري)</label>
            <input type="file" class="q-image-input" accept="image/*" onchange="readQuestionImageFile(this)" style="display:block; margin-top:5px;">
            <div class="q-image-preview" style="margin-top:8px;">${imageUrl ? `<img src="${imageUrl}" style="max-width:200px; border-radius:8px; border:1px solid var(--glass-border);"> <button type="button" class="btn-primary" style="background:#ef4444; padding:3px 8px; font-size:0.7rem; margin-right:8px;" onclick="this.closest('.q-image-preview').previousElementSibling.value=''; this.closest('.question-block').dataset.imageUrl=''; this.closest('.q-image-preview').innerHTML='';">حذف الصورة</button>` : ''}</div>
        </div>
    `;
    container.appendChild(block);
    renderQuestionTypeFields(block, qType, qData);
    refreshExamQuestionsSummary();
}

function toggleQuestionTypeFields(select) {
    const block = select.closest('.question-block');
    renderQuestionTypeFields(block, select.value);
}

function renderQuestionTypeFields(block, type, qData = null) {
    const wrap = block.querySelector('.q-options-wrap');
    const correctVal = qData ? (qData.correct ?? 0) : 0;
    if (type === 'tf') {
        wrap.innerHTML = `
            <div class="form-group">
                <label>الإجابة الصحيحة</label>
                <select class="q-correct">
                    <option value="0" ${correctVal == 0 ? 'selected' : ''}>صح</option>
                    <option value="1" ${correctVal == 1 ? 'selected' : ''}>خطأ</option>
                </select>
            </div>
            <input type="hidden" class="opt1" value="صح">
            <input type="hidden" class="opt2" value="خطأ">
            <input type="hidden" class="opt3" value="">
            <input type="hidden" class="opt4" value="">
        `;
    } else {
        const opts = qData && Array.isArray(qData.opts) ? qData.opts : ['', '', '', ''];
        wrap.innerHTML = `
            <div class="options-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                <input type="text" class="opt1" placeholder="الاختيار 1" value="${escapeForAttr(opts[0] || '')}">
                <input type="text" class="opt2" placeholder="الاختيار 2" value="${escapeForAttr(opts[1] || '')}">
                <input type="text" class="opt3" placeholder="الاختيار 3" value="${escapeForAttr(opts[2] || '')}">
                <input type="text" class="opt4" placeholder="الاختيار 4" value="${escapeForAttr(opts[3] || '')}">
            </div>
            <div class="form-group" style="margin-top:10px;">
                <label>الإجابة الصحيحة</label>
                <select class="q-correct">
                    <option value="0" ${correctVal == 0 ? 'selected' : ''}>الاختيار 1</option>
                    <option value="1" ${correctVal == 1 ? 'selected' : ''}>الاختيار 2</option>
                    <option value="2" ${correctVal == 2 ? 'selected' : ''}>الاختيار 3</option>
                    <option value="3" ${correctVal == 3 ? 'selected' : ''}>الاختيار 4</option>
                </select>
            </div>
        `;
    }
}

function readQuestionImageFile(input) {
    const file = input.files && input.files[0];
    const block = input.closest('.question-block');
    if (!file || !block) return;
    if (!file.type.startsWith('image/')) { alert('برجاء اختيار ملف صورة فقط'); return; }
    const reader = new FileReader();
    reader.onload = () => {
        block.dataset.imageUrl = reader.result;
        block.querySelector('.q-image-preview').innerHTML = `<img src="${reader.result}" style="max-width:200px; border-radius:8px; border:1px solid var(--glass-border);"> <button type="button" class="btn-primary" style="background:#ef4444; padding:3px 8px; font-size:0.7rem; margin-right:8px;" onclick="this.closest('.q-image-preview').previousElementSibling.value=''; this.closest('.question-block').dataset.imageUrl=''; this.closest('.q-image-preview').innerHTML='';">حذف الصورة</button>`;
    };
    reader.readAsDataURL(file);
}

function refreshExamQuestionsSummary() {
    const blocks = document.querySelectorAll('#questions-container .question-block');
    let points = 0;
    blocks.forEach(b => {
        const p = parseInt(b.querySelector('.q-points')?.value, 10) || 1;
        points += p;
    });
    const summary = document.getElementById('exam-questions-summary');
    if (summary) summary.textContent = `${blocks.length} سؤال | ${points} درجة`;
}

function escapeForAttr(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function saveNewLesson() {
    const url = document.getElementById('lesson-url').value;
    const title = document.getElementById('lesson-title').value;
    const desc = document.getElementById('lesson-desc').value;
    const grade = document.getElementById('lesson-grade').value;
    const branch = document.getElementById('lesson-branch').value;
    const requiredExamId = document.getElementById('lesson-required-exam').value;
    const minScore = parseInt(document.getElementById('lesson-min-score').value) || 0;
    const imageUrl = document.getElementById('lesson-image-preview')?.dataset.uploadedUrl || null;

    if (!url || !title) return alert('برجاء ملء البيانات');

    const newLesson = {
        url, title, grade, branch,
        desc: desc || 'درس فيديو توضيحي',
        imageUrl: imageUrl || null,
        requiredExamId: requiredExamId || null,
        minScore: minScore,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        const docRef = await db.collection('lessons').add(newLesson);
        newLesson.id = docRef.id;
        appData.lessons.push(newLesson);
        alert('تم الحفظ بنجاح في السحابة');
        if (currentState.selectedGrade === grade) renderContent();
        renderAdminSection('add-lesson');
    } catch (error) {
        console.error("Error saving lesson:", error);
        alert('فشل الحفظ في قاعدة البيانات');
    }
}

async function saveNewExam() {
    const editId = document.getElementById('exam-edit-id')?.value || null;
    const title = document.getElementById('exam-title').value.trim();
    const grade = document.getElementById('exam-grade').value;
    const branch = document.getElementById('exam-branch').value;
    const sheetImageUrl = document.getElementById('exam-image-url').value.trim();
    const imageQCount = parseInt(document.getElementById('exam-image-q-count').value) || 0;
    const minPassPercent = parseInt(document.getElementById('exam-min-pass-score')?.value) || 0;
    const duration = parseInt(document.getElementById('exam-duration')?.value) || 15;

    if (!title) return alert('برجاء إدخال عنوان للاختبار');

    let questions = [];

    if (sheetImageUrl && imageQCount > 0) {
        // Image-sheet exam: one correct choice (1-4) per question, no individual question images.
        for (let i = 1; i <= imageQCount; i++) {
            const correctChild = document.getElementById(`img-q-correct-${i}`);
            if (correctChild) {
                questions.push({
                    text: `سؤال رقم ${i}`,
                    type: 'mcq',
                    opts: ['1', '2', '3', '4'],
                    correct: parseInt(correctChild.value, 10) - 1,
                    points: 1,
                    imageUrl: null
                });
            }
        }
    } else {
        const qBlocks = document.querySelectorAll('#questions-container .question-block');
        qBlocks.forEach(block => {
            const text = block.querySelector('.q-text').value.trim();
            const type = block.querySelector('.q-type')?.value || 'mcq';
            const opts = [
                block.querySelector('.opt1')?.value.trim() || '',
                block.querySelector('.opt2')?.value.trim() || '',
                block.querySelector('.opt3')?.value.trim() || '',
                block.querySelector('.opt4')?.value.trim() || ''
            ];
            const correct = parseInt(block.querySelector('.q-correct')?.value, 10) || 0;
            const points = parseInt(block.querySelector('.q-points')?.value, 10) || 1;
            const imageUrl = block.dataset.imageUrl || null;
            if (text) questions.push({ text, type, opts, correct, points, imageUrl });
        });
    }

    if (questions.length === 0) return alert('برجاء إضافة أسئلة للاختبار');

    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);

    const examData = {
        title, grade, branch, questions,
        sheetImageUrl: sheetImageUrl || null,
        minPassPercent: minPassPercent,
        duration: duration,
        totalPoints: totalPoints
    };

    try {
        if (editId) {
            await db.collection('exams').doc(editId).update(examData);
            const idx = appData.exams.findIndex(e => e.id === editId);
            if (idx > -1) appData.exams[idx] = { ...appData.exams[idx], ...examData };
            alert('تم تحديث الاختبار بنجاح ✅');
            currentState.editingExamId = null;
        } else {
            examData.createdAt = new Date().toISOString();
            const docRef = await db.collection('exams').add(examData);
            examData.id = docRef.id;
            appData.exams.unshift(examData);
            alert('تم حفظ الاختبار بنجاح 🎉');
        }
        renderAdminSection('add-exam');
    } catch (error) {
        console.error('Error saving exam:', error);
        alert('حدث خطأ أثناء حفظ الاختبار');
    }
}

function renderImageAnswersGrid(editingExam = null) {
    const count = parseInt(document.getElementById('exam-image-q-count').value) || 0;
    const container = document.getElementById('image-answers-grid');
    if (!container) return;

    container.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        const existing = editingExam && editingExam.questions && editingExam.questions[i - 1];
        const correctVal = existing ? (parseInt(existing.correct, 10) + 1) : 1;
        container.innerHTML += `
            <div style="background: var(--input-bg); padding: 5px; border-radius: 5px; text-align: center;">
                <label style="font-size: 0.7rem; display: block;">س ${i} (الصح)</label>
                <input type="number" id="img-q-correct-${i}" min="1" max="4" value="${correctVal}" style="width: 100%; padding: 3px; border-radius: 4px; border: 1px solid var(--glass-border); background: var(--input-bg); color: var(--text-primary); text-align: center;">
            </div>
        `;
    }
}

// ==== EXAM RESULTS (Admin) ====
function openExamResultsModal(examId) {
    const exam = appData.exams.find(e => e.id === examId);
    if (!exam) return;

    const results = appData.results.filter(r => r.examId === examId);
    const total = results.length;
    const passed = results.filter(r => r.isPassed).length;
    const failed = total - passed;
    const avg = total ? Math.round(results.reduce((sum, r) => sum + (r.percentage || Math.round((r.score / r.total) * 100)), 0) / total) : 0;

    document.getElementById('exam-results-title').innerHTML = `<i class="fas fa-poll"></i> نتائج: ${exam.title}`;
    document.getElementById('exam-results-stats').innerHTML = `
        <div class="stat-item glass"><h4>${total}</h4><p>إجمالي المحاولات</p></div>
        <div class="stat-item glass"><h4 style="color:#22c55e;">${passed}</h4><p>ناجح</p></div>
        <div class="stat-item glass"><h4 style="color:#ef4444;">${failed}</h4><p>غير ناجح</p></div>
        <div class="stat-item glass"><h4 style="color:var(--primary-light);">${avg}%</h4><p>متوسط النسبة</p></div>
    `;

    const tbody = document.getElementById('exam-results-tbody');
    if (!results.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--text-muted);">لا توجد محاولات على هذا الاختبار حتى الآن</td></tr>`;
    } else {
        tbody.innerHTML = results.slice().reverse().map(r => {
            const pct = r.percentage || Math.round((r.score / r.total) * 100);
            return `
                <tr>
                    <td>${r.studentName}</td>
                    <td>${r.studentPhone || '—'}</td>
                    <td><strong>${r.score} / ${r.total}</strong></td>
                    <td>${pct}%</td>
                    <td>
                        <span style="background:${r.isPassed ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}; color:${r.isPassed ? '#4ade80' : '#f87171'}; padding:3px 8px; border-radius:6px; font-size:0.75rem;">
                            ${r.isPassed ? 'ناجح ✅' : 'غير ناجح ❌'}
                        </span>
                    </td>
                    <td style="font-size:0.78rem;">${new Date(r.createdAt).toLocaleString('ar-EG')}</td>
                    <td>
                        <button class="btn-primary" style="background:#f59e0b; padding:4px 8px; font-size:0.75rem;" onclick="resetStudentExamAttempt('${examId}', '${r.id}', '${(r.studentPhone || '').replace(/'/g, "\\'")}')">
                            <i class="fas fa-undo"></i> تصفير المحاولة
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    document.getElementById('exam-results-modal').style.display = 'flex';
}

async function resetStudentExamAttempt(examId, resultId, studentPhone) {
    if (!confirm('هل تريد تصفير محاولة هذا الطالب للسماح له بإعادة الاختبار؟')) return;
    try {
        await db.collection('results').doc(resultId).delete();
        appData.results = appData.results.filter(r => r.id !== resultId);
    } catch (e) {
        console.error('Error deleting result:', e);
    }
    // Clear the local one-attempt lock so the student device can retake it too.
    try {
        const takenExams = JSON.parse(localStorage.getItem('takenExams') || '{}');
        delete takenExams[examId];
        localStorage.setItem('takenExams', JSON.stringify(takenExams));
    } catch (e) { }
    openExamResultsModal(examId);
    alert('تم تصفير المحاولة بنجاح 🔄');
}

async function saveNewFile() {
    const url = document.getElementById('file-url').value;
    const title = document.getElementById('file-title').value;
    const grade = document.getElementById('file-grade').value;
    const branch = document.getElementById('file-branch').value;
    if (!url || !title) return alert('برجاء ملء البيانات');
    const newFile = {
        url, title, grade, branch,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    try {
        const docRef = await db.collection('files').add(newFile);
        newFile.id = docRef.id;
        appData.files.push(newFile);
        alert('تم حفظ الملف بنجاح');
        if (currentState.selectedGrade === grade) renderContent();
        renderAdminSection('add-file');
    } catch (error) {
        console.error("Error saving file:", error);
        alert('فشل الحفظ في قاعدة البيانات');
    }
}

function logout() {
    currentState.isAdmin = false;
    document.getElementById('admin-dashboard').classList.add('hidden');
}

function hideAdminDashboard() {
    document.getElementById('admin-dashboard').classList.add('hidden');
}

function sendWhatsAppMessage(event) {
    event.preventDefault();
    const name = document.getElementById('contact-name').value;
    const phone = document.getElementById('contact-phone').value;
    const grade = document.getElementById('contact-grade').value;
    const message = document.getElementById('contact-message').value;
    const whatsappNumber = "201028164601";
    const text = `*رسالة جديدة من الموقع*%0A%0A` +
        `*الاسم:* ${name}%0A` +
        `*رقم الهاتف:* ${phone}%0A` +
        `*المرحلة:* ${grade}%0A` +
        `*الرسالة:* ${message}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;
    window.open(whatsappUrl, '_blank');
}

// --- Voucher Management ---
function generateRandomCode(length = 10) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function generateVouchers() {
    const gradesToGen = [
        { id: '1mid', title: '1 إعدادي' },
        { id: '2mid', title: '2 إعدادي' },
        { id: '3mid', title: '3 إعدادي' },
        { id: '1sec', title: '1 ثانوي' },
        { id: '2sec', title: '2 ثانوي' },
        { id: '3sec-sci', title: '3 ثانوي (علمي)' },
        { id: '3sec-lit', title: '3 ثانوي (أدبي)' }
    ];

    if (!confirm('هل أنت متأكد من توليد 250 كود لكل مرحلة (إجمالي 1000 كود)؟')) return;

    const newVouchers = [];
    const chunks = [];

    // Create 250 vouchers per grade
    gradesToGen.forEach(g => {
        for (let i = 0; i < 250; i++) {
            const code = generateRandomCode(10);
            newVouchers.push({
                code: code,
                grade: g.id,
                isUsed: false,
                isActive: true,
                note: '',
                createdAt: new Date().toISOString()
            });
        }
    });

    // Firestore batch limit is 500
    for (let i = 0; i < newVouchers.length; i += 500) {
        chunks.push(newVouchers.slice(i, i + 500));
    }

    try {
        for (const chunk of chunks) {
            const batch = db.batch();
            chunk.forEach(vData => {
                const ref = db.collection('vouchers').doc();
                batch.set(ref, vData);
                vData.id = ref.id;
            });
            await batch.commit();
        }

        appData.vouchers.push(...newVouchers);
        alert('تم توليد 1000 كود بنجاح (250 لكل مرحلة) وحفظهم في السحابة');
        renderAdminSection('vouchers');
    } catch (error) {
        console.error("Error generating vouchers:", error);
        alert('حدث خطأ أثناء توليد الأكواد');
    }
}

async function checkVoucher(btn) {
    const input = btn.previousElementSibling;
    const code = input.value.trim().toUpperCase();
    if (!code) return alert('برجاء إدخال الكود');

    // Find in appData first
    const voucher = appData.vouchers.find(v => v.code === code);

    if (voucher) {
        if (voucher.isUsed) return alert('هذا الكود تم استخدامه من قبل');
        if (voucher.isActive === false) return alert('تم إغلاق هذا الكود من قبل الإدارة، برجاء التواصل مع الأستاذ');

        // Verify if voucher matches current selected grade
        let currentGrade = currentState.selectedGrade;
        let voucherCategory = currentGrade.startsWith('3sec') ? '3sec' : currentGrade;

        if (voucher.grade && voucher.grade !== voucherCategory) {
            return alert('هذا الكود مخصص لمرحلة دراسية أخرى، برجاء إدخال كود مخصص لهذه المرحلة');
        }

        try {
            await db.collection('vouchers').doc(voucher.id).update({
                isUsed: true,
                usedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            voucher.isUsed = true;

            // Unlock specific grade
            localStorage.setItem(`unlocked_${currentGrade}`, 'true');

            alert('تم تفعيل هذه المرحلة بنجاح! يمكنك الآن مشاهدة جميع الدروس الخاصة بها.');
            renderContent();
        } catch (error) {
            console.error("Error updating voucher status:", error);
            alert('فشل تفعيل الكود، تأكد من اتصالك بالإنترنت');
        }
    } else {
        alert('كود غير صحيح، تأكد من كتابة الكود بشكل صحيح');
    }
}

async function handleStudentLogin(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.classList.add('loading');

    // Collect full 4-part name
    const fname = document.getElementById('student-fname').value.trim();
    const sname = document.getElementById('student-sname').value.trim();
    const tname = document.getElementById('student-tname').value.trim();
    const lname = document.getElementById('student-lname').value.trim();
    const name = `${fname} ${sname} ${tname} ${lname}`;

    const governorate = document.getElementById('student-governorate').value;
    const phone = document.getElementById('student-phone').value.trim();
    const parentPhone = document.getElementById('student-parent-phone').value.trim();
    const grade = document.getElementById('student-grade').value;

    if (!grade) {
        if (submitBtn) submitBtn.classList.remove('loading');
        return alert('برجاء اختيار مرحلتك الدراسية أولاً من قائمة الصفوف');
    }
    if (!governorate) {
        if (submitBtn) submitBtn.classList.remove('loading');
        return alert('برجاء اختيار المحافظة');
    }

    // Check if student already exists by phone (Wait if list is loading)
    let student = appData.students.find(s => s.phone === phone);

    if (!student) {
        const studentData = {
            name,
            governorate,
            phone,
            parentPhone,
            grade,
            unlockedGrades: [],
            unlockedPackages: [],
            createdAt: new Date().toISOString()
        };

        try {
            const docRef = await db.collection('students').add(studentData);
            studentData.id = docRef.id;
            appData.students.unshift(studentData);
            student = studentData;
        } catch (error) {
            console.error('Error saving student:', error);
            if (submitBtn) submitBtn.classList.remove('loading');
            return alert('حدث خطأ أثناء تسجيل البيانات، تأكد من اتصالك بالإنترنت');
        }
    }

    localStorage.setItem('studentSession', JSON.stringify(student));

    // Sync existing unlocks
    if (student.unlockedGrades) {
        student.unlockedGrades.forEach(g => localStorage.setItem(`unlocked_${g}`, 'true'));
    }
    if (student.unlockedPackages) {
        student.unlockedPackages.forEach(p => localStorage.setItem(`pkg_unlocked_${p}`, 'true'));
    }

    logVisit(student);

    if (submitBtn) submitBtn.classList.remove('loading');

    // Check if system is already unlocked for this grade
    const isGradeUnlocked = localStorage.getItem(`unlocked_${grade}`) === 'true';
    if (isGradeUnlocked) {
        alert(`أهلاً بك يا ${fname} 🎉\nمنصتك مفعلة بالفعل، استمتع بالدروس!`);
        document.getElementById('student-login-modal').style.display = 'none';
        if (currentState.selectedGrade === grade) renderContent();
    } else {
        // Switch to Voucher Step
        document.getElementById('registration-step').style.display = 'none';
        document.getElementById('voucher-step').style.display = 'block';
        const subtitle = document.getElementById('registration-modal-subtitle');
        if (subtitle) subtitle.textContent = 'تم تسجيل بياناتك بنجاح! هل لديك كود تفعيل؟';
    }

    // Hide Subscribe Button
    const subscribeBtn = document.getElementById('subscribe-btn');
    if (subscribeBtn) subscribeBtn.style.display = 'none';
}

async function activateGradeWithVoucher() {
    const codeInput = document.getElementById('direct-voucher-input');
    const activateBtn = codeInput.nextElementSibling;
    const code = codeInput.value.trim().toUpperCase();
    const grade = document.getElementById('student-grade').value;

    if (!grade) return alert('الرجاء اختيار المرحلة الدراسية أولاً');
    if (!code) return alert('برجاء إدخال كود التفعيل');

    // Find the voucher in local state
    const voucher = appData.vouchers.find(v => v.code === code);

    if (!voucher) {
        return alert('كود التفعيل غير مخصص لهذه المرحلة أو غير صحيح');
    }
    if (voucher.grade !== grade) {
        return alert('هذا الكود مخصص لمرحلة دراسية أخرى');
    }
    if (voucher.isUsed) {
        return alert('هذا الكود تم استخدامه مسبقاً');
    }

    if (activateBtn) {
        activateBtn.classList.add('loading');
        activateBtn.disabled = true;
    }

    try {
        const session = localStorage.getItem('studentSession');
        if (!session) {
            throw new Error('يجب تسجيل البيانات أولاً');
        }
        const student = JSON.parse(session);

        // 1. Mark voucher as used in Firebase
        await db.collection('vouchers').doc(voucher.id).update({
            isUsed: true,
            usedAt: new Date().toISOString(),
            usedBy: student.phone,
            note: student.name
        });

        // 2. Persistent unlock: Associate with student in Firestore
        await db.collection('students').doc(student.id).update({
            unlockedGrades: firebase.firestore.FieldValue.arrayUnion(grade)
        });

        // 3. Update local state
        voucher.isUsed = true;
        localStorage.setItem(`unlocked_${grade}`, 'true');

        // Update session in localStorage to include the new unlock
        if (student.unlockedGrades) {
            student.unlockedGrades.push(grade);
        } else {
            student.unlockedGrades = [grade];
        }
        localStorage.setItem('studentSession', JSON.stringify(student));

        alert('تم تفعيل المرحلة بنجاح! 🎉 استمتع بالمحتوى التعليمي.');

        // Refresh content if viewing the same grade
        if (currentState.selectedGrade === grade) {
            renderContent();
        }

        // Hide modal
        document.getElementById('student-login-modal').style.display = 'none';

    } catch (error) {
        console.error('Error activating voucher:', error);
        alert(error.message || 'حدث خطأ أثناء تفعيل الكود، تأكد من اتصالك بالإنترنت والمحاولة مرة أخرى');
    } finally {
        if (activateBtn) {
            activateBtn.classList.remove('loading');
            activateBtn.disabled = false;
        }
    }
}

function printStudentsList() {
    const table = document.getElementById('printable-students-table').outerHTML;
    const win = window.open('', '', 'height=700,width=900');
    win.document.write('<html><head><title>قائمة الطلاب</title>');
    win.document.write('<style>body{direction:rtl; font-family: Tahoma; padding: 20px;} table{width:100%; border-collapse:collapse; margin-top:20px;} th,td{border:1px solid #ddd; padding:12px; text-align:right;} th{background:#f4f4f4;} h2{text-align:center;}</style>');
    win.document.write('</head><body>');
    win.document.write('<h2>قائمة الطلاب المسجلين - منصة الأستاذ أحمد جمال رضوان</h2>');
    win.document.write(table);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
}

async function logVisit(student) {
    if (!student) return;

    // Prevent multiple logs in the same session (tab open)
    if (sessionStorage.getItem('visitLogged')) return;

    const visitData = {
        studentName: student.name,
        phone: student.phone,
        grade: student.grade,
        timestamp: new Date().toISOString()
    };
    try {
        await db.collection('visits').add(visitData);
        appData.visits.unshift(visitData); // Local update
        sessionStorage.setItem('visitLogged', 'true');
    } catch (error) {
        console.error("Error logging visit:", error);
    }
}

function openIntroVideo() {
    const modal = document.getElementById('intro-modal');
    const videoId = 'c7EwMgecsVk';
    modal.style.display = 'flex';

    if (ytPlayers['intro']) {
        ytPlayers['intro'].loadVideoById(videoId);
    } else {
        initYTPlayer('intro', videoId, 'intro-video-iframe');
    }
}

function initYTPlayer(id, videoId, elementId = null) {
    if (!isYouTubeAPIReady) {
        // Double check if YT is actually ready but the flag was missed
        if (window.YT && window.YT.Player) {
            isYouTubeAPIReady = true;
        } else {
            setTimeout(() => initYTPlayer(id, videoId, elementId), 500);
            return;
        }
    }

    const targetId = elementId || `player-${id}`;
    let targetEl = document.getElementById(targetId);
    if (!targetEl) targetEl = document.getElementById(id); // Fallback to direct ID
    if (!targetEl) targetEl = document.getElementById(`pkg-player-${id.split('pkg-').pop()}`); // Specific fallback for package videos
    if (!targetEl) return; // Prevent errors if element is gone

    // Clean up old player if exists
    if (ytPlayers[id]) {
        try {
            if (ytPlayers[id].destroy) ytPlayers[id].destroy();
        } catch (e) { console.error("Error destroying player:", e); }
    }

    try {
        ytPlayers[id] = new YT.Player(targetId, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                'autoplay': 0,
                'controls': 1,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0,
                'iv_load_policy': 3,
                'disablekb': 1,
                'fs': 0,
                'enablejsapi': 1,
                'playsinline': 1,
                'origin': window.location.origin || '*'
            },
            events: {
                'onStateChange': (event) => onPlayerStateChange(event, id),
                'onError': (e) => console.error("YouTube Player Error for " + id, e)
            }
        });
    } catch (err) {
        console.error("Critical error initializing YouTube player:", err);
    }
}

function onPlayerStateChange(event, id) {
    const wrapper = id === 'intro' ? document.getElementById('intro-video-wrapper') : document.getElementById(`vid-wrapper-${id}`);
    if (!wrapper) return;
    const playIcon = wrapper.querySelector('.play-overlay i');
    const playOverlay = wrapper.querySelector('.play-overlay');

    if (event.data == YT.PlayerState.PLAYING) {
        if (playOverlay) playOverlay.style.opacity = '0';
        if (playIcon) playIcon.className = 'fas fa-pause';
        if (wrapper) wrapper.classList.remove('paused');
        startProgressLoop(id);
    } else {
        if (playOverlay) playOverlay.style.opacity = '1';
        if (playIcon) playIcon.className = 'fas fa-play';
        if (wrapper) wrapper.classList.add('paused');
        stopProgressLoop(id);
    }

}

let progressIntervals = {};

function startProgressLoop(id) {
    stopProgressLoop(id);
    progressIntervals[id] = setInterval(() => {
        const player = ytPlayers[id];
        const progressBar = document.getElementById(`progress-${id}`);
        if (player && progressBar && player.getCurrentTime) {
            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            const percent = (currentTime / duration) * 100;
            progressBar.style.width = `${percent}%`;
        }
    }, 1000);
}

function stopProgressLoop(id) {
    if (progressIntervals[id]) {
        clearInterval(progressIntervals[id]);
        delete progressIntervals[id];
    }
}

function handleSeek(event, id) {
    const player = ytPlayers[id];
    if (!player) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const percent = x / width;
    const duration = player.getDuration();
    if (duration > 0) {
        player.seekTo(duration * percent, true);
    }
}

function togglePlayPause(id) {
    const player = ytPlayers[id];
    if (!player) return;

    const state = player.getPlayerState();
    if (state == YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

// Custom Fullscreen Handler
function toggleFullscreen(wrapperId) {
    const elem = document.getElementById(wrapperId);
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Seek functionality
function seek(id, seconds) {
    const player = ytPlayers[id];
    if (player && player.getCurrentTime) {
        const currentTime = player.getCurrentTime();
        player.seekTo(currentTime + seconds, true);
    }
}

// Disable right-click on video wrappers to prevent context menu redirects
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.video-preview-wrapper, .video-container-wrapper')) {
        e.preventDefault();
        return false;
    }
});

function closeIntroVideo() {
    const modal = document.getElementById('intro-modal');
    if (ytPlayers['intro']) {
        ytPlayers['intro'].stopVideo();
    }
    modal.style.display = 'none';
}

function updateAdminBranches(type) {
    const gradeSelect = document.getElementById(`${type}-grade`);
    const branchSelect = document.getElementById(`${type}-branch`);
    if (!gradeSelect || !branchSelect) return;
    const selectedGrade = gradeSelect.value;

    const branches = appData.grades[selectedGrade]?.branches || MATH_BRANCHES;

    branchSelect.innerHTML = branches
        .filter(b => b !== 'الكل')
        .map(b => `<option value="${b}">${b}</option>`)
        .join('');
}
async function deleteItem(collection, id) {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    try {
        await db.collection(collection).doc(id).delete();
        // تحديث البيانات محلياً
        appData[collection] = appData[collection].filter(item => item.id !== id);
        alert('تم الحذف بنجاح');

        // إعادة رندرة القسم المفتوح في لوحة التحكم
        const sectionMap = {
            'lessons': 'add-lesson',
            'exams': 'add-exam',
            'files': 'add-file'
        };
        renderAdminSection(sectionMap[collection]);

        // تحديث الموقع الأساسي إذا كان المستخدم يشاهد قسماً معيناً
        if (currentState.selectedGrade) renderContent();
    } catch (error) {
        console.error("Error deleting item:", error);
        alert('حدث خطأ أثناء الحذف، يرجى المحاولة مرة أخرى');
    }
}
async function toggleVoucherStatus(id, currentActive) {
    try {
        const newStatus = !currentActive;
        await db.collection('vouchers').doc(id).update({
            isActive: newStatus
        });

        // تحديث محلي
        const voucher = appData.vouchers.find(v => v.id === id);
        if (voucher) voucher.isActive = newStatus;

        alert(newStatus ? 'تم تفعيل الكود بنجاح' : 'تم إغلاق الكود بنجاح');
        renderAdminSection('vouchers');
    } catch (error) {
        console.error("Error toggling voucher status:", error);
        alert('حدث خطأ أثناء تعديل حالة الكود');
    }
}

async function updateVoucherNote(id, note) {
    try {
        await db.collection('vouchers').doc(id).update({
            note: note
        });

        // تحديث محلي
        const voucher = appData.vouchers.find(v => v.id === id);
        if (voucher) voucher.note = note;
    } catch (error) {
        console.error("Error updating voucher note:", error);
    }
}

// --- New Voucher UI Helpers ---
function renderVoucherRows(vouchers) {
    return vouchers.slice()
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .reverse()
        .map((v, idx, arr) => {
            const active = v.isActive !== false;
            const serial = arr.length - idx;
            const gradeTitle = appData.grades[v.grade]?.title ||
                (v.grade === '3sec' ? 'الثالث الثانوي' :
                    (v.grade === '3mid' ? 'الثالث الإعدادي' :
                        (v.grade === '1sec' ? 'الأول الثانوي' :
                            (v.grade === '2sec' ? 'الثاني الثانوي' : v.grade || 'غير محدد'))));

            return `
                <tr>
                    <td><span style="color: var(--text-muted); font-size: 0.8rem;">#${serial}</span></td>
                    <td style="font-family: monospace; font-size: 1.1rem; color: var(--primary-light);">${v.code}</td>
                    <td><span class="status-badge" style="background: rgba(99, 102, 241, 0.1); color: #6366f1;">${gradeTitle}</span></td>
                    <td>
                        <input type="text" class="voucher-note-input" 
                               value="${v.note || ''}" 
                               placeholder="اكتب اسم الطالب هنا..." 
                               onblur="updateVoucherNote('${v.id}', this.value)">
                    </td>
                    <td>
                        <span class="status-badge" style="background: ${v.isUsed ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)'}; color: ${v.isUsed ? '#ef4444' : '#22c55e'};">
                            ${v.isUsed ? 'مُستخدم' : 'متاح'}
                        </span>
                        <span class="status-badge" style="background: ${active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)'}; color: ${active ? '#22c55e' : '#f59e0b'}; margin-right: 5px;">
                            ${active ? 'مفعل' : 'مغلق'}
                        </span>
                    </td>
                    <td>
                        <button class="btn-primary" style="background: ${active ? '#f59e0b' : '#22c55e'}; padding: 5px 10px;" onclick="toggleVoucherStatus('${v.id}', ${active})">
                            <i class="fas fa-${active ? 'pause' : 'play'}"></i> ${active ? 'إغلاق' : 'تفعيل'}
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
}

function filterVouchersByGrade(grade) {
    const tbody = document.getElementById('vouchers-table-body');
    if (!tbody) return;

    const filtered = grade === 'all'
        ? appData.vouchers
        : appData.vouchers.filter(v => v.grade === grade);

    tbody.innerHTML = renderVoucherRows(filtered);
}

async function resetStatistics() {
    const confirmation = confirm("⚠️ تحذير: هل أنت متأكد من تصفير إحصائيات الطلاب والزيارات وإعادة تعيين الأكواد كمتاحة؟ لن يتم حذف الدروس أو الاختبارات.");
    if (!confirmation) return;

    try {
        // 1. Clear students and visits
        const collections = ['students', 'visits'];
        for (const coll of collections) {
            const snapshot = await db.collection(coll).get();
            const batch = db.batch();
            snapshot.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
        }

        // 2. Reset voucher usage (Set isUsed to false but keep the codes)
        const voucherSnapshot = await db.collection('vouchers').get();
        const voucherBatch = db.batch();
        voucherSnapshot.docs.forEach(doc => {
            voucherBatch.update(doc.ref, {
                isUsed: false,
                usedAt: null,
                note: ''
            });
        });
        await voucherBatch.commit();

        appData.students = [];
        appData.visits = [];
        appData.vouchers.forEach(v => {
            v.isUsed = false;
            v.usedAt = null;
            v.note = '';
        });

        alert("تم تصفير الإحصائيات وإعادة تعيين الأكواد بنجاح!");
        renderAdminSection('dashboard');
    } catch (error) {
        console.error("Error resetting statistics:", error);
        alert("حدث خطأ أثناء تصفير الإحصائيات");
    }
}

async function resetFullSystem() {
    const confirmation = confirm("⚠️ تحذير نهائي: هل أنت متأكد من حذف كافة البيانات (دروس، طلاب، اختبارات، أكواد، إلخ)؟ لا يمكن التراجع عن هذه الخطوة!");
    if (!confirmation) return;

 
    const secondConfirmation = prompt("لتأكيد الحذف، اكتب كلمة 'تصفير' في المربع أدناه:");
    if (secondConfirmation !== 'تصفير') {
        alert("إجراء ملغي: الكلمة غير صحيحة");
        return;
    }

    const collections = ['lessons', 'exams', 'files', 'vouchers', 'students', 'visits'];

    try {
        // Show loading state
        document.getElementById('admin-content-area').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--primary-light);"></i>
                <h3 style="margin-top: 20px;">جاري تصفير النظام... برجاء عدم إغلاق الصفحة</h3>
            </div>
        `;

        for (const coll of collections) {
            const snapshot = await db.collection(coll).get();
            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }

        // Clear local storage
        localStorage.clear();
        sessionStorage.clear();

        alert("تم تصفير النظام بنجاح! سيتم إعادة تحميل الصفحة الآن.");
        window.location.reload();

    } catch (error) {
        console.error("Error resetting system:", error);
        alert("حدث خطأ أثناء تصفير النظام. برجاء المحاولة مرة أخرى أو التواصل مع المبرمج.");
    }
}

// ============================================================
// =================== PACKAGES SYSTEM ========================
// ============================================================

let currentPackageModal = null;

// --- Render packages for student view ---
function renderPackages() {
    const container = document.getElementById('packages-list');
    if (!container) return;

    const grade = currentState.selectedGrade;
    const filtered = appData.packages.filter(p => p.grade === grade);

    if (!filtered.length) {
        container.innerHTML = `<p class="empty-msg" style="grid-column:1/-1;">لا توجد باقات متاحة لهذه المرحلة حالياً</p>`;
        return;
    }

    container.innerHTML = filtered.map(pkg => {
        const isUnlocked = localStorage.getItem(`pkg_unlocked_${pkg.id}`) === 'true';
        const videos = pkg.lessons || pkg.videos || [];

        // Use package image if available, else use video thumbnails
        let topVisualHtml = '';
        if (pkg.imageUrl) {
            topVisualHtml = `
                <div style="position:relative; width:100%; aspect-ratio:16/9; overflow:hidden;">
                    <img src="${pkg.imageUrl}" alt="${pkg.name}" 
                         style="width:100%; height:100%; object-fit:cover; display:block; border-radius:16px 16px 0 0;">
                    ${!isUnlocked ? `
                        <div style="position:absolute; top:12px; left:12px; background:rgba(0,0,0,0.65); width:42px; height:42px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1.5px solid rgba(255,255,255,0.25); box-shadow:0 2px 10px rgba(0,0,0,0.4);">
                            <i class="fas fa-lock" style="color:#fff; font-size:1.05rem;"></i>
                        </div>
                    ` : `
                        <div style="position:absolute; inset:0; background:linear-gradient(transparent, rgba(0,0,0,0.5));"></div>
                    `}
                </div>
            `;
        } else {
            const thumbsHtml = videos.slice(0, 4).map(v => {
                const ytId = getYouTubeId(v.url);
                return `<div style="position:relative;overflow:hidden;border-radius:10px;aspect-ratio:16/9;background:#111; border:1px solid rgba(255,255,255,0.1);">
                    <img src="https://img.youtube.com/vi/${ytId}/mqdefault.jpg" alt="${v.title}"
                         style="width:100%;height:100%;object-fit:cover;">
                    ${!isUnlocked ? `
                        <div style="position:absolute; top:6px; left:6px; background:rgba(0,0,0,0.65); width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                            <i class="fas fa-lock" style="color:#fff; font-size:0.7rem;"></i>
                        </div>
                    ` : `
                        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
                            <i class="fas fa-play-circle" style="color:rgba(255,255,255,0.9);font-size:1.6rem; text-shadow:0 2px 10px rgba(0,0,0,0.5);"></i>
                        </div>
                    `}
                </div>`;
            }).join('');

            topVisualHtml = `
                <div style="padding:15px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${thumbsHtml}
                </div>
            `;
        }

        return `
        <div class="package-card glass" style="border-radius:20px;overflow:hidden;border:1px solid var(--glass-border);transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position:relative;" onmouseenter="this.style.transform='translateY(-8px)'; this.style.borderColor='var(--primary-light)';" onmouseleave="this.style.transform='translateY(0)'; this.style.borderColor='var(--glass-border)';">
            ${topVisualHtml}
            
            <div style="padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:15px;">
                    <div style="flex:1;">
                        <h3 style="margin:0;font-size:1.25rem;color:var(--text-primary); font-weight:700; line-height:1.4;">${pkg.name}</h3>
                        <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
                            <span style="background:rgba(99,102,241,0.15); color:#a5b4fc; padding:3px 10px; border-radius:6px; font-size:0.75rem;"><i class="fas fa-graduation-cap"></i> ${appData.grades[pkg.grade]?.title || pkg.grade}</span>
                            <span style="color:var(--text-muted); font-size:0.75rem;"><i class="fas fa-video"></i> ${videos.length} حصة</span>
                        </div>
                    </div>
                    ${!isUnlocked ? `
                        <div style="text-align:left;">
                            <div style="font-size:1.6rem;font-weight:900;color:var(--primary-light);">${pkg.price}<span style="font-size:0.8rem; font-weight:500; margin-right:3px;">ج.م</span></div>
                            ${pkg.duration ? `<div style="font-size:0.7rem;color:var(--text-muted); text-align:center; margin-top:2px;">${pkg.duration}</div>` : ''}
                        </div>
                    ` : `
                        <div style="color:#4ade80; font-size:1.8rem; filter: drop-shadow(0 0 8px rgba(74,222,128,0.3));"><i class="fas fa-check-circle"></i></div>
                    `}
                </div>

                ${pkg.description ? `<p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:18px; line-height:1.6;">${pkg.description}</p>` : ''}
                
                ${isUnlocked
                ? `<button class="btn-primary w-100" onclick="watchPackage('${pkg.id}')" style="background:linear-gradient(135deg,#22c55e,#16a34a); box-shadow:0 4px 15px rgba(22,163,74,0.3); padding:14px; border-radius:12px; font-weight:600;">
                            <i class="fas fa-play"></i> فتح المحتوى التعليمي
                       </button>`
                : `<button class="btn-primary w-100" onclick="openPackageModal('${pkg.id}')" style="padding:14px; border-radius:12px; font-weight:600; box-shadow:0 4px 15px rgba(99,102,241,0.3);">
                            <i class="fas fa-star"></i> اشترك وفعل الآن
                       </button>`
            }
            </div>
        </div>`;
    }).join('');
}

function openPackageModal(pkgId) {
    const pkg = appData.packages.find(p => p.id === pkgId);
    if (!pkg) return;
    currentPackageModal = pkg;

    document.getElementById('pkg-modal-name').textContent = pkg.name;
    document.getElementById('pkg-voucher-input').value = '';

    document.getElementById('pkg-modal-info').innerHTML = `
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
            <div style="background:rgba(99,102,241,0.1);border-radius:10px;padding:10px 16px;flex:1;min-width:110px;text-align:center;">
                <div style="font-size:1.6rem;font-weight:800;color:var(--primary-light);">${pkg.price}</div>
                <div style="font-size:0.8rem;color:var(--text-muted);">جنيه مصري</div>
            </div>
            ${pkg.duration ? `<div style="background:rgba(34,197,94,0.1);border-radius:10px;padding:10px 16px;flex:1;min-width:110px;text-align:center;">
                <div style="font-size:1rem;font-weight:700;color:#4ade80;">${pkg.duration}</div>
                <div style="font-size:0.8rem;color:var(--text-muted);">مدة الباقة</div>
            </div>` : ''}
            <div style="background:rgba(245,158,11,0.1);border-radius:10px;padding:10px 16px;flex:1;min-width:110px;text-align:center;">
                <div style="font-size:1.6rem;font-weight:800;color:#fbbf24;">${(pkg.lessons || pkg.videos || []).length}</div>
                <div style="font-size:0.8rem;color:var(--text-muted);">درس</div>
            </div>
        </div>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:4px;">
            <i class="fas fa-mobile-alt" style="color:#a5b4fc;"></i>
            رقم فودافون كاش: <strong id="vodafone-cash-num" onclick="copyToClipboard('01028164601', this)" style="color:var(--text-primary);font-family:monospace;cursor:pointer;padding:2px 5px;border-radius:4px;background:var(--input-bg);transition:0.3s;" title="اضغط للنسخ">01028164601</strong>
        </p>
        <p style="color:var(--text-muted);font-size:0.82rem;">حوّل المبلغ وأرسل صورة الإيصال عبر واتساب لاستلام الكود</p>
    `;
    document.getElementById('package-subscribe-modal').style.display = 'flex';
}

async function activatePackageVoucher() {
    const codeInput = document.getElementById('pkg-voucher-input');
    const activateBtn = codeInput.nextElementSibling;
    const code = codeInput.value.trim().toUpperCase();
    if (!code) return alert('برجاء إدخال كود الباقة');
    if (!currentPackageModal) return;

    // --- SMART VOUCHER LOOKUP ---
    // 1. Search in packageVouchers (specific package vouchers)
    let voucher = appData.packageVouchers.find(v => v.code === code && v.packageId === currentPackageModal.id);
    let voucherCollection = 'packageVouchers';

    // 2. If not found, search in packageVouchers without packageId filter (any package code)
    if (!voucher) {
        voucher = appData.packageVouchers.find(v => v.code === code);
        if (voucher) voucherCollection = 'packageVouchers';
    }

    // 3. If still not found, search in general vouchers collection
    if (!voucher) {
        // Try Firebase direct query for the code
        try {
            const snap = await db.collection('packageVouchers').where('code', '==', code).limit(1).get();
            if (!snap.empty) {
                voucher = { id: snap.docs[0].id, ...snap.docs[0].data() };
                voucherCollection = 'packageVouchers';
            }
        } catch (e) { console.error('Error querying packageVouchers:', e); }
    }

    // 4. Last resort: search in regular vouchers
    if (!voucher) {
        try {
            const snap = await db.collection('vouchers').where('code', '==', code).limit(1).get();
            if (!snap.empty) {
                voucher = { id: snap.docs[0].id, ...snap.docs[0].data() };
                voucherCollection = 'vouchers';
            }
        } catch (e) { console.error('Error querying vouchers:', e); }
    }

    if (!voucher) return alert('❌ الكود غير صحيح. برجاء التأكد من الكود وإعادة المحاولة.');
    if (voucher.isUsed) return alert('⚠️ هذا الكود تم استخدامه من قبل');
    if (voucher.isActive === false) return alert('⚠️ هذا الكود مغلق من الإدارة، برجاء التواصل مع الأستاذ');

    if (activateBtn) {
        activateBtn.classList.add('loading');
        activateBtn.disabled = true;
    }

    try {
        const session = localStorage.getItem('studentSession');
        if (!session) {
            throw new Error('يجب تسجيل البيانات أولاً من القائمة الرئيسية');
        }
        const student = JSON.parse(session);

        // 1. Mark voucher as used in Firebase (in the correct collection)
        await db.collection(voucherCollection).doc(voucher.id).update({
            isUsed: true,
            usedAt: firebase.firestore.FieldValue.serverTimestamp(),
            usedBy: student.phone,
            studentName: student.name
        });

        // 2. Persistent unlock: Associate with student in Firestore
        await db.collection('students').doc(student.id).update({
            unlockedPackages: firebase.firestore.FieldValue.arrayUnion(currentPackageModal.id)
        });

        // 3. Update local state
        voucher.isUsed = true;
        localStorage.setItem(`pkg_unlocked_${currentPackageModal.id}`, 'true');

        // Update session in localStorage
        if (student.unlockedPackages) {
            student.unlockedPackages.push(currentPackageModal.id);
        } else {
            student.unlockedPackages = [currentPackageModal.id];
        }
        localStorage.setItem('studentSession', JSON.stringify(student));

        document.getElementById('package-subscribe-modal').style.display = 'none';
        alert(`🎉 تم تفعيل باقة "${currentPackageModal.name}" بنجاح!\nيمكنك الآن مشاهدة جميع الفيديوهات.`);
        renderPackages();
    } catch (err) {
        console.error(err);
        alert(err.message || 'فشل التفعيل، تأكد من اتصالك بالإنترنت');
    } finally {
        if (activateBtn) {
            activateBtn.classList.remove('loading');
            activateBtn.disabled = false;
        }
    }
}

function subscribeViaWhatsApp() {
    if (!currentPackageModal) return;
    const pkg = currentPackageModal;
    const text = encodeURIComponent(
        `السلام عليكم أستاذ أحمد 👋\n\nأريد الاشتراك في الباقة التالية:\n\n📦 *${pkg.name}*\n💰 السعر: ${pkg.price} ج.م\n${pkg.duration ? `⏱️ المدة: ${pkg.duration}\n` : ''}📚 المرحلة: ${appData.grades[pkg.grade]?.title || pkg.grade}\n\nسأقوم بتحويل المبلغ على فودافون كاش وإرسال صورة الإيصال.`
    );
    window.open(`https://wa.me/201028164601?text=${text}`, '_blank');
}

function watchPackage(pkgId) {
    const pkg = appData.packages.find(p => p.id === pkgId);
    if (!pkg) return;
    // Backward compatibility: old packages stored "videos", new packages store "lessons"
    const lessons = pkg.lessons || (pkg.videos || []).map(v => ({ title: v.title, url: v.url, imageUrl: null, examId: null, fileUrl: null }));
    if (!lessons.length) return alert('لا توجد دروس في هذه الباقة');

    const existing = document.getElementById('watch-package-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'watch-package-modal';
    modal.className = 'modal';
    modal.style.cssText = 'display:flex;z-index:6000;';
    modal.innerHTML = `
        <div class="modal-content glass" style="max-width:800px;width:95%;max-height:90vh;overflow-y:auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                <h3 style="margin:0;">${pkg.name}</h3>
                <button onclick="document.getElementById('watch-package-modal').remove()" style="background:none;border:none;color:var(--text-muted);font-size:1.5rem;cursor:pointer;">✕</button>
            </div>
            <div style="display:grid;gap:12px;">
                ${lessons.map((v, i) => {
        const ytId = getYouTubeId(v.url);
        const wrapperId = `pkg-vid-wrapper-${pkgId}-${i}`;
        const playerId = `pkg-player-${pkgId}-${i}`;
        const vid_key = `pkg-${pkgId}-${i}`;
        const linkedExam = v.examId ? appData.exams.find(e => e.id === v.examId) : null;
        return `
                    <div class="item-card" style="margin:0;">
                        ${v.imageUrl ? `<img src="${v.imageUrl}" alt="${v.title}" style="width:100%; max-height:160px; object-fit:cover; border-radius:14px 14px 0 0; display:block;">` : ''}
                        <div class="video-preview-wrapper" id="${wrapperId}">
                            ${ytId ? `<div id="${playerId}"></div>` : (
                v.url.match(/\.(mp4|webm|ogg)$/i)
                    ? `<video src="${v.url}" controls style="width:100%; height:100%; border-radius:20px;"></video>`
                    : `<iframe src="${v.url}" style="width:100%; height:100%; border:none; border-radius:20px;" allowfullscreen></iframe>`
            )}
                            ${ytId ? `
                            <div class="video-overlay-shield total-shield" onclick="togglePlayPause('${vid_key}')" ondblclick="toggleFullscreen('${wrapperId}')">
                                <div class="play-overlay"><i class="fas fa-play"></i></div>
                                <div class="shield-top"></div><div class="shield-center-top"></div>
                                <div class="shield-bottom-right"></div><div class="shield-bottom-left"></div>
                                <div class="custom-controls">
                                    <button class="custom-seek-btn" onclick="event.stopPropagation();seek('${vid_key}',-10)"><i class="fas fa-undo"></i></button>
                                    <div class="progress-container" onclick="event.stopPropagation();handleSeek(event,'${vid_key}')">
                                        <div class="progress-bar" id="progress-${vid_key}"></div>
                                    </div>
                                    <button class="custom-seek-btn" onclick="event.stopPropagation();seek('${vid_key}',10)"><i class="fas fa-redo"></i></button>
                                    <button class="custom-fs-btn" onclick="event.stopPropagation();toggleFullscreen('${wrapperId}')"><i class="fas fa-expand"></i></button>
                                </div>
                            </div>` : ''}
                        </div>
                        <div class="item-info">
                            <h4>${v.title}</h4>
                            ${(linkedExam || v.fileUrl) ? `
                                <div style="display:flex; gap:8px; margin-top:10px; flex-wrap:wrap;">
                                    ${linkedExam ? `<button class="btn-primary" style="background:#7c3aed; padding:6px 14px; font-size:0.8rem;" onclick="document.getElementById('watch-package-modal').remove(); startExam('${linkedExam.id}');"><i class="fas fa-file-signature"></i> اختبار الدرس</button>` : ''}
                                    ${v.fileUrl ? `<a href="${v.fileUrl}" target="_blank" class="btn-primary" style="background:#0ea5e9; padding:6px 14px; font-size:0.8rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;"><i class="fas fa-file-pdf"></i> المذكرة</a>` : ''}
                                </div>
                            ` : ''}
                        </div>
                    </div>`;
    }).join('')}
            </div>
        </div>`;
    document.body.appendChild(modal);
    lessons.forEach((v, i) => {
        const ytId = getYouTubeId(v.url);
        if (ytId) {
            const vid_key = `pkg-${pkgId}-${i}`;
            const playerId = `pkg-player-${pkgId}-${i}`;
            setTimeout(() => initYTPlayer(vid_key, ytId, playerId), 250 + i * 150);
        }
    });
}

// ---- Admin: Manage Grades (Educational Stages) Images ----
function renderManageGradesSection(main) {
    main.innerHTML = `
        <h3>إدارة المراحل التعليمية 🏫</h3>
        <p style="color:var(--text-muted); margin-bottom:20px;">يمكنك رفع أو تغيير صورة كل مرحلة تعليمية، وستظهر هذه الصورة بدلاً من الأيقونة الافتراضية في الصفحة الرئيسية.</p>
        <div style="display:grid; gap:16px;">
            ${Object.entries(appData.grades).map(([gradeId, grade]) => `
                <div class="glass" style="padding:16px; border-radius:12px; border:1px solid var(--glass-border); display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
                    <div style="width:120px; height:80px; border-radius:10px; overflow:hidden; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        ${grade.imageUrl
            ? `<img src="${grade.imageUrl}" style="width:100%; height:100%; object-fit:cover;">`
            : `<i class="fas ${grade.icon || 'fa-graduation-cap'}" style="font-size:2rem; color:var(--primary-light);"></i>`
        }
                    </div>
                    <div style="flex:1; min-width:200px;">
                        <h4 style="margin:0 0 4px;">${grade.title}</h4>
                        <p style="color:var(--text-muted); font-size:0.85rem; margin:0;">${grade.desc || ''}</p>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px; min-width:220px;">
                        <input type="file" accept="image/*" id="grade-img-input-${gradeId}" onchange="handleGradeImageUpload('${gradeId}', this)">
                        <div id="grade-img-status-${gradeId}" style="font-size:0.78rem; color:var(--text-muted);"></div>
                        ${grade.imageUrl ? `<button class="btn-primary" style="background:#ef4444; padding:5px 10px; font-size:0.78rem;" onclick="removeGradeImage('${gradeId}')"><i class="fas fa-trash"></i> إزالة الصورة</button>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function handleGradeImageUpload(gradeId, inputEl) {
    const file = inputEl.files && inputEl.files[0];
    if (!file) return;
    const statusEl = document.getElementById(`grade-img-status-${gradeId}`);
    if (statusEl) statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري رفع الصورة...';

    const url = await uploadToCloudinary(file);
    if (!url) {
        if (statusEl) statusEl.textContent = '';
        return;
    }

    try {
        await db.collection('settings').doc('gradesImages').set({ [gradeId]: url }, { merge: true });
        appData.grades[gradeId].imageUrl = url;
        if (statusEl) statusEl.innerHTML = '<span style="color:#4ade80;"><i class="fas fa-check"></i> تم الحفظ بنجاح</span>';
        renderGradesGrid();
        renderManageGradesSection(document.getElementById('admin-content-area'));
    } catch (e) {
        console.error('Error saving grade image:', e);
        if (statusEl) statusEl.innerHTML = '<span style="color:#f87171;">فشل الحفظ</span>';
    }
}

async function removeGradeImage(gradeId) {
    if (!confirm('هل تريد إزالة صورة هذه المرحلة والعودة للأيقونة الافتراضية؟')) return;
    try {
        await db.collection('settings').doc('gradesImages').set({ [gradeId]: null }, { merge: true });
        appData.grades[gradeId].imageUrl = null;
        renderGradesGrid();
        renderManageGradesSection(document.getElementById('admin-content-area'));
    } catch (e) {
        console.error('Error removing grade image:', e);
        alert('فشل حذف الصورة');
    }
}

// ---- Admin: Add Package Section ----
function renderAddPackageSection(main) {
    const editingPkg = currentState.editingPackageId ? appData.packages.find(p => p.id === currentState.editingPackageId) : null;
    main.innerHTML = `
        <h3>${currentState.editingPackageId ? 'تعديل باقة' : 'إضافة باقة جديدة'} 📦</h3>
        <div class="admin-form-container">
            <div class="form-group">
                <label>اسم الباقة</label>
                <input type="text" id="pkg-name" placeholder="مثلاً: باقة الجبر والهندسة الكاملة" value="${editingPkg ? escapeForAttr(editingPkg.name) : ''}">
            </div>
            <div class="form-group">
                <label>وصف الباقة (اختياري)</label>
                <input type="text" id="pkg-desc" placeholder="مثلاً: تشمل جميع دروس الجبر والهندسة" value="${editingPkg ? escapeForAttr(editingPkg.description || '') : ''}">
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
                <div class="form-group" style="margin:0;">
                    <label>السعر (ج.م)</label>
                    <input type="number" id="pkg-price" placeholder="150" min="0" value="${editingPkg ? editingPkg.price : ''}">
                </div>
                <div class="form-group" style="margin:0;">
                    <label>مدة الباقة</label>
                    <input type="text" id="pkg-duration" placeholder="شهر كامل" value="${editingPkg ? escapeForAttr(editingPkg.duration || '') : ''}">
                </div>
                <div class="form-group" style="margin:0;">
                    <label>المرحلة الدراسية</label>
                    <select id="pkg-grade">
                        <option value="3mid" ${editingPkg?.grade === '3mid' ? 'selected' : ''}>الصف الثالث الإعدادي</option>
                        <option value="1sec" ${editingPkg?.grade === '1sec' ? 'selected' : ''}>الصف الأول الثانوي</option>
                        <option value="2sec" ${editingPkg?.grade === '2sec' ? 'selected' : ''}>الصف الثاني الثانوي</option>
                        <option value="3sec-sci" ${editingPkg?.grade === '3sec-sci' ? 'selected' : ''}>الصف الثالث الثانوي (علمي)</option>
                        <option value="3sec-lit" ${editingPkg?.grade === '3sec-lit' ? 'selected' : ''}>الصف الثالث الثانوي (أدبي)</option>
                    </select>
                </div>
            </div>
        </div>

        <div style="margin-top:20px; padding:15px; background:rgba(212,175,55,0.05); border-radius:12px; border:1px dashed var(--primary-color);">
            <h4 style="margin-bottom:12px; color:var(--primary-light);"><i class="fas fa-image"></i> صورة عرض الباقة</h4>
            <input type="file" id="pkg-image-input" accept="image/*" onchange="handleImageInputUpload(this, 'pkg-image-preview')">
            <div id="pkg-image-preview" style="margin-top:12px;" data-uploaded-url="${editingPkg && editingPkg.imageUrl ? editingPkg.imageUrl : ''}">
                ${editingPkg && editingPkg.imageUrl ? `
                    <div style="position:relative; display:inline-block;">
                        <img src="${editingPkg.imageUrl}" style="max-width:200px; max-height:140px; border-radius:8px; border:1px solid var(--glass-border); display:block;">
                    </div>
                ` : ''}
            </div>
            <p style="font-size:0.78rem; color:var(--text-muted); margin-top:8px;"><i class="fas fa-info-circle"></i> إذا لم تُرفع صورة، سيتم عرض صور مصغرة من فيديوهات الباقة تلقائياً.</p>
        </div>

        <div style="margin-top:20px;">
            <h4 style="margin-bottom:12px;"><i class="fas fa-book-open"></i> دروس الباقة</h4>
            <div id="pkg-lesson-rows"></div>
            <button class="btn-secondary" onclick="addPkgLessonRow()" style="margin-top:10px;">
                <i class="fas fa-plus"></i> إضافة درس
            </button>
        </div>

        <div style="display:flex; gap:10px;">
            <button class="btn-primary" onclick="saveNewPackage()" style="margin-top:24px; flex:1;">
                <i class="fas fa-save"></i> ${currentState.editingPackageId ? 'حفظ التعديلات' : 'حفظ الباقة'}
            </button>
            ${currentState.editingPackageId ? `
                <button class="btn-secondary" onclick="cancelPkgEdit()" style="margin-top:24px;">
                    إلغاء
                </button>
            ` : ''}
        </div>

        <hr style="margin:40px 0;border:1px solid var(--glass-border);">
        <h3>الباقات المضافة</h3>
        <div style="display:grid;gap:16px;">
            ${appData.packages.length === 0
            ? '<p style="color:var(--text-muted);">لا توجد باقات مضافة بعد</p>'
            : appData.packages.map(pkg => {
                const pkgVouchers = appData.packageVouchers.filter(v => v.packageId === pkg.id);
                const usedCount = pkgVouchers.filter(v => v.isUsed).length;
                const lessonsCount = (pkg.lessons || pkg.videos || []).length;
                return `
                    <div class="glass" style="border-radius:12px;padding:16px;border:1px solid var(--glass-border);">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;">
                            <div>
                                <h4 style="margin:0 0 4px;">${pkg.name}</h4>
                                <p style="color:var(--text-muted);font-size:0.85rem;margin:0;">
                                    ${appData.grades[pkg.grade]?.title || pkg.grade} | ${pkg.price} ج.م | ${pkg.duration || 'غير محدد'} | ${lessonsCount} درس
                                </p>
                                <p style="color:#a5b4fc;font-size:0.82rem;margin:6px 0 0;">
                                    أكواد: ${pkgVouchers.length} إجمالي | ${usedCount} مستخدم | ${pkgVouchers.length - usedCount} متاح
                                </p>
                            </div>
                            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                                <button class="btn-primary" style="background:#8b5cf6;padding:6px 14px;font-size:0.85rem;" onclick="editPackage('${pkg.id}')">
                                    <i class="fas fa-edit"></i> تعديل
                                </button>
                                <button class="btn-primary" style="background:#6366f1;padding:6px 14px;font-size:0.85rem;" onclick="generatePackageVouchers('${pkg.id}','${pkg.name.replace(/'/g, "\\'")}')">
                                    <i class="fas fa-key"></i> توليد أكواد
                                </button>
                                <button class="btn-primary" style="background:#3b82f6;padding:6px 14px;font-size:0.85rem;" onclick="viewPackageVouchers('${pkg.id}')">
                                    <i class="fas fa-list"></i> عرض الأكواد
                                </button>
                                <button class="btn-primary" style="background:#ef4444;padding:6px 14px;font-size:0.85rem;" onclick="deletePackage('${pkg.id}')">
                                    <i class="fas fa-trash"></i> حذف
                                </button>
                            </div>
                        </div>
                    </div>`;
            }).join('')}
        </div>
    `;

    if (editingPkg && (editingPkg.lessons || editingPkg.videos || []).length) {
        (editingPkg.lessons || editingPkg.videos).forEach(l => addPkgLessonRow(l));
    } else {
        addPkgLessonRow();
    }

    // Initialize
    updateAdminBranches('pkg');
}

async function saveNewPackage() {
    const name = document.getElementById('pkg-name').value.trim();
    const desc = document.getElementById('pkg-desc').value.trim();
    const price = document.getElementById('pkg-price').value;
    const duration = document.getElementById('pkg-duration').value.trim();
    const grade = document.getElementById('pkg-grade').value;
    const imageUrl = document.getElementById('pkg-image-preview')?.dataset.uploadedUrl || null;

    if (!name || !price) return alert('برجاء إدخال اسم الباقة والسعر');

    const lessonRows = document.querySelectorAll('.pkg-lesson-row');
    const lessons = [];
    lessonRows.forEach(row => {
        const title = row.querySelector('.pkg-lesson-title')?.value.trim();
        const url = row.querySelector('.pkg-lesson-url')?.value.trim();
        if (!title || !url) return;
        const lessonImageUrl = row.querySelector('.pkg-lesson-image-preview')?.dataset.uploadedUrl || null;
        const hasExam = row.querySelector('.pkg-lesson-has-exam')?.value === 'yes';
        const examId = hasExam ? (row.querySelector('.pkg-lesson-exam-select')?.value || null) : null;
        const hasFile = row.querySelector('.pkg-lesson-has-file')?.value === 'yes';
        const fileUrl = hasFile ? (row.querySelector('.pkg-lesson-file-url')?.value.trim() || null) : null;
        lessons.push({ title, url, imageUrl: lessonImageUrl, examId, fileUrl });
    });

    if (lessons.length === 0) return alert('برجاء إضافة درس واحد على الأقل');

    try {
        const pkgData = {
            name, description: desc, price: Number(price),
            duration, grade, lessons, imageUrl,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (currentState.editingPackageId) {
            await db.collection('packages').doc(currentState.editingPackageId).update(pkgData);
            alert(`✅ تم تحديث باقة "${name}" بنجاح!`);
            currentState.editingPackageId = null;
        } else {
            pkgData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('packages').add(pkgData);
            alert(`✅ تم حفظ باقة "${name}" بنجاح!`);
        }

        pkgLessonRowCount = 0;
        renderAdminSection('add-package');
    } catch (err) {
        console.error(err);
        alert('فشل الحفظ، تأكد من اتصالك بالإنترنت');
    }
}

function editPackage(pkgId) {
    const pkg = appData.packages.find(p => p.id === pkgId);
    if (!pkg) return;

    currentState.editingPackageId = pkgId;
    renderAdminSection('add-package');

    // Scroll to form
    document.getElementById('admin-content-area').scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelPkgEdit() {
    currentState.editingPackageId = null;
    renderAdminSection('add-package');
}

// ==== PACKAGE LESSONS BUILDER (unlimited lessons per package) ====
let pkgLessonRowCount = 0;
function addPkgLessonRow(lessonData = null) {
    pkgLessonRowCount++;
    const rowId = `pkg-lesson-row-${pkgLessonRowCount}-${Date.now()}`;
    const container = document.getElementById('pkg-lesson-rows');
    if (!container) return;

    const hasExam = lessonData ? !!lessonData.examId : false;
    const hasFile = lessonData ? !!lessonData.fileUrl : false;

    const row = document.createElement('div');
    row.className = 'pkg-lesson-row glass';
    row.id = rowId;
    row.style.cssText = 'padding:16px; border-radius:12px; margin-bottom:14px; border:1px solid var(--glass-border); position:relative;';
    row.innerHTML = `
        <button type="button" onclick="document.getElementById('${rowId}').remove();" style="position:absolute; left:12px; top:12px; background:#ef4444; border:none; color:#fff; padding:4px 10px; border-radius:6px; cursor:pointer; font-size:0.75rem;">
            <i class="fas fa-times"></i> حذف الدرس
        </button>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div class="form-group" style="margin:0;">
                <label>اسم الدرس</label>
                <input type="text" class="pkg-lesson-title" placeholder="مثلاً: الدرس الأول - المعادلات" value="${lessonData ? escapeForAttr(lessonData.title) : ''}">
            </div>
            <div class="form-group" style="margin:0;">
                <label>رابط الدرس (فيديو يوتيوب أو غيره)</label>
                <input type="text" class="pkg-lesson-url" placeholder="رابط يوتيوب" value="${lessonData ? escapeForAttr(lessonData.url) : ''}">
            </div>
        </div>

        <div style="margin-top:12px;">
            <label style="font-size:0.85rem; color:var(--text-muted);"><i class="fas fa-image"></i> صورة الدرس (اختياري)</label>
            <input type="file" class="pkg-lesson-image-input" accept="image/*" onchange="handleImageInputUpload(this, '${rowId}-img-preview')" style="display:block; margin-top:5px;">
            <div id="${rowId}-img-preview" class="pkg-lesson-image-preview" style="margin-top:8px;" data-uploaded-url="${lessonData && lessonData.imageUrl ? lessonData.imageUrl : ''}">
                ${lessonData && lessonData.imageUrl ? `<img src="${lessonData.imageUrl}" style="max-width:160px; max-height:110px; border-radius:8px; border:1px solid var(--glass-border); display:block;">` : ''}
            </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-top:14px;">
            <div>
                <label style="font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:6px;">هل يوجد اختبار لهذا الدرس؟</label>
                <select class="pkg-lesson-has-exam" onchange="togglePkgLessonExamField(this)" style="width:100%; padding:8px; border-radius:8px; border:1px solid var(--glass-border); background:var(--input-bg); color:var(--text-primary);">
                    <option value="no" ${!hasExam ? 'selected' : ''}>لا</option>
                    <option value="yes" ${hasExam ? 'selected' : ''}>نعم</option>
                </select>
                <select class="pkg-lesson-exam-select" style="width:100%; padding:8px; border-radius:8px; border:1px solid var(--glass-border); background:var(--input-bg); color:var(--text-primary); margin-top:8px; ${hasExam ? '' : 'display:none;'}">
                    <option value="">اختر الاختبار المرتبط</option>
                    ${appData.exams.map(e => `<option value="${e.id}" ${lessonData && lessonData.examId === e.id ? 'selected' : ''}>${e.title}</option>`).join('')}
                </select>
            </div>
            <div>
                <label style="font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:6px;">هل توجد مذكرة لهذا الدرس؟</label>
                <select class="pkg-lesson-has-file" onchange="togglePkgLessonFileField(this)" style="width:100%; padding:8px; border-radius:8px; border:1px solid var(--glass-border); background:var(--input-bg); color:var(--text-primary);">
                    <option value="no" ${!hasFile ? 'selected' : ''}>لا</option>
                    <option value="yes" ${hasFile ? 'selected' : ''}>نعم</option>
                </select>
                <input type="text" class="pkg-lesson-file-url" placeholder="رابط المذكرة (PDF)" value="${lessonData && lessonData.fileUrl ? escapeForAttr(lessonData.fileUrl) : ''}" style="width:100%; padding:8px; border-radius:8px; border:1px solid var(--glass-border); background:var(--input-bg); color:var(--text-primary); margin-top:8px; ${hasFile ? '' : 'display:none;'}">
            </div>
        </div>
    `;
    container.appendChild(row);
}

function togglePkgLessonExamField(select) {
    const field = select.parentElement.querySelector('.pkg-lesson-exam-select');
    field.style.display = select.value === 'yes' ? 'block' : 'none';
}

function togglePkgLessonFileField(select) {
    const field = select.parentElement.querySelector('.pkg-lesson-file-url');
    field.style.display = select.value === 'yes' ? 'block' : 'none';
}

async function generatePackageVouchers(pkgId, pkgName) {
    const countStr = prompt(`كم كود تريد توليده لباقة "${pkgName}"؟`, '50');
    if (!countStr) return;
    const count = parseInt(countStr);
    if (isNaN(count) || count < 1 || count > 500) return alert('برجاء إدخال عدد بين 1 و 500');

    const vouchers = [];
    for (let i = 0; i < count; i++) {
        vouchers.push({ code: 'PKG-' + generateRandomCode(8), packageId: pkgId, isUsed: false, createdAt: new Date().toISOString() });
    }
    try {
        const chunks = [];
        for (let i = 0; i < vouchers.length; i += 500) chunks.push(vouchers.slice(i, i + 500));
        for (const chunk of chunks) {
            const batch = db.batch();
            chunk.forEach(v => { const ref = db.collection('packageVouchers').doc(); batch.set(ref, v); v.id = ref.id; });
            await batch.commit();
        }
        appData.packageVouchers.push(...vouchers);
        alert(`✅ تم توليد ${count} كود لباقة "${pkgName}" بنجاح!`);
        renderAdminSection('add-package');
    } catch (err) {
        console.error(err);
        alert('فشل توليد الأكواد');
    }
}

function viewPackageVouchers(pkgId) {
    const pkg = appData.packages.find(p => p.id === pkgId);
    const vouchers = appData.packageVouchers.filter(v => v.packageId === pkgId);
    const existing = document.getElementById('pkg-vouchers-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'pkg-vouchers-modal';
    modal.className = 'modal';
    modal.style.cssText = 'display:flex;z-index:7000;';
    modal.innerHTML = `
        <div class="modal-content glass" style="max-width:650px;width:95%;max-height:85vh;overflow-y:auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h3 style="margin:0;">أكواد: ${pkg?.name || ''}</h3>
                <button onclick="this.closest('.modal').remove()" style="background:none;border:none;color:var(--text-muted);font-size:1.5rem;cursor:pointer;">✕</button>
            </div>
            <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:16px;">
                إجمالي: ${vouchers.length} | مستخدم: ${vouchers.filter(v => v.isUsed).length} | متاح: ${vouchers.filter(v => !v.isUsed).length}
            </p>
            <div class="vouchers-table-container">
                <table>
                    <thead><tr><th>#</th><th>الكود</th><th>الحالة</th></tr></thead>
                    <tbody>
                        ${vouchers.map((v, i) => `
                            <tr>
                                <td style="color:var(--text-muted);">${i + 1}</td>
                                <td style="font-family:monospace;color:var(--primary-light);">${v.code}</td>
                                <td><span style="background:${v.isUsed ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)'};color:${v.isUsed ? '#ef4444' : '#22c55e'};padding:3px 10px;border-radius:6px;font-size:0.82rem;">${v.isUsed ? 'مستخدم' : 'متاح'}</span></td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    document.body.appendChild(modal);
}

async function deletePackage(pkgId) {
    if (!confirm('هل أنت متأكد من حذف هذه الباقة وجميع أكوادها؟')) return;
    try {
        await db.collection('packages').doc(pkgId).delete();
        const snap = await db.collection('packageVouchers').where('packageId', '==', pkgId).get();
        if (!snap.empty) {
            const batch = db.batch();
            snap.docs.forEach(d => batch.delete(d.ref));
            await batch.commit();
        }
        alert('تم حذف الباقة وأكوادها بنجاح');
        renderAdminSection('add-package');
    } catch (err) {
        console.error(err);
        alert('فشل الحذف');
    }
}

function copyToClipboard(text, el) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHtml = el.innerHTML;
        const originalColor = el.style.color;
        el.style.color = '#4ade80';
        el.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
        setTimeout(() => {
            el.style.color = originalColor;
            el.innerHTML = originalHtml;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('الكود للنسخ اليدوي: ' + text);
    });
}
