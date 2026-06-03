# phishing-email
phishing email test internal


# 📧 ระบบส่งอีเมลสวัสดิการอัตโนมัติ

Node.js + Nodemailer สำหรับส่งอีเมลแจ้งสวัสดิการพนักงานแบบอัตโนมัติ

## โครงสร้างไฟล์

```
email-auto/
├── index.js                    # จุดเริ่มต้น – แก้รายชื่อพนักงานที่นี่
├── mailer.js                   # บริการส่งอีเมล (Batch + single)
├── templates/
│   └── welfareEmail.js         # HTML template อีเมล
├── .env.example                # ตัวอย่างการตั้งค่า
└── README.md
```

## การติดตั้ง

```bash
npm install
cp .env.example .env
# แก้ไขค่าใน .env ให้ถูกต้อง
```

## การตั้งค่า (.env)

| ตัวแปร | คำอธิบาย |
|--------|-----------|
| `EMAIL_HOST` | SMTP host เช่น `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port เช่น `587` |
| `EMAIL_SECURE` | `true` = SSL (port 465), `false` = TLS (port 587) |
| `EMAIL_USER` | อีเมลผู้ส่ง |
| `EMAIL_PASS` | **App Password** (Gmail) หรือรหัสผ่าน SMTP |
| `EMAIL_FROM_NAME` | ชื่อที่แสดงในช่อง "จาก" |
| `EMAIL_FROM_ADDRESS` | อีเมลที่แสดงในช่อง "จาก" |
| `COMPANY_NAME` | ชื่อบริษัท |

### วิธีสร้าง App Password (Gmail)

1. เข้า [myaccount.google.com](https://myaccount.google.com)
2. ความปลอดภัย → การยืนยันตัวตน 2 ขั้นตอน (เปิดก่อน)
3. App Passwords → สร้างรหัสใหม่
4. คัดลอกรหัส 16 ตัวอักษรมาใส่ `EMAIL_PASS`

## การใช้งาน

```bash
# ส่งอีเมลทันที
npm start
```

## การเพิ่มพนักงาน

แก้ไขอาร์เรย์ `employees` ใน `index.js`:

```javascript
const employees = [
  { name: "ชื่อพนักงาน", email: "email@company.com" },
  // เพิ่มได้เรื่อยๆ...
];
```

> **Tip:** สำหรับพนักงานจำนวนมาก แนะนำให้โหลดจาก CSV หรือ database แทน

## SMTP Providers อื่นๆ

| Provider | HOST | PORT | SECURE |
|----------|------|------|--------|
| Gmail | smtp.gmail.com | 587 | false |
| Outlook/Office 365 | smtp.office365.com | 587 | false |
| Yahoo Mail | smtp.mail.yahoo.com | 465 | true |
| Zoho | smtp.zoho.com | 587 | false |
| SendGrid | smtp.sendgrid.net | 587 | false |