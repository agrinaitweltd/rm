"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Re-implements the small runtime behaviours the original site got from its
 * page-builder plugins, without shipping jQuery/Elementor:
 *
 * 1. jet-unfold "read more" toggles (About page values).
 * 2. Entrance animations (elementor-invisible -> animated <name>).
 * 3. Nested tabs (The Chain sourcing map).
 * 4. Click-to-play Vimeo embeds (About brand movie).
 * 5. Swiper carousels (Elementor's own Swiper v8 is loaded globally).
 * 6. Re-initialising Astra's mobile menu bindings after client-side navigation.
 */

type SwiperCtor = new (el: Element, options: Record<string, unknown>) => unknown;

function initUnfolds(cleanups: Array<() => void>) {
  document.querySelectorAll<HTMLElement>(".jet-unfold").forEach((unfold) => {
    const mask = unfold.querySelector<HTMLElement>(".jet-unfold__mask");
    const content = unfold.querySelector<HTMLElement>(".jet-unfold__content");
    const trigger = unfold.querySelector<HTMLElement>(".jet-unfold__trigger");
    const button = unfold.querySelector<HTMLElement>(".jet-unfold__button");
    const buttonText = unfold.querySelector<HTMLElement>(".jet-unfold__button-text");
    if (!mask || !content || !trigger || !button) return;

    const foldedHeight = mask.style.height || "80px";
    if (content.scrollHeight <= parseInt(foldedHeight, 10)) return;
    trigger.style.display = "flex";

    let open = false;
    const toggle = () => {
      open = !open;
      unfold.classList.toggle("jet-unfold-state", open);
      mask.style.transition = open
        ? "height 500ms cubic-bezier(0.34, 1.56, 0.64, 1)"
        : "height 300ms cubic-bezier(0.61, 1, 0.88, 1)";
      mask.style.height = open ? `${content.scrollHeight}px` : foldedHeight;
      if (buttonText) {
        buttonText.textContent = open
          ? button.dataset.foldText || "hide"
          : button.dataset.unfoldText || "read more";
      }
    };
    button.addEventListener("click", toggle);
    cleanups.push(() => button.removeEventListener("click", toggle));
  });
}

function initEntranceAnimations(cleanups: Array<() => void>) {
  const pending = new Set(document.querySelectorAll<HTMLElement>(".elementor-invisible[data-settings]"));
  if (!pending.size) return;

  const reveal = (el: HTMLElement) => {
    let animation = "fadeIn";
    let delay = 0;
    try {
      const settings = JSON.parse(el.dataset.settings || "{}");
      animation = settings._animation || animation;
      delay = settings._animation_delay || 0;
    } catch {
      /* keep defaults */
    }
    setTimeout(() => {
      el.classList.remove("elementor-invisible");
      el.classList.add("animated", animation);
    }, delay);
  };

  const check = () => {
    const threshold = window.innerHeight * 0.92;
    pending.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < threshold && rect.bottom > 0) {
        pending.delete(el);
        reveal(el);
      }
    });
    if (!pending.size) detach();
  };

  const onScroll = () => requestAnimationFrame(check);
  const detach = () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  check();
  cleanups.push(detach);
}

function initTabs(cleanups: Array<() => void>) {
  document.querySelectorAll<HTMLElement>(".e-n-tabs").forEach((tabs) => {
    const titles = Array.from(tabs.querySelectorAll<HTMLElement>(".e-n-tab-title"));
    const panels = Array.from(tabs.querySelectorAll<HTMLElement>(".e-n-tabs-content > [data-tab-index]"));
    const activate = (index: string) => {
      tabs.classList.add("e-activated");
      titles.forEach((t) => {
        const active = t.dataset.tabIndex === index;
        t.setAttribute("aria-selected", active ? "true" : "false");
        t.setAttribute("tabindex", active ? "0" : "-1");
      });
      panels.forEach((p) => p.classList.toggle("e-active", p.dataset.tabIndex === index));
    };
    titles.forEach((title) => {
      const onClick = () => activate(title.dataset.tabIndex || "1");
      title.addEventListener("click", onClick);
      cleanups.push(() => title.removeEventListener("click", onClick));
    });
  });
}

function initVideos(cleanups: Array<() => void>) {
  document.querySelectorAll<HTMLElement>(".uael-video__play").forEach((play) => {
    const onClick = () => {
      const src = play.dataset.src;
      if (!src) return;
      const iframe = document.createElement("iframe");
      iframe.src = src.includes("autoplay=") ? src : `${src}${src.includes("?") ? "&" : "?"}autoplay=1`;
      iframe.allow = "autoplay; fullscreen";
      iframe.setAttribute("allowfullscreen", "");
      iframe.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;";
      const wrap = play.parentElement as HTMLElement;
      wrap.style.position = "relative";
      wrap.style.paddingBottom = "56.25%";
      wrap.innerHTML = "";
      wrap.appendChild(iframe);
    };
    play.addEventListener("click", onClick);
    cleanups.push(() => play.removeEventListener("click", onClick));
  });
}

function initCarousels(cleanups: Array<() => void>) {
  const Swiper = (window as unknown as { Swiper?: SwiperCtor }).Swiper;
  if (!Swiper) return;
  document
    .querySelectorAll<HTMLElement>(".e-n-carousel.swiper, .swiper.elementor-loop-container")
    .forEach((el) => {
      if ((el as HTMLElement & { swiper?: unknown }).swiper) return; // already initialised
      const widget = el.closest<HTMLElement>("[data-settings]");
      let settings: Record<string, unknown> = {};
      try {
        settings = JSON.parse(widget?.dataset.settings || "{}");
      } catch {
        /* defaults */
      }
      const num = (v: unknown, fallback: number) => {
        const n = parseInt(String(v ?? ""), 10);
        return Number.isFinite(n) ? n : fallback;
      };
      const spacing = (v: unknown) => {
        const size = (v as { size?: number } | undefined)?.size;
        return typeof size === "number" ? size : 0;
      };
      const container = el.parentElement as HTMLElement;
      const options: Record<string, unknown> = {
        slidesPerView: num(settings.slides_to_show_mobile, 1),
        slidesPerGroup: num(settings.slides_to_scroll, 1),
        spaceBetween: spacing(settings.image_spacing_custom_mobile) || spacing(settings.image_spacing_custom),
        speed: num(settings.speed, 500),
        loop: true,
        breakpoints: {
          768: {
            slidesPerView: num(settings.slides_to_show_tablet, 1),
            spaceBetween: spacing(settings.image_spacing_custom_tablet) || spacing(settings.image_spacing_custom),
          },
          1025: {
            slidesPerView: num(settings.slides_to_show, 1),
            spaceBetween: spacing(settings.image_spacing_custom),
          },
        },
      };
      if (settings.autoplay === "yes") {
        options.autoplay = {
          delay: num(settings.autoplay_speed, 5000),
          pauseOnMouseEnter: settings.pause_on_hover === "yes",
          disableOnInteraction: settings.pause_on_interaction === "yes",
        };
      }
      const prev = container.querySelector<HTMLElement>(".elementor-swiper-button-prev");
      const next = container.querySelector<HTMLElement>(".elementor-swiper-button-next");
      if (prev && next) options.navigation = { prevEl: prev, nextEl: next };
      const instance = new Swiper(el, options) as { destroy?: (a?: boolean, b?: boolean) => void };
      cleanups.push(() => instance.destroy?.(true, true));
    });
}

export default function SiteBehaviors() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    initUnfolds(cleanups);
    initEntranceAnimations(cleanups);
    initTabs(cleanups);
    initVideos(cleanups);
    initCarousels(cleanups);

    const w = window as unknown as { astraToggleSetup?: () => void };
    if (typeof w.astraToggleSetup === "function") w.astraToggleSetup();

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
