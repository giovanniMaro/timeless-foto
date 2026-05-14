// pages/index.js
import { useState, useEffect, useCallback } from "react";
import Head from "next/head";

const FORMATS = [
  {
    id: "pov",
    label: "P.O.V.",
    description: "Il tuo punto di vista sul dancefloor",
  },
  {
    id: "t2a",
    label: "Time2Ape",
    description: "È il momento di scatenarsi",
  },
  {
    id: "nsr",
    label: "Not So Rich",
    description: "Il lusso è uno stato mentale",
  },
];

export default function Home() {
  const [activeFormat, setActiveFormat] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState(null); // index of open image

  const fetchImages = useCallback(async (tag) => {
    setLoading(true);
    setImages([]);
    try {
      const res = await fetch(`/api/gallery?tag=${tag}`);
      const data = await res.json();
      setImages(data.images || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFormatClick = (format) => {
    if (activeFormat?.id === format.id) {
      setActiveFormat(null);
      setImages([]);
      return;
    }
    setActiveFormat(format);
    fetchImages(format.id);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handler = (e) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, images.length]);

  return (
    <>
      <Head>
        <title>TIMELESS</title>
        <meta name="description" content="Timeless — Events Gallery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@200;300;400&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="page">
        {/* HEADER */}
        <header className="header">
          <div className="logo-wrap">
            <h1 className="logo">TIMELESS</h1>
            <div className="logo-line" />
          </div>
          <p className="tagline">Events &amp; Experiences</p>
        </header>

        {/* FORMAT SELECTOR */}
        <nav className="formats">
          {FORMATS.map((fmt, i) => (
            <button
              key={fmt.id}
              className={`format-btn ${activeFormat?.id === fmt.id ? "active" : ""}`}
              onClick={() => handleFormatClick(fmt)}
            >
              <span className="fmt-number">0{i + 1}</span>
              <span className="fmt-label">{fmt.label}</span>
              <span className="fmt-desc">{fmt.description}</span>
            </button>
          ))}
        </nav>

        {/* GALLERY */}
        {activeFormat && (
          <section className="gallery-section">
            <div className="gallery-header">
              <h2 className="gallery-title">{activeFormat.label}</h2>
              <div className="gallery-count">
                {loading ? "—" : `${images.length} foto`}
              </div>
            </div>

            {loading && (
              <div className="loader">
                <div className="loader-dots">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {!loading && images.length === 0 && (
              <p className="empty">Nessuna foto trovata per questo format.</p>
            )}

            {!loading && images.length > 0 && (
              <div className="grid">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="grid-item"
                    onClick={() => setLightbox(idx)}
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <img src={img.thumb} alt={img.id} loading="lazy" />
                    <div className="grid-overlay" />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {!activeFormat && (
          <div className="cta-hint">
            <span>Seleziona un format per vedere la gallery</span>
          </div>
        )}

        {/* LIGHTBOX */}
        {lightbox !== null && images[lightbox] && (
          <div className="lightbox" onClick={() => setLightbox(null)}>
            <button className="lb-close" onClick={() => setLightbox(null)}>
              ✕
            </button>
            <button
              className="lb-prev"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((i) => (i - 1 + images.length) % images.length);
              }}
            >
              ‹
            </button>
            <img
              src={images[lightbox].url}
              alt=""
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="lb-next"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((i) => (i + 1) % images.length);
              }}
            >
              ›
            </button>
            <div className="lb-counter">
              {lightbox + 1} / {images.length}
            </div>
          </div>
        )}

        <footer className="footer">
          <span>© {new Date().getFullYear()} Timeless</span>
        </footer>
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: #0a0a0a;
          color: #e8e2d9;
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>

      <style jsx>{`
        .page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 32px 80px;
        }

        /* HEADER */
        .header {
          text-align: center;
          padding: 80px 0 48px;
          position: relative;
        }
        .logo-wrap {
          display: inline-block;
          position: relative;
        }
        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(3.5rem, 10vw, 8rem);
          letter-spacing: 0.35em;
          color: #e8e2d9;
          line-height: 1;
        }
        .logo-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
          margin-top: 12px;
          width: 100%;
        }
        .tagline {
          font-family: 'Montserrat', sans-serif;
          font-weight: 200;
          font-size: 0.7rem;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: #6b6560;
          margin-top: 16px;
        }

        /* FORMATS NAV */
        .formats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          margin: 48px 0 0;
          border: 1px solid #1e1e1e;
        }
        .format-btn {
          background: #0e0e0e;
          border: none;
          border-right: 1px solid #1e1e1e;
          padding: 40px 32px;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: background 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .format-btn:last-child { border-right: none; }
        .format-btn::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: #c9a84c;
          transform: scaleX(0);
          transition: transform 0.35s ease;
          transform-origin: left;
        }
        .format-btn:hover { background: #121212; }
        .format-btn:hover::after,
        .format-btn.active::after { transform: scaleX(1); }
        .format-btn.active { background: #121212; }

        .fmt-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.75rem;
          color: #c9a84c;
          letter-spacing: 0.2em;
        }
        .fmt-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 300;
          color: #e8e2d9;
          letter-spacing: 0.05em;
          line-height: 1;
        }
        .fmt-desc {
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #4a4540;
          margin-top: 4px;
        }

        /* GALLERY */
        .gallery-section {
          margin-top: 64px;
          animation: fadeUp 0.5s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .gallery-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          border-bottom: 1px solid #1e1e1e;
          padding-bottom: 16px;
          margin-bottom: 32px;
        }
        .gallery-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 2rem;
          letter-spacing: 0.1em;
          color: #e8e2d9;
        }
        .gallery-count {
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #4a4540;
        }

        /* GRID */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 3px;
        }
        .grid-item {
          position: relative;
          aspect-ratio: 3/2;
          overflow: hidden;
          cursor: pointer;
          opacity: 0;
          animation: fadeIn 0.5s ease forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        .grid-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .grid-item:hover img { transform: scale(1.05); }
        .grid-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0);
          transition: background 0.3s ease;
        }
        .grid-item:hover .grid-overlay {
          background: rgba(201,168,76,0.08);
        }

        /* LOADER */
        .loader {
          display: flex;
          justify-content: center;
          padding: 80px 0;
        }
        .loader-dots {
          display: flex;
          gap: 8px;
        }
        .loader-dots span {
          width: 6px; height: 6px;
          background: #c9a84c;
          border-radius: 50%;
          animation: pulse 1.2s ease-in-out infinite;
        }
        .loader-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loader-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }

        .empty {
          text-align: center;
          padding: 80px 0;
          color: #4a4540;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .cta-hint {
          text-align: center;
          padding: 100px 0;
          color: #2e2b28;
          font-size: 0.65rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
        }

        /* LIGHTBOX */
        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.95);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        .lightbox img {
          max-width: 90vw;
          max-height: 90vh;
          object-fit: contain;
          box-shadow: 0 0 80px rgba(0,0,0,0.8);
        }
        .lb-close {
          position: fixed;
          top: 24px; right: 32px;
          background: none; border: none;
          color: #e8e2d9; font-size: 1.5rem;
          cursor: pointer; z-index: 10;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .lb-close:hover { opacity: 1; }
        .lb-prev, .lb-next {
          position: fixed;
          top: 50%; transform: translateY(-50%);
          background: none; border: none;
          color: #e8e2d9; font-size: 3rem;
          cursor: pointer; z-index: 10;
          opacity: 0.4;
          transition: opacity 0.2s;
          padding: 16px;
          line-height: 1;
        }
        .lb-prev { left: 16px; }
        .lb-next { right: 16px; }
        .lb-prev:hover, .lb-next:hover { opacity: 1; }
        .lb-counter {
          position: fixed;
          bottom: 24px; left: 50%; transform: translateX(-50%);
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          color: #4a4540;
        }

        /* FOOTER */
        .footer {
          text-align: center;
          padding-top: 80px;
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #2e2b28;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .page { padding: 0 16px 60px; }
          .formats {
            grid-template-columns: 1fr;
          }
          .format-btn {
            border-right: none;
            border-bottom: 1px solid #1e1e1e;
            padding: 28px 20px;
          }
          .format-btn:last-child { border-bottom: none; }
          .grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          }
          .lb-prev { left: 4px; }
          .lb-next { right: 4px; }
        }
      `}</style>
    </>
  );
}
