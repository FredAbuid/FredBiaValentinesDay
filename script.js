/* =============================================================================
   NOSSA HISTÓRIA — Site de Dia dos Namorados
   JavaScript puro (sem dependências). Organizado por módulos.

   COMO PERSONALIZAR (resumo rápido):
   - Data de início do relacionamento .... CONFIG.RELATIONSHIP_START
   - Legendas da galeria .................. CONFIG.galleryCaptions
   - Perguntas do quiz .................... CONFIG.quizQuestions
   - Músicas .............................. edite data-src="" no index.html
   ============================================================================= */

'use strict';

/* -----------------------------------------------------------------------------
   0. CONFIGURAÇÃO — altere aqui os dados do casal
   -------------------------------------------------------------------------- */
const CONFIG = {
  // Data e hora em que tudo começou (ano, mês [0-11], dia, hora, minuto)
  // ATENÇÃO: mês começa em 0 → Junho = 5
  RELATIONSHIP_START: new Date(2023, 6, 15, 15, 0, 0),

  // Legendas exibidas no lightbox da galeria (índice = data-index do item)
  galleryCaptions: [
    'Foto 1 — Onde tudo começou 💕',  'Foto 2 — Seu sorriso',
    'Foto 3 — Momentos simples',       'Foto 4 — Nós dois',
    'Foto 5 — Risadas sem fim',        'Foto 6 — Um dia perfeito',
    'Foto 7 — Aventuras juntos',       'Foto 8 — Pôr do sol',
    'Foto 9 — Abraço apertado',        'Foto 10 — Café da manhã',
    'Foto 11 — Viagem dos sonhos',     'Foto 12 — Tarde preguiçosa',
    'Foto 13 — Olhares cúmplices',     'Foto 14 — Dança na cozinha',
    'Foto 15 — Nosso cantinho',        'Foto 16 — Festa especial',
    'Foto 17 — Caminhada à noite',     'Foto 18 — Mãos dadas',
    'Foto 19 — Surpresa 🎁',           'Foto 20 — Para sempre ❤️'
  ],

  // Perguntas do Quiz — 'correct' é o índice (0-based) da resposta certa
  quizQuestions: [
    {
      q: 'Onde nós nos conhecemos?',
      options: ['Em uma festa', 'No trabalho', 'Pela internet', 'Na Escola'],
      correct: 3
    },
    {
      q: 'Qual foi o nosso primeiro encontro?',
      options: ['Cinema', 'Escola', 'Mineirão', 'Festa de um amigo'],
      correct: 0
    },
    {
      q: 'Qual é a "nossa música"?',
      options: ['Amor de Fim de Noite', '3X4', 'Poesia Acústica 7', 'Te Amar Demais'],
      correct: 0
    },
    {
      q: 'Qual é a comida favorita pra gente comer juntos?',
      options: ['Pizza 🍕', 'Sushi 🍣', 'Hambúrguer 🍔', 'Massa 🍝'],
      correct: 2
    },
    {
      q: 'O que eu mais amo em você?',
      options: ['Seu sorriso', 'Seu jeito', 'Seu carinho', 'Absolutamente tudo ❤️'],
      correct: 3
    }
  ]
};

/* Atalhos utilitários */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Espera o DOM estar pronto antes de inicializar tudo */
document.addEventListener('DOMContentLoaded', () => {
  initFloatingHearts();
  initNavigation();
  initRelationshipCounter();
  initRevealOnScroll();
  initGalleryLightbox();
  initLoveLetters();
  initReasonCards();
  initPlaylist();
  initTypewriter();
  initQuiz();
  initSecretSection();
});


/* =============================================================================
   1. CORAÇÕES FLUTUANTES (Canvas no fundo)
   -------------------------------------------------------------------------- */
function initFloatingHearts() {
  const canvas = $('#hearts-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Respeita acessibilidade: sem movimento → sem canvas
  if (prefersReducedMotion) { canvas.style.display = 'none'; return; }

  let hearts;
  const EMOJIS = ['❤️', '💕', '💖', '🌸', '✨'];

  // Densidade adaptada ao tamanho da tela → mobile recebe MENOS partículas (performance)
  const heartCount = () => (window.innerWidth < 768 ? 14 : 28);

  function resize() {
    // Ajusta o canvas ao tamanho real do dispositivo (considera densidade de pixels)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeHeart() {
    const vw = window.innerWidth, vh = window.innerHeight;
    return {
      x: Math.random() * vw,
      y: vh + Math.random() * vh,            // começa abaixo da tela
      size: 12 + Math.random() * 22,
      speed: 0.3 + Math.random() * 0.9,      // sobe devagar
      drift: (Math.random() - 0.5) * 0.6,    // balanço horizontal
      opacity: 0.25 + Math.random() * 0.45,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      angle: Math.random() * Math.PI * 2
    };
  }

  const build = () => { hearts = Array.from({ length: heartCount() }, makeHeart); };

  function frame() {
    const vw = window.innerWidth, vh = window.innerHeight;
    ctx.clearRect(0, 0, vw, vh);
    for (const h of hearts) {
      h.y -= h.speed;                        // sobe
      h.angle += 0.01;
      h.x += Math.sin(h.angle) * h.drift;    // balança suavemente

      // Quando sai pelo topo, reaparece embaixo
      if (h.y < -40) {
        h.y = vh + 40;
        h.x = Math.random() * vw;
      }

      ctx.save();
      ctx.globalAlpha = h.opacity;
      ctx.font = `${h.size}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(h.emoji, h.x, h.y);
      ctx.restore();
    }
    requestAnimationFrame(frame);
  }

  resize();
  build();
  frame();

  // Recalcula em redimensionamento (com debounce simples)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); build(); }, 200);
  });
}


/* =============================================================================
   2. NAVEGAÇÃO — efeito ao rolar, menu mobile, scroll suave, link ativo
   -------------------------------------------------------------------------- */
function initNavigation() {
  const nav = $('#nav');
  const menuBtn = $('#menuBtn');
  const navLinks = $('#navLinks');
  const links = $$('.nav__link');

  /* 2.1 — Sombra/fundo da barra ao rolar a página */
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 2.2 — Abrir/fechar menu hambúrguer (mobile) */
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    });
  }

  /* 2.3 — Scroll suave ao clicar nos links e fechar o menu no mobile */
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = targetId && targetId.startsWith('#') ? $(targetId) : null;
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
      // Fecha o menu mobile após escolher uma seção
      if (navLinks) navLinks.classList.remove('open');
      if (menuBtn) menuBtn.classList.remove('open');
    });
  });

  /* 2.4 — Destaca o link da seção visível (scroll spy) */
  const sections = links
    .map(l => $(l.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }
}


/* =============================================================================
   3. CONTADOR DE RELACIONAMENTO — atualiza a cada segundo
   -------------------------------------------------------------------------- */
function initRelationshipCounter() {
  const el = {
    years:   $('#cnt-years'),
    months:  $('#cnt-months'),
    days:    $('#cnt-days'),
    hours:   $('#cnt-hours'),
    minutes: $('#cnt-minutes'),
    seconds: $('#cnt-seconds')
  };
  if (!el.seconds) return;

  const start = CONFIG.RELATIONSHIP_START;

  // Exibe a data de início de forma legível na nota abaixo do contador
  const dateDisplay = $('#counter-date-display');
  if (dateDisplay) {
    dateDisplay.textContent = start.toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  const pad = (n) => String(n).padStart(2, '0');

  function update() {
    const now = new Date();

    // Decompõe a diferença campo a campo (ano, mês, dia, hora, min, seg)
    let years  = now.getFullYear() - start.getFullYear();
    let months = now.getMonth()    - start.getMonth();
    let days   = now.getDate()     - start.getDate();
    let hours  = now.getHours()    - start.getHours();
    let mins   = now.getMinutes()  - start.getMinutes();
    let secs   = now.getSeconds()  - start.getSeconds();

    // Faz os "empréstimos" quando um campo fica negativo
    if (secs < 0)   { secs += 60;   mins--; }
    if (mins < 0)   { mins += 60;   hours--; }
    if (hours < 0)  { hours += 24;  days--; }
    if (days < 0) {
      const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += daysInPrevMonth; months--;
    }
    if (months < 0) { months += 12; years--; }

    el.years.textContent   = pad(Math.max(0, years));
    el.months.textContent  = pad(Math.max(0, months));
    el.days.textContent    = pad(Math.max(0, days));
    el.hours.textContent   = pad(Math.max(0, hours));
    el.minutes.textContent = pad(Math.max(0, mins));
    el.seconds.textContent = pad(Math.max(0, secs));
  }

  update();
  setInterval(update, 1000);
}


/* =============================================================================
   4. REVELAR AO ROLAR — anima elementos com .reveal-* ao entrarem na tela
   -------------------------------------------------------------------------- */
function initRevealOnScroll() {
  const items = $$('.reveal-fade, .reveal-up, .reveal-left, .reveal-right');
  if (!items.length) return;

  // Sem IntersectionObserver (ou movimento reduzido): mostra tudo de imediato
  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    items.forEach(i => i.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);  // anima só uma vez
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  items.forEach(i => observer.observe(i));
}


/* =============================================================================
   5. GALERIA + LIGHTBOX — abrir, navegar (botões, teclado, swipe)
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = $$('.gallery-item');
  const lightbox = $('#lightbox');
  if (!galleryItems.length || !lightbox) return;

  const imgBox   = $('#lightboxImg');
  const caption  = $('#lightboxCaption');
  const btnClose = $('#lightboxClose');
  const btnPrev  = $('#lightboxPrev');
  const btnNext  = $('#lightboxNext');

  let current = 0;

  // Lê o conteúdo real (imagem ou placeholder) de um item da galeria
  function getItemView(index) {
    const item = galleryItems[index];
    const realImg = item ? item.querySelector('img') : null;
    return {
      src: realImg ? realImg.getAttribute('src') : null,
      caption: CONFIG.galleryCaptions[index] || `Foto ${index + 1}`
    };
  }

  function render() {
    const view = getItemView(current);
    if (view.src) {
      // Se houver imagem real, mostra-a dentro do lightbox
      imgBox.innerHTML = `<img src="${view.src}" alt="${view.caption}" />`;
    } else {
      // Caso contrário, mantém o ícone placeholder
      imgBox.textContent = '📸';
    }
    caption.textContent = view.caption;
  }

  function open(index) {
    current = index;
    render();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';  // trava o scroll do fundo
    btnClose.focus();
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function go(step) {
    current = (current + step + galleryItems.length) % galleryItems.length; // circular
    render();
  }

  // Abre ao clicar/teclar (Enter/Espaço) em cada item
  galleryItems.forEach((item, i) => {
    const index = Number(item.dataset.index ?? i);
    item.addEventListener('click', () => open(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(index); }
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => go(-1));
  btnNext.addEventListener('click', () => go(1));

  // Fecha clicando no fundo escuro (fora do conteúdo)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Navegação por teclado quando o lightbox está aberto
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  go(-1);
    if (e.key === 'ArrowRight') go(1);
  });

  // Swipe horizontal no celular (essencial para a experiência mobile)
  let touchX = null;
  lightbox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);  // arrastou bastante → troca foto
    touchX = null;
  });
}


/* =============================================================================
   6. CARTAS DE AMOR — abrir/fechar o envelope com animação
   -------------------------------------------------------------------------- */
function initLoveLetters() {
  const envelopes = $$('.envelope');
  envelopes.forEach(env => {
    // Acessibilidade: comporta-se como botão (foco + teclado)
    env.setAttribute('tabindex', '0');
    env.setAttribute('role', 'button');

    const open = () => {
      // Permite apenas uma carta aberta por vez (fecha as outras)
      const isOpen = env.classList.contains('open');
      envelopes.forEach(e => e.classList.remove('open'));
      if (!isOpen) env.classList.add('open');
    };

    env.addEventListener('click', open);
    env.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });
}


/* =============================================================================
   7. MOTIVOS PELOS QUAIS TE AMO — vira o card ao clicar (flip)
   -------------------------------------------------------------------------- */
function initReasonCards() {
  const cards = $$('.reason-card');
  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    const toggle = () => card.classList.toggle('flipped');
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
}


/* =============================================================================
   8. PLAYLIST — substitua as funções initPlaylist() e initPlaylistExtras()
   no seu script.js por este bloco completo.
   ============================================================================= */
function initPlaylist() {
  const audio = $('#audioPlayer');
  const items = $$('.sp-playlist__item');
  if (!items.length) return;

  const ui = {
    trackName: $('#spTrackName'),
    artist:    $('#spTrackArtist'),
    eq:        $('#spEq'),
    playPause: $('#spPlayPause'),
    prev:      $('#spPrev'),
    next:      $('#spNext'),
    curTime:   $('#spCurrentTime'),
    duration:  $('#spDuration'),
    progress:  $('#spProgress'),
    bar:       $('#spProgressFill'),
    photo:     $('#spPhotoImg')   // <-- foto do card
  };

  let current = 0;   // começa na primeira já selecionada
  let isPlaying = false;
  let simTimer = null;
  let simElapsed = 0;
  let simTotal = 0;

  const fmt = (s) => {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  function parseDuration(text) {
    const parts = (text || '0:00').split(':').map(Number);
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  }

  const setActiveItem = (index) => {
    items.forEach((it, i) => it.classList.toggle('active', i === index));
  };

  function setPlayingUI(playing) {
    isPlaying = playing;
    if (ui.playPause) ui.playPause.textContent = playing ? '⏸' : '▶';
    if (ui.eq) ui.eq.classList.toggle('playing', playing);
  }

  const stopSimulation = () => {
    if (simTimer) { clearInterval(simTimer); simTimer = null; }
  };

  const setProgress = (pct) => {
    if (ui.bar) ui.bar.style.width = pct + '%';
  };

  // Troca a foto do card com uma pequena transição de fade
  function updatePhoto(src) {
    if (!ui.photo || !src) return;
    ui.photo.style.opacity = '0';
    setTimeout(() => {
      ui.photo.src = src;
      ui.photo.style.opacity = '1';
    }, 180);
  }

  function load(index, autoplay = true) {
    if (index < 0 || index >= items.length) return;
    current = index;
    const data = items[index].dataset;

    setActiveItem(index);

    // Atualiza texto do card
    if (ui.trackName) ui.trackName.textContent = data.title  || 'Sem título';
    if (ui.artist)    ui.artist.textContent    = data.artist || '';

    // Troca a foto do card pela foto da faixa
    updatePhoto(data.photo);

    stopSimulation();

    const src = data.src;
    if (src) {
      // Modo com arquivo de áudio real
      if (audio) {
        audio.src = src;
        audio.load();
        if (autoplay) audio.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
      }
    } else {
      // Modo simulado (sem arquivo)
      const durEl = items[index].querySelector('.sp-playlist__item-duration');
      simTotal   = parseDuration(durEl ? durEl.textContent : '0:00');
      simElapsed = 0;
      if (ui.duration) ui.duration.textContent = fmt(simTotal);
      if (ui.curTime)  ui.curTime.textContent  = '0:00';
      setProgress(0);
      if (autoplay) playSimulation();
    }
  }

  function playSimulation() {
    setPlayingUI(true);
    stopSimulation();
    simTimer = setInterval(() => {
      simElapsed += 1;
      if (simElapsed >= simTotal) { next(); return; }
      if (ui.curTime) ui.curTime.textContent = fmt(simElapsed);
      setProgress(simElapsed / simTotal * 100);
    }, 1000);
  }

  function togglePlay() {
    const hasRealAudio = audio && items[current] && !!items[current].dataset.src;
    if (hasRealAudio) {
      if (audio.paused) audio.play().then(() => setPlayingUI(true)).catch(() => {});
      else { audio.pause(); setPlayingUI(false); }
    } else {
      if (isPlaying) { stopSimulation(); setPlayingUI(false); }
      else playSimulation();
    }
  }

  const next = () => load((current + 1) % items.length);
  const prev = () => load((current - 1 + items.length) % items.length);

  // Clique em uma faixa da lista
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (i === current) togglePlay();
      else load(i);
    });
  });

  if (ui.playPause) ui.playPause.addEventListener('click', togglePlay);
  if (ui.next) ui.next.addEventListener('click', next);
  if (ui.prev) ui.prev.addEventListener('click', prev);

  // Eventos do <audio>
  if (audio) {
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      if (ui.curTime) ui.curTime.textContent = fmt(audio.currentTime);
      setProgress(audio.currentTime / audio.duration * 100);
    });
    audio.addEventListener('loadedmetadata', () => {
      if (ui.duration) ui.duration.textContent = fmt(audio.duration);
    });
    audio.addEventListener('ended', next);
    audio.addEventListener('play',  () => setPlayingUI(true));
    audio.addEventListener('pause', () => setPlayingUI(false));

    if (ui.progress) {
      ui.progress.addEventListener('click', (e) => {
        const rect = ui.progress.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        if (items[current].dataset.src && audio.duration) {
          audio.currentTime = ratio * audio.duration;
        }
      });
    }
  }

  // Inicializa o card com a primeira faixa (sem autoplay)
  load(0, false);
  initPlaylistExtras();
}

/* Apenas o código de barras e o botão de curtir — sem upload */
function initPlaylistExtras() {
  // Código de barras decorativo
  const barcode = $('#spBarcode');
  if (barcode && !barcode.childElementCount) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 40; i++) {
      const bar = document.createElement('span');
      bar.style.height = (8 + Math.random() * 18) + 'px';
      frag.appendChild(bar);
    }
    barcode.appendChild(frag);
  }

  // Botão curtir
  const heart = $('#spHeart');
  if (heart) {
    heart.addEventListener('click', () => {
      const liked = heart.dataset.liked === 'true';
      heart.dataset.liked = String(!liked);
      heart.textContent   = liked ? '♡' : '♥';
      heart.style.color   = liked ? '' : '#ff4d6d';
      heart.setAttribute('aria-pressed', String(!liked));
    });
  }
}

/* Recursos visuais do card Spotify: código de barras, foto e coração */
/* Recursos visuais do card Spotify: código de barras, foto e coração */
function initPlaylistExtras() {
  // Código de barras decorativo (barras verdes de alturas variadas)
  const barcode = $('#spBarcode');
  if (barcode && !barcode.childElementCount) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 40; i++) {
      const bar = document.createElement('span');
      bar.style.height = (8 + Math.random() * 18) + 'px';
      frag.appendChild(bar);
    }
    barcode.appendChild(frag);
  }

  // Upload da foto do casal — ativa pelo input, pela imagem e pelo botão "Trocar"
  const fileInput   = $('#spFileInput');
  const photoImg    = $('#spPhotoImg');
  const placeholder = $('#spPhotoPlaceholder');
  const changeBtn   = $('#spPhotoChange');
  const photoWrap   = $('#spPhotoWrap');

  function handlePhotoUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    photoImg.src = url;
    photoImg.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
    if (changeBtn)   changeBtn.style.display = '';
    // Reseta o input para permitir selecionar o mesmo arquivo novamente
    fileInput.value = '';
  }

  if (fileInput) {
    fileInput.addEventListener('change', handlePhotoUpload);
  }

  // Clique direto na imagem já carregada também abre o seletor
  if (photoImg) {
    photoImg.style.cursor = 'pointer';
    photoImg.addEventListener('click', () => fileInput && fileInput.click());
  }

  // Botão de curtir (coração) — alterna estado visual
  const heart = $('#spHeart');
  if (heart) {
    heart.addEventListener('click', () => {
      const liked = heart.dataset.liked === 'true';
      heart.dataset.liked = String(!liked);
      heart.textContent = liked ? '♡' : '♥';
      heart.setAttribute('aria-pressed', String(!liked));
    });
  }
}


/* =============================================================================
   9. MENSAGEM ESPECIAL — efeito máquina de escrever (typewriter)
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const target = $('#typewriterTarget');
  const source = $('#fullMessageText');
  const btn = $('#typewriterBtn');
  if (!target || !source || !btn) return;

  // Pega o HTML completo da mensagem (preservando os <br/>)
  const fullHTML = source.innerHTML.trim();
  let started = false;
  let typing = false;

  // "Tokeniza" o HTML em pedaços: ou um caractere de texto, ou uma tag inteira
  function tokenize(html) {
    const tokens = [];
    let i = 0;
    while (i < html.length) {
      if (html[i] === '<') {
        const close = html.indexOf('>', i);
        tokens.push(html.slice(i, close + 1)); // tag completa de uma vez
        i = close + 1;
      } else {
        tokens.push(html[i]);
        i++;
      }
    }
    return tokens;
  }

  const CURSOR = '<span class="typewriter-cursor" aria-hidden="true"></span>';

  function typeOut() {
    if (typing) return;
    typing = true;

    // Movimento reduzido → mostra o texto completo sem animar
    if (prefersReducedMotion) {
      target.innerHTML = fullHTML;
      typing = false;
      btn.style.display = 'none';
      return;
    }

    const tokens = tokenize(fullHTML);
    let typed = '';
    let idx = 0;
    const tick = () => {
      if (idx >= tokens.length) {
        target.innerHTML = fullHTML;   // remove o cursor ao final
        typing = false;
        btn.style.display = 'none';
        return;
      }
      const token = tokens[idx];
      typed += token;
      target.innerHTML = typed + CURSOR;  // texto digitado + cursor piscante
      idx++;
      // Pausa um pouco maior depois de pontuação para dar ritmo
      const delay = /[.,!?]/.test(token) ? 90 : 22;
      setTimeout(tick, delay);
    };
    tick();
  }

  // Inicia ao clicar no botão
  btn.addEventListener('click', () => { started = true; typeOut(); });

  // OU inicia automaticamente quando a seção entra na tela
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          typeOut();
          io.disconnect();
        }
      });
    }, { threshold: 0.5 });
    io.observe(target.closest('.message-card') || target);
  }
}


/* =============================================================================
   10. QUIZ DO CASAL — perguntas, pontuação e resultado final
   -------------------------------------------------------------------------- */
function initQuiz() {
  const playing = $('#quizPlaying');
  const result  = $('#quizResult');
  if (!playing || !result) return;

  const elQuestion = $('#quizQuestion');
  const elOptions  = $('#quizOptions');
  const elCounter  = $('#quizCounter');
  const elProgress = $('#quizProgressBar');
  const elIcon     = $('#quizResultIcon');
  const elTitle    = $('#quizResultTitle');
  const elScore    = $('#quizResultScore');
  const elMsg      = $('#quizResultMsg');
  const btnRestart = $('#quizRestart');

  const questions = CONFIG.quizQuestions;
  let index = 0;
  let score = 0;
  let locked = false;  // impede clicar em várias respostas

  function showQuestion() {
    locked = false;
    const item = questions[index];
    elCounter.textContent = `Pergunta ${index + 1} de ${questions.length}`;
    elProgress.style.width = (index / questions.length * 100) + '%';
    elQuestion.textContent = item.q;
    elOptions.innerHTML = '';

    item.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz__option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => answer(i));
      elOptions.appendChild(btn);
    });
  }

  function answer(chosen) {
    if (locked) return;
    locked = true;
    const correct = questions[index].correct;
    const allBtns = $$('.quiz__option-btn', elOptions);

    allBtns.forEach((b, i) => {
      b.disabled = true;
      if (i === correct) b.classList.add('correct');                    // marca a certa
      if (i === chosen && chosen !== correct) b.classList.add('wrong'); // marca o erro
    });

    if (chosen === correct) score++;

    // Avança para a próxima pergunta (ou resultado) após um instante
    setTimeout(() => {
      index++;
      if (index < questions.length) showQuestion();
      else showResult();
    }, 1100);
  }

  function showResult() {
    playing.style.display = 'none';
    result.style.display = 'block';
    elProgress.style.width = '100%';

    const pct = score / questions.length;
    elScore.textContent = `Você acertou ${score} de ${questions.length}!`;

    // Mensagem e ícone variam conforme o desempenho
    if (pct === 1) {
      elIcon.textContent = '🏆';
      elTitle.textContent = 'Perfeito! Você me conhece de cor ❤️';
      elMsg.textContent = 'Não tenho dúvidas: somos almas gêmeas. Acertou tudinho!';
    } else if (pct >= 0.6) {
      elIcon.textContent = '💖';
      elTitle.textContent = 'Muito bem!';
      elMsg.textContent = 'Você me conhece bastante — e ainda temos uma vida toda pra aprender mais um do outro.';
    } else {
      elIcon.textContent = '💕';
      elTitle.textContent = 'Vamos criar mais memórias!';
      elMsg.textContent = 'Tudo bem errar algumas — cada dia juntos é uma nova chance de nos conhecermos mais.';
    }
  }

  function restart() {
    index = 0; score = 0;
    result.style.display = 'none';
    playing.style.display = 'block';
    showQuestion();
  }

  btnRestart.addEventListener('click', restart);
  showQuestion();
}


/* =============================================================================
   11. SEÇÃO SECRETA — desbloqueia após explorar a página
   Dispara: confetes + chuva de corações + mensagem comemorativa
   -------------------------------------------------------------------------- */
function initSecretSection() {
  const secret = $('#secretSection');
  if (!secret) return;

  const btnClose = $('#secretClose');
  const heartsBox = $('#secretHearts');
  const confettiCanvas = $('#confettiCanvas');

  let unlocked = false;

  function unlock() {
    if (unlocked) return;
    unlocked = true;

    secret.classList.add('show');
    secret.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    rainHearts();
    launchConfetti(confettiCanvas);
    if (btnClose) btnClose.focus();
  }

  function close() {
    secret.classList.remove('show');
    secret.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ---- Gatilho: usuário chegou perto do fim da página (≥ 92% rolado) ----
  const checkScroll = () => {
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.documentElement.scrollHeight;
    if (scrolled >= total * 0.92) {
      unlock();
      window.removeEventListener('scroll', checkScroll);
    }
  };
  window.addEventListener('scroll', checkScroll, { passive: true });

  if (btnClose) btnClose.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && secret.classList.contains('show')) close();
  });

  /* ---- Chuva de corações em HTML (leve, com auto-remoção) ---- */
  function rainHearts() {
    if (prefersReducedMotion || !heartsBox) return;
    const EMOJIS = ['❤️', '💕', '💖', '🌹', '✨', '💗'];
    const TOTAL = window.innerWidth < 768 ? 24 : 40;

    for (let i = 0; i < TOTAL; i++) {
      const span = document.createElement('span');
      span.className = 'falling-heart';
      span.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      span.style.left = Math.random() * 100 + '%';
      span.style.fontSize = (14 + Math.random() * 22) + 'px';
      span.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
      span.style.animationDelay = (Math.random() * 1.5) + 's';
      heartsBox.appendChild(span);
      // Remove depois da animação para não acumular nós no DOM
      setTimeout(() => span.remove(), 6000);
    }
  }
}


/* =============================================================================
   12. CONFETES — animação em <canvas> (usada na seção secreta)
   -------------------------------------------------------------------------- */
function launchConfetti(canvas) {
  if (!canvas || prefersReducedMotion) return;
  const ctx = canvas.getContext('2d');

  const W = canvas.width  = canvas.offsetWidth  || window.innerWidth;
  const H = canvas.height = canvas.offsetHeight || window.innerHeight;
  const COLORS = ['#ff4d6d', '#ff8fa3', '#ffb3c1', '#ffccd5', '#fff0f3', '#ffd700'];
  const COUNT = window.innerWidth < 768 ? 90 : 160;

  // Cada confete tem posição, velocidade, rotação e cor próprias
  const pieces = Array.from({ length: COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * -H,                 // começam acima do topo
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vy: 2 + Math.random() * 3.5,
    vx: (Math.random() - 0.5) * 2,
    rot: Math.random() * Math.PI,
    vrot: (Math.random() - 0.5) * 0.2
  }));

  let frames = 0;
  const MAX_FRAMES = 60 * 6;  // ~6 segundos de animação

  function frame() {
    ctx.clearRect(0, 0, W, H);
    pieces.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      p.rot += p.vrot;
      if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }  // recicla

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    frames++;
    if (frames < MAX_FRAMES) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, W, H);  // limpa ao terminar
    }
  }
  frame();
}
