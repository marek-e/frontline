export async function sendEmail({
  apiKey,
  to,
  subject,
  html,
}: {
  apiKey: string
  to: string
  subject: string
  html: string
}) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Frontline <onboarding@resend.dev>',
      to,
      subject,
      html,
    }),
  })
}
