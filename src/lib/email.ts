import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getFrom() {
  return process.env.RESEND_FROM_EMAIL ?? "NexusVault <noreply@nexusvault.com>";
}

export async function sendPurchaseConfirmation(
  buyerEmail: string,
  productTitle: string,
  orderUrl: string
) {
  await getResend().emails.send({
    from: getFrom(),
    to: buyerEmail,
    subject: `Your purchase: ${productTitle}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #c084fc;">NexusVault</h1>
        <h2>Purchase Confirmed!</h2>
        <p>Thank you for purchasing <strong>${productTitle}</strong>.</p>
        <p>Access your delivery content here:</p>
        <a href="${orderUrl}" style="display: inline-block; background: #c084fc; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          View Your Order
        </a>
        <p style="color: #888; margin-top: 24px; font-size: 14px;">If you have any issues, contact the seller directly through NexusVault.</p>
      </div>
    `,
  });
}

export async function sendSellerNotification(
  sellerEmail: string,
  productTitle: string,
  amount: number
) {
  await getResend().emails.send({
    from: getFrom(),
    to: sellerEmail,
    subject: `New sale: ${productTitle}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #c084fc;">NexusVault</h1>
        <h2>You made a sale!</h2>
        <p>Someone just purchased <strong>${productTitle}</strong> for <strong>$${amount.toFixed(2)}</strong>.</p>
        <p>Check your seller dashboard for details.</p>
      </div>
    `,
  });
}
