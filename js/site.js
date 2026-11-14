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
