export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-neutral-500  border-t-red-600" />

        <p className="text-lg text-neutral-400">Loading...</p>
      </div>
    </main>
  );
}
