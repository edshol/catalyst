import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      const hasPicture = div.querySelector('picture');
      const hasOnlyImage = div.children.length === 1
        && (hasPicture || div.querySelector('img'));
      if (hasOnlyImage) {
        div.className = 'cards-featured-card-image';
        // Wrap bare img in picture if needed
        const img = div.querySelector('img');
        if (img && !img.closest('picture')) {
          const picture = document.createElement('picture');
          img.parentElement.replaceChild(picture, img);
          picture.append(img);
        }
      } else {
        div.className = 'cards-featured-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const isExternal = img.src && new URL(img.src, window.location.href).origin !== window.location.origin;
    if (isExternal) {
      img.setAttribute('loading', 'lazy');
      return;
    }
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
