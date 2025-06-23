const cart = [];

function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}

function loadCart() {
  const savedCart = JSON.parse(localStorage.getItem('cartItems'));
  if (savedCart && Array.isArray(savedCart)) {
    cart.length = 0;
    savedCart.forEach(item => cart.push(item));
  }
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

function addToCart(name, price) {
  // تحقق هل المنتج موجود مسبقاً في السلة
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  saveCart();
  updateCartCount();
}

function removeFromCart(name) {
  const index = cart.findIndex(item => item.name === name);
  if (index > -1) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
  }
}

function changeQuantity(name, quantity) {
  const item = cart.find(item => item.name === name);
  if (item) {
    item.quantity = quantity > 0 ? quantity : 1;
    saveCart();
    updateCartCount();
  }
}

function showCart() {
  const cartModal = document.getElementById('cart-modal');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>السلة فارغة</p>';
    cartTotal.textContent = '';
    cartModal.style.display = 'flex';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.style.marginBottom = '10px';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = `${item.name} — `;

    const priceSpan = document.createElement('span');
    priceSpan.textContent = `${item.price} دج × `;

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = '1';
    qtyInput.value = item.quantity;
    qtyInput.style.width = '50px';
    qtyInput.style.margin = '0 5px';
    qtyInput.addEventListener('change', e => {
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      e.target.value = val;
      changeQuantity(item.name, val);
      showCart(); // تحديث العرض مع الجديد
    });

    const subtotal = item.price * item.quantity;
    total += subtotal;

    const subtotalSpan = document.createElement('span');
    subtotalSpan.textContent = ` = ${subtotal} دج `;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'حذف';
    removeBtn.style.marginLeft = '10px';
    removeBtn.style.backgroundColor = '#e03670';
    removeBtn.style.color = 'white';
    removeBtn.style.border = 'none';
    removeBtn.style.borderRadius = '4px';
    removeBtn.style.padding = '2px 6px';
    removeBtn.style.cursor = 'pointer';
    removeBtn.addEventListener('click', () => {
      removeFromCart(item.name);
      showCart();
    });

    itemDiv.appendChild(nameSpan);
    itemDiv.appendChild(priceSpan);
    itemDiv.appendChild(qtyInput);
    itemDiv.appendChild(subtotalSpan);
    itemDiv.appendChild(removeBtn);

    cartItems.appendChild(itemDiv);
  });

  cartTotal.textContent = `الإجمالي: ${total} دج`;
  cartModal.style.display = 'flex';
}

function clearCart() {
  cart.length = 0;
  saveCart();
  updateCartCount();
  document.getElementById('cart-items').innerHTML = '';
  document.getElementById('cart-total').textContent = '';
  document.getElementById('cart-modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartCount();

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

  // EmailJS initialization
  emailjs.init("MxN-ML5SwEtO17Esp");

  document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = this.user_name.value.trim();
    const email = this.user_email.value.trim();
    const message = this.message.value.trim();

    if (!name || !email || !message) {
      alert("⚠️ الرجاء تعبئة جميع الحقول المطلوبة.");
      return;
    }

    if (cart.length === 0) {
      alert("⚠️ لا يمكن إرسال الطلب. السلة فارغة.");
      return;
    }

    let summary = cart.map(item => `${item.name} - ${item.price} دج × ${item.quantity}`).join("\n");
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    summary += `\n\n📦 الإجمالي: ${total} دج`;

    document.getElementById("cart-summary").value = summary;

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