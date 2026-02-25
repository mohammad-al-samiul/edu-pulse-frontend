export function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex bg-muted/40">
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="px-6 py-5 border-b">
          <h1 className="text-xl font-bold text-primary">EduPulse</h1>
          <div className="h-4 w-24 bg-muted rounded mt-1 animate-pulse"></div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 bg-muted rounded animate-pulse"></div>
          ))}
        </nav>
        <div className="border-t p-4">
          <div className="h-16 bg-muted rounded animate-pulse"></div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-4 py-3 border-b bg-background md:hidden">
          <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
        </header>
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="h-32 bg-muted rounded animate-pulse"></div>
        </div>
      </main>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
        ))}
      </div>
      <div className="h-96 bg-muted rounded animate-pulse"></div>
    </div>
  );
}
