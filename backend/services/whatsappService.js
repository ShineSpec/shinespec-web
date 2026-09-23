import axios from "axios";

/**
 * Send WhatsApp message using various providers
 * Supports: Twilio, WhatsApp Business API, or custom webhook
 */
export const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    // Format phone number (remove spaces, ensure it starts with country code)
    let formattedPhone = phoneNumber.replace(/\s+/g, "").replace(/^0/, "+27");
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+27${formattedPhone}`;
    }

    // Check which WhatsApp service is configured
    const whatsappProvider = process.env.WHATSAPP_PROVIDER || "webhook"; // Options: "twilio", "webhook", "chatapi"

    switch (whatsappProvider) {
      case "twilio":
        return await sendViaTwilio(formattedPhone, message);
      
      case "chatapi":
        return await sendViaChatAPI(formattedPhone, message);
      
      case "webhook":
      default:
        return await sendViaWebhook(formattedPhone, message);
    }
  } catch (error) {
    console.error("WhatsApp send error:", error);
    throw new Error(`Failed to send WhatsApp message: ${error.message}`);
  }
};

/**
 * Send via Twilio WhatsApp API
 */
const sendViaTwilio = async (phoneNumber, message) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Format: whatsapp:+14155238886

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error("Twilio credentials not configured");
  }

  const response = await axios.post(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    new URLSearchParams({
      From: fromNumber,
      To: `whatsapp:${phoneNumber}`,
      Body: message,
    }),
    {
      auth: {
        username: accountSid,
        password: authToken,
      },
    }
  );

  return {
    success: true,
    messageId: response.data.sid,
    provider: "twilio",
  };
};

/**
 * Send via ChatAPI (https://chatapi.com/)
 */
const sendViaChatAPI = async (phoneNumber, message) => {
  const apiUrl = process.env.CHATAPI_URL || "https://api.chatapi.com/instance12345/sendMessage";
  const apiToken = process.env.CHATAPI_TOKEN;

  if (!apiToken) {
    throw new Error("ChatAPI token not configured");
  }

  const response = await axios.post(
    apiUrl,
    {
      phone: phoneNumber,
      body: message,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
    }
  );

  return {
    success: true,
    messageId: response.data.id,
    provider: "chatapi",
  };
};

/**
 * Send via custom webhook (most flexible - you can use any WhatsApp service)
 * Configure your webhook URL in .env as WHATSAPP_WEBHOOK_URL
 */
const sendViaWebhook = async (phoneNumber, message) => {
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;

  if (!webhookUrl) {
    // If no webhook configured, log the message (for development)
    console.log("📱 WhatsApp Message (Webhook not configured):");
    console.log(`To: ${phoneNumber}`);
    console.log(`Message: ${message}`);
    console.log("\n⚠️  To enable WhatsApp, set WHATSAPP_WEBHOOK_URL in .env");
    console.log("Example: https://your-whatsapp-service.com/api/send");
    
    // Return success in development mode so the flow continues
    return {
      success: true,
      messageId: "dev-mode",
      provider: "webhook-dev",
      note: "Webhook not configured - message logged to console",
    };
  }

  const response = await axios.post(
    webhookUrl,
    {
      phone: phoneNumber,
      message: message,
      type: "text",
    },
    {
      headers: {
        "Content-Type": "application/json",
        ...(process.env.WHATSAPP_WEBHOOK_TOKEN && {
          Authorization: `Bearer ${process.env.WHATSAPP_WEBHOOK_TOKEN}`,
        }),
      },
    }
  );

  return {
    success: true,
    messageId: response.data?.id || response.data?.messageId || "sent",
    provider: "webhook",
  };
};

/**
 * Generate a 6-digit verification code
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
