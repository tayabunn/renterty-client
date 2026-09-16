import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const srcPath = "C:\\Users\\Jannat\\.gemini\\antigravity-ide\\brain\\a8574dd0-f88d-4ce1-89d0-16279b768064\\.user_uploaded\\media_1789400103550.png";
    const destPath = path.join(process.cwd(), "public", "logo.png");
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      return Response.json({ success: true, message: "Logo copied successfully to public/logo.png" });
    } else {
      return Response.json({ success: false, message: "Source file not found", srcPath });
    }
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
