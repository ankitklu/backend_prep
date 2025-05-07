import { AppType } from "next/app";
import { httpBatchLink } from "@trpc/client";
import { withTRPC } from "@trpc/next";
import superjson from "superjson";
import { AppRouter } from "@/server/trpc";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default withTRPC<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    };
  },
  ssr: false,
})(MyApp);
