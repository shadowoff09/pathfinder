# 🗺️ Pathfinder

<div align="center">
  <img src="public/banner.png" alt="Pathfinder Banner" width="1280"/>
  
  A modern, interactive mapping application built with Next.js 15, MapboxGL, and TypeScript. Pathfinder provides a seamless mapping experience with features like real-time weather data, location search, and customizable map styles.

  [Demo](https://pathfinder.shadowdev.xyz) · [Report Bug](https://github.com/shadowoff09/pathfinder/issues) · [Request Feature](https://github.com/shadowoff09/pathfinder/issues)
</div>

## ✨ Features

- 🌓 Dark/Light mode support
- 🏢 3D Building visualization
- 🔍 Location search with autocomplete
- 🌤️ Real-time weather information
- 📍 Current location detection
- 🛰️ Street/Satellite view toggle
- 📱 Fully responsive design
- ⌨️ Keyboard shortcuts support
- 🎨 Modern UI with Tailwind CSS and shadcn/ui

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ 
- A Mapbox API key
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shadowoff09/pathfinder.git
cd pathfinder
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your Mapbox API key:
```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Usage

### Map Navigation
- Pan: Click and drag
- Zoom: Scroll or use the zoom controls
- Rotate: Right-click and drag
- Reset View: Press Ctrl+Q

### Features
- Search locations using the search bar
- Toggle between street and satellite view
- View 3D buildings in street view mode (zoom level 15+)
- Check weather information (zoom level 14+)
- Get current location with one click
- Copy coordinates to clipboard

## 🛠️ Built With

- [Next.js 15](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js) - Maps API
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [React Map GL](https://visgl.github.io/react-map-gl/) - React wrapper for Mapbox GL

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Mapbox](https://www.mapbox.com/) for their excellent mapping platform
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Vercel](https://vercel.com) for hosting and deployment

## 📫 Contact

shadow - [@shadowdev09](https://twitter.com/shadowdev09)

Project Link: [https://github.com/shadowoff09/pathfinder](https://github.com/shadowoff09/pathfinder)

---

⭐️ If you like this project, please give it a star!
