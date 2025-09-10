// Danh sách key hợp lệ
const validKeys = [
  "nnhatv2",
  "nnhatvip500",
  "nnhatvip2l",
  "nnhatvip100ca",
  "nnhatvip50k",
  "nnhattest1",
  "nnhattest2",
  "nnhattest3",
  "nnhattest4",
  "nnhattest5"
];

function checkKey() {
  const inputKey = document.getElementById("keyInput").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  if (validKeys.includes(inputKey)) {
    // Key nnhatv2: giới hạn thời gian
    if (inputKey === "nnhatv2") {
      const firstUse = localStorage.getItem("nnhatv2_start");
      if (firstUse) {
        const timePassed = Date.now() - parseInt(firstUse, 10);
        if (timePassed > 2 * 60 * 60 * 1000) {
          errorMsg.textContent = "❌ Key nnhatv2 đã hết hạn.";
          return;
        } else {
          localStorage.setItem("loggedIn", "nnhatv2");
          window.location.href = "main.html";
          return;
        }
      } else {
        localStorage.setItem("nnhatv2_start", Date.now().toString());
        localStorage.setItem("loggedIn", "nnhatv2");
        window.location.href = "main.html";
        return;
      }
    }

    // Key test (giới hạn 20 lần)
    if (inputKey.startsWith("nnhattest")) {
      let usedCount = parseInt(localStorage.getItem(inputKey + "_count") || "0", 10);
      if (usedCount >= 20) {
        errorMsg.textContent = `❌ Key ${inputKey} đã vượt quá 20 lần đăng nhập.`;
        return;
      } else {
        usedCount++;
        localStorage.setItem(inputKey + "_count", usedCount.toString());
        localStorage.setItem("loggedIn", inputKey);
        localStorage.setItem("remaining", (20 - usedCount).toString()); // lưu số lần còn lại
        window.location.href = "main.html";
        return;
      }
    }

    // Các key khác: không giới hạn
    localStorage.setItem("loggedIn", inputKey);
    window.location.href = "main.html";

  } else {
    errorMsg.textContent = "❌ Key không hợp lệ. Vui lòng thử lại.";
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("remaining");
  window.location.href = "index.html";
}

// Kiểm tra trạng thái khi vào trang
window.onload = function() {
  const path = window.location.pathname;
  const loggedIn = localStorage.getItem("loggedIn");

  if (path.endsWith("index.html") || path.endsWith("/")) {
    if (loggedIn) {
      window.location.href = "main.html";
    }
  }

  if (path.endsWith("main.html")) {
    if (!loggedIn) {
      window.location.href = "index.html";
    } else {
      if (loggedIn === "nnhatv2") {
        const start = localStorage.getItem("nnhatv2_start");
        if (start) {
          const expiresAt = parseInt(start, 10) + 2*60*60*1000;
          startCountdown(expiresAt);
        }
      }
      if (loggedIn.startsWith("nnhattest")) {
        const remaining = localStorage.getItem("remaining");
        if (remaining) {
          document.getElementById("remainingInfo").textContent =
            `🔑 Số lần còn lại cho ${loggedIn}: ${remaining}/20`;
        }
      }
    }
  }
};

function startCountdown(exp) {
  const cd = document.getElementById("countdown");
  function tick() {
    const now = Date.now();
    const diff = exp - now;
    if (diff <= 0) {
      logout();
      alert("Key nnhatv2 đã hết hạn.");
      return;
    }
    const h = Math.floor(diff/1000/60/60);
    const m = Math.floor((diff/1000/60)%60);
    const s = Math.floor((diff/1000)%60);
    cd.textContent = `⏳ Thời gian còn lại: ${h}h ${m}m ${s}s`;
  }
  tick();
  setInterval(tick, 1000);
}
