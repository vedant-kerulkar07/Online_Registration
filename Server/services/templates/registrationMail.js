export const registrationMailTemplate = ({
  firstName,
  lastName,
  weightCategory,
  amount,
}) => {
  return {
    subject: "Registration Successful - Ahilyanagar Armwrestling",
    text: `Hello ${firstName},

Your registration is successful.

Details:
Name: ${firstName} ${lastName}
Weight Category: ${weightCategory}
Amount: ₹${amount}

You have successfully registered for the tournament.

Venue: Ahilyanagar Armwrestling Arena
Date: 15th December 2024

Thank you!`,
  };
};