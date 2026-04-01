"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  Clock,
  Globe,
  Zap,
  BarChart3,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const FRAMEWORKS = [
  "ISO 27001", "SOC 2 Type II", "GDPR", "HIPAA", "PCI DSS",
  "NIST CSF", "RBI Guidelines", "SEBI CSCRF", "DPDPA", "ISO 22301",
];

const FEATURES = [
  {
    icon: <Zap className="w-5 h-5 text-[#00E5A0]" />,
    title: "Instant Estimates",
    desc: "Get detailed cost breakdowns in under 2 minutes",
  },
  {
    icon: <TrendingDown className="w-5 h-5 text-[#3B82F6]" />,
    title: "Multi-Framework Savings",
    desc: "Automatically calculates overlap discounts for multiple frameworks",
  },
  {
    icon: <Globe className="w-5 h-5 text-[#F59E0B]" />,
    title: "Country-Aware Pricing",
    desc: "Costs adjusted for India, US, EU, and 40+ countries",
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-[#8B5CF6]" />,
    title: "Competitive Comparison",
    desc: "See how SecComply stacks up against Big Four and boutique firms",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-[#1E293B] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-[#00E5A0]" />
            <span className="font-jetbrains font-bold text-[#F1F5F9] text-lg">
              Sec<span className="text-[#00E5A0]">Comply</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/estimator">
              <Button variant="primary" size="sm">
                Start Estimator
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="success" size="md" className="mb-6">
              <Zap className="w-3 h-3" />
              Free Compliance Cost Calculator
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-jetbrains text-4xl md:text-6xl font-bold text-[#F1F5F9] leading-tight mb-6"
          >
            Know Your{" "}
            <span className="text-[#00E5A0] relative">
              Compliance Costs
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5A0] to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </span>
            <br />
            Before You Commit
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#94A3B8] text-xl max-w-2xl mx-auto mb-10"
          >
            Get a detailed, personalized estimate for ISO 27001, SOC 2, GDPR, HIPAA,
            PCI DSS, RBI, SEBI, DPDPA compliance — powered by SecComply&apos;s pricing engine.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/estimator">
              <Button size="lg" variant="primary" className="gap-2 text-base">
                Get My Free Estimate
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-[#94A3B8]"
          >
            {["No signup required", "Takes 2 minutes", "Instant results"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00E5A0]" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Framework pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-xs text-[#475569] uppercase tracking-widest mb-4">
            Supports 14+ compliance frameworks
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {FRAMEWORKS.map((fw, i) => (
              <motion.div
                key={fw}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
              >
                <Badge variant="default" size="md">{fw}</Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-[#111827] border border-[#1E293B] rounded-xl p-5 hover:border-[#334155] transition-colors"
            >
              <div className="mb-3">{feature.icon}</div>
              <h3 className="font-jetbrains font-semibold text-[#F1F5F9] mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-[#94A3B8]">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-[#1E293B] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "14+", label: "Frameworks Supported" },
              { value: "40+", label: "Countries" },
              { value: "200+", label: "Organizations Helped" },
              { value: "60%", label: "Lower than Big Four" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-jetbrains text-3xl font-bold text-[#00E5A0] mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-[#94A3B8]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] py-8 px-6 text-center text-sm text-[#475569]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#00E5A0]" />
          <span className="font-jetbrains font-bold text-[#94A3B8]">
            Sec<span className="text-[#00E5A0]">Comply</span>
          </span>
        </div>
        <p>© 2024 SecComply. All estimates are indicative.</p>
      </footer>
    </div>
  );
}
