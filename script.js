// حفظ السلة في localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function loadCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// إشعار (Notification)
function showNotification(msg) {
    const notif = document.getElementById('notification');
    notif.innerText = msg;
    notif.className = "show";
    setTimeout(() => notif.className = notif.className.replace("show", ""), 2000);
}

let cart = loadCart();

function updateCartCount() {
    document.getElementById('cart-count').innerText = cart.reduce((sum, p) => sum + p.qty, 0);
}

function renderCart() {
    const itemsDiv = document.getElementById('cart-items');
    if (cart.length === 0) {
        itemsDiv.innerHTML = "<p>السلة فارغة</p>";
        document.getElementById('cart-total').innerText = "";
        return;
    }
    let html = '';
    let total = 0;
    cart.forEach((item, idx) => {
        total += item.price * item.qty;
        html += `<p>
            ${item.name} - ${item.price} دج × ${item.qty}
            <button onclick="removeFromCart(${idx})" style="background:#eee;color:#ff4081;border:none;border-radius:2px;margin-right:7px;cursor:pointer;">حذف</button>
        </p>`;
    });
    itemsDiv.innerHTML = html;
    document.getElementById('cart-total').innerText = "المجموع: " + total + " دج";
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    saveCart(cart);
    updateCartCount();
    renderCart();
}

function addToCart(product) {
    let found = cart.find(p => p.name === product.name);
    if (found) found.qty += 1;
    else cart.push({ ...product, qty: 1 });
    saveCart(cart);
    updateCartCount();
    showNotification("تم إضافة المنتج للسلة!");
}

// تحميل مكتبة EmailJS وتفعيلها
(function () {
    const script = document.createElement('script');
    script.src = "https://cdn.emailjs.com/sdk/3.2.0/email.min.js";
    script.onload = function () {
        emailjs.init('MxN-ML5SwEtO17Esp'); // Public Key
    };
    document.head.appendChild(script);
})();

// الأحداث الرئيسية
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function () {
            const p = this.closest('.product');
            addToCart({
                name: p.getAttribute('data-name'),
                price: parseInt(p.getAttribute('data-price'))
            });
        });
    });

    document.getElementById('view-cart').onclick = function (e) {
        e.preventDefault();
        renderCart();
        document.getElementById('cart-modal').style.display = 'flex';
    };

    document.getElementById('close-cart').onclick = function () {
        document.getElementById('cart-modal').style.display = 'none';
    };

    document.getElementById('clear-cart').onclick = function () {
        cart = [];
        saveCart(cart);
        updateCartCount();
        renderCart();
    };

    // عند إرسال النموذج
    document.getElementById('contact-form').addEventListener('submit', function (e) {
        e.preventDefault();

        if (cart.length === 0) {
            showNotification("أضف منتجات للسلة أولاً!");
            return;
        }

        // إعداد ملخص السلة
        let summary = cart.map(p => `${p.name} × ${p.qty} = ${p.price * p.qty} دج`).join('\n');
        document.getElementById('cart-summary').value = summary;

        const formData = {
            user_name: this.user_name.value,
            user_email: this.user_email.value,
            message: this.message.value,
            cart_summary: summary
        };

        // إرسال الطلب عبر EmailJS
        emailjs.send('service_o7uhqey', 'template_g8sr0vu', formData)
            .then(() => {
                showNotification("✅ تم إرسال طلبك بنجاح! سنتواصل معك قريبًا.");
                cart = [];
                saveCart(cart);
                updateCartCount();
                renderCart();
                this.reset();
            }, (error) => {
                console.error('EmailJS Error:', error);
                showNotification("❌ حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
            });
    });

    // تحديث العداد عند التحميل
    updateCartCount();
});