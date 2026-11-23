// ==========================================
// TELEGRAM SOZLAMALARI (SHU YERGA JOYLANG)
// ==========================================
const BOT_TOKEN = "9259694312:AAEEelPfbU9nUcxQcnbHukfjbHAYiKoz2JY"; 
const CHAT_ID = "7318575042";    
// ==========================================

const form = document.getElementById("registerForm");
const submitBtn = document.getElementById("submitBtn");
const statusBox = document.getElementById("statusBox");

function showStatus(type, text) {
  statusBox.className = `status ${type}`;
  statusBox.textContent = text;
}

function escapeMarkdown(str) {
  return str.replace(/([_*`\[])/g, "\\$1");
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!BOT_TOKEN || BOT_TOKEN === "YOUR_BOT_TOKEN_HERE" || !CHAT_ID || CHAT_ID === "YOUR_CHAT_ID_HERE") {
    showStatus("error", "Iltimos, script.js boshida BOT_TOKEN va CHAT_ID ni kiriting.");
    return;
  }

  if (!fullName || !phone || !message) {
    showStatus("error", "Iltimos, barcha maydonlarni to'ldiring.");
    return;
  }

  const telegramText =
    `📩 *Yangi ro'yxatdan o'tish / Xabar*\n\n` +
    `👤 *Ism-familiya:* ${escapeMarkdown(fullName)}\n` +
    `📞 *Telefon:* ${escapeMarkdown(phone)}\n` +
    `💬 *Xabar:* ${escapeMarkdown(message)}`;

  submitBtn.disabled = true;
  submitBtn.textContent = "Yuborilmoqda...";
  statusBox.className = "status";

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: telegramText,
        parse_mode: "Markdown"
      })
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      showStatus("success", "Ma'lumotlaringiz muvaffaqiyatli yuborildi!");
      form.reset();
    } else {
      showStatus("error", `Xatolik yuz berdi: ${data.description || "Telegram API javob bermadi"}`);
    }
  } catch (err) {
    showStatus("error", "Tarmoq xatosi! Internet aloqasini yoki token/chat ID ni tekshiring.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Yuborish";
  }
});