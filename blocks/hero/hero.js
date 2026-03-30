/**
 * Hero Block - rerdade futebolista
 * Text rotation effect (replaces Morphext/WOW.js flipInX animation)
 * Cycles through text variants in the hero heading
 */
export default function decorate(block) {
  // Trigger staggered entrance animation
  block.classList.add('hero-animated');

  const heading = block.querySelector('h2');
  if (!heading) return;

  // Extract rotating text from heading
  // Original format: "Rerdade = Liberdade 自由"
  // The original site rotates: Liberdade 自由, Verdade 真実, Felicidade 幸福, Respeito 尊重
  const headingText = heading.textContent;
  const match = headingText.match(/^(.+=\s*).+$/);
  if (!match) return;

  const prefix = match[1]; // "Rerdade = "
  const rotatingTexts = [
    'Liberdade 自由',
    'Verdade 真実',
    'Felicidade 幸福',
    'Respeito 尊重',
  ];

  // Build rotating HTML structure
  const span = document.createElement('span');
  span.className = 'hero-rotating';

  const textSpan = document.createElement('span');
  textSpan.className = 'hero-rotating-text';
  textSpan.textContent = rotatingTexts[0];
  span.appendChild(textSpan);

  heading.textContent = prefix;
  heading.appendChild(span);

  // Rotate text every 5 seconds (matching original hero_speed: 5000)
  let currentIndex = 0;
  setInterval(() => {
    textSpan.classList.add('hero-rotating-out');
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % rotatingTexts.length;
      textSpan.textContent = rotatingTexts[currentIndex];
      textSpan.classList.remove('hero-rotating-out');
      textSpan.classList.add('hero-rotating-in');
      setTimeout(() => {
        textSpan.classList.remove('hero-rotating-in');
      }, 750);
    }, 400);
  }, 5000);
}
