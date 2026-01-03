(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

// Dark mode toggle
(function() {
  // quick load marker
  // ensure DOM ready
  const init = () => {
  // init
    const toggle = document.getElementById('dark-toggle');
    const icon = document.getElementById('dark-icon');
    const apply = (isDark) => {
      if (isDark) document.body.classList.add('dark'); else document.body.classList.remove('dark');
      if (icon) {
        icon.classList.remove('fa-moon', 'fa-sun');
        icon.classList.remove('fa-solid', 'fa-regular');
        icon.classList.add(isDark ? 'fa-solid' : 'fa-regular');
        icon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
      }
    };

    // initialize from localStorage, else use system preference
    try {
      const saved = localStorage.getItem('wl-dark');
      let isDark;
      if (saved === null) {
        // first visit: respect system preference
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  // respect system preference on first visit
      } else {
        isDark = saved === '1';
      }
  // initialized dark-mode preference
      // apply with a smooth transition on first paint
      document.body.classList.add('theme-transition');
      apply(isDark);
      if (toggle) toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      setTimeout(() => document.body.classList.remove('theme-transition'), 350);
    } catch (e) {
      // silence theme init errors in production; no-op
    }

    // primary handler
    if (toggle) {
      toggle.setAttribute('aria-pressed', 'false');
      toggle.addEventListener('click', (ev) => {
        // add transition class briefly for smooth fade
        document.body.classList.add('theme-transition');
        const isDark = document.body.classList.toggle('dark');
  try { localStorage.setItem('wl-dark', isDark ? '1' : '0'); } catch (e) {}
  apply(isDark);
  toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  // toggled dark-mode
  try { ev.stopPropagation(); } catch (e) {}
    setTimeout(() => document.body.classList.remove('theme-transition'), 360);
        // debug toast removed — no-op here
      }, false);
    }

    // Fallback: delegated click in case markup changes after load
    document.body.addEventListener('click', (ev) => {
      const t = ev.target;
      if (!t) return;
      const button = t.closest && t.closest('#dark-toggle');
      if (button) {
        // simulate the same logic
        document.body.classList.add('theme-transition');
        const isDark = document.body.classList.toggle('dark');
        try { localStorage.setItem('wl-dark', isDark ? '1' : '0'); } catch (e) {}
        apply(isDark);
        if (toggle) toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  // delegated toggled dark-mode
        setTimeout(() => document.body.classList.remove('theme-transition'), 360);
      }
    }, false);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready
    init();
  }
})();

/* Password visibility toggle (reusable for any .password-toggle-btn inside an .input-group) */
;(function(){
  function initPasswordToggles(){
    const buttons = document.querySelectorAll('.password-toggle-btn');
    if(!buttons || !buttons.length) return;
    buttons.forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        const group = btn.closest('.input-group');
        if(!group) return;
        const input = group.querySelector('input[type="password"], input[type="text"]');
        if(!input) return;
        const isCurrentlyText = input.type === 'text';
        // Toggle type
        input.type = isCurrentlyText ? 'password' : 'text';
        // Update aria-pressed
        btn.setAttribute('aria-pressed', (!isCurrentlyText).toString());
        // Update icon
        const icon = btn.querySelector('i');
        if(icon){
          icon.classList.toggle('fa-eye', isCurrentlyText);
          icon.classList.toggle('fa-eye-slash', !isCurrentlyText);
          // Use solid for visible (more pronounced) and regular for hidden
          icon.classList.toggle('fa-solid', !isCurrentlyText);
          icon.classList.toggle('fa-regular', isCurrentlyText);
        }
        // Move focus back to input for convenience
        try { input.focus(); } catch(e){}
      }, false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPasswordToggles);
  } else {
    initPasswordToggles();
  }
})();
