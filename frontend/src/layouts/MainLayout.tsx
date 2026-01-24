import Navbar from '@/components/custom/Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Page layout with global navigation and background treatment.
 *
 * @example
 * ```tsx
 * <MainLayout>
 *   <HomePage />
 * </MainLayout>
 * ```
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--sport-surface)] text-[var(--sport-ink)]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-36 right-[-8%] h-72 w-72 rotate-6 bg-[linear-gradient(135deg,rgba(255,111,92,0.55),rgba(53,201,214,0.35))] blur-3xl" />
        <div className="absolute top-28 left-[-12%] h-64 w-64 -rotate-6 bg-[linear-gradient(135deg,rgba(255,179,71,0.45),rgba(255,111,92,0.35))] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,18,36,0.08),transparent_55%)]" />
      </div>
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
}
