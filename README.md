# Akshun Kalra | Brutalist Portfolio

A modern, high-performance personal portfolio website featuring a brutalist aesthetic and interactive background effects.

## Features

- **Brutalist Design**: High contrast, bold components, and raw layout aesthetics.
- **Interactive "Pixel Blast" Background**: A custom implementation of the [ReactBits Pixel Blast](https://reactbits.dev/backgrounds/pixel-blast) effect using Vanilla JS and Canvas.
  - Organic flowing noise patterns.
  - Interactive mouse response with ripples and pixel intensity changes.
- **Performance Optimized**:
  - `IntersectionObserver` to pause animations when off-screen.
  - Throttled scroll handlers and passive event listeners.
  - Efficient canvas rendering.
- **Responsive Layout**: Fully adaptive design for all device sizes.
- **Privacy Focused**: Direct contact information removed in favor of social links and contact form.

## Tech Stack

- **HTML5**
- **CSS3** (Custom Properties, Flexbox, Grid)
- **Vanilla JavaScript** (ES6+)
- **Canvas API** (for background effects)
- **No Frameworks**: Pure, lightweight code for maximum performance.

## 🚀 Setup & Usage

Since this is a static site, you can view it directly:

1.  Clone the repository:
    ```bash
    git clone https://github.com/anochronos/portfolio-brutalist.git
    ```
2.  Open `index.html` in your browser.

## Structure

- `index.html`: Main portfolio structure.
- `styles.css`: All styling, including the brutalist design system and responsive rules.
- `script.js`: Logic for the Pixel Blast background, scroll animations, and interactivity.

## Credits

- **Background Effect**: Inspired by [ReactBits](https://reactbits.dev/).
- **Design Philosophy**: Modern Brutalism.

## License

This project is open source and available under the [MIT License](LICENSE).
