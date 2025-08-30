import EventListeners from "@/components/EventListener/EventListener";
import { checkWindow } from "@/lib/functions/_helpers.lib";
import "@/styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import React from "react";
import { toast, Toaster } from "sonner";
import {
  Mutation,
  MutationCache,
  QueryClient,
  QueryClientProvider,
  QueryKey
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { AxiosResponse } from "axios";

interface SuccessData {
  message?: string;
}

// Example mutation variables type
type Variables = Record<string, any>;

// Example mutation context type
type Context = unknown;

interface ErrorData {
  response: {
    data: {
      message: string;
    };
  };
}

// Define meta type for mutations
interface MutationMeta {
  invalidateQueries?: string[];
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
}

/**
 * It suppresses the useLayoutEffect warning when running in SSR mode
 */
function fixSSRLayout() {
  // suppress useLayoutEffect (and its warnings) when not running in a browser
  // hence when running in SSR mode
  if (!checkWindow()) {
    React.useLayoutEffect = () => {
      // console.log("layout effect")
    };
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 0
    }
  },
  mutationCache: new MutationCache({
    onSuccess: (data, _variables, _context, mutation) => {
      const message = (data as AxiosResponse).headers["x-message"];
      const showToast = mutation.meta?.showToast !== false;
      if (showToast && message) {
        toast.success(message);
      }
    },
    onError: (res, _variables, _context, _mutation) => {
      const result = res as unknown as ErrorData;
      if (result?.response?.data?.message) {
        toast.error(result?.response?.data?.message);
      } else {
        toast.error("An error occurred while processing your request.");
      }
    },
    onSettled: (_data, _error, _variables, _context, mutation) => {
      if (mutation?.meta?.invalidateQueries) {
        queryClient.invalidateQueries({
          queryKey: mutation?.meta?.invalidateQueries as QueryKey,
          refetchType: "all"
        });
      }
    }
  })
});

export default function CustomApp({ Component, pageProps }: AppProps) {
  fixSSRLayout();

  return (
    <main>
      {/* <SessionProvider session={pageProps.session}> */}
      <QueryClientProvider client={queryClient}>
        <EventListeners />
        <Toaster richColors position="bottom-left" />
        <Component {...pageProps} />
      </QueryClientProvider>
      {/* </SessionProvider> */}
    </main>
  );
}

CustomApp.getInitialProps = async (context: AppContext) => {
  // // const client = initializeApollo({ headers: context.ctx.req?.headers });
  // // resetServerContext();
  const appProps = await App.getInitialProps(context);

  return { ...appProps };
};
