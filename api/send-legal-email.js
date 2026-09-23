export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      thirdPartyName,
      thirdPartyEmail,
      caseReference,
      subject,
      message
    } = req.body;

    if (!thirdPartyEmail || !subject || !message) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "Sentinel Law <onboarding@resend.dev>",
        to: [thirdPartyEmail],
        subject: subject,
        text: `
Sentinel Law
Legal Correspondence

Third Party: ${thirdPartyName || ""}
Case / Reference Number: ${caseReference || ""}

${message}
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({
      success: true,
      message: "Legal correspondence sent successfully."
    });

  } catch (error) {
    return res.status(500).json({
      error: "Failed to send email."
    });
  }
}