export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-surface border-b-primary animate-spin"></div>
        <div className="text-lg mt-4 font-medium ">Loading...</div>
      </div>
    </main>
  );
}
