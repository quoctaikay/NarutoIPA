// Danh sách key hợp lệ (đã xoá key cũ, chỉ còn key mới)
const validKeys = [
  "devkay",
  "kaitokid1",
  "kaitokid2",
  "kaitokid3",
  "kayuchiha",
  "uchihacoder",
  "kayadmin"
];

function checkKey() {
  const inputKey = document.getElementById("keyInput").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  if (validKeys.includes(inputKey)) {
    // Key test mới (giới hạn 50 lần)
    if (inputKey === "devkay") {
      let usedCount = parseInt(localStorage.getItem(inputKey + "_count") || "0", 10);
      if (usedCount >= 5) {
        errorMsg.textContent = `❌ Key ${inputKey} đã vượt quá 5 lần đăng nhập.`;
        return;
      } else {
        usedCount++;
        localStorage.setItem(inputKey + "_count", usedCount.toString());
        localStorage.setItem("loggedIn", inputKey);
        localStorage.setItem("remaining", (5 - usedCount).toString()); // lưu số lần còn lại
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
      if (loggedIn === "devkay") {
        const remaining = localStorage.getItem("remaining");
        if (remaining) {
          document.getElementById("remainingInfo").textContent = 
            `🔑 Số lần còn lại cho ${loggedIn}: ${remaining}/50`;
        }
      }
    }
  }
};
