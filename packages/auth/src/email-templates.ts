export function verificationEmail(url: string) {
  return `
<!DOCTYPE html>
<html>
  <body style="background:#0a0804;color:#d4c5a9;font-family:sans-serif;padding:40px;">
    <h1 style="color:#c8922a;font-size:24px;margin-bottom:16px;">Verify your Frontline account</h1>
    <p style="margin-bottom:24px;">Click the link below to verify your email and join the front.</p>
    <a href="${url}" style="background:#c8922a;color:#0a0804;padding:12px 24px;text-decoration:none;font-weight:bold;display:inline-block;">
      VERIFY EMAIL
    </a>
    <p style="margin-top:24px;color:#6b6050;font-size:12px;">Link expires in 24 hours. If you didn't create an account, ignore this email.</p>
  </body>
</html>`
}

export function resetPasswordEmail(url: string) {
  return `
<!DOCTYPE html>
<html>
  <body style="background:#0a0804;color:#d4c5a9;font-family:sans-serif;padding:40px;">
    <h1 style="color:#c8922a;font-size:24px;margin-bottom:16px;">Reset your Frontline password</h1>
    <p style="margin-bottom:24px;">Click the link below to set a new password.</p>
    <a href="${url}" style="background:#c8922a;color:#0a0804;padding:12px 24px;text-decoration:none;font-weight:bold;display:inline-block;">
      RESET PASSWORD
    </a>
    <p style="margin-top:24px;color:#6b6050;font-size:12px;">Link expires in 1 hour. If you didn't request this, ignore this email.</p>
  </body>
</html>`
}
