function toIND(phone: string) {
  // Validate the mobile number
  var regex = /^[6789]\d{9}$/;
  if (!regex.test(phone)) {
    return null;
  }

  // Remove the leading zeros
  phone = phone.replace(/^0+/, '');

  // Format the mobile number
  var formattedNumber = '+91' + phone.slice(0, 3) + phone.slice(3);

  return formattedNumber;
}

export default toIND;
