document.getElementById('ano').textContent = new Date().getFullYear();
  var topo = document.getElementById('topo');
  var sub = document.querySelector('.tem-sub');
  sub.querySelector('button').addEventListener('click', function(e){ e.stopPropagation(); var a = sub.classList.toggle('aberto'); this.setAttribute('aria-expanded', a); });
  sub.addEventListener('mouseenter', function(){ if (window.matchMedia('(hover:hover)').matches) sub.classList.add('aberto'); });
  sub.addEventListener('mouseleave', function(){ sub.classList.remove('aberto'); });
  document.addEventListener('click', function(){ sub.classList.remove('aberto'); });
  var hamb = document.querySelector('.hamb'), gav = document.getElementById('gaveta');
  function menu(a){ gav.classList.toggle('aberta', a); hamb.setAttribute('aria-expanded', a); hamb.setAttribute('aria-label', a ? 'Fechar menu' : 'Abrir menu'); document.body.classList.toggle('menu-aberto', a); }
  hamb.addEventListener('click', function(){ menu(!gav.classList.contains('aberta')); });
  gav.querySelectorAll('a').forEach(function(l){ l.addEventListener('click', function(){ menu(false); }); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') menu(false); });
  document.querySelectorAll('.submenu a').forEach(function(l){ l.addEventListener('click', function(){ sub.classList.remove('aberto'); }); });
  function cabecalho(){ topo.classList.toggle('solido', window.scrollY > 40); }
  window.addEventListener('scroll', cabecalho, {passive:true}); cabecalho();
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visivel'); obs.unobserve(e.target); } }); }, {threshold:.12});
    document.querySelectorAll('.revela').forEach(function(el){ obs.observe(el); });
  } else { document.querySelectorAll('.revela').forEach(function(el){ el.classList.add('visivel'); }); }
  var form = document.getElementById('form-contato');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = this, nome = f.nome.value.trim(), email = f.email.value.trim(), msg = f.mensagem.value.trim();
    var faltam = [];
    if (!nome) faltam.push('nome');
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) faltam.push('e-mail válido');
    if (!msg) faltam.push('mensagem');
    if (faltam.length) { alert('Preencha: ' + faltam.join(', ') + '.'); return; }
    var texto = 'Olá, vim pelo site da ĒTHICA.\n\n' +
      'Nome: ' + nome + '\nE-mail: ' + email +
      (f.telefone.value.trim() ? '\nTelefone: ' + f.telefone.value.trim() : '') +
      '\nAssunto: ' + f.assunto.value + '\n\n' + msg;
    window.open('https://wa.me/5547992559213?text=' + encodeURIComponent(texto), '_blank', 'noopener');
  });
  /* carrossel da abertura */
  (function(){
    var slides = document.querySelectorAll('.carrossel .slide');
    var pontos = document.querySelectorAll('.pontos button');
    if (slides.length < 2) return;
    var atual = 0, timer = null, parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function carregar(i){ var img = slides[i].querySelector('img[data-src]'); if (img){ img.src = img.getAttribute('data-src'); img.removeAttribute('data-src'); } }
    function ir(i){
      carregar(i); carregar((i + 1) % slides.length); carregar((i + 2) % slides.length);
      slides[atual].classList.remove('ativo'); pontos[atual] && pontos[atual].removeAttribute('aria-current');
      atual = i;
      slides[atual].classList.add('ativo'); pontos[atual] && pontos[atual].setAttribute('aria-current', 'true');
    }
    function visivel(i){ return getComputedStyle(slides[i]).display !== 'none'; }
    function proximo(){ var i = atual; for (var k = 0; k < slides.length; k++){ i = (i + 1) % slides.length; if (visivel(i)) return i; } return atual; }
    function marcar(){ pontos.forEach(function(b, i){ b.classList.toggle('oculto', !visivel(i)); }); if (!visivel(atual)) ir(proximo()); }
    window.addEventListener('resize', marcar); marcar();
    function iniciar(){ if (parado) return; clearInterval(timer); timer = setInterval(function(){ ir(proximo()); }, 6500); }
    pontos.forEach(function(b, i){ b.addEventListener('click', function(){ ir(i); iniciar(); }); });
    document.addEventListener('visibilitychange', function(){ if (document.hidden) clearInterval(timer); else iniciar(); });
    window.addEventListener('load', function(){ carregar(1); });
    iniciar();
  })();
  /* coverflow das finalidades */
  document.querySelectorAll('.cf').forEach(function(cf){
    var palco = cf.querySelector('.cf-palco'), itens = Array.prototype.slice.call(cf.querySelectorAll('.cf-item'));
    var pontos = cf.querySelector('.cf-pontos'), n = itens.length, atual = 0;
    if (!n) return;
    itens.forEach(function(it, i){
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Finalidade ' + (i + 1) + ' de ' + n);
      b.addEventListener('click', function(){ ir(i); }); pontos.appendChild(b);
      it.addEventListener('click', function(e){ if (i !== atual){ e.preventDefault(); ir(i); } });
    });
    function desenhar(){
      var cel = window.matchMedia('(max-width:700px)').matches;
      var passo = cel ? 58 : 66, longe = cel ? 1 : 2;
      var maxH = 0;
      itens.forEach(function(it, i){
        var d = (i - atual + n) % n; if (d > n / 2) d -= n;
        var ad = Math.abs(d), s = d < 0 ? -1 : 1;
        var tx = d * passo, rot = ad === 0 ? 0 : -s * 38, esc = ad === 0 ? 1 : (ad === 1 ? .82 : .66);
        if (ad === 2) tx = s * (passo + (cel ? 40 : 52));
        it.style.transform = 'translateX(-50%) translateX(' + tx + '%) rotateY(' + rot + 'deg) scale(' + esc + ')';
        it.style.zIndex = 10 - ad;
        it.style.opacity = ad > longe ? 0 : (ad === 2 ? .55 : 1);
        it.style.pointerEvents = ad > longe ? 'none' : '';
        it.classList.toggle('ativo', ad === 0);
        it.setAttribute('aria-hidden', ad === 0 ? 'false' : 'true');
        it.tabIndex = ad === 0 ? 0 : -1;
        maxH = Math.max(maxH, it.offsetHeight);
      });
      if (maxH) palco.style.height = (maxH + 20) + 'px';
      pontos.querySelectorAll('button').forEach(function(b, i){ if (i === atual) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    }
    function ir(i){ atual = (i + n) % n; desenhar(); }
    cf.querySelector('.cf-ant').addEventListener('click', function(){ ir(atual - 1); });
    cf.querySelector('.cf-prox').addEventListener('click', function(){ ir(atual + 1); });
    palco.addEventListener('keydown', function(e){ if (e.key === 'ArrowRight'){ e.preventDefault(); ir(atual + 1); } if (e.key === 'ArrowLeft'){ e.preventDefault(); ir(atual - 1); } });
    var x0 = null;
    palco.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, {passive:true});
    palco.addEventListener('touchend', function(e){ if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) ir(atual + (dx < 0 ? 1 : -1)); x0 = null; }, {passive:true});
    window.addEventListener('resize', desenhar); window.addEventListener('load', desenhar);
    ir(0);
  });
