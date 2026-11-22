import type { Headline, SlideshowFeed } from '../lib/headlines';

const slideDuration = 10_000;

export function mountSlideshow(carousel: HTMLElement, signal?: AbortSignal) {
  const container = carousel?.querySelector<HTMLElement>('[data-slides]');
  const controls = carousel?.querySelector<HTMLElement>('[data-headline-controls]');
  const empty = carousel?.querySelector<HTMLElement>('[data-headline-empty]');
  const template = carousel?.querySelector<HTMLTemplateElement>('[data-slide-template]')?.content;
  if (!container || !controls || !empty || !template) return;
  const presentation = carousel.hasAttribute('data-presentation');
  const day = carousel.querySelector<HTMLElement>('[data-window-last-day]');
  const older = carousel.querySelector<HTMLElement>('[data-window-older]');
  const number = new Intl.NumberFormat(document.documentElement.lang);
  const position = controls.querySelector('[data-count-position]');
  const progress = controls.querySelector('[data-slide-progress]');
  const seconds = controls.querySelector('[data-slide-seconds]');
  const pause = controls.querySelector<HTMLElement>('[data-pause]');
  const play = controls.querySelector<HTMLElement>('[data-play]');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover)');
  const interval = Number(carousel.dataset.interval);
  let slides = Array.from(container.querySelectorAll<HTMLElement>('[data-slide]'));
  let index = 0;
  let playing = !reduceMotion.matches;
  let etag = carousel.dataset.etag ?? '';
  let pending = false;
  let elapsed = 0;
  let lastTick = performance.now();
  let queued: Headline[] | SlideshowFeed | undefined;

  const paintCountdown = () => {
    progress?.setAttribute('stroke-dashoffset', String(elapsed / slideDuration));
    const label = number.format(Math.ceil((slideDuration - elapsed) / 1_000));
    if (seconds && seconds.textContent !== label) seconds.textContent = label;
  };

  const paint = (animate = false) => {
    slides.forEach((slide, i) => {
      slide.toggleAttribute('data-entering', animate && i === index);
      slide.hidden = i !== index;
    });
    empty.hidden = slides.length > 0;
    controls.hidden = slides.length < 2;
    container.setAttribute('aria-live', playing ? 'off' : 'polite');
    if (position) position.textContent = `${number.format(index + 1)} / ${number.format(slides.length)}`;
    if (play) play.hidden = playing;
    if (pause) pause.hidden = !playing;
    paintCountdown();
  };

  const toward = (direction: number) => {
    if (slides.length < 2) return;
    elapsed = 0;
    index = (index + direction + slides.length) % slides.length;
    paint(true);
  };

  const isReading = () => container.contains(document.activeElement) || (!presentation && hover.matches && container.matches(':hover'));
  const update = (items: Headline[]) => {
    const selected = slides[index]?.dataset.slide;
    const newLead = slides[0]?.dataset.slide !== items[0]?.href;
    slides = items.map(story => {
      const slide = template.firstElementChild!.cloneNode(true) as HTMLElement;
      slide.dataset.slide = story.href;
      const heading = slide.querySelector<HTMLAnchorElement>('h3 a')!;
      const time = slide.querySelector('time')!;
      const image = slide.querySelector('img')!;
      heading.textContent = story.title;
      heading.href = story.href;
      time.textContent = story.dateLabel;
      time.dateTime = story.date;
      slide.querySelector('[data-edition]')!.textContent = story.section;
      slide.querySelector('[data-summary]')!.textContent = story.summary;
      image.src = story.photo;
      image.loading = 'lazy';
      return slide;
    });
    index = newLead && playing ? 0 : Math.max(0, slides.findIndex(slide => slide.dataset.slide === selected));
    if (slides[index]?.dataset.slide !== selected) elapsed = 0;
    paint(slides[index]?.dataset.slide !== selected);
    container.replaceChildren(...slides);
  };

  const applyFeed = (feed: Headline[] | SlideshowFeed) => {
    if (Array.isArray(feed)) update(feed);
    else {
      if (day) day.hidden = !feed.last24Hours;
      if (older) older.hidden = feed.last24Hours || !feed.items.length;
      update(feed.items);
    }
  };

  const refresh = async () => {
    if (document.hidden || pending || signal?.aborted) return;
    pending = true;
    try {
      const response = await fetch(`/api/headlines?locale=${carousel.dataset.headlines}${presentation ? '&window=day' : ''}`, {
        cache: 'no-cache', headers: etag ? { 'If-None-Match': etag } : {}, signal: AbortSignal.timeout(interval),
      });
      if (!response.ok) return;
      const nextEtag = response.headers.get('ETag') ?? '';
      if (nextEtag && nextEtag === etag) return;
      const feed = await response.json<Headline[] | SlideshowFeed>();
      if (isReading()) return;
      if (playing && slides.length) queued = feed;
      else applyFeed(feed);
      etag = nextEtag;
    } catch {
      // Keep the current headlines readable if the feed is temporarily unavailable.
    } finally {
      pending = false;
    }
  };

  controls.querySelector('[data-prev]')?.addEventListener('click', () => toward(-1));
  controls.querySelector('[data-next]')?.addEventListener('click', () => toward(1));
  controls.querySelector('[data-toggle]')?.addEventListener('click', () => { playing = !playing; paint(); });
  reduceMotion.addEventListener('change', event => { if (event.matches) { playing = false; paint(); } }, { signal });
  document.addEventListener('visibilitychange', () => { lastTick = performance.now(); void refresh(); }, { signal });
  paint();
  const refreshTimer = window.setInterval(refresh, interval);
  const countdown = window.setInterval(() => {
    const now = performance.now();
    const delta = now - lastTick;
    lastTick = now;
    if (document.hidden || isReading() || !playing || !slides.length) return;
    elapsed = Math.min(slideDuration, elapsed + delta);
    if (elapsed >= slideDuration) {
      const selected = slides[index]?.dataset.slide;
      if (queued) { applyFeed(queued); queued = undefined; }
      if (slides[index]?.dataset.slide === selected) toward(1);
      elapsed = 0;
    }
    paintCountdown();
  }, 80);
  signal?.addEventListener('abort', () => { clearInterval(refreshTimer); clearInterval(countdown); }, { once: true });
}
