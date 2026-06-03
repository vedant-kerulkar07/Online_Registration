export const registrationMailTemplate = ({
  firstName,
  lastName,
  weightCategory,
  amount,
}) => {
  return {
    subject: "Registration Confirmed | Ahilyanagar Armwrestling Tournament",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Registration Successful</title>
</head>

<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0d0d0d">
<tr>
<td align="center" style="padding:30px 15px;">

<table width="650" border="0" cellspacing="0" cellpadding="0"
style="max-width:650px;background:#111111;border:2px solid #d4af37;">

<!-- Header -->
<tr>
<td align="center"
style="background:#000000;padding:30px 20px;border-bottom:2px solid #d4af37;">

<h1 style="margin:0;color:#d4af37;font-size:34px;">
AHILYANAGAR
</h1>

<p style="margin:10px 0 0;color:#ffffff;font-size:18px;">
ARMWRESTLING TOURNAMENT
</p>

</td>
</tr>

<!-- Success Banner -->
<tr>
<td align="center" style="padding:30px 20px 15px;">

<table border="0" cellspacing="0" cellpadding="0">
<tr>
<td
style="background:#d4af37;color:#000000;padding:12px 24px;font-size:20px;font-weight:bold;">
REGISTRATION SUCCESSFUL
</td>
</tr>
</table>

</td>
</tr>

<!-- Greeting -->
<tr>
<td style="padding:10px 40px;color:#ffffff;">

<p style="font-size:18px;margin:0 0 15px;">
Hello <strong style="color:#d4af37;">${firstName}</strong>,
</p>

<p style="font-size:16px;line-height:1.8;color:#dddddd;">
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

<table width="100%" border="0" cellspacing="0" cellpadding="0"
style="background:#1a1a1a;border:1px solid #333333;">

<tr>
<td colspan="2"
style="background:#d4af37;color:#000000;padding:15px;text-align:center;font-size:20px;font-weight:bold;">
Registration Details
</td>
</tr>

<tr>
<td style="padding:15px;color:#bbbbbb;border-bottom:1px solid #333;">
Full Name
</td>
<td style="padding:15px;color:#ffffff;border-bottom:1px solid #333;">
${firstName} ${lastName}
</td>
</tr>

<tr>
<td style="padding:15px;color:#bbbbbb;border-bottom:1px solid #333;">
Weight Category
</td>
<td style="padding:15px;color:#ffffff;border-bottom:1px solid #333;">
${weightCategory}
</td>
</tr>

<tr>
<td style="padding:15px;color:#bbbbbb;border-bottom:1px solid #333;">
Registration Amount
</td>
<td style="padding:15px;color:#00ff99;font-weight:bold;border-bottom:1px solid #333;">
₹${amount}
</td>
</tr>

<tr>
<td style="padding:15px;color:#bbbbbb;">
Tournament Date
</td>
<td style="padding:15px;color:#ffffff;">
21 June 2026, 10:30 AM
</td>
</tr>

</table>

</td>
</tr>

<!-- Venue -->
<tr>
<td style="padding:0 40px 25px;">

<table width="100%" border="0" cellspacing="0" cellpadding="0"
style="border:1px solid #d4af37;background:#1a1a1a;">

<tr>
<td align="center" style="padding:25px;">

<h2 style="margin:0 0 12px;color:#d4af37;">
📍 Venue
</h2>

<p style="margin:0;color:#ffffff;font-size:16px;line-height:1.8;">
BEING HEALTHY GYM<br>
Near Surabhi Hospital,<br>
Chhatrapati Sambhajinagar Road,<br>
Ahilyanagar - 414001
</p>

</td>
</tr>

</table>

</td>
</tr>

<!-- Footer -->
<tr>
<td align="center"
style="background:#000000;padding:25px;border-top:2px solid #d4af37;">

<h3 style="margin:0;color:#d4af37;">
STRENGTH • RESPECT • HONOR
</h3>

<p style="margin:15px 0 0;color:#aaaaaa;font-size:14px;line-height:1.7;">
Thank you for registering.<br>
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