import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2022-11-15" })

export async function POST(req: Request) {
  try {
    const { customerId } = await req.json()
    if (!customerId) return NextResponse.json({ error: "customerId required" }, { status: 400 })

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: req.headers.get("origin") ?? "http://localhost:3000/billing",
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Stripe portal error", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
} 