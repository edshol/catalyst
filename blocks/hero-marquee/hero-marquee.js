export default function decorate(block) {
  const firstDiv = block.querySelector(':scope > div:first-child');
  const hasImage = firstDiv && (firstDiv.querySelector('picture') || firstDiv.querySelector('img'));
  if (!hasImage) {
    block.classList.add('no-image');
  }
}
