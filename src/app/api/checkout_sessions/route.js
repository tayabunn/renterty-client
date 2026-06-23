import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe'

export async function POST(req) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Extract dynamic form fields or query params
    let amount = 100;
    let propertyId = '65f1a2b3c4d5e6f7a8b9c0d1';
    let propertyTitle = 'Renterty Property Reservation';
    let moveInDate = new Date().toISOString().split('T')[0];
    let contactNumber = '1234567890';
    let additionalNotes = 'Stripe Checkout Booking';
    let tenantEmail = '';

    try {
      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
        const formData = await req.formData();
        amount = Number(formData.get('amount')) || amount;
        propertyId = formData.get('propertyId') || propertyId;
        propertyTitle = formData.get('propertyTitle') || propertyTitle;
        moveInDate = formData.get('moveInDate') || moveInDate;
        contactNumber = formData.get('contactNumber') || contactNumber;
        additionalNotes = formData.get('additionalNotes') || additionalNotes;
        tenantEmail = formData.get('tenantEmail') || tenantEmail;
      } else if (contentType.includes('application/json')) {
        const body = await req.json();
        amount = Number(body.amount) || amount;
        propertyId = body.propertyId || propertyId;
        propertyTitle = body.propertyTitle || propertyTitle;
        moveInDate = body.moveInDate || moveInDate;
        contactNumber = body.contactNumber || contactNumber;
        additionalNotes = body.additionalNotes || additionalNotes;
        tenantEmail = body.tenantEmail || tenantEmail;
      }
    } catch (e) {
      console.warn('Could not parse request body for checkout session:', e.message);
    }

    // Create Checkout Session options with dynamic line items using price_data
    const sessionOpts = {
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: propertyTitle,
            },
            unit_amount: Math.round(amount * 100), // Stripe amount is in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?tx={CHECKOUT_SESSION_ID}&amount=${amount}&title=${encodeURIComponent(propertyTitle)}&propertyId=${propertyId}&moveInDate=${moveInDate}&contactNumber=${contactNumber}&additionalNotes=${encodeURIComponent(additionalNotes)}&tenantEmail=${encodeURIComponent(tenantEmail)}&checkout_flow=true`,
      cancel_url: `${origin}/properties/${propertyId}`,
    };

    // Pre-fill tenant email if available
    if (tenantEmail) {
      sessionOpts.customer_email = tenantEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionOpts);

    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}