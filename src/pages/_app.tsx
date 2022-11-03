import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { appWithTranslation } from 'next-i18next';
import { trpc } from 'utils/trpc';
import Router from 'next/router';
import NProgress from 'nprogress';
import AOS from 'aos';
import 'nprogress/nprogress.css';
import 'styles/globals.css';
import 'aos/dist/aos.css';

export type NextPageWithLayout<P = unknown> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page);

  NProgress.configure({
    showSpinner: false,
  });

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
    });

    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
  }, []);

  return <>{getLayout(<Component {...pageProps} />)}</>;
}

export default trpc.withTRPC(appWithTranslation(MyApp));
