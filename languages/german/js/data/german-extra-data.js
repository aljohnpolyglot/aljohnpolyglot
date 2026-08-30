export const germanExtraPlaylist = {
  playlistId: 'PLtLp08LfvxttE4NbSXMYf9zl328IQ4FAP',
  playlistUrl: 'https://www.youtube.com/watch?v=6jrm6f9aS9k&list=PLtLp08LfvxttE4NbSXMYf9zl328IQ4FAP',
  title: 'Extr@ auf Deutsch',
  channel: 'Mahmoud Yahia',
  episodes: [
    { id: '6jrm6f9aS9k', number: 1, duration: '24:01' },
    { id: '78xkB_c2uZE', number: 2, duration: '23:59' },
    { id: 'uz6f4oatc7E', number: 3, duration: '24:08' },
    { id: 'HG3g35rdJYU', number: 4, duration: '24:11' },
    { id: 'Z7IMnsxzAZs', number: 5, duration: '24:05' },
    { id: 'sSfHtNEOGbQ', number: 6, duration: '24:14' },
    { id: '04UW4PFeS2M', number: 7, duration: '24:12' },
    { id: 'rR0WuNAP4fo', number: 8, duration: '24:15' },
    { id: '6PBsR4lf96E', number: 9, duration: '23:53' },
    { id: 'IiWSNKa6Cy4', number: 10, duration: '23:56' },
    { id: 'Z7kIpR0eRFY', number: 11, duration: '24:16' },
    { id: '9g_6zFo8a4w', number: 12, duration: '24:12' },
    { id: 'WLcSkH1ufJs', number: 13, duration: '24:22' }
  ].map(episode => ({
    ...episode,
    title: `Extr@ auf Deutsch — Folge ${episode.number}`,
    thumbnail: `images/extra/${episode.id}.webp`,
    thumbnailAlt: `Filmszene aus Extr@ auf Deutsch, Folge ${episode.number}`
  }))
};
