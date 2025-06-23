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

  // زر إضافة إلى السلة
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      const product = e.target.closest('.product');
      const name = product.dataset.name;
      const price = parseInt(product.dataset.price);
      addToCart(name, price);
    });
  });

  // عرض السلة
  document.getElementById('view-cart').addEventListener('click', e => {
    e.preventDefault();
    showCart();
  });

  // إغلاق نافذة السلة
  document.getElementById('close-cart').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'none';
  });

  // تفريغ السلة
  document.getElementById('clear-cart').addEventListener('click', clearCart);

  // إغلاق السلة عند الضغط خارجها
  window.addEventListener('click', e => {
    if (e.target === document.getElementById('cart-modal')) {
      document.getElementById('cart-modal').style.display = 'none';
    }
  });

  // ✅ EmailJS
  emailjs.init("MxN-ML5SwEtO17Esp");

  // إرسال الطلب
  document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("⚠️ لا يمكن إرسال الطلب. السلة فارغة.");
      return;
    }

    // تلخيص محتوى السلة
    let summary = cart.map(item => `${item.name} - ${item.price} دج`).join("\n");
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    summary += `\n\n📦 الإجمالي: ${total} دج`;

    // تمرير ملخص السلة إلى الحقل المخفي
    document.getElementById("cart-summary").value = summary;

    // إرسال عبر EmailJS
    emailjs.sendForm("service_o7uhqey", "template_g8sr0vu", this)
      .then(() => {
        alert("✅ تم إرسال الطلب بنجاح!");
        clearCart();
        this.reset();
      }, (error) => {
        console.error("EmailJS error:", error);
        alert("❌ حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
      });
  });
});