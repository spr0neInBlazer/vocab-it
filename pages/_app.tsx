import { AppProps } from 'next/app';
import '@/styles/globals.css';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

interface Metric {
  id: string,
  name: string,
  startTime: number,
  value: number,
  label: string
}

// display FCP and TTFB values
export function reportWebVitals(metric: Metric) {
  console.log(metric.name, metric.value);
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps}: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout (<Component {...pageProps} />)
}