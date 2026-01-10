'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/lib/use-toast';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
    const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');
  const [showResend, setShowResend] = useState(false);
  const [email, setEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
    const { toast } = useToast();
  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (verificationAttempted.current) {
      return;
    }

    if (!token) {
      setStatus('error');
      setMessage('Verification token not found.');
      return;
    }

    const verifyToken = async () => {
      verificationAttempted.current = true;
      try {
        await api.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified. You can now log in.');
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || 'An error occurred during verification.';
        setStatus('error');
        setMessage(errorMessage);
        if (errorMessage.includes('Invalid') || errorMessage.includes('expired')) {
          setShowResend(true);
        }
      }
    };

    verifyToken();
  }, [token]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    setIsResending(true);
    try {
      await api.resendVerificationEmail(email);
      toast({
        title: "Success",
        description: "A new verification email has been sent. Please check your inbox.",
      });
      setResendCooldown(60);
      setShowResend(false);
      setMessage('A new verification email has been sent. Please check your inbox.');
      setStatus('info');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to resend verification email.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Email Verification</h2>
        <div className={`p-4 rounded-md text-center ${status === 'success' ? 'bg-green-100 text-green-700' : status === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
          {message}
        </div>
                {status === 'success' && (
          <Link href="/login" className="block w-full px-4 py-2 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Go to Login
          </Link>
        )}
        {showResend && (
          <div className="space-y-4 pt-4 border-t">
            <p className="text-sm text-center">Enter your email to resend the verification link.</p>
            <Input
              type="email"
              placeholder="your.email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isResending}
            />
            <Button
              onClick={handleResendVerification}
              disabled={isResending || resendCooldown > 0}
              className="w-full"
            >
              {isResending
                ? 'Sending...'
                : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : 'Resend Verification Email'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
