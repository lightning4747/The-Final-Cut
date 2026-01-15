import Link from "next/link"
import { AlertTriangle, Github, RefreshCw } from "lucide-react"

export const metadata = {
    title: "Service Unavailable - The Final Cut",
    description: "The backend service is currently unavailable.",
}

export default function SupabaseErrorPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            {/* Animated gradient background effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-500/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-fuchsia-500/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-lg space-y-8">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="p-6 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30">
                        <AlertTriangle className="w-16 h-16 text-violet-400" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gradient">
                    Oops! Service Down
                </h1>

                {/* Message */}
                <p className="text-lg text-muted-foreground leading-relaxed">
                    The author needs to restart the Supabase backend. This usually happens when the free tier goes to sleep after inactivity.
                </p>

                {/* Sad face */}
                <p className="text-6xl">☹️</p>

                {/* Call to action */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        href="https://github.com/lightning4747/The-Final-Cut/issues/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
                    >
                        <Github className="w-5 h-5" />
                        Leave an Issue on GitHub
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-secondary/50 text-foreground font-semibold hover:bg-secondary transition-all duration-300"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                    </Link>
                </div>

                {/* Additional info */}
                <p className="text-sm text-muted-foreground pt-8">
                    Don&apos;t worry, the site will be back once the author wakes up the database!
                </p>
            </div>
        </div>
    )
}
