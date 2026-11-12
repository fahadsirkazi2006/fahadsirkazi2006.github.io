/* ==========================================================================
   FARAD MOHAMMED SARKHAJI - PORTFOLIO INTERACTIVITY
   Modern JS with Theme Switching, Modals, Filtering, Smooth Nav & Form Handling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initTechStackFilter();
  initProjectFilter();
  initModals();
  initFeedbackSystem();
  initContactForm();
  initStarCatchGame();
  initScrollTop();
});

/* ==========================================================================
   THEME TOGGLE SYSTEM (Standard Compliant)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');

  // Determine initial theme
  const savedTheme = localStorage.getItem('portfolio-theme');
  const initialTheme = savedTheme || 'light';

  applyTheme(initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      applyTheme(newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (metaColorScheme) {
      metaColorScheme.content = theme;
    }
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    }
  }
}

/* ==========================================================================
   NAVIGATION & SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, footer');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navContainer = document.getElementById('nav-links');
  const header = document.getElementById('site-header');

  // Sticky header depth on scroll
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.pageYOffset > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileBtn && navContainer) {
    mobileBtn.addEventListener('click', () => {
      navContainer.classList.toggle('mobile-open');
      const icon = mobileBtn.querySelector('i');
      if (icon) {
        if (navContainer.classList.contains('mobile-open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close mobile nav on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navContainer.classList.remove('mobile-open');
        const icon = mobileBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });

    // Close mobile nav on click outside
    document.addEventListener('click', (e) => {
      if (!navContainer.contains(e.target) && !mobileBtn.contains(e.target) && navContainer.classList.contains('mobile-open')) {
        navContainer.classList.remove('mobile-open');
        const icon = mobileBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  // Scroll spy
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   SCROLL TO TOP BUTTON
   ========================================================================== */
function initScrollTop() {
  const scrollBtn = document.getElementById('scroll-to-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 380) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   TECH STACK FILTERING
   ========================================================================== */
function initTechStackFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const techCards = document.querySelectorAll('.tech-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetCategory = btn.getAttribute('data-category');

      techCards.forEach(card => {
        const cardCategories = card.getAttribute('data-category') || '';
        if (targetCategory === 'all' || cardCategories.includes(targetCategory)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   PROJECTS FILTERING & PAGINATION
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const pageBtns = document.querySelectorAll('.page-btn');
  const pageSize = 3;
  let activeFilter = 'all';
  let currentPage = 1;

  function updateProjects() {
    const filteredCards = Array.from(projectCards).filter(card => {
      return activeFilter === 'all' || card.getAttribute('data-category') === activeFilter;
    });
    const pageCount = Math.max(1, Math.ceil(filteredCards.length / pageSize));
    currentPage = Math.min(currentPage, pageCount);

    projectCards.forEach(card => {
      const cardIndex = filteredCards.indexOf(card);
      const isVisible = cardIndex >= (currentPage - 1) * pageSize && cardIndex < currentPage * pageSize;
      card.style.display = isVisible ? 'flex' : 'none';
      if (isVisible) {
        card.style.animation = 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    });

    pageBtns.forEach(btn => {
      const pageIndex = Number(btn.getAttribute('data-page-index'));
      if (pageIndex) {
        btn.hidden = pageIndex > pageCount;
        btn.classList.toggle('active', pageIndex === currentPage);
      } else if (btn.dataset.pageDirection === 'prev') {
        btn.disabled = currentPage === 1;
      } else if (btn.dataset.pageDirection === 'next') {
        btn.disabled = currentPage === pageCount;
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-project-filter') || 'all';
      currentPage = 1;
      updateProjects();
    });
  });

  pageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.pageDirection === 'prev') {
        currentPage -= 1;
      } else if (btn.dataset.pageDirection === 'next') {
        currentPage += 1;
      } else {
        currentPage = Number(btn.dataset.pageIndex);
      }
      updateProjects();
    });
  });

  updateProjects();
}

/* ==========================================================================
   MODALS SYSTEM (Resume, Project Details, Feedback)
   ========================================================================== */
const projectData = {
  p1: {
    title: "Healthcare Treatment Allocation & Fracture Outcomes Analysis",
    subtitle: "MSc Dissertation in collaboration with University Hospitals of Morecambe Bay NHS Trust",
    category: "Data Science & Healthcare Analytics",
    image: "project-healthcare.jpg",
    tags: ["Python", "Healthcare Data", "Propensity Scores", "IPTW", "Statistical Diagnostics"],
    overview: "Analysed 40,951 anonymised DEXA bone density scan records to assess whether bisphosphonate prescription led to a statistically significant decrease in 3-year fracture incidence.",
    keyPoints: [
      "Built rigorous preprocessing pipeline handling 36 clinical baseline covariates including BMD T-scores, previous fractures, and medication histories.",
      "Implemented Propensity Score Matching (PSM) and Inverse Probability of Treatment Weighting (IPTW), achieving standardized mean differences below 0.10 across all confounders.",
      "Conducted extensive model calibration and validation with Brier scores and ROC-AUC curves.",
      "Delivered comprehensive epidemiological report and reproducible Jupyter notebooks."
    ],
    github: "https://github.com/faradsarkhaji"
  },
  p2: {
    title: "AyurEssence E-commerce Website",
    subtitle: "Modern headless e-commerce for natural herbal cosmetics",
    category: "Full-Stack Web Development",
    image: "project-ayur-essence.jpg",
    tags: ["Next.js", "React", "TailwindCSS", "Headless CMS", "Vercel"],
    overview: "A high-performance modern web application built for an Ayurvedic beauty brand with automated inventory sync, dynamic catalogue filtering, and headless CMS content editing.",
    keyPoints: [
      "Custom UI components engineered in Next.js 14 and Tailwind CSS with sub-second page transitions.",
      "Integrated Stripe checkout and secure customer accounts.",
      "Headless CMS integration allowing marketing editors to update banners and ingredients without redeploying code.",
      "Lighthouse performance score of 98 on desktop and 94 on mobile devices."
    ],
    github: "https://github.com/faradsarkhaji"
  },
  p3: {
    title: "Drug–Drug Interaction Classification with Biomedical Language Models",
    subtitle: "Biomedical NLP Research Pipeline based on SemEval-2013 Task 9.2",
    category: "Biomedical NLP & Deep Learning",
    image: "project-biomedical-nlp.jpg",
    tags: ["Python", "Biomedical NLP", "Transformers", "BioBERT", "PubMedBERT", "PyTorch"],
    overview: "Developed a natural language processing architecture to extract and classify pharmacological drug-drug interaction descriptions from scientific literature.",
    keyPoints: [
      "Engineered automated XML biomedical text parser with entity masking for target drug pairs.",
      "Fine-tuned domain-adapted transformer models including BioBERT, SciBERT, and PubMedBERT.",
      "Surpassed classical baseline models (Random Forest, SVM) with an optimal Macro F1-score of 0.7130.",
      "Created containerized inference endpoint for real-time drug interaction verification."
    ],
    github: "https://github.com/faradsarkhaji"
  },
  p4: {
    title: "Heart Disease Risk Prediction & Tableau Dashboard",
    subtitle: "Clinical predictive modelling and interactive BI dashboard",
    category: "Analytics & Business Intelligence",
    image: "project-heart-risk.jpg",
    tags: ["Python", "Pandas", "Scikit-learn", "Tableau", "EDA"],
    overview: "Conducted clinical data mining on patient physiological data, evaluating 14 risk predictors to forecast cardiovascular anomalies.",
    keyPoints: [
      "Trained Logistic Regression, Decision Tree, and K-Nearest Neighbors classifiers with 87% test accuracy.",
      "Designed an interactive Tableau dashboard providing healthcare practitioners with real-time patient risk stratifications.",
      "Identified chest pain type, maximum heart rate, and ST depression as the strongest risk correlates."
    ],
    github: "https://github.com/faradsarkhaji"
  },
  p5: {
    title: "AI Coursework Analyzer & Academic Planner",
    subtitle: "LLM-assisted curriculum analysis tool for university students",
    category: "Web Development & Practical AI",
    image: "project-coursework-analyzer.jpg",
    tags: ["Next.js", "TypeScript", "FastAPI", "Document Analysis", "Vercel"],
    overview: "A student productivity platform that ingests complex academic syllabi and coursework assignment briefs, extracting deliverables and timeline milestones automatically.",
    keyPoints: [
      "Implemented document parsing pipeline extracting grading weightings, required citations, and deadlines.",
      "Generates interactive Gantt charts and checklist milestones for semester coursework planning.",
      "Built with Next.js frontend and FastAPI microservice backend."
    ],
    github: "https://github.com/faradsarkhaji"
  },
  p6: {
    title: "Teknorix Corporate Digital Platform",
    subtitle: "Enterprise web experience with Strapi CMS and Ant Design",
    category: "Web Development",
    image: "project-teknorix.jpg",
    tags: ["Next.js", "Strapi CMS", "Ant Design", "TailwindCSS"],
    overview: "Contributed to a major website redesign during a 3-month software internship, migrating legacy pages into modern component-driven layouts.",
    keyPoints: [
      "Engineered responsive components with reusable design patterns.",
      "Streamlined content workflow enabling non-technical stakeholders to update case studies directly.",
      "Participated in automated testing and Azure DevOps pull request code reviews."
    ],
    github: "https://github.com/faradsarkhaji"
  }
};

function initModals() {
  // Resume Modal
  const resumeBtn = document.getElementById('btn-view-resume');
  const resumeModal = document.getElementById('resume-modal');
  const closeResumeBtn = document.getElementById('close-resume-modal');

  if (resumeBtn && resumeModal) {
    resumeBtn.addEventListener('click', () => openModal(resumeModal));
  }
  if (closeResumeBtn && resumeModal) {
    closeResumeBtn.addEventListener('click', () => closeModal(resumeModal));
  }

  // Project Modal
  const projectModal = document.getElementById('project-modal');
  const closeProjectBtn = document.getElementById('close-project-modal');
  if (closeProjectBtn && projectModal) {
    closeProjectBtn.addEventListener('click', () => closeModal(projectModal));
  }

  // Feedback Modal
  const feedbackBtn = document.getElementById('btn-open-feedback');
  const feedbackModal = document.getElementById('feedback-modal');
  const closeFeedbackBtn = document.getElementById('close-feedback-modal');

  if (feedbackBtn && feedbackModal) {
    feedbackBtn.addEventListener('click', () => openModal(feedbackModal));
  }
  if (closeFeedbackBtn && feedbackModal) {
    closeFeedbackBtn.addEventListener('click', () => closeModal(feedbackModal));
  }

  // Close modals when clicking overlay
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => closeModal(modal));
    }
  });
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

window.printResume = function() {
  document.body.classList.add('printing-resume');
  window.print();
  document.body.classList.remove('printing-resume');
};

// Global modal trigger for project cards
window.openProjectModal = function(id) {
  const modal = document.getElementById('project-modal');
  const content = document.getElementById('project-modal-content');
  const data = projectData[id];

  if (!modal || !content || !data) return;

  content.innerHTML = `
    <div style="margin-bottom: 24px;">
      <span class="project-category-badge" style="margin-bottom: 12px; display: inline-block;">${data.category}</span>
      <h2 style="font-size: 1.85rem; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.02em; color: var(--text-heading);">${data.title}</h2>
      <p style="color: var(--accent-blue); font-weight: 600; font-size: 1.05rem;">${data.subtitle}</p>
    </div>

    <div style="width: 100%; height: 280px; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-card);">
      <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>

    <div style="margin-bottom: 22px;">
      <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; color: var(--text-heading);">Overview</h4>
      <p style="color: var(--text-main); line-height: 1.75; font-size: 0.98rem;">${data.overview}</p>
    </div>

    <div style="margin-bottom: 24px;">
      <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 10px; color: var(--text-heading);">Key Deliverables & Metrics</h4>
      <ul style="padding-left: 20px; color: var(--text-main); line-height: 1.75; font-size: 0.96rem;">
        ${data.keyPoints.map(point => `<li style="margin-bottom: 8px;">${point}</li>`).join('')}
      </ul>
    </div>

    <div style="margin-bottom: 28px;">
      <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 12px; color: var(--text-heading);">Technologies Used</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${data.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join('')}
      </div>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 14px; border-top: 1px solid var(--border-subtle); padding-top: 22px;">
      <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn-pill-primary">
        <i class="fa-brands fa-github"></i> View on GitHub
      </a>
      <button class="btn-pill-secondary" style="color: var(--text-heading); border-color: var(--border-subtle);" onclick="closeModal(document.getElementById('project-modal'))">
        Close Details
      </button>
    </div>
  `;

  openModal(modal);
};

/* ==========================================================================
   FEEDBACK / TESTIMONIAL SYSTEM
   ========================================================================== */
function initFeedbackSystem() {
  const form = document.getElementById('feedback-form');
  const container = document.getElementById('comments-container');
  const modal = document.getElementById('feedback-modal');

  // Load custom feedback from localStorage
  const savedFeedback = JSON.parse(localStorage.getItem('portfolio-comments') || '[]');
  const visibleFeedback = savedFeedback.filter(item => String(item.name || '').trim() !== '123');
  if (visibleFeedback.length !== savedFeedback.length) {
    savedFeedback.splice(0, savedFeedback.length, ...visibleFeedback);
    localStorage.setItem('portfolio-comments', JSON.stringify(savedFeedback));
  }
  savedFeedback.forEach(item => addCommentCard(item, false));

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fb-name').value.trim();
      const role = document.getElementById('fb-role').value.trim();
      const comment = document.getElementById('fb-comment').value.trim();

      if (!name || !role || !comment) return;

      const newFeedback = { name, role, comment, date: new Date().toLocaleDateString() };
      
      // Save
      savedFeedback.push(newFeedback);
      localStorage.setItem('portfolio-comments', JSON.stringify(savedFeedback));

      // Append to UI
      addCommentCard(newFeedback, true);

      // Reset & Close
      form.reset();
      closeModal(modal);
      showToast('Thank you! Your feedback has been posted.');
    });
  }

  function addCommentCard(item, animate) {
    const card = document.createElement('div');
    card.className = 'comment-card';
    if (animate) card.style.animation = 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

    const initial = item.name.charAt(0).toUpperCase();

    card.innerHTML = `
      <p class="comment-quote-text">"${item.comment}"</p>
      <div class="comment-author-info">
        <div class="author-avatar">${initial}</div>
        <div class="author-details">
          <h4>${item.name}</h4>
          <p>${item.role}</p>
        </div>
      </div>
    `;

    if (container) {
      container.prepend(card);
    }
  }
}

// Read more toggle for quotes
window.toggleReadMore = function(btn, quoteId) {
  const quote = document.getElementById(quoteId);
  if (!quote) return;

  if (btn.textContent === 'Read more') {
    quote.style.webkitLineClamp = 'unset';
    quote.style.overflow = 'visible';
    btn.textContent = 'Read less';
  } else {
    btn.textContent = 'Read more';
  }
};

/* ==========================================================================
   CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');

  if (form) {
    const submitButton = document.getElementById('btn-submit-contact');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/fahadsirkazi109@gmail.com', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });
        const result = await response.json();

        if (!response.ok || result.success !== 'true') {
          throw new Error(result.message || `Form service returned HTTP ${response.status}`);
        }

        form.reset();
        showToast('Message sent successfully. Thank you for getting in touch!');
      } catch (error) {
        console.error('Contact form submission failed:', error);
        showToast('Your message could not be sent. Please try again or email fahadsirkazi109@gmail.com.');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
        }
      }
    });
  }
}

/* ==========================================================================
   VISITOR STAR-CATCHING GAME
   ========================================================================== */
function initStarCatchGame() {
  const arena = document.getElementById('game-arena');
  const target = document.getElementById('game-target');
  const startButton = document.getElementById('game-start');
  const scoreDisplay = document.getElementById('game-score');
  const timeDisplay = document.getElementById('game-time');
  const highScoreDisplay = document.getElementById('game-high-score');
  const status = document.getElementById('game-status');

  if (!arena || !target || !startButton || !scoreDisplay || !timeDisplay || !highScoreDisplay || !status) return;

  const highScoreKey = 'portfolio-star-game-high-score';
  let score = 0;
  let highScore = Number(localStorage.getItem(highScoreKey)) || 0;
  let timeRemaining = 20;
  let previousHighScore = highScore;
  let isPlaying = false;
  let timerId;

  highScoreDisplay.textContent = String(highScore);

  function moveTarget() {
    const maxX = Math.max(0, arena.clientWidth - target.offsetWidth);
    const maxY = Math.max(0, arena.clientHeight - target.offsetHeight);
    target.style.left = `${Math.round(Math.random() * maxX)}px`;
    target.style.top = `${Math.round(Math.random() * maxY)}px`;
  }

  function finishGame() {
    isPlaying = false;
    clearInterval(timerId);
    target.hidden = true;
    startButton.disabled = false;
    startButton.textContent = 'Play Again';
    startButton.focus();
    status.textContent = score > previousHighScore
      ? `New personal best: ${score}! Great catching!`
      : `Time's up! You caught ${score} ${score === 1 ? 'star' : 'stars'}.`;
  }

  startButton.addEventListener('click', () => {
    clearInterval(timerId);
    score = 0;
    timeRemaining = 20;
    previousHighScore = highScore;
    isPlaying = true;
    scoreDisplay.textContent = '0';
    timeDisplay.textContent = String(timeRemaining);
    status.textContent = 'Game on! Catch the star!';
    startButton.disabled = true;
    startButton.textContent = 'Game in Progress';
    target.hidden = false;
    moveTarget();
    target.focus();

    timerId = setInterval(() => {
      timeRemaining -= 1;
      timeDisplay.textContent = String(timeRemaining);

      if (timeRemaining <= 0) finishGame();
    }, 1000);
  });

  target.addEventListener('click', () => {
    if (!isPlaying) return;

    score += 1;
    scoreDisplay.textContent = String(score);

    if (score > highScore) {
      highScore = score;
      localStorage.setItem(highScoreKey, String(highScore));
      highScoreDisplay.textContent = String(highScore);
      status.textContent = 'New personal best! Keep going!';
    }

    moveTarget();
  });
}

/* ==========================================================================
   TOAST NOTIFICATION HELPER
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');

  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}