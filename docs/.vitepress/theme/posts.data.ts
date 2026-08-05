import { createContentLoader } from 'vitepress'

export interface PostItem {
  title: string
  url: string
  date: string
  description: string
  tags: string[]
}

export interface CategoryPosts {
  key: string
  title: string
  link: string
  posts: PostItem[]
}

const CATEGORIES = [
  { key: 'tech', title: '技术', link: '/tech/' },
  { key: 'project', title: '项目', link: '/project/' },
  { key: 'growth', title: '成长', link: '/growth/' },
]

function formatDate(raw: unknown): string {
  const d = raw instanceof Date ? raw : new Date(String(raw ?? ''))
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}

export default createContentLoader(
  ['tech/**/*.md', 'project/**/*.md', 'growth/**/*.md'],
  {
    transform(raw): CategoryPosts[] {
      return CATEGORIES.map((cat) => {
        const posts = raw
          .filter(
            (p) =>
              p.url.startsWith(`/${cat.key}/`) &&
              p.url !== cat.link &&
              !p.url.endsWith('/index'),
          )
          .map((p) => ({
            title: p.frontmatter.title || p.url,
            url: p.url,
            date: formatDate(p.frontmatter.date),
            description: p.frontmatter.description || '',
            tags: ([] as string[]).concat(p.frontmatter.tags || []),
            _timestamp: new Date(p.frontmatter.date ?? 0).getTime(),
          }))
          .sort((a, b) => b._timestamp - a._timestamp)
          .slice(0, 4)
          .map(({ _timestamp, ...post }) => post)

        return { ...cat, posts }
      })
    },
  },
)
