require("dotenv").config();
const nodemailer = require("nodemailer");

const TRACKER_HOST = process.env.TRACKER_HOST || "http://localhost:3000";

// ── Transporter (Gmail) ──────────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4,
    auth: {
      user: process.env.OUTLOOK_EMAIL,
      pass: process.env.OUTLOOK_PASSWORD,
    },
  });
}

// ── HTML Template (welfare) ───────────────────────────────────────────────────
function buildWelfareEmailHtml(recipient) {
  const companyName = process.env.COMPANY_NAME || "บริษัท ABC จำกัด";
  const effectiveDate = process.env.EFFECTIVE_DATE || "1 กรกฎาคม 2568";
  const trackUrl = `${TRACKER_HOST}/track?name=${encodeURIComponent(recipient.name)}&email=${encodeURIComponent(recipient.email)}`;

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>แจ้งสวัสดิการเพิ่มเติม – ${companyName}</title>
</head>
<body style="margin:0; padding:0; background:#EEF2FF; font-family:'Sarabun','Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px; width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1E3A5F 0%,#2563EB 100%);
                        border-radius:16px 16px 0 0; padding:40px 40px 32px; text-align:center;">
              <div style="display:inline-block; background:rgba(255,255,255,0.15);
                          border-radius:50%; padding:16px; margin-bottom:16px; font-size:36px;">🎁</div>
              <h1 style="margin:0 0 8px; color:#ffffff; font-size:26px; font-weight:800; letter-spacing:-0.3px;">
                ประกาศสวัสดิการใหม่ ปี 2569 🎉
              </h1>
              <p style="margin:0; color:#BFDBFE; font-size:15px;">มีผลตั้งแต่วันที่ ${effectiveDate}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#F8FAFF; padding:36px 40px;">

              <p style="margin:0 0 8px; color:#1E3A5F; font-size:16px; font-weight:600;">
                เรียน คุณ${recipient.name}
              </p>
              <p style="margin:0 0 28px; color:#475569; font-size:15px; line-height:1.8;">
                ${companyName} มีความยินดีประกาศสวัสดิการเพิ่มเติมสำหรับพนักงานทุกท่าน
                เพื่อส่งเสริมคุณภาพชีวิตและความเป็นอยู่ที่ดีในการทำงาน
                สวัสดิการทั้งหมดมีผลบังคับใช้ตั้งแต่ <strong style="color:#2563EB;">${effectiveDate}</strong> เป็นต้นไป
              </p>

              <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px;">
                <div style="height:3px; flex:1; background:linear-gradient(90deg,#2563EB,transparent);"></div>
                <span style="color:#1E3A5F; font-weight:700; font-size:15px; white-space:nowrap;">✨ สวัสดิการที่ได้รับเพิ่มเติม</span>
                <div style="height:3px; flex:1; background:linear-gradient(270deg,#2563EB,transparent);"></div>
              </div>

              <!-- Benefits -->
              ${[
                ["🏥","ประกันสุขภาพกลุ่ม","บริษัทเพิ่มวงเงินคุ้มครองจาก 200,000 บาท เป็น <strong>500,000 บาท/ปี</strong> รวมค่ารักษาผู้ป่วยใน-นอก และทันตกรรม"],
                ["💰","กองทุนสำรองเลี้ยงชีพ (PVD)","บริษัทเพิ่มอัตราสมทบจาก 5% เป็น <strong>10%</strong> ของเงินเดือน มีผลทันทีสำหรับพนักงานที่ผ่านทดลองงาน"],
                ["🏖️","วันลาพักร้อน","เพิ่มวันลาพักร้อนเป็น <strong>15 วัน/ปี</strong> (จากเดิม 10 วัน) และสามารถสะสมข้ามปีได้สูงสุด 30 วัน"],
                ["🤱","ลาคลอดบุตร","มารดา <strong>98 วัน</strong> (ได้รับเงินเดือนเต็ม 60 วัน) และบิดา <strong>15 วัน</strong> ได้รับเงินเดือนเต็ม"],
                ["📚","ทุนพัฒนาทักษะ","สนับสนุนค่าอบรม/คอร์สออนไลน์ <strong>15,000 บาท/ปี</strong> และสนับสนุนค่าสอบใบรับรองวิชาชีพ 100%"],
                ["🍽️","เบี้ยเลี้ยงอาหาร","เพิ่มเบี้ยเลี้ยงอาหารกลางวันเป็น <strong>100 บาท/วัน</strong> จ่ายผ่าน E-Voucher ทุกต้นเดือน"],
                ["🏠","Work From Home","นโยบาย Hybrid Work ทำงานจากบ้านได้ <strong>3 วัน/สัปดาห์</strong> พร้อมเบี้ยเลี้ยงอินเทอร์เน็ต 500 บาท/เดือน"],
                ["🎂","วันเกิด","วันหยุดพิเศษ <strong>1 วัน</strong> ในเดือนเกิด พร้อมของขวัญจากบริษัท มูลค่า 1,000 บาท"],
              ].map(([icon, title, desc]) => `
              <div style="background:#ffffff; border-radius:12px; padding:20px 24px; margin-bottom:16px;
                          box-shadow:0 2px 8px rgba(0,0,0,0.06); border-left:4px solid #2563EB;">
                <div style="display:flex; align-items:flex-start; gap:16px;">
                  <div style="font-size:32px; line-height:1; flex-shrink:0;">${icon}</div>
                  <div>
                    <div style="font-weight:700; color:#1E3A5F; font-size:15px; margin-bottom:6px;">${title}</div>
                    <div style="color:#475569; font-size:14px; line-height:1.6;">${desc}</div>
                  </div>
                </div>
              </div>`).join("")}

              <!-- CTA with tracking -->
              <div style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE); border-radius:12px;
                          padding:24px 28px; margin-top:28px; text-align:center; border:1px solid #BFDBFE;">
                <p style="margin:0 0 4px; color:#1E3A5F; font-weight:700; font-size:15px;">
                  📋 ดูรายละเอียดฉบับเต็มได้ที่
                </p>
                <p style="margin:0 0 16px; color:#64748B; font-size:13px;">
                  กรุณายืนยันสิทธิ์ผ่านปุ่มด้านล่าง เพื่อรับทราบและยอมรับสวัสดิการใหม่ของบริษัท
                </p>
                <a href="${trackUrl}" style="display:inline-block; background:#2563EB; color:#ffffff;
                                    text-decoration:none; padding:12px 32px; border-radius:8px;
                                    font-weight:700; font-size:14px; letter-spacing:0.3px;">
                  ยืนยันสิทธิ์ →
                </a>
              </div>

              <p style="margin:24px 0 0; color:#94A3B8; font-size:13px; line-height:1.7; text-align:center;">
                หากมีข้อสงสัยเพิ่มเติม กรุณาติดต่อ HR ได้ที่<br>
                📧 hr@fusion.co.th &nbsp;|&nbsp; 📞 02-965-8006-8 
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1E3A5F; border-radius:0 0 16px 16px; padding:24px 40px; text-align:center;">
              <p style="margin:0 0 4px; color:#BFDBFE; font-size:13px; font-weight:600;">${companyName}</p>
              <p style="margin:0; color:#64748B; font-size:12px;">
                อีเมลฉบับนี้ส่งโดยอัตโนมัติ กรุณาอย่าตอบกลับโดยตรง
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── ส่งอีเมล ──────────────────────────────────────────────────────────────────
async function sendWelfareEmail(transporter, recipient) {
  const companyName = process.env.COMPANY_NAME || "บริษัท ABC จำกัด";
  const effectiveDate = process.env.EFFECTIVE_DATE || "1 กรกฎาคม 2568";

  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || "ฝ่าย HR"}" <${process.env.OUTLOOK_EMAIL}>`,
    to: `"${recipient.name}" <${recipient.email}>`,
    subject: `🎁 [${companyName}] ประกาศสวัสดิการใหม่ มีผลตั้งแต่ ${effectiveDate}`,
    html: buildWelfareEmailHtml(recipient),
  });
  return info.messageId;
}

// ── Batch ──────────────────────────────────────────────────────────────────────
async function sendBatch(recipients, _effectiveDate, options = {}) {
  const { delayMs = 500 } = options;
  const transporter = createTransporter();

  await transporter.verify();
  console.log("✅ เชื่อมต่อ SMTP สำเร็จ\n");

  const results = [];
  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    const progress = `[${i + 1}/${recipients.length}]`;
    try {
      const msgId = await sendWelfareEmail(transporter, recipient);
      results.push({ ...recipient, status: "sent", messageId: msgId });
      console.log(`${progress} ✔ ส่งถึง ${recipient.name} <${recipient.email}>`);
    } catch (err) {
      results.push({ ...recipient, status: "failed", error: err.message });
      console.error(`${progress} ✖ ล้มเหลว ${recipient.email} → ${err.message}`);
    }
    if (i < recipients.length - 1 && delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return results;
}

module.exports = { sendBatch, sendWelfareEmail, createTransporter };