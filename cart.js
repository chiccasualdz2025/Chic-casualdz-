// cart.js

const cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  updateCartCount();
  saveCart();
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  cartCount.textContent = cart.length;
}

function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}

function loadCart() {
  const savedCart = JSON.parse(localStorage.getItem('cartItems'));
  if (savedCart && Array.isArray(savedCart)) {
    savedCart.forEach(item => cart.push(item));
    updateCartCount();
  }
}

function showCart() {
  const cartModal = document.getElementById('cart-modal');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const p = document.createElement('p');
    p.textContent = `${item.name} - ${item.price} دج`;
    cartItems.appendChild(p);
    total += item.price;
  });

  cartTotal.textContent = `الإجمالي: ${total} دج`;
  cartModal.style.display = 'flex';
}

function clearCart() {
  cart.length = 0;
  localStorage.removeItem('cartItems');
  updateCartCount();
  document.getElementById('cart-items').innerHTML = '';
  document.getElementById('cart-total').textContent = '';
  document.getElementById('cart-modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  loadCart();

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      const product = e.target.closest('.product');
      const name = product.dataset.name;
      const price = parseInt(product.dataset.price);
      addToCart(name, price);
    });
  });

  document.getElementById('view-cart').addEventListener('click', e => {
    e.preventDefault();
    showCart();
  });

  document.getElementById('close-cart').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'none';
  });

  document.getElementById('clear-cart').addEventListener('click', clearCart);

  window.addEventListener('click', e => {
    if (e.target === document.getElementById('cart-modal')) {
      document.getElementById('cart-modal').style.display = 'none';
    }
  });
});