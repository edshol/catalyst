var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const bgImage = element.querySelector('.parallax-bg img, img[class*="hero"]');
    const heading = element.querySelector("h2.hero-large-text, h2, h1");
    const subtitle = element.querySelector(".hero-small-text p, .hero-small-text");
    const ctaLinks = Array.from(element.querySelectorAll("a.btn, a.button, .hero__content > a"));
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subtitle) contentCell.push(subtitle);
    contentCell.push(...ctaLinks);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    const cells = [];
    const inStaff = !!element.closest("#staff");
    const inSponsor = !!element.closest("#sponsor");
    const inNews = !!element.closest("#news");
    if (inStaff) {
      const items = element.querySelectorAll(".service-item");
      items.forEach((item) => {
        const img = item.querySelector(".service-image img, img");
        const title = item.querySelector(".service-title, h4");
        const desc = item.querySelector(".service-content p, p");
        const link = item.querySelector(".service-link");
        const textCell = [];
        if (title) {
          const strong = document.createElement("strong");
          strong.textContent = title.textContent.trim();
          textCell.push(strong);
        }
        if (desc) textCell.push(desc);
        if (link && link.href) {
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = title ? title.textContent.trim() : "Read more";
          textCell.push(a);
        }
        cells.push([img || "", textCell]);
      });
    } else if (inSponsor) {
      const slides = element.querySelectorAll(".keen-slider__slide");
      slides.forEach((slide) => {
        const img = slide.querySelector("img");
        const name = slide.querySelector(".name, h3");
        const desc = slide.querySelector(".desc, span.desc");
        const link = slide.querySelector(".slider-link, a");
        const textCell = [];
        if (name) {
          const strong = document.createElement("strong");
          strong.textContent = name.textContent.trim();
          textCell.push(strong);
        }
        if (desc && desc.textContent.trim() && desc.textContent.trim() !== "...") {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          textCell.push(p);
        }
        if (link && link.href && link.href !== "#") {
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = name ? name.textContent.trim() : "Visit";
          textCell.push(a);
        }
        cells.push([img || "", textCell]);
      });
    } else if (inNews) {
      const articles = element.querySelectorAll("article, .blog-entry");
      const targets = articles.length > 0 ? articles : [element];
      targets.forEach((article) => {
        const img = article.querySelector(".list-article-thumb img, img");
        const titleLink = article.querySelector(".entry-title a, .entry-title");
        const excerpt = article.querySelector(".entry-excerpt p, .entry-excerpt");
        const textCell = [];
        if (titleLink) {
          const strong = document.createElement("strong");
          if (titleLink.tagName === "A") {
            const a = document.createElement("a");
            a.href = titleLink.href;
            a.textContent = titleLink.textContent.trim();
            strong.appendChild(a);
          } else {
            strong.textContent = titleLink.textContent.trim();
          }
          textCell.push(strong);
        }
        if (excerpt) textCell.push(excerpt);
        cells.push([img || "", textCell]);
      });
    } else {
      const items = element.querySelectorAll(":scope > div, :scope > li, :scope > article");
      items.forEach((item) => {
        const img = item.querySelector("img");
        const text = item.querySelector("h3, h4, strong, p");
        cells.push([img || "", text || ""]);
      });
    }
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/rerdade-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      const heroSection = element.querySelector("#parallax-hero");
      const headerSection = element.querySelector("#header-section");
      if (heroSection && headerSection && headerSection.parentElement) {
        headerSection.parentElement.insertBefore(heroSection, headerSection.nextSibling);
      }
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        ".c-bully",
        ".section-parallax"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "#header-section",
        "footer#colophon",
        ".feature-item",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-wow-duration");
      });
    }
  }

  // tools/importer/transformers/rerdade-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(metaBlock);
        }
        if (section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          if (sectionEl.parentElement) {
            sectionEl.parentElement.insertBefore(hr, sectionEl);
          }
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero": parse,
    "cards": parse2
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    urls: [
      "https://rerdade.com/"
    ],
    description: "Rerdade homepage - main landing page with hero, about, school info, staff, gallery, sponsors, news, and access sections",
    blocks: [
      {
        name: "hero",
        instances: ["#parallax-hero"]
      },
      {
        name: "cards",
        instances: ["#staff .row", "#sponsor .keen-slider", "#news .blog-entry"]
      }
    ],
    sections: [
      {
        id: "hero",
        name: "Hero",
        selector: ["#parallax-hero", "section#hero"],
        style: "dark",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "about",
        name: "About",
        selector: "section#about",
        style: null,
        blocks: [],
        defaultContent: ["#about .section-title", "#about .section-desc blockquote", "#about .section-desc p"]
      },
      {
        id: "school",
        name: "School Info",
        selector: "section#school",
        style: null,
        blocks: [],
        defaultContent: ["#school .section-title", "#school .section-desc table", "#school .section-desc ul"]
      },
      {
        id: "staff",
        name: "Staff",
        selector: "section#staff",
        style: null,
        blocks: ["cards"],
        defaultContent: ["#staff .section-title"]
      },
      {
        id: "gallery",
        name: "Gallery",
        selector: "section#gallery",
        style: null,
        blocks: [],
        defaultContent: ["#gallery .section-title", "#gallery .g-item img"]
      },
      {
        id: "sponsor",
        name: "Sponsors",
        selector: "section#sponsor",
        style: null,
        blocks: ["cards"],
        defaultContent: ["#sponsor .section-title"]
      },
      {
        id: "news",
        name: "News",
        selector: "section#news",
        style: null,
        blocks: ["cards"],
        defaultContent: ["#news .section-title", "#news .all-news a"]
      },
      {
        id: "access",
        name: "Access / Contact",
        selector: "section#access",
        style: null,
        blocks: [],
        defaultContent: ["#access .section-title", "#access .section-desc a", "#access .address-box"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
