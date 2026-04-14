import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { name, surname, email, phone, message, workTitle, workId } = await req.json()

  if (!name || !email || !phone) {
    return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'ivancosharnii@gmail.com',
      subject: `[ДЛЯ КЛИЕНТА] Заявка на работу: ${workTitle}`,
      html: `
        <h2>Новая заявка с сайта</h2>
        <p><b>Работа:</b> ${workTitle}</p>
        <p><b>Имя:</b> ${name} ${surname}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Телефон:</b> ${phone}</p>
        ${message ? `<p><b>Сообщение:</b> ${message}</p>` : ''}
        <hr/>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://danil-swart.vercel.app'}/work/${workId}">Посмотреть работу</a></p>
      `,
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка отправки' }, { status: 500 })
  }
}
