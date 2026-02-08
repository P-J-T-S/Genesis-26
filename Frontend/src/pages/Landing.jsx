import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Wrench,
  Calendar,
  Users,
  BarChart3,
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import Button from '@mui/material/Button';
import Logo from '../components/Logo';

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap size={24} />,
      title: 'Live Waste Forecasts',
      description: 'Get real-time predictions for waste generation and trends across Mumbai zones.',
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Zone Prioritization',
      description: 'Identify and manage high-priority zones for efficient waste handling.',
    },
    {
      icon: <Users size={24} />,
      title: 'Community Engagement',
      description: 'Empower citizens and officers to report, track, and resolve waste issues.',
    },
    {
      icon: <Calendar size={24} />,
      title: 'Smart Scheduling',
      description: 'Optimize collection schedules and resource allocation for maximum impact.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Alert & Signal System',
      description: 'Receive instant alerts and signals for spikes, complaints, and zone status.',
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Data-Driven Recommendations',
      description: 'Leverage ML-powered insights to improve waste management strategies.',
    },
  ];

  const stats = [
    { value: '40%', label: 'Reduction in Downtime', icon: <TrendingUp size={24} /> },
    { value: '500+', label: 'Companies Trust Us', icon: <Users size={24} /> },
    { value: '99.9%', label: 'System Uptime', icon: <Clock size={24} /> },
    { value: '4.9/5', label: 'Customer Rating', icon: <Award size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Navigation */}
      <nav className={`border-b fixed w-full top-0 z-50 transition-colors duration-200 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-secondary-200' : 'bg-transparent border-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="flex items-center gap-4">
              <Link to="/wards">
                <Button variant="contained" color="primary">Manage Wards</Button>
              </Link>
              <Link to="/forecast">
                <Button variant="outlined" color="secondary">Forecast Waste</Button>
              </Link>
              <Link to="/priorities">
                <Button variant="text" color="secondary">Zone Priorities</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 bg-secondary-50">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-primary-50 to-secondary-100"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-100 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary-200 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm bg-primary-50 text-primary-700 border border-primary-100">
              <Zap size={16} />
              <span>Genesis Mumbai Waste Management</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight text-secondary-900">
              Smarter Waste. Cleaner Mumbai.
              <span className="block mt-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Forecast. Prioritize. Act.
              </span>
            </h1>

            <p className="text-xl sm:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-secondary-600">
              ML-powered platform for real-time waste forecasting, zone prioritization, and actionable recommendations. Empowering BMC, officers, and citizens for a cleaner city.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/wards">
                <Button
                  size="large"
                  variant="contained"
                  className="w-full sm:w-auto shadow-lg hover:shadow-xl"
                  endIcon={<ArrowRight size={20} />}
                >
                  Explore Mumbai Wards
                </Button>
              </Link>
              <Link to="/forecast">
                <Button size="large" variant="outlined" className="w-full sm:w-auto">
                  View Waste Forecast
                </Button>
              </Link>
              <Link to="/priorities">
                <Button size="large" variant="text" className="w-full sm:w-auto">
                  Zone Priorities
                </Button>
              </Link>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="rounded-xl p-6 shadow-sm border border-secondary-200 bg-white hover:shadow-md transition-shadow">
                  <div className="flex justify-center mb-3 text-primary-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-1 text-secondary-900">{stat.value}</div>
                  <div className="text-sm text-secondary-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative bg-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 bg-secondary-100 text-secondary-800">
              POWERFUL FEATURES
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4 text-secondary-900">
              Everything you need to manage maintenance
            </h2>
            <p className="text-xl max-w-2xl mx-auto text-secondary-600">
              Powerful features designed to make equipment maintenance simple and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl border border-secondary-200 hover:shadow-xl transition-all duration-300 overflow-hidden bg-white"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary-50 to-transparent"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-secondary-900">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-secondary-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative overflow-hidden bg-secondary-50">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full filter blur-3xl opacity-20 bg-primary-200"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full filter blur-3xl opacity-20 bg-secondary-300"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 bg-white text-secondary-800 shadow-sm">
                PROVEN RESULTS
              </div>
              <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6 leading-tight text-secondary-900">
                Reduce costs and increase efficiency
              </h2>
              <p className="text-lg mb-8 leading-relaxed text-secondary-600">
                GearGuard helps organizations optimize their maintenance operations and maximize equipment uptime with data-driven insights and automation.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { text: 'Zero-Gap Compliance: Ensure every asset meets 100% of regulatory safety standards automatically.' },
                  { text: 'Zero-Manual Entry: Intelligent Auto-Fill pulls equipment history instantly.' },
                  { text: 'Predictive Cost Shield: Identify failing assets algorithms before catastrophic failures.' },
                  { text: 'Technician Autonomy: Mobile-first workflows for duration and completion recording.' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 rounded-lg p-4 shadow-sm border border-secondary-200 bg-white">
                    <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-primary-100">
                      <CheckCircle2 size={16} className="text-primary-600" />
                    </div>
                    <span className="font-medium text-secondary-700">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link to="/signup">
                <Button size="large" variant="contained" color="primary" className="shadow-lg">
                  Get Started Now
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl p-1 shadow-2xl bg-white/50 backdrop-blur-sm">
                <div className="rounded-3xl p-8 bg-white border border-secondary-100">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="rounded-2xl p-6 text-center bg-secondary-50">
                      <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md text-white">
                        <TrendingUp size={32} />
                      </div>
                      <p className="text-3xl font-bold mb-1 text-secondary-900">99.9%</p>
                      <p className="text-sm text-secondary-500">Asset Reliability</p>
                    </div>
                    <div className="rounded-2xl p-6 text-center bg-secondary-50">
                      <div className="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md text-white">
                        <Users size={32} />
                      </div>
                      <p className="text-3xl font-bold mb-1 text-secondary-900">95%</p>
                      <p className="text-sm text-secondary-500">Team Utilization</p>
                    </div>
                    <div className="rounded-2xl p-6 text-center bg-secondary-50">
                      <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md text-white">
                        <Clock size={32} />
                      </div>
                      <p className="text-3xl font-bold mb-1 text-secondary-900">1.2h</p>
                      <p className="text-sm text-secondary-500">MTTR</p>
                    </div>
                    <div className="rounded-2xl p-6 text-center bg-secondary-50">
                      <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md text-white">
                        <Shield size={32} />
                      </div>
                      <p className="text-3xl font-bold mb-1 text-secondary-900">$0</p>
                      <p className="text-sm text-secondary-500">Cost of Inaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-primary-700">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-white mb-6">
            Ready to optimize your maintenance?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of companies already using GearGuard to streamline their operations and reduce costs.
          </p>
          <Link to="/signup">
            <Button size="large" variant="contained" className="hover:shadow-2xl" sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'primary.50' } }}>
              Join In Now!!
            </Button>
          </Link>
          <p className="mt-6 text-primary-200 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-secondary-900 text-secondary-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Logo />
              </div>
              <p className="text-sm leading-relaxed text-secondary-400">
                The ultimate maintenance tracking solution for modern businesses.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm border-secondary-800 text-secondary-500">
            <p>&copy; {new Date().getFullYear()} GearGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
