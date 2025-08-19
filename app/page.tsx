import { UrlShortener } from "@/components/url-shortener"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            KodeKa<span className="text-blue-600">Link</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your long URLs into short, memorable links with custom slugs
          </p>
        </div>

        <UrlShortener />
      </div>
    </main>
  )
}
