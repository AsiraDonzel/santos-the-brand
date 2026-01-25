import axios from "axios";

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    this.baseUrl = "https://api.paystack.co";

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  // Initialize transaction
  async initializeTransaction(email, amount, reference, metadata = {}) {
    try {
      const response = await this.axiosInstance.post(
        "/transaction/initialize",
        {
          email,
          amount: amount * 100, // Convert to kobo
          reference,
          metadata,
          callback_url: process.env.PAYSTACK_CALLBACK_URL,
        },
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(
        "Paystack initialize error:",
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.message || "Failed to initialize payment",
      };
    }
  }

  // Verify transaction
  async verifyTransaction(reference) {
    try {
      const response = await this.axiosInstance.get(
        `/transaction/verify/${reference}`,
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(
        "Paystack verify error:",
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.message || "Failed to verify payment",
      };
    }
  }

  // Create transfer recipient (for vendor payouts)
  async createTransferRecipient(name, accountNumber, bankCode, type = "nuban") {
    try {
      const response = await this.axiosInstance.post("/transferrecipient", {
        type,
        name,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: "NGN",
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(
        "Paystack create recipient error:",
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create recipient",
      };
    }
  }

  // Initiate transfer
  async initiateTransfer(recipientCode, amount, reason) {
    try {
      const response = await this.axiosInstance.post("/transfer", {
        source: "balance",
        amount: amount * 100,
        recipient: recipientCode,
        reason,
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(
        "Paystack transfer error:",
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.message || "Failed to initiate transfer",
      };
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(signature, body) {
    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha512", this.secretKey)
      .update(JSON.stringify(body))
      .digest("hex");

    return hash === signature;
  }
}


export default new PaystackService();