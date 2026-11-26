
import type { MetadataRoute } from "next";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/actualizar-password",
        "/login",
        "/registro",
        "/recuperar-password",
        "/auth/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
