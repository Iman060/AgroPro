# EmailJS Setup Instructions

To enable email functionality in the contact form, you need to set up EmailJS. Follow these steps:

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (free tier includes 200 emails/month)

## Step 2: Add Email Service

1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. Copy your **Service ID** (e.g., `service_xxxxx`)

## Step 3: Create Email Template

1. Go to **Email Templates** in your EmailJS dashboard
2. Click **Create New Template**
3. Use the following template:

**Template Name:** Contact Form

**Subject:** `{{subject}}`

**Content:**
```
Yeni mesaj alındı!

Ad: {{from_name}}
Email: {{from_email}}
Mövzu: {{subject}}

Mesaj:
{{message}}

---
Bu mesaj AgroPro İdarəetmə Sistemi vasitəsilə göndərilmişdir.
```

4. In the **To Email** field, enter: `omemmedzade@std.beu.edu.az`
5. Save the template
6. Copy your **Template ID** (e.g., `template_xxxxx`)

## Step 4: Get Public Key

1. Go to **Account** → **General** in your EmailJS dashboard
2. Find your **Public Key** (e.g., `xxxxxxxxxxxxx`)

## Step 5: Update Configuration

1. Open `src/config/emailjs.js`
2. Replace the placeholder values:

```javascript
export const emailjsConfig = {
  publicKey: 'YOUR_PUBLIC_KEY', // Replace with your Public Key
  serviceId: 'YOUR_SERVICE_ID', // Replace with your Service ID
  templateId: 'YOUR_TEMPLATE_ID', // Replace with your Template ID
  recipientEmail: 'omemmedzade@std.beu.edu.az', // Already set
};
```

## Step 6: Test

1. Start your development server: `npm run dev`
2. Navigate to the Contact page
3. Fill out and submit the form
4. Check the email inbox at `omemmedzade@std.beu.edu.az`

## Fallback Behavior

If EmailJS is not configured (still has placeholder values), the form will:
- Open the user's default email client with a pre-filled mailto link
- This ensures the form still works even without EmailJS setup

## Troubleshooting

- **Emails not sending**: Check that all IDs are correct in `emailjs.js`
- **Template variables not working**: Make sure template variable names match exactly (case-sensitive)
- **Rate limiting**: Free tier has 200 emails/month limit
- **CORS errors**: Make sure your domain is allowed in EmailJS settings

## Security Note

The Public Key is safe to expose in client-side code. EmailJS uses it for authentication but it's designed to be public. Never expose your Private Key if you upgrade to a paid plan.

