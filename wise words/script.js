const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const modal = $('#preorderModal');
const toast = $('#toast');
let selectedEdition = 'Wise Words by TRUMP';
let selectedPrice = 49;
let quantity = 1;
let currentStep = 1;

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),2600);
}

function updateSummary(){
  $('#summaryEdition').textContent = selectedEdition;
  $('#summaryQty').textContent = quantity;
  $('#qtyValue').textContent = quantity;
  const total = selectedPrice * quantity;
  $('#totalValue').textContent = total.toFixed(2);
  $('#confirmEdition').textContent = selectedEdition;
  $('#confirmQty').textContent = quantity;
  $('#confirmTotal').textContent = total.toFixed(2);
}

function setStep(step){
  currentStep = step;
  $$('.checkout-step').forEach(el=>el.classList.toggle('active-step', Number(el.dataset.step)===step));
  $$('.steps span').forEach((el,i)=>el.classList.toggle('active', i+1===step));
}

function openPreorder(card){
  if(card){
    selectedEdition = card.dataset.edition || selectedEdition;
    selectedPrice = Number(card.dataset.price || selectedPrice);
  }
  quantity = 1;
  updateSummary();
  setStep(1);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}

function closePreorder(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}

$$('[data-preorder]').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const card = e.currentTarget.closest('.product-card');
    openPreorder(card);
  });
});

$('#modalClose').addEventListener('click', closePreorder);
modal.addEventListener('click', e=>{ if(e.target===modal) closePreorder(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && modal.classList.contains('open')) closePreorder(); });

$('#minusQty').addEventListener('click',()=>{ if(quantity>1){quantity--;updateSummary();} });
$('#plusQty').addEventListener('click',()=>{ if(quantity<10){quantity++;updateSummary();} });

$$('[data-next]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(currentStep===1){
      const form = $('#checkoutForm');
      if(!form.reportValidity()) return;
      setStep(2);
    }else if(currentStep===2){
      setStep(3);
      showToast('Demo order confirmed');
    }
  });
});
$$('[data-back]').forEach(btn=>btn.addEventListener('click',()=>setStep(Math.max(1,currentStep-1))));
$('#doneBtn').addEventListener('click', closePreorder);

$('#themeToggle').addEventListener('click',()=>{
  document.body.classList.toggle('dark');
  $('#themeToggle').textContent = document.body.classList.contains('dark') ? '☀' : '☾';
});

$('#menuToggle').addEventListener('click',()=>$('.main-nav').classList.toggle('open'));
$$('.main-nav a').forEach(a=>a.addEventListener('click',()=>$('.main-nav').classList.remove('open')));

$('[data-contact]').addEventListener('click',()=>document.querySelector('#contact').scrollIntoView({behavior:'smooth'}));

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting) entry.target.classList.add('visible')});
},{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

const routeLinks = $$('[data-route]');
function highlightRoute(){
  const hash = location.hash || '#home';
  routeLinks.forEach(a=>a.classList.toggle('current', a.getAttribute('href')===hash));
}
window.addEventListener('hashchange',highlightRoute);
highlightRoute();

$$('[data-blog]').forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();
  showToast('Blog article preview - replace with final article');
}));

// Keep the supplied landing-page content as the source of truth.
// This script intentionally uses placeholder contact/payment actions until the client's
// final business links, payment gateway, social URLs, and approved blog copy are supplied.
