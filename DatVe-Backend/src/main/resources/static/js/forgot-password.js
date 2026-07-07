const API = "http://localhost:8080/api/auth";

document.getElementById("sendOtp").onclick = async () => {
  const email = document.getElementById("email").value;

  const res = await fetch(`${API}/forgot-password?email=${email}`, {
    method: "POST",
  });

  const text = await res.text();

  document.getElementById("message").innerHTML = text;
};

document.getElementById("reset").onclick = async () => {
  const email = document.getElementById("email").value;

  const otp = document.getElementById("otp").value;

  const password = document.getElementById("password").value;

  const res = await fetch(
    `${API}/reset-password?email=${email}&otp=${otp}&newPassword=${password}`,

    {
      method: "POST",
    },
  );

  const text = await res.text();

  document.getElementById("message").innerHTML = text;

  if (text === "Password changed successfully") {
    alert("Đổi mật khẩu thành công");

    location.href = "login.html";
  }
};
