import twilio from 'twilio';
import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_SERVICE_SID,
} from '@/config';

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

export const sendSMS = async (mobile: string) => {
  const response = await client.verify.v2
    .services(TWILIO_SERVICE_SID)
    .verifications.create({
      to: mobile,
      channel: 'sms',
    });
  return response;
};

export const verifyOTP = async (mobile: string, otp: string) => {
  const response = await client.verify.v2
    .services(TWILIO_SERVICE_SID)
    .verificationChecks.create({
      to: mobile,
      code: otp,
    });
  return response;
};
