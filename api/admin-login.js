export default function handler(req, res) {
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

    // Check environment variables
    if (
      !ADMIN_USERNAME ||
      !ADMIN_PASSWORD ||
      !ADMIN_SESSION_SECRET
    ) {
      console.error("Missing admin environment variables");

      return res.status(500).json({
        success: false,
        error: "Admin configuration is missing on server."
      });
    }

    // Check username and password
    if (
      username !== ADMIN_USERNAME ||
      password !== ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password."
      });
    }

    // Create admin session token
    const token = Buffer.from(
      `${ADMIN_USERNAME}:${ADMIN_SESSION_SECRET}`
    ).toString("base64");

    // Set admin cookie
    res.setHeader(
      "Set-Cookie",
      `kravinzo_admin=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    );

    console.log("Admin login successful");

    return res.status(200).json({
      success: true,
      message: "Login successful"
    });

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}
