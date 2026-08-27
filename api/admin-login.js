const crypto = require("crypto");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { username, password } = req.body || {};

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !ADMIN_SESSION_SECRET) {
      return res.status(500).json({
        success: false,
        error: "Admin login is not configured"
      });
    }

    if (
      username !== ADMIN_USERNAME ||
      password !== ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password"
      });
    }

    const token = crypto
      .createHmac("sha256", ADMIN_SESSION_SECRET)
      .update(username)
      .digest("hex");

    res.setHeader(
      "Set-Cookie",
      `kravinzo_admin=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
    );

    return res.status(200).json({
      success: true,
      message: "Login successful"
    });

  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};
