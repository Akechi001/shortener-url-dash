"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Copy, ExternalLink, Scissors, AlertTriangle, X } from "lucide-react"

export function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [shortenedUrl, setShortenedUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showErrorBox, setShowErrorBox] = useState(false)
  const { toast } = useToast()

  const handleShorten = async () => {
    if (!originalUrl) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      })
      return
    }

    // Basic URL validation
    try {
      new URL(originalUrl)
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_url: originalUrl,
          custom_slug: customSlug || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === "Slug already taken") {
          setShowErrorBox(true)
          return
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      setShortenedUrl(data.short_url)

      toast({
        title: "Success!",
        description: "Your URL has been shortened successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to shorten URL. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl)
      toast({
        title: "Copied!",
        description: "Shortened URL copied to clipboard",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const openUrl = () => {
    window.open(shortenedUrl, "_blank")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <Scissors className="w-6 h-6 text-blue-600" />
            Shorten Your URL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="original-url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Original URL
            </Label>
            <Input
              id="original-url"
              type="url"
              placeholder="https://example.com/very-long-url-that-needs-shortening"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-slug" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Slug (Optional)
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">link.kodekalabs.com/</span>
              <Input
                id="custom-slug"
                placeholder="my-custom-link"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))}
                className="h-12 text-base"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Leave empty for a random slug. Only letters, numbers, and hyphens allowed.
            </p>
          </div>

          <Button
            onClick={handleShorten}
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Shortening...
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4 mr-2" />
                Shorten URL
              </>
            )}
          </Button>

          {shortenedUrl && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Label className="text-sm font-medium text-green-800 dark:text-green-300 mb-2 block">
                Your Shortened URL
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  value={shortenedUrl}
                  readOnly
                  className="bg-white dark:bg-gray-800 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 font-mono"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                  className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 bg-transparent"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  onClick={openUrl}
                  variant="outline"
                  size="icon"
                  className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 bg-transparent"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showErrorBox && (
        <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
          <div className="bg-slate-800 dark:bg-slate-900 border-2 border-orange-400 dark:border-orange-500 rounded-lg p-4 shadow-2xl max-w-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-400 dark:text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">Slug Already Taken</h3>
                <p className="text-slate-300 dark:text-slate-400 text-xs mt-1">
                  The slug "{customSlug}" is already in use. Try a different one or leave it empty for a random slug.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-slate-500 text-slate-300 hover:bg-slate-700 hover:border-slate-400 bg-transparent"
                    onClick={() => {
                      setCustomSlug("")
                      setShowErrorBox(false)
                    }}
                  >
                    Use Random
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
                    onClick={() => setShowErrorBox(false)}
                  >
                    Try Different
                  </Button>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-slate-400 hover:bg-slate-700 hover:text-white"
                onClick={() => setShowErrorBox(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
