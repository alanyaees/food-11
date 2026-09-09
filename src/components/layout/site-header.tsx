"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { brand, primaryNav } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/cart-provider";
import { WordmarkLink } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./mobile-menu";
import { SearchDialog } from "./search-dialog";
import { AnnouncementBar } from "./announcement-bar";

export function SiteHeader() {
  const pathname = usePathname();
  const { totals, openCart } = useCart();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 24);
  });

  // Cmd/Ctrl-K opens search, as expected of a modern storefront.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-line/80 bg-bone/85 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-full flex h-(--header-height) items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <WordmarkLink className="text-[1.5rem]" />
            <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
              {primaryNav.map((item) => {
                const active =
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-active={active}
                    className="link-underline text-[0.9rem] font-medium tracking-tight text-ink/75 transition-colors hover:text-ink data-[active=true]:text-ink"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="press grid size-10 place-items-center rounded-full text-ink/70 hover:bg-ink/[0.06] hover:text-ink"
              aria-label="Search meals"
            >
              <Search className="size-[1.15rem]" aria-hidden />
            </button>
            <Link
              href="/account"
              className="press hidden size-10 place-items-center rounded-full text-ink/70 hover:bg-ink/[0.06] hover:text-ink sm:grid"
              aria-label="Your account"
            >
              <User className="size-[1.15rem]" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="press relative grid size-10 place-items-center rounded-full text-ink/70 hover:bg-ink/[0.06] hover:text-ink"
              aria-label={`Open cart, ${totals.itemCount} item${totals.itemCount === 1 ? "" : "s"}`}
            >
              <ShoppingBag className="size-[1.15rem]" aria-hidden />
              <AnimatePresence>
                {totals.itemCount > 0 ? (
                  <motion.span
                    key={totals.itemCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
                    className="num absolute -top-0.5 -right-0.5 grid min-w-[1.15rem] place-items-center rounded-full bg-ember px-1 py-0.5 text-[0.65rem] leading-none font-bold text-white"
                  >
                    {totals.itemCount}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </button>
            <Button href="/build-a-box" size="sm" className="ml-1 hidden md:inline-flex">
              Build your box
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="press grid size-10 place-items-center rounded-full text-ink hover:bg-ink/[0.06] lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu className="size-[1.3rem]" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <span className="sr-only">{brand.tagline}</span>
    </>
  );
}
