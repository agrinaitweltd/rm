import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-5 pt-[var(--header-h)]">
      <div className="text-center">
        <p className="text-7xl font-black text-brand-600 sm:text-8xl">404</p>
        <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
          This page has gone off to the orchard
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          We couldn&apos;t find what you were looking for — but our premium
          Pakistani mangoes are still right here.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg">
            <Icon name="arrow" size={20} className="rotate-180" /> Back Home
          </Button>
          <Button href="/products" variant="outline" size="lg">
            View Mango Boxes
          </Button>
        </div>
      </div>
    </section>
  );
}
