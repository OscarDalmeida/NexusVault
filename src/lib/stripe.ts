import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-05-27.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export function getCommissionRate(): number {
  return parseFloat(process.env.PLATFORM_COMMISSION_RATE ?? "0.10");
}

export function calculateFees(price: number) {
  const rate = getCommissionRate();
  const platformFee = Math.round(price * rate * 100) / 100;
  const sellerAmount = Math.round((price - platformFee) * 100) / 100;
  return { platformFee, sellerAmount };
}
