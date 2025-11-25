import { stripe } from "./stripe";
import { updateStripeCustomerId } from "./users";

export async function handleStripeWebhook(event: any) {
  switch (event.type) {
    case "setup_intent.succeeded": {
      const setupIntent = event.data.object;

      const customerId = setupIntent.customer;
      const paymentMethodId = setupIntent.payment_method;

      console.log("Card added:", paymentMethodId);

      return;
    }

    default:
      console.log("Unhandled event:", event.type);
  }
}
