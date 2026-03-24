"use client";

import * as React from "react";
import {
  Activity,
  ArrowRight,
  BarChart,
  CirclePlay,
  GraduationCap,
  Menu,
  Plug,
  Sparkles,
  Zap,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, useAnimation, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const navigationItems = [
  { title: "SOLUTIONS", href: "#" },
  { title: "INDUSTRIES", href: "#" },
  { title: "RESOURCES", href: "#" },
  { title: "ABOUT US", href: "#" },
];

const labels = [
  { icon: Sparkles, label: "Smart Campus Operations" },
  { icon: Plug, label: "Integrated Student Services" },
  { icon: Activity, label: "Real-time Academic Tracking" },
];

const features = [
  {
    icon: BarChart,
    label: "Unified University Analytics",
    description: "Track admissions, attendance, fees, and outcomes from one central dashboard.",
  },
  {
    icon: Zap,
    label: "Automated Academic Workflows",
    description: "Simplify attendance, grading, and communication with fast digital workflows.",
  },
  {
    icon: Activity,
    label: "Live Campus Visibility",
    description: "Get real-time visibility into classes, operations, and student engagement.",
  },
];

export function MynaHero() {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const titleWords = ["SMART", "CAMPUS", "MANAGEMENT", "FOR", "GLOBAL", "UNIVERSITIES"];

  return (
    <div className="mx-auto min-h-[100dvh] bg-background overflow-x-hidden">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="#" className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-mono text-xl font-bold">UniManage</span>
            </div>
          </a>

          <nav className="hidden items-center space-x-8 md:flex">
            {navigationItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="text-sm font-mono text-foreground transition-colors hover:text-primary"
              >
                {item.title}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button asChild variant="default" className="hidden rounded-none font-mono md:inline-flex">
              <Link to="/login">
                GET STARTED <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="mt-6 flex flex-col gap-6">
                  {navigationItems.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      className="text-sm font-mono text-foreground transition-colors hover:text-primary"
                    >
                      {item.title}
                    </a>
                  ))}
                  <Button asChild className="cursor-pointer rounded-none font-mono">
                    <Link to="/login">
                      GET STARTED <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 md:py-24">
          <div className="flex flex-col items-center text-center">
            <motion.h1
              initial={shouldReduceMotion ? { opacity: 0 } : { filter: "blur(10px)", opacity: 0, y: 50 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto max-w-4xl font-mono text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {titleWords.map((text, index) => (
                <motion.span
                  key={index}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="mx-2 inline-block md:mx-4"
                >
                  {text}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mx-auto mt-8 max-w-2xl text-balance font-mono text-lg text-muted-foreground sm:text-xl"
            >
              UniManage helps international universities run admissions, academics, finance, and student services on one platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="mt-10 flex flex-wrap justify-center gap-3 md:gap-4"
            >
              {labels.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.8 + index * 0.15,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  }}
                  className="flex items-center gap-2 rounded-full border bg-card px-4 py-2"
                >
                  <feature.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-mono">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 2.4,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
              className="mt-12 flex flex-wrap items-center justify-center gap-3"
            >
              <Button asChild size="lg" className="cursor-pointer rounded-none font-mono">
                <Link to="/login">
                  GET STARTED <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="cursor-pointer rounded-none font-mono">
                WATCH DEMO <CirclePlay className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20" ref={ref}>
          <motion.h2
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{
              delay: 0.1,
              duration: 0.6,
              type: "spring",
              stiffness: 100,
              damping: 10,
            }}
            className="mb-6 text-center font-mono text-4xl font-bold"
          >
            Powering Modern University Operations
          </motion.h2>
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{
                  delay: 0.25 + index * 0.12,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                }}
                className="group flex flex-col items-center rounded-md border bg-card p-8 text-center transition-transform hover:-translate-y-1"
              >
                <div className="mb-6 rounded-full bg-primary/10 p-4">
                  <feature.icon className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                </div>
                <h3 className="mb-4 text-xl font-mono font-bold">{feature.label}</h3>
                <p className="text-sm font-mono leading-relaxed text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
