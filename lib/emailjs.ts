import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export interface LeadEmailParams {
  name: string;
  email: string;
  useCases: string[];
  message?: string;
}

export async function sendLeadEmail(params: LeadEmailParams): Promise<void> {
  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      from_name: params.name || 'Anonymous',
      from_email: params.email,
      use_cases: params.useCases.join(', '),
      message: params.message || '',
      to_email: 'jeff@ripxg.com',
    },
    PUBLIC_KEY
  );
}
