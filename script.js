document.getElementById('year').textContent = new Date().getFullYear();

// --- Menu mobile ---
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

// --- Formulaire de contact -> Supabase ---
let supabaseClient = null;
try {
  if (window.supabase && window.SUPABASE_URL && !window.SUPABASE_URL.includes('xxxxxxxxxxxx')) {
    supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON);
  }
} catch (e) {
  console.error('Supabase non initialisé :', e);
}

const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.className = 'form-status';
  statusEl.textContent = '';

  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.nom || !data.telephone || !data.message) {
    statusEl.textContent = "Merci de remplir le nom, le téléphone et le message.";
    statusEl.className = 'form-status err';
    return;
  }

  if (!supabaseClient) {
    statusEl.textContent = "Le formulaire n'est pas encore connecté. Contactez-nous directement sur WhatsApp en attendant.";
    statusEl.className = 'form-status err';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Envoi en cours…';

  const { error } = await supabaseClient.from('contacts').insert({
    nom: data.nom,
    entreprise: data.entreprise || null,
    telephone: data.telephone,
    secteur: data.secteur || null,
    message: data.message,
  });

  submitBtn.disabled = false;
  submitBtn.textContent = 'Envoyer la demande';

  if (error) {
    console.error(error);
    statusEl.textContent = "L'envoi a échoué. Réessayez, ou écrivez-nous directement sur WhatsApp.";
    statusEl.className = 'form-status err';
  } else {
    form.reset();
    statusEl.textContent = 'Demande envoyée — nous revenons vers vous rapidement.';
    statusEl.className = 'form-status ok';
  }
});
