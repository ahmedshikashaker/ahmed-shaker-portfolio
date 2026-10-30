import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ahmed Shaker — Head of Digital Technology & Banking Digital Factory Architect",
    short_name: "Ahmed Shaker",
    description:
      "Official executive portfolio of Ahmed Shaker (أحمد شاكر), Head of Digital Technology at Kuwait International Bank (KIB) and former Android Chapter Lead at Warba Bank.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e17",
    theme_color: "#0a0e17",
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
      },
    ],
  };
}
