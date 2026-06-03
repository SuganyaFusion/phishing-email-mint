// index.js – จุดเริ่มต้นของโปรแกรม
require("dotenv").config();
const { sendBatch } = require("./mailer");

// ──────────────────────────────────────────────
// รายชื่อพนักงานที่ต้องการส่งอีเมล
// (ในโปรเจกต์จริง: โหลดจาก database หรือ CSV)
// ──────────────────────────────────────────────
const employees = [
  { name: "Suganya Photawin", email: "suganya@fusion.co.th" },
  // { name: "Thitiphol", email: "thitiphol@fusion.co.th" },
  { name: "Porramin Thaikla", email: "porramin@fusion.co.th" }

];

// วันที่มีผลบังคับใช้ของสวัสดิการ
const EFFECTIVE_DATE = "1 กรกฎาคม 2569";

// ──────────────────────────────────────────────
// รันโปรแกรม
// ──────────────────────────────────────────────
async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  📧 ระบบส่งอีเมลสวัสดิการอัตโนมัติ  ");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  บริษัท  : ${process.env.COMPANY_NAME || "(ไม่ได้ตั้งค่า)"}`);
  console.log(`  วันที่มีผล: ${EFFECTIVE_DATE}`);
  console.log(`  พนักงาน : ${employees.length} ท่าน`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  try {
    const results = await sendBatch(employees, EFFECTIVE_DATE, { delayMs: 500 });

    // ──────── สรุปผล ────────
    const sent = results.filter((r) => r.status === "sent").length;
    const failed = results.filter((r) => r.status === "failed").length;

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  📊 สรุปผลการส่ง");
    console.log(`  ✅ สำเร็จ  : ${sent} ฉบับ`);
    console.log(`  ❌ ล้มเหลว : ${failed} ฉบับ`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    if (failed > 0) {
      console.log("รายการที่ล้มเหลว:");
      results
        .filter((r) => r.status === "failed")
        .forEach((r) => console.log(`  - ${r.name} (${r.email}): ${r.error}`));
    }
  } catch (err) {
    console.error("\n🔴 เกิดข้อผิดพลาดร้ายแรง:", err.message);
    console.error("\nโปรดตรวจสอบ:");
    console.error("  1. ค่าใน .env (EMAIL_USER, EMAIL_PASS)");
    console.error("  2. เปิดใช้ App Password ใน Gmail (หรือ SMTP ของ provider อื่น)");
    console.error("  3. การเชื่อมต่ออินเทอร์เน็ต\n");
    process.exit(1);
  }
}

main();
