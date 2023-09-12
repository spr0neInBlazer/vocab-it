import Layout from '@/components/Layout'
import React from 'react'

export default function Vocabulary() {
  return (
    <Layout>
      Vocabulary
    </Layout>
  )
}

// Return a list of possible value for id
export async function getStaticPaths() {

}

// Fetch necessary data for the blog post using params.id
export async function getStaticProps({ params }) {
  
}