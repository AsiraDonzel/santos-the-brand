import nodemailer from "nodemailer";
import {Settings} from "../models/index.js"


class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOrderConfirmation(order) {
    try {
      const settings = await Settings.getSettings();

      const mailOptions = {
        from: `"${settings.storeName}" <${settings.storeEmail}>`,
        to: order.customerEmail,
        subject: `Order Confirmation: ${order.orderNumber}`,
        html: this.getOrderConfirmationTemplate(order, settings),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Order confirmation email sent to ${order.customerEmail}`);

      return true;
    } catch (error) {
      console.error("Send order confirmation error:", error);
      return false;
    }
  }

  async sendPaymentConfirmation(order) {
    try {
      const settings = await Settings.getSettings();

      const mailOptions = {
        from: `"${settings.storeName}" <${settings.storeEmail}>`,
        to: order.customerEmail,
        subject: `Payment Confirmed: ${order.orderNumber}`,
        html: this.getPaymentConfirmationTemplate(order, settings),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Payment confirmation email sent to ${order.customerEmail}`);

      return true;
    } catch (error) {
      console.error("Send payment confirmation error:", error);
      return false;
    }
  }

  async sendOrderStatusUpdate(order, oldStatus, newStatus) {
    try {
      const settings = await Settings.getSettings();

      const mailOptions = {
        from: `"${settings.storeName}" <${settings.storeEmail}>`,
        to: order.customerEmail,
        subject: `Order Update: ${order.orderNumber}`,
        html: this.getOrderStatusUpdateTemplate(
          order,
          oldStatus,
          newStatus,
          settings,
        ),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Order status update email sent to ${order.customerEmail}`);

      return true;
    } catch (error) {
      console.error("Send order status update error:", error);
      return false;
    }
  }

  async sendAdminNotification(subject, message) {
    try {
      const settings = await Settings.getSettings();

      const mailOptions = {
        from: `"${settings.storeName}" <${settings.storeEmail}>`,
        to: settings.storeEmail,
        subject: subject,
        text: message,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Send admin notification error:", error);
      return false;
    }
  }

  // Email templates
  getOrderConfirmationTemplate(order, settings) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .order-details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank you for your order!</h1>
            <p>Order #${order.orderNumber}</p>
          </div>
          
          <div class="content">
            <p>Hi ${order.customerName},</p>
            <p>We've received your order and it's being processed. Here are your order details:</p>
            
            <div class="order-details">
              <h3>Order Summary</h3>
              ${order.items
                .map(
                  (item) => `
                <p>${item.quantity}x ${item.title} - ₦${item.price * item.quantity}</p>
              `,
                )
                .join("")}
              <hr>
              <p><strong>Total: ₦${order.totalAmount}</strong></p>
              <p>Payment Method: ${order.paymentMethod}</p>
              <p>Status: ${order.orderStatus}</p>
            </div>
            
            <h3>Shipping Address</h3>
            <p>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
              ${order.shippingAddress.country} ${order.shippingAddress.postalCode}
            </p>
            
            <p>You can track your order status using this link:</p>
            <p>
              <a href="${process.env.FRONTEND_URL}/track-order/${order.orderNumber}" class="button">
                Track Your Order
              </a>
            </p>
            
            <p>If you have any questions, please reply to this email.</p>
            <p>Best regards,<br>The ${settings.storeName} Team</p>
          </div>
          
          <div class="footer">
            <p>${settings.storeName}</p>
            <p>${settings.contactPhone ? `Phone: ${settings.contactPhone}` : ""}</p>
            <p>© ${new Date().getFullYear()} ${settings.storeName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPaymentConfirmationTemplate(order, settings) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .payment-details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmed!</h1>
            <p>Order #${order.orderNumber}</p>
          </div>
          
          <div class="content">
            <p>Hi ${order.customerName},</p>
            <p>We're pleased to confirm that your payment of <strong>₦${order.totalAmount}</strong> has been received successfully.</p>
            
            <div class="payment-details">
              <h3>Payment Details</h3>
              <p>Amount: ₦${order.totalAmount}</p>
              <p>Payment Method: ${order.paymentMethod}</p>
              <p>Status: ${order.paymentStatus}</p>
              <p>Date: ${new Date(order.updatedAt).toLocaleDateString()}</p>
            </div>
            
            <p>Your order is now being processed and will be shipped soon.</p>
            <p>You'll receive another email with tracking information once your order ships.</p>
            
            <p>Thank you for shopping with us!</p>
            <p>Best regards,<br>The ${settings.storeName} Team</p>
          </div>
          
          <div class="footer">
            <p>${settings.storeName}</p>
            <p>© ${new Date().getFullYear()} ${settings.storeName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getOrderStatusUpdateTemplate(order, oldStatus, newStatus, settings) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #17a2b8; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .status-box { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { background: #17a2b8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Status Updated</h1>
            <p>Order #${order.orderNumber}</p>
          </div>
          
          <div class="content">
            <p>Hi ${order.customerName},</p>
            <p>The status of your order has been updated.</p>
            
            <div class="status-box">
              <h3>Status Update</h3>
              <p><strong>From:</strong> ${oldStatus}</p>
              <p><strong>To:</strong> ${newStatus}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p>Order Details:</p>
            <ul>
              ${order.items
                .map(
                  (item) => `
                <li>${item.quantity}x ${item.title}</li>
              `,
                )
                .join("")}
            </ul>
            
            <p>Total: ₦${order.totalAmount}</p>
            
            ${
              newStatus === "shipped"
                ? `
              <p>Your order has been shipped! You'll receive tracking information soon.</p>
            `
                : ""
            }
            
            ${
              newStatus === "delivered"
                ? `
              <p>Your order has been delivered! We hope you enjoy your purchase.</p>
              <p>Please consider leaving a review for your products.</p>
            `
                : ""
            }
            
            <p>
              <a href="${process.env.FRONTEND_URL}/track-order/${order.orderNumber}" class="button">
                View Order Details
              </a>
            </p>
            
            <p>If you have any questions, please reply to this email.</p>
            <p>Best regards,<br>The ${settings.storeName} Team</p>
          </div>
          
          <div class="footer">
            <p>${settings.storeName}</p>
            <p>${settings.contactPhone ? `Phone: ${settings.contactPhone}` : ""}</p>
            <p>© ${new Date().getFullYear()} ${settings.storeName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendNewsletterTest(email, subject, content, settings) {
    try {
      const mailOptions = {
        from: `"${settings.storeName}" <${settings.storeEmail}>`,
        to: email,
        subject: `[TEST] ${subject}`,
        html: this.getNewsletterTemplate(content, settings, true),
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Send newsletter test error:", error);
      throw error;
    }
  }

  async sendNewsletter(email, name, subject, content, settings, trackingId) {
    try {
      const mailOptions = {
        from: `"${settings.storeName}" <${settings.storeEmail}>`,
        to: name ? `"${name}" <${email}>` : email,
        subject: subject,
        html: this.getNewsletterTemplate(content, settings, false, trackingId),
        headers: {
          "List-Unsubscribe": `<mailto:${settings.storeEmail}?subject=unsubscribe>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Send newsletter error:", error);
      throw error;
    }
  }

  getNewsletterTemplate(content, settings, isTest = false, trackingId = null) {
    const unsubscribeLink = `${process.env.FRONTEND_URL}/unsubscribe?email=SUBSCRIBER_EMAIL`;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${settings.storeName} Newsletter</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee; }
        .unsubscribe { text-align: center; margin-top: 30px; font-size: 11px; color: #999; }
        .test-banner { background: #ffc107; color: #856404; padding: 10px; text-align: center; font-weight: bold; }
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${isTest ? '<div class="test-banner">TEST EMAIL - NOT FOR PRODUCTION</div>' : ""}
        
        <div class="header">
          <h1>${settings.storeName}</h1>
          <p>Newsletter</p>
        </div>
        
        <div class="content">
          ${content}
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${settings.storeName}. All rights reserved.</p>
          <p>${settings.contactPhone ? `Phone: ${settings.contactPhone}` : ""}</p>
          ${
            settings.socialLinks
              ? `
            <p>
              ${settings.socialLinks.facebook ? `<a href="${settings.socialLinks.facebook}">Facebook</a> | ` : ""}
              ${settings.socialLinks.instagram ? `<a href="${settings.socialLinks.instagram}">Instagram</a> | ` : ""}
              ${settings.socialLinks.twitter ? `<a href="${settings.socialLinks.twitter}">Twitter</a>` : ""}
            </p>
          `
              : ""
          }
        </div>
        
        <div class="unsubscribe">
          <p>
            You received this email because you subscribed to our newsletter.
            <br>
            <a href="${unsubscribeLink}">Unsubscribe</a> from future emails.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  }

}


export default new EmailService();