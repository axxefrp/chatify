import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate, createPasswordResetEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Chatify!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome Email sent successfully", data);
};

export const sendPasswordResetEmail = async (email, name, resetURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Reset Your Chatify Password",
    html: createPasswordResetEmailTemplate(name, resetURL),
  });

  if (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }

  console.log("Password Reset Email sent successfully", data);
};
