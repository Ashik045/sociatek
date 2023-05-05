import { ContextProvider } from "Context/Context";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/home.module.scss";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // for hydration errors
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setShowChild(true);
  }, []);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  if (!showChild) {
    return null;
  }

  return (
    <>
      {loading ? (
        <div className={styles.loader_bg}>
          <span className={styles.loader}></span>
        </div>
      ) : null}
      <ContextProvider>
        <Component {...pageProps} />
      </ContextProvider>
    </>
  );
}
