import { VideoCatalog } from './video-catalog';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">Video Catalog</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse and stream available content on the local network.
        </p>
      </header>
      <VideoCatalog />
    </div>
  );
}
