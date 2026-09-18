import htm from 'https://unpkg.com/htm?module';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@12.0.0/lib/marked.esm.js';

const html = htm.bind(h);

const ProductCardPreview = createClass({
  getInitialState() {
    return {
      activeVersion: {}, // itemIndex -> versionIndex
      activeImage: {},   // itemIndex -> imageSrc
    };
  },

  resolveAsset(imgPath) {
    if (!imgPath) return '';
    const asset = this.props.getAsset(imgPath);
    return asset ? asset.toString() : imgPath;
  },

  normalizeImage(img) {
    if (!img) return '';
    if (typeof img === 'string') return this.resolveAsset(img);
    if (typeof img === 'object' && img.image) return this.resolveAsset(img.image);
    return '';
  },

  render() {
    const { entry } = this.props;
    const rawItems = entry.getIn(['data', 'items']);
    const items = rawItems ? (rawItems.toJS ? rawItems.toJS() : rawItems) : [];

    if (!items.length) {
      return html`
        <div style="padding: 2rem; color: #6b7280; font-family: sans-serif; text-align: center;">
          Adaugă un produs în listă pentru a vedea previzualizarea cardului.
        </div>
      `;
    }

    return html`
      <div class="preview-root">
        <style>
          :root {
            --accent-gold: #c5a059;
            --accent-gold-hover: #b8860b;
            --card-bg: #ffffff;
            --border-subtle: #e5e7eb;
            --text-primary: #1a1a1a;
            --text-secondary: #4b5563;
          }

          .preview-root {
            padding: 2rem;
            background: #f3f4f6;
            min-height: 100vh;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .product-card {
            background: var(--card-bg);
            border-radius: 12px;
            box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(0, 0, 0, 0.04);
            padding: 2.5rem;
            box-sizing: border-box;
            max-width: 1200px;
            margin: 0 auto 3rem auto;
          }

          .product-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 2.1rem;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0 0 2rem 0;
            line-height: 1.2;
          }

          .product-content-grid {
            display: grid;
            grid-template-columns: 5fr 4fr;
            gap: 3rem;
            align-items: start;
          }

          @media (max-width: 860px) {
            .product-content-grid {
              grid-template-columns: 1fr;
              gap: 2rem;
            }
          }

          .divider {
            height: 1px;
            background-color: var(--border-subtle);
            margin: 1.5rem 0;
            width: 100%;
          }

          /* Gallery */
          .gallery-column {
            display: flex;
            flex-direction: column;
          }

          .main-image-viewport {
            width: 100%;
            aspect-ratio: 4 / 3;
            border-radius: 8px;
            overflow: hidden;
            background-color: #f9fafb;
            border: 1px solid var(--border-subtle);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .main-image-viewport img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .thumbnail-strip {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .thumb-btn {
            width: 72px;
            height: 72px;
            padding: 0;
            border: 2px solid transparent;
            border-radius: 6px;
            overflow: hidden;
            background: transparent;
            cursor: pointer;
            outline: none;
            transition: all 0.2s ease;
          }

          .thumb-btn img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .thumb-btn:hover {
            border-color: #d1d5db;
          }

          .thumb-btn.active {
            border-color: var(--accent-gold);
            box-shadow: 0 0 0 1px var(--accent-gold);
          }

          /* Details */
          .details-column {
            display: flex;
            flex-direction: column;
          }

          .section-label {
            font-size: 1.05rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0 0 1rem 0;
          }

          .versions-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .version-chip {
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.5rem 0.9rem;
            border-radius: 8px;
            border: 1px solid var(--border-subtle);
            background-color: #fafafa;
            color: var(--text-secondary);
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .version-thumb {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            object-fit: cover;
          }

          .version-chip:hover {
            border-color: var(--accent-gold);
            color: var(--text-primary);
            background-color: #ffffff;
          }

          .version-chip.active {
            border-color: var(--accent-gold);
            background-color: #fdfbf7;
            color: #926615;
            font-weight: 600;
            box-shadow: 0 0 0 1px var(--accent-gold);
          }

          .version-description {
            font-size: 0.98rem;
            line-height: 1.7;
            color: var(--text-secondary);
          }

          .version-description p {
            margin: 0 0 0.8rem 0;
          }

          .version-description strong {
            color: var(--text-primary);
          }
        </style>

        ${items.map((item, itemIdx) => {
          const versions = item.versions || [];
          const activeVerIdx = this.state.activeVersion[itemIdx] ?? 0;
          const currentVersion = versions[activeVerIdx] || {};

          const rawImages = currentVersion.images || [];
          const images = rawImages.map(img => this.normalizeImage(img)).filter(Boolean);

          const activeImg = this.state.activeImage[itemIdx] || images[0] || '';
          const rawDescription = currentVersion.description || item.description || '';
          const parsedDescription = rawDescription ? marked.parse(rawDescription) : '';

          return html`
            <main class="product-card" key=${itemIdx}>
              <h1 class="product-title">${item.title || 'Nume Produs'}</h1>

              <div class="product-content-grid">
                <!-- Gallery Column -->
                <section class="gallery-column">
                  <div class="main-image-viewport">
                    ${activeImg
                      ? html`<img src="${activeImg}" alt="${item.title || ''}" />`
                      : html`<span style="color: #9ca3af;">Fără imagine</span>`}
                  </div>

                  <div class="divider"></div>

                  <div class="thumbnail-strip" role="region" aria-label="Galerie imagini">
                    ${images.map((img, imgIdx) => {
                      const isSelected = activeImg === img || (!activeImg && imgIdx === 0);
                      return html`
                        <button
                          type="button"
                          class="thumb-btn ${isSelected ? 'active' : ''}"
                          onClick=${() => {
                            this.setState(prev => ({
                              activeImage: { ...prev.activeImage, [itemIdx]: img }
                            }));
                          }}
                        >
                          <img src="${img}" alt="" />
                        </button>
                      `;
                    })}
                  </div>
                </section>

                <!-- Details Column -->
                <section class="details-column">
                  <h2 class="section-label">Variante disponibile:</h2>

                  <div class="versions-list">
                    ${versions.map((v, vIdx) => {
                      const isSelected = vIdx === activeVerIdx;
                      const thumb = v.images && v.images[0] ? this.normalizeImage(v.images[0]) : '';

                      return html`
                        <div
                          class="version-chip ${isSelected ? 'active' : ''}"
                          onClick=${() => {
                            const newVerImages = (v.images || []).map(i => this.normalizeImage(i)).filter(Boolean);
                            this.setState(prev => ({
                              activeVersion: { ...prev.activeVersion, [itemIdx]: vIdx },
                              activeImage: { ...prev.activeImage, [itemIdx]: newVerImages[0] || '' }
                            }));
                          }}
                        >
                          ${thumb ? html`<img src="${thumb}" alt="" class="version-thumb" />` : null}
                          <span>${v.title || `Varianta ${vIdx + 1}`}</span>
                        </div>
                      `;
                    })}
                  </div>

                  <div class="divider"></div>

                  ${parsedDescription
                    ? html`<div class="version-description" dangerouslySetInnerHTML=${{ __html: parsedDescription }}></div>`
                    : null}
                </section>
              </div>
            </main>
          `;
        })}
      </div>
    `;
  },
});

CMS.registerPreviewTemplate('categories', ProductCardPreview);
