import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Bookmark from "../components/bookmark"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Bookmark />
  </Layout>
)

export default IndexPage
