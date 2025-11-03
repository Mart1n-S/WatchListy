import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import fr from "@/app/[locale]/messages/fr.json";
import en from "@/app/[locale]/messages/en.json";

export async function sendResetPasswordEmail(
  email: string,
  token: string,
  locale: string = "fr"
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/reset-password/${token}`;

  // Sélection des traductions depuis les fichiers JSON
  const messages = locale === "en" ? en : fr;
  const t = messages.auth?.reset?.email;

  if (!t) {
    console.warn("⚠️ Traductions d'e-mail manquantes pour la locale :", locale);
  }

  const html = `
  <div style="background-color: #f9fafb; padding: 40px 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
      <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 20px; margin: 0;">Watchlisty</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #111827; font-size: 22px; margin-bottom: 16px;">${t.title}</h2>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          ${t.intro}
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}"
             style="background-color: #4f46e5; color: #ffffff; text-decoration: none;
                    padding: 12px 24px; border-radius: 6px; display: inline-block;
                    font-weight: 600; font-size: 16px;" target="_blank">
            ${t.button}
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">${t.expiry}</p>
        <p style="margin-top: 32px; color: #111827;">${t.footer}</p>
      </div>
      <div style="background-color: #f3f4f6; text-align: center; padding: 16px;">
        <p style="color: #9ca3af; font-size: 13px; margin: 0;">
          © ${new Date().getFullYear()} Watchlisty. ${t.rights}
        </p>
      </div>
    </div>
  </div>
  `;

  try {
    const apiInstance = new TransactionalEmailsApi();
    apiInstance.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!
    );

    await apiInstance.sendTransacEmail({
      sender: { email: process.env.BREVO_EMAIL_ADDRESS!, name: "Watchlisty" },
      to: [{ email }],
      subject: t.subject,
      htmlContent: html,
    });

    console.log(`Email de réinitialisation envoyé (${locale}) à`, email);
  } catch (error) {
    console.error("Erreur lors de l’envoi de l’e-mail de réinitialisation :", error);
    throw new Error("auth.reset.errors.emailSendFailed");
  }
}
