import React, { useState, useEffect } from "react";
import {
  Trophy,
  Play,
  Calendar,
  Star,
  ChevronRight,
  Globe,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

// Separate Hover Card Component
export function LeagueStandingCard({
  icon: IconComponent,
  title,
  description,
  color,
  path,
}) {
  return (
    <div className="group relative p-8 rounded-2xl bg-white shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-500 hover:scale-105 hover:shadow-xl cursor-pointer">
      <div
        className={`w-16 h-16 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
      >
        <IconComponent className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
        {description}
      </p>
      <ChevronRight className="w-5 h-5 absolute top-8 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-blue-500" />
    </div>
  );
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Trophy,
      title: "League Standings",
      description:
        "Track top 5 European leagues with real-time standings and stats",
      color: "from-yellow-400 to-orange-500",
      path: "/standings",
    },
    {
      icon: Play,
      title: "Live Scores",
      description: "Get instant updates on ongoing matches across all leagues",
      color: "from-green-400 to-blue-500",
      path: "/live",
    },
    {
      icon: Calendar,
      title: "Fixtures",
      description: "Never miss a game with comprehensive fixture listings",
      color: "from-purple-400 to-pink-500",
      path: "/fixtures",
    },
    {
      icon: Star,
      title: "BPL Special",
      description: "Dedicated section for Bangladesh Premier League coverage",
      color: "from-red-400 to-rose-500",
      path: "/bpl",
    },
  ];

  const stats = [
    { number: "500+", label: "Active Users", icon: Users },
    { number: "500+", label: "Matches Covered", icon: Globe },
    { number: "99.9%", label: "Uptime", icon: Zap },
    { number: "5", label: "Top Leagues", icon: TrendingUp },
  ];

  const heroSlides = [
    {
      title: "Your Ultimate Football Companion",
      subtitle: "Live scores, standings, and fixtures all in one place",
    },
    {
      title: "Never Miss a Match",
      subtitle: "Real-time updates from UCL + Europe's top 5 leagues",
    },
    {
      title: "BPL Coverage & More",
      subtitle: "Comprehensive football data at your fingertips",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-6xl mx-auto">
          <div
            className={`transform transition-all duration-1500 delay-300 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              {heroSlides[currentSlide].subtitle}
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center transform transition-all duration-1500 delay-500 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            <Link to="/live">
              <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg text-white hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2">
                <span>Explore Live Scores</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>

            <Link to="/standings">
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-bold text-lg hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 hover:scale-105">
                View Standings
              </button>
            </Link>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-3 mt-16">
            {heroSlides.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSlide
                    ? "bg-blue-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Everything Football
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive coverage of your favorite leagues with real-time
              data and beautiful interfaces
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={feature.path}>
              <LeagueStandingCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                path={feature.path}
              />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-black mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-6 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Scorspace
          </div>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Your ultimate destination for football scores, standings, and
            fixtures. Stay connected to the beautiful game.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <span>&copy; 2025 Scorspace. All rights reserved.</span>
            <span>Made with ⚽ for football fans</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
