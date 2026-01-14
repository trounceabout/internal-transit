import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

/**
 * RSS Feed for Internal Transit Blog
 *
 * This endpoint generates a valid RSS 2.0 feed for all published blog posts.
 * The feed filters out draft posts and sorts by publication date (newest first).
 *
 * Access at: /blog/rss.xml
 */
export async function GET(context) {
  // Fetch all blog posts from the content collection
  const blogPosts = await getCollection('blog');

  // Filter out draft posts and sort by publication date (descending)
  const publishedPosts = blogPosts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    // Feed metadata
    title: 'Internal Transit - Blog',
    description: 'Thoughts, ideas, and explorations on design and technology',
    site: context.site,

    // Map each blog post to an RSS item
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      // Create full URL to the blog post using the collection slug
      link: `/blog/${post.slug}/`,
      author: post.data.author,
    })),

    // Recommended namespace for RSS 2.0
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
  });
}
