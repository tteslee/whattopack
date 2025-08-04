# What to Wear v.1

A smart packing list generator that uses live weather data to create personalized packing recommendations for your trips.

## Features

- **Weather-based packing lists**: Get recommendations based on actual weather forecasts
- **Temperature tolerance**: Choose your comfort level (cold-sensitive, neutral, heat-sensitive)
- **Duration scaling**: Packing counts automatically adjust to trip length
- **NYC Subway-inspired design**: Clean, bold, information-first UI
- **Mobile responsive**: Works perfectly on all devices
- **Real-time validation**: Form validation with helpful error messages

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Animations**: Framer Motion
- **Weather API**: OpenWeatherMap (ready for integration)

## Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd whattowear-v1
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your weather API key:
```
WEATHER_API_KEY=your_openweathermap_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── plan/
│   │   ├── page.tsx          # Plan page
│   │   └── actions.ts        # Server action for form handling
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── Badge.tsx             # NYC Subway-style badges
│   ├── FormCard.tsx          # Main form component
│   ├── ResultCard.tsx        # Results display
│   ├── LoadingState.tsx      # Loading animation
│   └── ErrorState.tsx        # Error handling
├── types/
│   └── index.ts              # TypeScript type definitions
└── utils/
    ├── weather.ts            # Weather logic and API calls
    └── rateLimit.ts          # Rate limiting utilities
```

## Design System

The app uses a NYC Subway-inspired design system with:

- **Colors**: MTA line colors (A, B, C, G, J, L lines)
- **Typography**: Inter font family
- **Components**: Circular badges, rounded cards, bold typography
- **Layout**: Grid-based with 4px base unit

### Color Palette

- `subway-a`: #0039A6 (Blue)
- `subway-b`: #FF6319 (Orange)
- `subway-g`: #6CBE45 (Green)
- `subway-c`: #2850AD (Blue-gray)
- `subway-j`: #996633 (Brown)
- `subway-l`: #A7A9AC (Grey)

## API Integration

The app is designed to work with weather APIs. Currently using mock data, but ready for:

- **OpenWeatherMap**: Free tier available
- **WeatherAPI**: Alternative option
- **Custom weather service**: Easy to integrate

### Weather Data Structure

```typescript
interface WeatherData {
  city: string;
  avg: number;      // Average temperature
  min: number;      // Minimum temperature
  max: number;      // Maximum temperature
  humidity: number; // Humidity percentage
  summary: string;  // Human-readable summary
  rainChance?: number; // Rain probability
}
```

## Packing Logic

The app uses sophisticated algorithms to determine packing recommendations:

### Temperature Bands
- **< 8°C**: Heavy winter gear
- **8-14°C**: Light/heavy jacket + layers
- **15-20°C**: Light jacket or cardigan
- **21-26°C**: Short-sleeve tops, light layers
- **> 26°C**: Very light, breathable clothing

### Count Calculations
- **Tops**: `ceil(tripDays / 2)` (minimum 2)
- **Bottoms**: `max(1, floor(tripDays / 4)) + 1`
- **Outerwear**: Based on temperature bands
- **Footwear**: 1 main + 1 alternative for longer trips
- **Accessories**: Based on weather conditions

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

```bash
# Required for production
WEATHER_API_KEY=your_weather_api_key

# Optional
NEXT_PUBLIC_APP_NAME=WhatToWear
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Roadmap

### v1.1
- [ ] Real weather API integration
- [ ] More detailed packing recommendations
- [ ] Save/export packing lists
- [ ] Multiple destinations support

### v1.2
- [ ] User accounts
- [ ] Trip history
- [ ] Social sharing
- [ ] Advanced weather alerts

### v2.0
- [ ] Mobile app
- [ ] Offline support
- [ ] AI-powered recommendations
- [ ] Integration with travel booking platforms
