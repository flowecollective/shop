import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, fulfillment } = req.body;

    // Build line items from cart
    const line_items = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.name} - ${item.sub}`,
          description: `${item.line} · ${item.sz}`,
          images: [item.img],
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.qty,
    }));

    // Calculate if free shipping applies ($75+)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'https://shop.flowecollective.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://shop.flowecollective.com'}`,
      metadata: {
        fulfillment,
      },
    };

    // Add shipping options if shipping fulfillment
    if (fulfillment === 'shipping') {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['US'],
      };
      sessionConfig.shipping_options = [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: subtotal >= 75 ? 0 : 800, // Free over $75, else $8
              currency: 'usd',
            },
            display_name: subtotal >= 75 ? 'Free Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ];
    }

    // For local pickup, add a note
    if (fulfillment === 'pickup') {
      sessionConfig.custom_text = {
        submit: {
          message: 'Pickup at Flowe Collective, Houston, TX. You\'ll receive pickup details via email.',
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
}
