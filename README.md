# What to Pack v1

A smart packing list generator that uses real-time weather data to provide personalized clothing recommendations for your trips.

## 🌟 Features

- **Real Weather Data**: Powered by [Open-Meteo](https://open-meteo.com/) API for accurate forecasts
- **Temperature Tolerance**: Choose your comfort level (cold-sensitive, neutral, heat-sensitive)
- **Smart Packing Logic**: Calculates optimal clothing quantities based on trip duration and weather

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17.1 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd whattopack-v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.5 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom NYC Subway theme
- **UI Components**: Headless UI + Heroicons
- **Weather API**: Open-Meteo (free, no API key required)
- **Geocoding**: Open-Meteo Geocoding API
- **Validation**: Zod schema validation
- **Animations**: Framer Motion

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Landing page
│   └── plan/              # Planning page
│       ├── actions.ts     # Server actions for form processing
│       └── page.tsx       # Planning page component
├── components/            # Reusable React components
│   ├── Badge.tsx         # NYC Subway-style circular badges
│   ├── DatePicker.tsx    # Custom calendar date picker
│   ├── ErrorState.tsx    # Error display component
│   ├── FormCard.tsx      # Main form component
│   ├── LoadingState.tsx  # Loading animation component
│   └── ResultCard.tsx    # Results display component
├── types/                # TypeScript type definitions
│   └── index.ts          # Main type definitions
└── utils/                # Utility functions
    ├── rateLimit.ts      # Rate limiting implementation
    └── weather.ts        # Weather API integration
```

## 🌤️ API Integration

### Open-Meteo Weather API

The app uses Open-Meteo's free weather API to fetch real-time forecasts:

- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Data**: Daily temperature (max/min), precipitation probability
- **Coverage**: Global with high resolution (1-11km)
- **Updates**: Hourly updates with real-time data

### Geocoding API

City names are converted to coordinates using Open-Meteo's geocoding service:

- **Endpoint**: `https://geocoding-api.open-meteo.com/v1/search`
- **Features**: Multi-language support, fuzzy matching

### Date Limitations

Due to Open-Meteo's current data availability, weather forecasts are limited to:
- **Valid Range**: May 3, 2025 - August 19, 2025
- **Reason**: API data availability constraints
- **Future**: Will expand as more historical data becomes available

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Variables

No environment variables are required for basic functionality. The app uses free, public APIs.

### Adding New Features

1. **Components**: Add to `src/components/`
2. **Pages**: Add to `src/app/`
3. **Types**: Add to `src/types/index.ts`
4. **Utilities**: Add to `src/utils/`

## 📊 Packing Logic

The app uses sophisticated algorithms to generate packing recommendations:

### Temperature Tolerance

- **Cold-sensitive**: +2°C perceived temperature
- **Neutral**: No adjustment
- **Heat-sensitive**: -2°C perceived temperature

### Clothing Quantities

- **Tops**: Based on trip duration and humidity
- **Bottoms**: Optimized for trip length
- **Outerwear**: Temperature-based recommendations
- **Footwear**: Duration and climate considerations
- **Accessories**: Weather and comfort factors

### Weather Factors

- **Temperature Range**: Min/max daily temperatures
- **Precipitation**: Rain probability percentages
- **Humidity**: Moisture levels (estimated)
- **Duration**: Trip length in days

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your Git repository to Vercel
2. **Auto Deploy**: Every push to main branch triggers deployment
3. **Environment**: No additional configuration needed

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Open-Meteo**: For providing free, reliable weather data
- **Next.js Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **NYC MTA**: For design inspiration

## 📞 Support

If you encounter any issues or have questions:

1. **Check the documentation** above
2. **Search existing issues** in the repository
3. **Create a new issue** with detailed information

---

**Built with ❤️ using Next.js, TypeScript, and real-time weather data**