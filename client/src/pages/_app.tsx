import { ContextProvider } from "Context/Context";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  // const router = useRouter();
  // const [loading, setLoading] = useState(false);
  const [showChild, setShowChild] = useState(false);

  // for hydration errors
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  // loading
  // useEffect(() => {
  //   const handleStart = () => setLoading(true);
  //   const handleComplete = () => setLoading(false);

  //   router.events.on("routeChangeStart", handleStart);
  //   router.events.on("routeChangeComplete", handleComplete);
  //   router.events.on("routeChangeError", handleComplete);

  //   return () => {
  //     router.events.off("routeChangeStart", handleStart);
  //     router.events.off("routeChangeComplete", handleComplete);
  //     router.events.off("routeChangeError", handleComplete);
  //   };
  // }, [router]);

  // if (loading) {
  //   return (
  //     <ContextProvider>
  //       <div className={styles.loader_bg}>
  //         <span className={styles.loader}></span>
  //       </div>
  //     </ContextProvider>
  //   );
  // }

  return (
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  );
}
