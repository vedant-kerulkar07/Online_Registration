export const registrationMailTemplate = ({
  firstName,
  lastName,
  weightCategory,
  amount,
}) => {
  return {
    subject: "Registration Confirmed | Ahilyanagar Armwrestling Tournament",
    text: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Registration Successful</title>
  </head>

  <body style="margin:0; padding:0; background-color:#0d0d0d; font-family:Arial, Helvetica, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d0d0d; padding:40px 0;">
      <tr>
        <td align="center">

          <table width="650" cellpadding="0" cellspacing="0" border="0"
            style="background:#111111; border-radius:18px; overflow:hidden; border:2px solid #d4af37; box-shadow:0 0 20px rgba(212,175,55,0.3);">

            <!-- Header -->
            <tr>
              <td align="center"
                style="background:linear-gradient(135deg,#000000,#1a1a1a); padding:35px 20px; border-bottom:2px solid #d4af37;">

                <h1 style="margin:0; color:#d4af37; font-size:38px; letter-spacing:2px; font-weight:bold;">
                  AHILYANAGAR
                </h1>

                <p style="margin:10px 0 0; color:#ffffff; font-size:20px; letter-spacing:1px;">
                  ARMWRESTLING TOURNAMENT
                </p>

              </td>
            </tr>

            <!-- Success Banner -->
            <tr>
              <td align="center" style="padding:30px 25px 10px;">

                <div style="
                  display:inline-block;
                  background:#d4af37;
                  color:#000000;
                  padding:12px 28px;
                  border-radius:50px;
                  font-size:24px;
                  font-weight:bold;
                  letter-spacing:1px;
                ">
                  ✅ REGISTRATION SUCCESSFUL
                </div>

              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding:25px 40px 10px; color:#ffffff;">

                <p style="font-size:18px; margin:0 0 15px;">
                  Hello <strong style="color:#d4af37;">${firstName}</strong>,
                </p>

                <p style="font-size:16px; line-height:1.8; color:#d9d9d9;">
                  Congratulations! Your registration for the
                  <strong style="color:#d4af37;">
                    Ahilyanagar Armwrestling Tournament
                  </strong>
                  has been successfully confirmed.
                </p>

              </td>
            </tr>

            <!-- Registration Details -->
            <tr>
              <td style="padding:20px 40px;">

                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                  style="background:#1a1a1a; border-radius:12px; overflow:hidden; border:1px solid #333;">

                  <tr>
                    <td colspan="2"
                      style="background:#d4af37; color:#000000; padding:15px; font-size:20px; font-weight:bold; text-align:center;">
                      Registration Details
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:15px; color:#bbbbbb; font-size:15px; border-bottom:1px solid #2b2b2b;">
                      Full Name
                    </td>

                    <td style="padding:15px; color:#ffffff; font-size:15px; border-bottom:1px solid #2b2b2b;">
                      ${firstName} ${lastName}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:15px; color:#bbbbbb; font-size:15px; border-bottom:1px solid #2b2b2b;">
                      Weight Category
                    </td>

                    <td style="padding:15px; color:#ffffff; font-size:15px; border-bottom:1px solid #2b2b2b;">
                      ${weightCategory}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:15px; color:#bbbbbb; font-size:15px; border-bottom:1px solid #2b2b2b;">
                      Registration Amount
                    </td>

                    <td style="padding:15px; color:#00ff99; font-size:16px; font-weight:bold; border-bottom:1px solid #2b2b2b;">
                      ₹${amount}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:15px; color:#bbbbbb; font-size:15px;">
                      Tournament Date
                    </td>

                    <td style="padding:15px; color:#ffffff; font-size:15px;">
                      21th June 2026
                    </td>
                  </tr>

                </table>

              </td>
            </tr>

            <!-- Venue Section -->
            <tr>
              <td style="padding:10px 40px 20px;">

                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                  style="background:linear-gradient(135deg,#1a1a1a,#0f0f0f); border:1px solid #d4af37; border-radius:12px;">

                  <tr>
                    <td align="center" style="padding:25px;">

                      <h2 style="margin:0 0 10px; color:#d4af37; font-size:24px;">
                        📍 Venue
                      </h2>

                      <p style="margin:0; color:#ffffff; font-size:18px; font-weight:bold;">
                        Ahilyanagar Armwrestling Arena
                      </p>

                    </td>
                  </tr>

                </table>

              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td align="center"
                style="background:#0a0a0a; padding:30px 20px; border-top:2px solid #d4af37;">

                <h3 style="margin:0; color:#d4af37; letter-spacing:1px;">
                  STRENGTH • RESPECT • HONOR
                </h3>

                <p style="margin:15px 0 0; color:#888888; font-size:14px; line-height:1.7;">
                  Thank you for registering.<br/>
                  We look forward to seeing you at the tournament!
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `,
  };
};