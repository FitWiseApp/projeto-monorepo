"use client";

import { motion } from "framer-motion";
import { Dumbbell, Zap, Trophy, Target, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-[#00E676]/20">
        <nav className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-[#00E676]" />
            <span className="text-xl font-bold">FitQuest</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-[#00E676] transition-colors">Features</a>
            <a href="#plans" className="hover:text-[#00E676] transition-colors">Plans</a>
            <a href="#faq" className="hover:text-[#00E676] transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-[#00E676] transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-[#00E676] text-[#0A0A0A] px-6 py-2 rounded-lg font-semibold hover:bg-[#00E676]/90 transition-all hover:scale-105"
            >
              Start Free
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#00E676]/10 border border-[#00E676]/30 rounded-full px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-[#00E676]" />
              <span className="text-sm text-[#00E676]">AI-Powered Fitness Revolution</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Transform Your Body
              <br />
              <span className="text-[#00E676]">Level Up Your Life</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of players turning fitness into an epic adventure. Get AI-powered workouts, 
              personalized nutrition, and unlock rewards as you progress.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-[#00E676] text-[#0A0A0A] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#00E676]/90 transition-all hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Start Your Quest
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="border border-[#00E676] text-[#00E676] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#00E676]/10 transition-all w-full sm:w-auto">
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
          >
            {[
              { value: "10K+", label: "Active Players" },
              { value: "500+", label: "Levels to Unlock" },
              { value: "95%", label: "Success Rate" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#00E676] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Epic Features for <span className="text-[#00E676]">Epic Results</span>
            </h2>
            <p className="text-xl text-gray-400">Everything you need to dominate your fitness journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "AI-Powered Plans",
                description: "Get personalized workouts and meal plans tailored to your goals, powered by advanced AI.",
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Gamification System",
                description: "Earn XP, unlock achievements, customize your avatar, and compete on global leaderboards.",
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Daily Quests",
                description: "Complete daily challenges, maintain streaks, and earn massive bonus rewards.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-[#00E676]/20 rounded-2xl p-8 hover:border-[#00E676]/50 transition-all hover:scale-105"
              >
                <div className="text-[#00E676] mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Choose Your <span className="text-[#00E676]">Adventure</span>
            </h2>
            <p className="text-xl text-gray-400">Start free, upgrade when you're ready</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Basic Quest",
                price: "Free",
                features: [
                  "Basic AI workout plans",
                  "Nutrition tracking",
                  "Avatar customization",
                  "Daily quests",
                  "Community access",
                ],
              },
              {
                name: "Pro Legend",
                price: "$19/mo",
                popular: true,
                features: [
                  "Advanced AI personalization",
                  "Unlimited meal plans",
                  "Premium avatar items",
                  "Priority support",
                  "Exclusive challenges",
                  "Ad-free experience",
                ],
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-8 ${
                  plan.popular ? "border-[#00E676] shadow-2xl shadow-[#00E676]/20" : "border-[#00E676]/20"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00E676] text-[#0A0A0A] px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-[#00E676] mb-6">{plan.price}</div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#00E676] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3 rounded-lg font-semibold transition-all hover:scale-105 ${
                    plan.popular
                      ? "bg-[#00E676] text-[#0A0A0A] hover:bg-[#00E676]/90"
                      : "border border-[#00E676] text-[#00E676] hover:bg-[#00E676]/10"
                  }`}
                >
                  {plan.price === "Free" ? "Start Free" : "Upgrade Now"}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#0A0A0A]/50 to-[#0A0A0A]">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Frequently Asked <span className="text-[#00E676]">Questions</span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How does the AI personalization work?",
                a: "Our AI analyzes your goals, fitness level, and preferences to create custom workout and nutrition plans that adapt as you progress.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes! You can cancel your subscription at any time. Your access continues until the end of your billing period.",
              },
              {
                q: "What makes FitQuest different?",
                a: "We combine proven fitness science with gaming mechanics to make working out addictive and fun. Plus, our AI ensures every plan is perfectly tailored to you.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-[#00E676]/20 rounded-xl p-6"
              >
                <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#00E676]/20 to-[#00E676]/10 border border-[#00E676]/30 rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to Start Your <span className="text-[#00E676]">Fitness Quest?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of players transforming their bodies and lives. Your adventure begins now.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#00E676] text-[#0A0A0A] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#00E676]/90 transition-all hover:scale-105"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#00E676]/20 py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-6 h-6 text-[#00E676]" />
                <span className="text-lg font-bold">FitQuest</span>
              </div>
              <p className="text-gray-400 text-sm">
                Gamified fitness platform powered by AI.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#00E676]">Features</a></li>
                <li><a href="#" className="hover:text-[#00E676]">Pricing</a></li>
                <li><a href="#" className="hover:text-[#00E676]">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#00E676]">About</a></li>
                <li><a href="#" className="hover:text-[#00E676]">Blog</a></li>
                <li><a href="#" className="hover:text-[#00E676]">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#00E676]">Privacy</a></li>
                <li><a href="#" className="hover:text-[#00E676]">Terms</a></li>
                <li><a href="#" className="hover:text-[#00E676]">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#00E676]/20 pt-8 text-center text-sm text-gray-400">
            © 2024 FitQuest. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
