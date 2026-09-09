"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { Menu } from "lucide-react";
import { brand, primaryNav } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { WordmarkLink } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./mobile-menu";
import { SearchDialog } from "./search-dialog";
import { AnnouncementBar } from "./announcement-bar";

export function SiteHeader() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 24);
  });

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
            <Button href="/survey" size="sm" variant="accentSoft" className="px-3 sm:px-4">
              Take a survey
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
