"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Code, Gift, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function HomePageComponent() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div className="min-h-screen bg-[#FDF7F2] text-black">
      <header className="container mx-auto py-6 sticky top-0 bg-[#FDF7F2] z-10">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-[#FF6B4A]"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            <h1 className="text-2xl font-bold">ScrollGrants</h1>
          </div>
          {/* <Button className="bg-[#FF6B4A] hover:bg-[#FF8D75] text-white">
            Connect Wallet
          </Button> */}
          <ConnectButton />
        </nav>
      </header>

      <main className="container mx-auto mt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ opacity, scale }}
          className="text-center"
        >
          <h2 className="text-6xl font-bold mb-6">
            Empowering the Scroll Community
          </h2>
          <p className="text-xl mb-8 text-gray-600">
            Join our community grant platform and bring your ideas to life
          </p>
          <Button className="bg-[#FF6B4A] hover:bg-[#FF8D75] text-white">
            Explore Grants <ArrowRight className="ml-2" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="grid md:grid-cols-3 gap-8 mt-20"
        >
          <FeatureCard
            icon={<Code size={24} />}
            title="Build on Scroll"
            description="Develop innovative solutions on the Scroll network and contribute to its thriving ecosystem."
          />
          <FeatureCard
            icon={<Gift size={24} />}
            title="Community Grants"
            description="Apply for and receive community-backed grants to fund your groundbreaking projects."
          />
          <FeatureCard
            icon={<Users size={24} />}
            title="Collaborative Ecosystem"
            description="Join a network of developers, creators, and innovators shaping the future of Scroll."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-20"
        >
          <h3 className="text-3xl font-bold mb-6 text-center">How It Works</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white shadow-md border-none">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-black">
                  <Gift className="mr-2" />
                  Grant Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>Community members submit grant proposals</li>
                  <li>The community reviews and votes on proposals</li>
                  <li>Selected projects receive funding</li>
                  <li>
                    Funded projects build and contribute to the Scroll ecosystem
                  </li>
                </ol>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md border-none">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-black">
                  <Users className="mr-2" />
                  Community Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>
                    Support for innovative projects within the Scroll ecosystem
                  </li>
                  <li>Community-driven decision making</li>
                  <li>Fostering collaboration among developers and creators</li>
                  <li>Accelerating the growth of the Scroll network</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 107, 74, 0.1), transparent 80%)`,
          }}
        />
      </main>

      <footer className="container mx-auto mt-20 py-6 text-center">
        <p className="text-gray-600">
          &copy; 2023 ScrollGrants. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-white shadow-md border-none">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-black">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
