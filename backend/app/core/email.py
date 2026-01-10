# core/email.py
import os
import logging
from typing import List
from pydantic import EmailStr
import httpx
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

logger = logging.getLogger(__name__)

EMAIL_PROVIDER = os.getenv("EMAIL_PROVIDER", "smtp").lower()
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
RESEND_API_URL = "https://api.resend.com/emails"


conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM", "rahisishatech@gmail.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 465)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


async def _send_email_smtp(subject: str, recipients: List[EmailStr], body: str):
    """Sends an email using the configured SMTP server."""
    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=body,
        subtype="html",
    )
    fm = FastMail(conf)
    try:
        logger.info(f"Sending email via SMTP with subject '{subject}' to {recipients}")
        await fm.send_message(message)
        logger.info(f"Email to {recipients} sent successfully via SMTP.")
    except Exception as e:
        logger.error(f"SMTP email send failed: {e}", exc_info=True)

async def _send_email_resend(subject: str, recipients: List[EmailStr], body: str):
    """Sends an email using the Resend API."""
    if not RESEND_API_KEY:
        logger.error("RESEND_API_KEY is not set. Cannot send email via Resend.")
        return

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "from": os.getenv("MAIL_FROM", "noreply@yourdomain.com"),
        "to": recipients,
        "subject": subject,
        "html": body,
    }

    async with httpx.AsyncClient() as client:
        try:
            logger.info(f"Sending email via Resend with subject '{subject}' to {recipients}")
            response = await client.post(RESEND_API_URL, json=payload, headers=headers)
            response.raise_for_status()
            logger.info(f"Email to {recipients} sent successfully via Resend.")
        except httpx.HTTPStatusError as e:
            logger.error(
                f"Resend API request failed with status {e.response.status_code}: {e.response.text}",
                exc_info=True
            )
        except Exception as e:
            logger.error(f"An unexpected error occurred when sending email via Resend: {e}", exc_info=True)

async def send_email(subject: str, recipients: List[EmailStr], body: str):
    if EMAIL_PROVIDER == 'resend':
        await _send_email_resend(subject, recipients, body)
    else:
        await _send_email_smtp(subject, recipients, body)



async def send_password_reset_email(email: str, token: str):
    frontend_domain = os.getenv("FRONTEND_URL", "http://localhost:8080")
    logger.debug(f"FRONTEND_URL from env: {frontend_domain}")
    reset_link = f"{frontend_domain}/reset-password?token={token}"

    subject = "Reset your password"
    body = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
    </head>
    <body>
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Reset Your Password</h2>
            <p>Please click the link below to reset your password:</p>
            <p>
                <a href="{reset_link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
            <hr>
            <p style="font-size: 0.8em; color: #888;">If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
            <p style="font-size: 0.8em; color: #888; word-break: break-all;">{reset_link}</p>
        </div>
    </body>
    </html>
    """

    await send_email(subject, [email], body)


async def send_verification_email(email: str, token: str):
    frontend_domain = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:8080")
    verification_link = f"{frontend_domain}/verify-email?token={token}"

    subject = "Verify your email address"
    body = f"""
    <html>
        <body>
            <h3>Verify your email</h3>
            <p>Please click the link below to verify your email address:</p>
            <p><a href="{verification_link}">Verify Email</a></p>
            <p>This link will expire in 24 hours.</p>
        </body>
    </html>
    """

    await send_email(subject, [email], body)
