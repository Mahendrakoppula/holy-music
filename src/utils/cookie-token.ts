import secrets from '@/config/secrets';
import { Response } from 'express';

const cookieToken = async <U>(user: U | any, res: Response, rest = {}) => {
  const token = await user.getJwtToken();
  const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  user.password = undefined;
  res
    .status(200)
    .cookie(secrets.token, token, options);

    return token;
};

// const cookieToken = async <U>(user: U | any, res: Response, rest = {}) => {
//   const token = await user.getJwtToken();
//   const options = {
//     expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//   };
//   user.password = undefined;
//   res
//     .status(200)
//     .cookie(secrets.token, token, options)
//     .json({
//       success: true,
//       token: token,
//       user: user,
//       ...rest,
//     });
// };

export default cookieToken;
