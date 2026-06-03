// tracker.js – Tracking server (Railway-ready)
require("dotenv").config();
const http = require("http");

const PORT = process.env.PORT || 3000;

// เก็บใน memory (Railway ฟรีไม่มี persistent disk)
const clicks = [];

// HTML หน้าขอบคุณ
const thankYouPage = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8"/>
  <title>ขอบคุณ</title>
  <style>
    body { margin:0; display:flex; justify-content:center; align-items:center;
           min-height:100vh; background:#f3f4f6; font-family:'Segoe UI',sans-serif; }
    .box { background:#fff; border-radius:16px; padding:48px 56px; text-align:center;
           box-shadow:0 4px 24px rgba(0,0,0,0.08); }
    .icon { font-size:48px; margin-bottom:16px; }
    h1 { margin:0 0 8px; color:#1e3a5f; font-size:22px; }
    p  { margin:0; color:#64748b; font-size:14px; }
  </style>
</head>
<body>
  <div class="box">
    <div class="icon">✅</div>
    <h1>รับทราบแล้ว</h1>
    <p>ขอบคุณที่เปิดอ่านอีเมลครับ</p>
  </div>
</body>
</html>`;

// HTML Dashboard
function buildDashboard() {
  const rows = clicks.length === 0
    ? `<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:24px;">ยังไม่มีการคลิก</td></tr>`
    : clicks.map((c, i) => `
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 16px;color:#64748b;font-size:13px;">${i + 1}</td>
          <td style="padding:10px 16px;font-weight:600;color:#1e3a5f;">${c.name || "-"}</td>
          <td style="padding:10px 16px;color:#475569;">${c.email || "-"}</td>
          <td style="padding:10px 16px;color:#64748b;font-size:13px;">${c.clickedAt}</td>
        </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8"/>
  <meta http-equiv="refresh" content="10"/>
  <title>Click Dashboard</title>
  <style>
    body { margin:0; background:#f3f4f6; font-family:'Segoe UI',sans-serif; padding:40px 24px; }
    h1   { color:#1e3a5f; font-size:22px; margin:0 0 4px; }
    p    { color:#64748b; font-size:14px; margin:0 0 24px; }
    .card { background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
    table { width:100%; border-collapse:collapse; }
    thead td { background:#1e3a5f; color:#fff; padding:12px 16px; font-size:13px; font-weight:600; }
    tbody tr:hover { background:#f8faff; }
    .badge { display:inline-block; background:#dbeafe; color:#1d4ed8;
             border-radius:99px; padding:2px 12px; font-size:13px; font-weight:700; }
  </style>
</head>
<body>
  <h1>📊 Click Tracking Dashboard</h1>
  <p>รีเฟรชอัตโนมัติทุก 10 วินาที &nbsp;|&nbsp; คลิกทั้งหมด: <span class="badge">${clicks.length}</span></p>
  <div class="card">
    <table>
      <thead>
        <tr><td>#</td><td>ชื่อ</td><td>อีเมล</td><td>เวลาที่คลิก</td></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</body>
</html>`;
}

// Server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/track") {
    const name  = decodeURIComponent(url.searchParams.get("name")  || "");
    const email = decodeURIComponent(url.searchParams.get("email") || "");
    const clickedAt = new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });

    clicks.push({ name, email, clickedAt });
    console.log(`🖱  คลิก: ${name} <${email}> @ ${clickedAt}`);

    res.writeHead(302, { Location: "/thankyou" });
    res.end();
    return;
  }

  if (url.pathname === "/thankyou") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(thankYouPage);
    return;
  }

  if (url.pathname === "/dashboard") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(buildDashboard());
    return;
  }

  // Health check สำหรับ Railway
  if (url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`\n🚀 Tracker running on port ${PORT}`);
  console.log(`📊 Dashboard: /dashboard\n`);
});