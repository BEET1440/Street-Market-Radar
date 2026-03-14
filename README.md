# Street Market Radar 🚀

Street Market Radar is a real-time digital infrastructure designed to map, organize, and connect the informal street economy. This platform enables buyers to locate nearby mobile vendors while providing vendors with demand visibility and location-sharing tools.

## ✨ Features

- 🗺️ **Real-time Mapping**: See moving vendors in your neighborhood using interactive maps.
- 🏪 **Vendor Dashboard**: Vendors can go "live", update their location via GPS, and manage their inventory.
- 🛍️ **Buyer Interface**: Easily search for specific goods or vendors and see who's nearby.
- 📱 **Mobile First**: Designed for use on the go for both vendors and buyers.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Maps**: [Leaflet](https://leafletjs.com/) with [React Leaflet](https://react-leaflet.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/street-market-radar.git
   cd street-market-radar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

This project is ready to be deployed on **Vercel**:

1. Push your code to a GitHub repository.
2. Import the project into [Vercel](https://vercel.com/).
3. Vercel will automatically detect Next.js and deploy the app.

Alternatively, you can build and start the production server manually:

```bash
npm run build
npm start
```

## 🗺️ Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (Map, etc.).
- `src/context`: React Context for state management (Vendor status, real-time updates).
- `src/globals.css`: Global styles and Tailwind imports.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---
Built with ❤️ for the street economy.
