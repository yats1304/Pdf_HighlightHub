"use client";

import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

/**
 * BookParticles component renders a particle background using tsparticles.
 * The config enables interactive particles with custom styling suitable as an overlay.
 */
export default function BookParticles() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize the particles engine with slim build for performance.
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInitialized(true);
    });
  }, []);

  // Callback when particles are loaded - useful for debugging.
  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log("Particles container:", container);
  };

  // Particle configuration options memoized for performance.
  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: { value: "transparent" }, // Transparent so it can overlay other content
      },
      fullScreen: {
        enable: false, // Disable full screen - parent container controls size
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" }, // Add particles on click
          onHover: { enable: true, mode: "repulse" }, // Repulse particles on hover
        },
        modes: {
          push: { quantity: 4 },
          repulse: { distance: 100, duration: 0.4 },
        },
      },
      particles: {
        color: { value: "#ffffff" }, // Fixed white particles
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.4,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: { default: OutMode.out },
          speed: 2,
        },
        number: {
          density: { enable: true, area: 800 },
          value: 60,
        },
        opacity: { value: 0.5 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 4 } },
      },
      detectRetina: true,
    }),
    []
  );

  if (!initialized) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      particlesLoaded={particlesLoaded}
      className="absolute inset-0"
    />
  );
}
