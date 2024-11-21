export const seo = {
  title: 'Timothy Lau | 全栈开发、开源贡献者、细节控、学习创业中',
  description:
    '我叫 Timothy，一名全栈开发、开源贡献者、细节控，同时也在学习创业中。目前工作于原则科技团队，是一个充满活力和创造力的团队。',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://timlau.me'
      : 'http://localhost:3000'
  ),
} as const
