import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Menu,
  Music2,
  Pause,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/couple-hero.jpg";
import walkImage from "@/assets/memory-walk.jpg";
import ringsImage from "@/assets/memory-rings.jpg";
import laughImage from "@/assets/memory-laugh.jpg";
import envelopeImage from "@/assets/envelope.png";
import weddingAnimation from "@/assets/wedding-animation.mp4";
import invitationBg from "@/assets/invitaion-bg.png";
import engagementImage from "@/assets/engagement.png";
import weddingImage from "@/assets/wedding.png";
import receptionImage from "@/assets/invitaion1-bg.png";
import topTornEdge from "@/assets/top-torn-svg.svg";
import bottomTornEdge from "@/assets/bottom-torn-svg.svg";

const weddingDate = new Date("2027-02-14T17:30:00+05:30");
const gallery = [
  { src: heroImage, alt: "Saanvi and Jai in a palace garden", ratio: "portrait" },
  { src: ringsImage, alt: "Henna, heirloom rings and jasmine", ratio: "landscape" },
  { src: walkImage, alt: "The couple walking through a sunlit colonnade", ratio: "portrait" },
  { src: laughImage, alt: "The couple laughing beneath white flowers", ratio: "landscape" },
];

function useCountdown() {
  const calculate = () => {
    const distance = Math.max(0, weddingDate.getTime() - Date.now());
    return {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance / 3600000) % 24),
      minutes: Math.floor((distance / 60000) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    };
  };
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const initialTimer = window.setTimeout(() => setTime(calculate()), 500);
    const timer = window.setInterval(() => setTime(calculate()), 1000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, []);
  return time;
}

function ScratchBox({ label, value, onReveal }: { label: string; value: string; onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasRevealed = useRef(false);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#a77b36");
    gradient.addColorStop(0.45, "#ead49d");
    gradient.addColorStop(1, "#96702d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(255,255,255,.76)";
    ctx.font = "600 10px Manrope";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH", rect.width / 2, rect.height / 2 + 4);
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    ctx.save();
    ctx.scale(ratio, ratio);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(clientX - rect.left, clientY - rect.top, 21, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    for (let i = 3; i < pixels.length; i += 80) if (pixels[i] === 0) clear++;
    if (clear / (pixels.length / 80) > 0.34 && !hasRevealed.current) {
      hasRevealed.current = true;
      setRevealed(true);
      onReveal();
    }
  };

  return (
    <div className="scratch-item">
      <span>{label}</span>
      <strong>{value}</strong>
      {!revealed && (
        <canvas
          ref={canvasRef}
          aria-label={`Scratch to reveal ${label}`}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            scratch(event.clientX, event.clientY);
          }}
          onPointerMove={(event) => event.buttons === 1 && scratch(event.clientX, event.clientY)}
        />
      )}
    </div>
  );
}

function FloralMark() {
  return (
    <div className="floral-mark" aria-hidden="true">
      <span />
      <Heart size={12} fill="currentColor" />
      <span />
    </div>
  );
}

export function WeddingInvitation() {
  const countdown = useCountdown();
  const [mounted, setMounted] = useState(false);
  const [opened, setOpened] = useState(false);
  const [contentRevealed, setContentRevealed] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const [music, setMusic] = useState(false);
  const [progress, setProgress] = useState(0);
  const [revealedDates, setRevealedDates] = useState(0);
  const audioRef = useRef<{ context: AudioContext; oscillators: OscillatorNode[] } | null>(null);
  const swipeStart = useRef(0);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight * 0.88) element.dataset["visible"] = "true";
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % gallery.length), 4800);
    return () => window.clearInterval(timer);
  }, []);

  const toggleMusic = () => {
    if (music && audioRef.current) {
      void audioRef.current.context.close();
      audioRef.current = null;
      setMusic(false);
      return;
    }
    const AudioContextClass = window.AudioContext;
    const context = new AudioContextClass();
    const gain = context.createGain();
    gain.gain.value = 0.018;
    gain.connect(context.destination);
    const oscillators = [261.63, 329.63, 392].map((frequency, index) => {
      const oscillator = context.createOscillator();
      const toneGain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency / (index === 0 ? 2 : 1);
      toneGain.gain.value = 0.22;
      oscillator.connect(toneGain).connect(gain);
      oscillator.start();
      return oscillator;
    });
    audioRef.current = { context, oscillators };
    setMusic(true);
  };

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => {
      setContentRevealed(true);
    }, 1800); // Wait for the envelope scale-out animation
  };

  const moveLightbox = (direction: number) => {
    setLightbox((current) => current === null ? 0 : (current + direction + gallery.length) % gallery.length);
  };

  return (
    <main className={`wedding-page ${!contentRevealed ? 'locked-scroll' : ''}`}>
      {contentRevealed && <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} />}

      {!contentRevealed && (
        <div className="glitter-container" aria-hidden="true">
          {Array.from({ length: 40 }, (_, index) => <i key={index} className="glitter-particle" style={{ "--i": index, "--x": Math.random(), "--y": Math.random() } as React.CSSProperties} />)}
        </div>
      )}

      {contentRevealed && (
        <div className="particles" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}
        </div>
      )}

      {contentRevealed && (
        <>
          <Button className="music-button" size="icon" variant="outline" onClick={toggleMusic} aria-label={music ? "Pause ambient music" : "Play ambient music"}>
            {music ? <Pause /> : <Music2 />}
          </Button>
          <Button className="menu-button" size="icon" variant="outline" onClick={() => setNavOpen(!navOpen)} aria-label="Open navigation"><Menu /></Button>
          <nav className={navOpen ? "floating-nav is-open" : "floating-nav"} aria-label="Invitation sections">
            {["Invitation", "Story", "Memories", "Events", "Venue", "Notes"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setNavOpen(false)}>{item}</a>
            ))}
          </nav>
        </>
      )}

      {!contentRevealed && (
        <section id="invitation" className={opened ? "opening-screen is-open" : "opening-screen"}>
          <div className="opening-glow" />
          <div className="image-envelope-wrap">
            <img src={envelopeImage} alt="Wedding Invitation Envelope" className="envelope-img" />
            <button className="image-wax-seal" onClick={handleOpen} aria-label="Open the wedding invitation" />
          </div>
          <p className="opening-hint">Tap the seal to open</p>
        </section>
      )}

      {contentRevealed && (
        <>
          <section id="welcome" className="hero-section">
            <video src={weddingAnimation} autoPlay loop muted playsInline className="hero-video-bg" />
            <div className="hero-shade" />
            <div className="hero-copy" data-reveal>
              <p className="hero-subheading">WE ARE <br></br>GETTING MARRIED</p>
              <h1 className="hero-names">
                <span className="script-title">Samjin</span>
                <span className="hero-amp">&amp;</span>
                <span className="script-title">Jineesha</span>
              </h1>
              <div className="hero-gold-divider">
                <span className="divider-line" />
                <span className="divider-diamond">◇</span>
                <span className="divider-line" />
              </div>
              <p className="hero-action-text"></p>
              <div className="hero-scroll-indicator">
                <span>SCROLL TO DISCOVER</span>
                <div className="scroll-line" />
              </div>
            </div>
          </section>

          <section className="paper-section date-reveal-section torn-section" data-reveal>
            {/* <img className="torn-edge torn-edge-top" src={topTornEdge} alt="" aria-hidden="true" />
            <img className="torn-edge torn-edge-bottom" src={bottomTornEdge} alt="" aria-hidden="true" /> */}
            <p className="eyebrow">Save our date</p>
            <h2>A golden day awaits</h2>
            <p className="section-intro">Gently scratch each golden panel to reveal when our forever begins.</p>
            <div className="scratch-grid">
              <ScratchBox label="Day" value="14" onReveal={() => setRevealedDates((count) => count + 1)} />
              <ScratchBox label="Month" value="FEB" onReveal={() => setRevealedDates((count) => count + 1)} />
              <ScratchBox label="Year" value="2027" onReveal={() => setRevealedDates((count) => count + 1)} />
            </div>
            {revealedDates === 3 && (
              <div className="date-celebration" role="status">
                <div className="celebration-sparkles" aria-hidden="true">✦ ✧ ✦</div>
                <strong>Our forever begins</strong>
                <span>14 February 2027</span>
              </div>
            )}
          </section>

          <section className="invitation-band" data-reveal style={{ backgroundImage: `url(${invitationBg})` }}>
            <div className="formal-card">
              <p className="eyebrow">YOU ARE INVITED TO THE<br />WEDDING CEREMONY OF</p>

              <FloralMark />
              <h2 className="script-title card-person-name">Samjin</h2>

              <div className="parent-section">
                <span className="parent-label">SON OF</span>
                <strong className="parent-names">MR. SOOSADIMAI &amp; MRS. VEERGIN MARY</strong>
              </div>

              <p className="with-connector">With</p>

              <h2 className="script-title card-person-name">Jineesha</h2>

              <div className="parent-section">
                <span className="parent-label">DAUGHTER OF</span>
                <strong className="parent-names">MR. VIJITUS &amp; MRS. MARYTHASY</strong>
              </div>

              <div className="card-custom-message">
                <h3 className="message-title">Dear Friends and Family</h3>
                <p className="message-body">
                  Join us for a celebration of love, laughter, and unforgettable memories as we begin our forever.
                </p>
              </div>

              <strong className="card-event-date">SUNDAY · 14 FEBRUARY · 2027</strong>
              <span className="card-event-venue">at The Rambagh Palace, Jaipur</span>
            </div>
          </section>

          <section className="countdown-section torn-section" data-reveal>
            <img className="torn-edge torn-edge-top" src={topTornEdge} alt="" aria-hidden="true" />
            <img className="torn-edge torn-edge-bottom" src={bottomTornEdge} alt="" aria-hidden="true" />
            <p className="eyebrow">Counting every heartbeat</p>
            <h2>Until we say “I do”</h2>
            <div className="countdown">
              {Object.entries(countdown).map(([label, value]) => <div key={label}><strong>{mounted ? String(value).padStart(2, "0") : "00"}</strong><span>{label}</span></div>)}
            </div>
          </section>
                    <section id="memories" className="slideshow-section">
            {gallery.map((image, index) => <img key={image.src} className={slide === index ? "active" : ""} src={image.src} alt={image.alt} width={1280} height={index === 0 ? 1536 : 912} loading="lazy" />)}
            <div className="slideshow-shade" />
            <div className="slideshow-copy" data-reveal><p className="eyebrow">Beautiful memories</p><h2>Every frame, a chapter</h2><p>Of laughter held close and moments we will carry into forever.</p></div>
            <div className="slide-dots">{gallery.map((_, index) => <button key={index} className={slide === index ? "active" : ""} onClick={() => setSlide(index)} aria-label={`Show slide ${index + 1}`} />)}</div>
          </section>

          {/* <section id="story" className="story-section paper-section">
            <div data-reveal><p className="eyebrow">Written in the stars</p><h2>Our Love Story</h2></div>
            <div className="timeline">
              {[
                ["2019", "The first hello", "A rainy afternoon, one borrowed umbrella, and a conversation neither of us wanted to end."],
                ["2021", "A thousand little moments", "Coffee dates became journeys, familiar songs, and the quiet certainty of home."],
                ["2025", "The easiest yes", "Under a sky full of lanterns, we promised to choose each other in every lifetime."],
                ["2027", "Our forever begins", "Surrounded by everyone we love, our next chapter begins with you beside us."],
              ].map(([year, title, text], index) => <article key={year} data-reveal><span>{year}</span><div><small>Chapter {index + 1}</small><h3>{title}</h3><p>{text}</p></div></article>)}
            </div>
            <div className={storyOpen ? "how-we-met is-open" : "how-we-met"} data-reveal>
              <div><p className="eyebrow">The untold chapter</p><h3>How we really met</h3></div>
              <Button variant="outline" onClick={() => setStoryOpen(!storyOpen)}>{storyOpen ? "Hide the story" : "Turn the page"}</Button>
              {storyOpen && <p>Jai arrived twenty minutes late. Saanvi had ordered for him anyway—and somehow remembered exactly how he took his coffee. He says it was fate. She says it was excellent intuition.</p>}
            </div>
          </section> */}

          <section className="gallery-section paper-section torn-section">
            <img className="torn-edge torn-edge-top" src={topTornEdge} alt="" aria-hidden="true" />
            <img className="torn-edge torn-edge-bottom" src={bottomTornEdge} alt="" aria-hidden="true" />
            <div data-reveal><p className="eyebrow">Through our eyes</p><h2>A few favorite moments</h2></div>
            <div className="gallery-grid">
              {gallery.map((image, index) => <button key={image.src} className={image.ratio} onClick={() => setLightbox(index)} aria-label={`View ${image.alt} fullscreen`}><img src={image.src} alt={image.alt} width={1024} height={1280} loading="lazy" /><span>0{index + 1}</span></button>)}
            </div>
          </section>

          <section className="polaroid-section">
            <div data-reveal><p className="eyebrow">Little pieces of us</p><h2>Polaroid memories</h2></div>
            <div className="polaroids">
              {[walkImage, laughImage, ringsImage].map((src, index) => <figure key={src}><img src={src} alt={["A walk to remember", "The laugh we love", "A promise in gold"][index]} width={500} height={600} loading="lazy" /><figcaption>{["the long way home", "always laughing", "the promise"][index]}</figcaption></figure>)}
            </div>
          </section>

          <section id="events" className="events-section paper-section torn-section">
            <img className="torn-edge torn-edge-top" src={topTornEdge} alt="" aria-hidden="true" />
            <img className="torn-edge torn-edge-bottom" src={bottomTornEdge} alt="" aria-hidden="true" />
            <div data-reveal><p className="eyebrow">The celebrations</p><h2>Join us for</h2></div>
            <div className="event-list">
              <article className="event-card event-engagement" style={{ backgroundImage: `url(${engagementImage})` }} data-reveal><span>01</span><div><Heart /><p>Friday · February 12</p><h3>Engagement</h3><p>7:00 in the evening · The Garden Terrace</p><small>An evening of blessings, laughter & celebration</small></div></article>
              <article className="event-card event-wedding" style={{ backgroundImage: `url(${weddingImage})` }} data-reveal><span>02</span><div><CalendarDays /><p>Sunday · February 14</p><h3>Wedding</h3><p>5:30 in the evening · The Palace Courtyard</p><small>Baraat begins at 4:30 · Festive traditional attire</small></div></article>
              <article className="event-card event-reception"  style={{ backgroundImage: `url(${receptionImage})` }} data-reveal><span>03</span><div><CalendarDays /><p>Saturday · February 13</p><h3>Reception</h3><p>7:00 in the evening · The Mughal Gardens</p><small>Cocktails, dinner & dancing · Formal Indian attire</small></div></article>
            </div>
          </section>

          <section className="letter-section">
            <div className={letterOpen ? "love-envelope is-open" : "love-envelope"} data-reveal>
              <div className="love-letter"><p>Dear loved ones,</p><p>Every chapter of our lives carries a little of your love. Having you beside us as we begin this one would mean the world.</p><strong>With all our love,<br />Samjin &amp; Jineesha</strong></div>
              <div className="love-envelope-front"><Button className="letter-seal" onClick={() => setLetterOpen(!letterOpen)} aria-label="Open our love letter"><Heart fill="currentColor" /></Button></div>
            </div>
            <p className="opening-hint">{letterOpen ? "A note from our hearts" : "Tap the heart to open our letter"}</p>
          </section>

          <section id="venue" className="venue-section paper-section">
            <div className="venue-image"><img src={heroImage} alt="Palace gardens at the wedding venue" width={1024} height={1536} loading="lazy" /></div>
            <div className="venue-copy" data-reveal><p className="eyebrow">Where we gather</p><h2>Rambagh Palace</h2><p>Bhawani Singh Road<br />Jaipur, Rajasthan 302005</p><p className="venue-note">A storied palace where old-world grace meets a garden glowing in candlelight.</p><Button asChild><a href="https://maps.google.com/?q=Rambagh+Palace+Jaipur" target="_blank" rel="noreferrer"><MapPin /> Get directions</a></Button></div>
          </section>

          <section id="notes" className="faq-section">
            <div data-reveal><p className="eyebrow">A few thoughtful details</p><h2>Before you arrive</h2></div>
            <div className="faq-list">
              {[
                ["What should I wear?", "Festive Indian or formal attire. Our palette is ivory, rose, sage and jewel tones—wear what makes you feel wonderful."],
                ["May I bring a guest?", "Your invitation will note whether a guest has been included. We’re keeping our celebration intimate."],
                ["Will transport be provided?", "Shuttles will depart selected hotels 45 minutes before each event. Final timings will be shared closer to the date."],
                ["Can I take photos?", "We invite you to be fully present during the ceremony. Afterward, capture every happy moment and tag #SaanviAndJai."],
              ].map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown /></summary><p>{answer}</p></details>)}
            </div>
          </section>

          <section className="final-section">
            <img src={laughImage} alt="Samjin and Jineesha laughing together at dusk" width={1280} height={912} loading="lazy" />
            <div className="final-shade" />
            <div data-reveal><Sparkles /><p className="eyebrow">With you, always</p><h2>And So Our<br /><em>Forever Begins...</em></h2><p>14 · 02 · 2027</p><span>Samjin &amp; Jineesha</span></div>
          </section>

          {lightbox !== null && (
            <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo gallery" onPointerDown={(event) => { swipeStart.current = event.clientX; }} onPointerUp={(event) => { const distance = event.clientX - swipeStart.current; if (Math.abs(distance) > 40) moveLightbox(distance > 0 ? -1 : 1); }}>
              <Button size="icon" variant="ghost" className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close gallery"><X /></Button>
              <Button size="icon" variant="ghost" className="lightbox-prev" onClick={() => moveLightbox(-1)} aria-label="Previous photo"><ChevronLeft /></Button>
              <img src={gallery[lightbox]?.src} alt={gallery[lightbox]?.alt ?? "Wedding memory"} />
              <Button size="icon" variant="ghost" className="lightbox-next" onClick={() => moveLightbox(1)} aria-label="Next photo"><ChevronRight /></Button>
              <span>{lightbox + 1} / {gallery.length}</span>
            </div>
          )}
        </>
      )}
    </main>
  );
}