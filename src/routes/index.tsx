import { createFileRoute } from "@tanstack/react-router";
import { WeddingInvitation } from "@/components/WeddingInvitation";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "jijitha_subith_marriage inv" },
      { name: "description", content: "Join Saanvi and Jai for their wedding celebration on February 14, 2027 in Jaipur." },
      { property: "og:title", content: "Saanvi & Jai | Wedding Invitation" },
      { property: "og:description", content: "A celebration of love in Jaipur — February 14, 2027." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <WeddingInvitation />;
}
