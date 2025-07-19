import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2022-11-15" })

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json()
    if (!priceId) return NextResponse.json({ error: "priceId required" }, { status: 400 })

    const origin = req.headers.get("origin") ?? "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing?canceled=true`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("Stripe checkout error", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
} 