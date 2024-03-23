import { Helmet } from 'react-helmet'

type Props = {
  props: {
    title?: string
    description?: string
    image?: string
    url?: string
    type?: string
    siteName?: string
    twitter?: string
    facebook?: string
    robots?: string
    locale?: string
    date?: string
    modified?: string
  }
}

const SEOComponent = (props: Props) => {
  const { title, description, image, url, type, siteName, twitter, facebook, robots, locale, date, modified } =
    props.props
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
      <meta property='og:url' content={url} />
      <meta property='og:type' content={type} />
      <meta property='og:site_name' content={siteName} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content={twitter} />
      <meta name='twitter:creator' content={twitter} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
      <meta property='og:locale' content={locale} />
      <meta property='og:published_time' content={date} />
      <meta property='og:modified_time' content={modified} />
      <meta name='robots' content={robots} />
    </Helmet>
  )
}

export default SEOComponent
