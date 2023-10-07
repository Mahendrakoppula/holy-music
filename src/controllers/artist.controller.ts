import secrets from '@/config/secrets';
import Artist from '@/models/users/artist.model';
import { sendSMS, verifyOTP } from '@/services/twilio.services';
import { UserStatus } from '@/typings/enums';
import cookieToken from '@/utils/cookie-token';
import CoffeeError from '@/utils/custom-error';
import toIND from '@/utils/to-ind';
import { NextFunction, Request, Response } from 'express';
import Play from '@/models/play.model';
import { bucket } from '@/databases';

type P = {
  rq: Request;
  rs: Response;
  n: NextFunction;
};

/**
 * Find All artist
 * @param req
 * @param res
 * @param next
 */

export const getAllartists = async (req: P['rq'], res: P['rs']) => {
  try {
    const artist = await Artist.find();
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json(error);
  }
};
/**
 * Find artist by ID
 * @param req
 * @param res
 * @param next
 */
export const getartistByName = async (req: P['rq'], res: P['rs']) => {
  try {
    const name = req.params;
    const artist = await Artist.find( name);
    console.log(artist)
    res.status(200).json(artist);

  } catch (error) {

    res.status(500).json("user not found");
  }
};
/**
 * Delete artist by ID
 * @param req
 * @param res
 * @param next
 */
export const deleteartistById = async (req: P['rq'], res: P['rs']) => {
  try {
    const artist = await Artist.deleteOne({ _id: req.params.artist_id });
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json(error);
  }
};
/**
 * Sign Up artist
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const signUp = async (req: P['rq'], res: P['rs'], next: P['n']) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !password) {
    return next(new CoffeeError('Required', 400));
  }
  try {
    /**
     * For Sending OTP to the artist phone
     */
    const india = toIND(phone);
    await sendSMS(india);
    const artist = await Artist.create({
      name,
      phone,
      password,

    });
    await cookieToken<typeof artist>(artist, res);
  } catch (error) {
    res.status(500).json(error);
  }
};
/**
 * Confirm OTP
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const confirmOTP = async (req: P['rq'], res: P['rs'], next: P['n']) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return next(new CoffeeError('OTP is required', 400));
  }
  try {
    const india = toIND(phone);
    const response = await verifyOTP(india, otp);
    if (response.status === UserStatus.APPROVED) {
      const artist = await Artist.findOneAndUpdate(
        { phone },
        { status: UserStatus.APPROVED },
        { new: true }
      );

      artist.save();
      res.status(200).json(artist);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
/**
 * Sign In artist
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const signIn = async (req: P['rq'], res: P['rs'], next: P['n']) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return next(new Error('Email and password Required '));
  }
  const artist = await Artist.findOne({ phone }).select('+password');
  console.log({ artist });
  if (!artist) {
    return next(new Error('Email and password not matched '));
  }
  const isCorrectPassword = await artist.checkValidPassword(password);
  if (!isCorrectPassword) {
    return next(new Error('Not Registered artist'));
  }
  await cookieToken(artist, res);

  // Retrieve recently played songs for the artist
  const artistId = artist._id;
  const artistRecentlyPlayed = await Play.find({ artistId }).sort({ timestamp: -1 });
  res.status(200).json({ artist, recentlyPlayed: artistRecentlyPlayed });

};

export const play = async (req, res) => {
  try {
    const { artistId, song } = req.body;

    // Log the recently played song
    const timestamp = new Date();
    const newSong = new Play({ artistId, song, timestamp });
    await newSong.save();

    res.status(200).json({ message: 'Song played and logged successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging the song' });
  }
};

// Retrieve a artist's recently played songs
// export const recentlyPlayed = async (req, res) => {
//   try {
//     const { artistId } = req.params;

//     // Retrieve recently played songs for the artist
//     const artistRecentlyPlayed = await Play.find({ artistId }).sort({ timestamp: -1 });

//     res.status(200).json({ artistRecentlyPlayed });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error retrieving recently played songs' });
//   }
// };

/**
 * Log Out artist
 * @param req
 * @param res
 * @param next
 */
export const logOut = async (req: P['rq'], res: P['rs'], next: P['n']) => {
  res.cookie(secrets.token, null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: 'Logout artist Successfully',
  });
};
/**
 * Forget Password
 */
export const forgetPassword = async (
  req: P['rq'],
  res: P['rs'],
  next: P['n']
) => {
  const { phone } = req.body;
  if (!phone) {
    return next(new Error('Email Required'));
  }
  const artist = await Artist.findOne({ phone });
  console.log({ artist });
  if (!artist) {
    return next(new Error('Email and password not matched '));
  }
  const token = await artist.getForgetPasswordToken();
  await artist.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: 'Reset Password Token Send to Your Email',
    token,
  });
};
/**
 * Reset Password
 */

export const resetPassword = async (
  req: P['rq'],
  res: P['rs'],
  next: P['n']
) => {
  const { password, token } = req.body;

  if (!password) {
    return next(new Error('Password Required'));
  }
  if (!token) {
    return next(new Error('Token Required'));
  }

  const artist = await Artist.findOne({
    forgetPasswordToken: token,
  });

  if (!artist) {
    return next(new Error('Invalid Token'));
  }
  artist.password = password;
  artist.forgetPasswordToken = undefined;
  artist.forgetPasswordExpiry = undefined;
  await artist.save();
  await cookieToken(artist, res, {
    message: 'Password Reset Successfully',
  });
};
