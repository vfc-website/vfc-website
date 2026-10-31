// Vanguard Frontier Capital — shared behaviour
(function () {
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/vanguardfrontiercapital@gmail.com';
  var CONTACT_EMAIL = 'vanguardfrontiercapital@gmail.com';

  // Mobile navigation
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.querySelectorAll('.mobile-menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Enquiry forms — submitted directly to the VFC inbox
  document.querySelectorAll('form[data-enquiry]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      if (data._honey) return; // spam trap
      button.disabled = true;
      var label = button.innerHTML;
      button.textContent = 'Sending…';
      status.className = 'form-status';
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
        .then(function (res) {
          if (!res.ok || String(res.body.success) === 'false') throw new Error('rejected');
          form.reset();
          status.textContent = 'Thank you. Your message is with us and we will respond within five business days. Every enquiry is treated in confidence.';
          status.className = 'form-status ok';
        })
        .catch(function () {
          status.innerHTML = 'Your message could not be sent just now. Please email us directly at <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>.';
          status.className = 'form-status err';
        })
        .finally(function () {
          button.disabled = false;
          button.innerHTML = label;
          status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
