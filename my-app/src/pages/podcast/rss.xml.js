import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

/**
 * iTunes-Compatible RSS Feed for Internal Transit Podcast
 *
 * This endpoint generates an RSS 2.0 feed with iTunes-specific tags for podcast
 * distribution. The feed includes all podcast episodes sorted by episode number
 * and includes proper enclosure tags for audio files.
 *
 * Access at: /podcast/rss.xml
 *
 * This feed can be submitted to:
 * - Apple Podcasts
 * - Spotify
 * - Google Podcasts
 * - Other podcast directories that support iTunes RSS
 */
export async function GET(context) {
  // Fetch all podcast episodes from the content collection
  const podcastEpisodes = await getCollection('podcast');

  // Sort by episode number (ascending for chronological order)
  const sortedEpisodes = podcastEpisodes.sort(
    (a, b) => a.data.episode - b.data.episode
  );

  return rss({
    // Feed metadata
    title: 'Internal Transit Podcast',
    description:
      'A podcast exploring thoughts, ideas, and conversations on design, technology, and personal growth',
    site: context.site,

    // iTunes namespace for podcast-specific metadata
    xmlns: {
      itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      content: 'http://purl.org/rss/1.0/modules/content/',
    },

    // Channel-level iTunes metadata (applies to all episodes)
    customData: `
      <itunes:author>Cody</itunes:author>
      <itunes:category text="Technology" />
      <itunes:explicit>false</itunes:explicit>
      <itunes:image href="${context.site}podcast-cover.jpg" />
      <itunes:type>episodic</itunes:type>
    `.trim(),

    // Map each episode to an RSS item
    items: sortedEpisodes.map((episode) => ({
      title: episode.data.title,
      pubDate: episode.data.pubDate,
      description: episode.data.description,
      // Create full URL to the podcast episode
      link: `/podcast/${episode.slug}/`,

      // Custom data for iTunes-specific episode metadata
      customData: `
        <itunes:episodeType>full</itunes:episodeType>
        <itunes:episode>${episode.data.episode}</itunes:episode>
        <itunes:duration>${episode.data.duration}</itunes:duration>
        ${
          episode.data.guests
            ? `<itunes:author>${episode.data.guests.join(', ')}</itunes:author>`
            : '<itunes:author>Cody</itunes:author>'
        }
        <enclosure
          url="${episode.data.audioUrl}"
          length="${episode.data.fileSize}"
          type="audio/mpeg"
        />
        ${episode.data.transcript ? `<content:encoded><![CDATA[${episode.data.transcript}]]></content:encoded>` : ''}
      `.trim(),
    })),
  });
}
