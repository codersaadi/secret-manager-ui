import { AuthForm } from "@/components/auth-form"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">SecretKeeper</h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Secure password management for your sensitive credentials
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <AuthForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

