const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
mainNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const inputs = [...document.querySelectorAll('#orderItems input[data-price]')];
const totalEl = document.getElementById('orderTotal');
function calculateTotal() {
  const total = inputs.reduce((sum, input) => {
    const qty = Math.max(0, Math.min(20, Number.parseInt(input.value || '0', 10) || 0));
    input.value = qty;
    return sum + qty * Number(input.dataset.price);
  }, 0);
  totalEl.textContent = 'LKR ' + total.toLocaleString('en-LK');
  return total;
}
inputs.forEach(input => input.addEventListener('input', calculateTotal));
document.getElementById('sendOrder')?.addEventListener('click', () => {
  const selected = inputs.filter(i => Number(i.value) > 0);
  if (!selected.length) {
    alert('Please select at least one menu item.');
    return;
  }
  const name = document.getElementById('customerName').value.trim();
  const details = document.getElementById('customerDetails').value.trim();
  const lines = selected.map(i => `${i.dataset.name} x ${i.value} = LKR ${(Number(i.dataset.price) * Number(i.value)).toLocaleString('en-LK')}`);
  const total = calculateTotal();
  const message = [
    'Hello Hungry Brunch Café & Restaurant, I would like to enquire about this order:',
    '',
    ...lines,
    '',
    `Estimated total: LKR ${total.toLocaleString('en-LK')}`,
    name ? `Name: ${name}` : '',
    details ? `Pickup / delivery details: ${details}` : '',
    '',
    'Please confirm availability, final prices and the order.'
  ].filter(Boolean).join('\\n');
  // Publicly listed contact number; verify with the business before relying on WhatsApp ordering.
  window.open('https://wa.me/94776057554?text=' + encodeURIComponent(message), '_blank', 'noopener');
});
calculateTotal();
