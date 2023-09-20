import { AppProps } from 'next/app';
import '@/styles/globals.css';
import Layout from '@/components/Layout';

interface Metric {
  id: string,
  name: string,
  startTime: number,
  value: number,
  label: string
}

export function reportWebVitals(metric: Metric) {
  console.log(metric.name, metric.value);
}

export default function App({ Component, pageProps}: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}