"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import Image from "next/image";
import Link from "next/link";
import { Quicksand } from "next/font/google";

gsap.registerPlugin(SplitText, DrawSVGPlugin, MorphSVGPlugin);

const quickSans = Quicksand({ subsets: ["latin"] });

type Submission = {
  id: string;
  text: string;
};

function SubmissionsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const submissionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const addSplitTextAnimation = (el: HTMLDivElement, index: number) => {
    const text = el.innerText;
    el.innerHTML = `<h1>${text}</h1>`;
    const split = new SplitText(el.querySelector("h1"), {
      type: "words,chars",
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    switch (index % 5) {
      case 0:
        tl.from(split.chars, {
          scale: 0,
          rotation: () => gsap.utils.random(-180, 180),
          autoAlpha: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        });
        break;
      case 1:
        tl.from(split.words, {
          x: () => gsap.utils.random(-200, 200),
          y: () => gsap.utils.random(-50, 50),
          autoAlpha: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.7)",
        });
        break;
      case 2:
        tl.from(split.chars, {
          rotationX: 90,
          transformOrigin: "50% top",
          autoAlpha: 0,
          stagger: 0.04,
          duration: 0.6,
          ease: "back.out(2)",
        });
        break;
      case 3:
        tl.from(split.words, {
          scale: 0.5,
          y: () => gsap.utils.random(-60, 60),
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "bounce.out",
        });
        break;
      case 4:
        tl.from(split.chars, {
          rotation: () => gsap.utils.random(-360, 360),
          scaleY: 0.2,
          autoAlpha: 0,
          stagger: 0.03,
          duration: 0.7,
          ease: "elastic.out(1, 0.3)",
        });
        break;
    }
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("subs") || "[]");
    const latestFive = stored.slice(-5).map((item: Submission, i: number) => ({
      id: `submission-${i}`,
      text: item.text,
    }));
    setSubmissions(latestFive);

    gsap.to(".arrow", {
      x: -10,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || submissions.length === 0) return;

    const portal = document.querySelector(".portal") as HTMLElement;
    const portalRect = portal.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const startX = portalRect.left + portalRect.width / 2 - containerRect.left;
    const startY = portalRect.top + portalRect.height / 2 - containerRect.top;

    const positions = [
      { x: containerRect.width * 0.25, y: 20 },
      { x: containerRect.width * 0.7, y: 120 },
      { x: containerRect.width * 0.15, y: 200 },
      { x: containerRect.width * 0.5, y: 280 },
      { x: containerRect.width * 0.35, y: 600 },
    ];

    submissions.forEach((_, index) => {
      const div = submissionRefs.current[index];
      if (!div) return;

      const { x: endX, y: endY } = positions[index % positions.length];

      gsap.set(div, { x: startX, y: startY, opacity: 0 });

      gsap.to(div, {
        delay: 1 + index * 0.2,
        x: Math.min(endX, containerRect.width - 240),
        y: endY,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          addSplitTextAnimation(div, index);
          gsap.to(".boxes", {
            y: "+=10",
            duration: 0.8,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
          });
        },
      });
    });

    gsap.set(".portal", { scaleY: 0 });
    gsap.to(".portal", {
      delay: 0.2,
      opacity: 1,
      scaleY: 1,
      duration: 1,
      ease: "power1.inOut",
    });
  }, [submissions]);

  useLayoutEffect(() => {
    if (!containerRef.current || submissions.length === 0) return;

    const portal = document.querySelector(".portal") as HTMLElement;
    const icons = gsap.utils.toArray<HTMLElement>(".floating-icon");
    if (!portal) return;

    // const portalRect = portal.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // const startX = portalRect.left + portalRect.width / 2 - containerRect.left;
    // const startY = portalRect.top + portalRect.height / 2 - containerRect.top;

    const centerY = containerRect.height / 2;
    icons.forEach((el) => {
      const icon = el as HTMLElement;

      // Set initial at portal position
      gsap.set(icon, {
        x: -60,
        y: centerY,
        opacity: 0,
        rotation: gsap.utils.random(-180, 180),
      });

      gsap.to(icon, {
        delay: gsap.utils.random(0.5, 1.5),
        opacity: 0.6,
        x: gsap.utils.random(0, containerRect.width - 60),
        y: gsap.utils.random(0, containerRect.height - 60),
        duration: 2,
        ease: "power2.out",
        onComplete: () => {
          // Start floating motion
          gsap.to(icon, {
            x: `+=${gsap.utils.random(-0, 100)}`,
            y: `+=${gsap.utils.random(-100, 100)}`,
            rotation: `+=${gsap.utils.random(-360, 360)}`,
            duration: gsap.utils.random(4, 8),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      });
    });
  }, [submissions]);

  return (
    <div
      className={`p-8 h-screen overflow-hidden relative flex flex-col justify-center items-center gap-6 ${quickSans.className}`}
    >
      <div className="absolute inset-0 -z-10" aria-hidden>
        <Image
          src="/bg.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <h2 className="text-2xl mb-4 bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
        Floating Words Zone 🌈
      </h2>
      <div className="absolute left-16 2xl:left-24 transform  top-1/2  -translate-y-1/2 rotate-180 portal opacity-0 z-40">
        <svg
          width="245"
          height="693"
          className="2xl:h-[693px] 2xl:w-[245px] h-[550px] "
          viewBox="0 0 245 693"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_di_1015_1397)">
            <ellipse cx="122" cy="347" rx="32" ry="243" fill="#0B1A24" />
            <path
              d="M122 106.5C122.85 106.5 124.355 107.195 126.347 110.29C128.251 113.249 130.181 117.774 132.069 123.839C135.835 135.934 139.26 153.563 142.148 175.499C147.921 219.335 151.5 279.971 151.5 347C151.5 414.029 147.921 474.665 142.148 518.501C139.26 540.437 135.835 558.066 132.069 570.161C130.181 576.226 128.251 580.751 126.347 583.71C124.355 586.805 122.85 587.5 122 587.5C121.15 587.5 119.645 586.805 117.653 583.71C115.749 580.751 113.819 576.226 111.931 570.161C108.165 558.066 104.74 540.437 101.852 518.501C96.0789 474.665 92.5 414.029 92.5 347C92.5 279.971 96.0789 219.335 101.852 175.499C104.74 153.563 108.165 135.934 111.931 123.839C113.819 117.774 115.749 113.249 117.653 110.29C119.645 107.195 121.15 106.5 122 106.5Z"
              stroke="url(#paint0_linear_1015_1397)"
              stroke-width="5"
            />
          </g>
          <g filter="url(#filter1_i_1015_1397)">
            <path
              d="M127.5 105.5C127.723 105.5 128.141 105.584 128.789 106.139C129.454 106.708 130.232 107.667 131.081 109.131C132.78 112.058 134.502 116.537 136.187 122.536C139.544 134.495 142.597 151.919 145.17 173.589C150.313 216.895 153.5 276.792 153.5 343C153.5 409.208 150.313 469.105 145.17 512.411C142.597 534.081 139.544 551.505 136.187 563.464C134.502 569.463 132.78 573.942 131.081 576.869C130.232 578.333 129.454 579.292 128.789 579.861C128.141 580.416 127.723 580.5 127.5 580.5C127.277 580.5 126.859 580.416 126.211 579.861C125.546 579.292 124.768 578.333 123.919 576.869C122.22 573.942 120.498 569.463 118.813 563.464C115.456 551.505 112.403 534.081 109.83 512.411C104.687 469.105 101.5 409.208 101.5 343C101.5 276.792 104.687 216.895 109.83 173.589C112.403 151.919 115.456 134.495 118.813 122.536C120.498 116.537 122.22 112.058 123.919 109.131C124.768 107.667 125.546 106.708 126.211 106.139C126.859 105.584 127.277 105.5 127.5 105.5Z"
              stroke="url(#paint1_linear_1015_1397)"
              stroke-width="5"
            />
          </g>
          <g filter="url(#filter2_i_1015_1397)">
            <path
              d="M117.5 113.5C117.723 113.5 118.141 113.584 118.789 114.139C119.454 114.708 120.232 115.667 121.081 117.131C122.78 120.058 124.502 124.537 126.187 130.536C129.544 142.495 132.597 159.919 135.17 181.589C140.313 224.895 143.5 284.792 143.5 351C143.5 417.208 140.313 477.105 135.17 520.411C132.597 542.081 129.544 559.505 126.187 571.464C124.502 577.463 122.78 581.942 121.081 584.869C120.232 586.333 119.454 587.292 118.789 587.861C118.141 588.416 117.723 588.5 117.5 588.5C117.277 588.5 116.859 588.416 116.211 587.861C115.546 587.292 114.768 586.333 113.919 584.869C112.22 581.942 110.498 577.463 108.813 571.464C105.456 559.505 102.403 542.081 99.8301 520.411C94.6875 477.105 91.5 417.208 91.5 351C91.5 284.792 94.6875 224.895 99.8301 181.589C102.403 159.919 105.456 142.495 108.813 130.536C110.498 124.537 112.22 120.058 113.919 117.131C114.768 115.667 115.546 114.708 116.211 114.139C116.859 113.584 117.277 113.5 117.5 113.5Z"
              stroke="url(#paint2_linear_1015_1397)"
              stroke-width="5"
            />
          </g>
          <defs>
            <filter
              id="filter0_di_1015_1397"
              x="62.4"
              y="75.4"
              width="121.2"
              height="543.2"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feMorphology
                radius="2"
                operator="dilate"
                in="SourceAlpha"
                result="effect1_dropShadow_1015_1397"
              />
              <feOffset dx="1" />
              <feGaussianBlur stdDeviation="13.3" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.266667 0 0 0 0 0.901961 0 0 0 0 0.913725 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_1015_1397"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_1015_1397"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect2_innerShadow_1015_1397"
              />
            </filter>
            <filter
              id="filter1_i_1015_1397"
              x="99"
              y="103"
              width="57"
              height="484"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_1015_1397"
              />
            </filter>
            <filter
              id="filter2_i_1015_1397"
              x="89"
              y="111"
              width="57"
              height="484"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur id="#gradient-blur" stdDeviation="2" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_1015_1397"
              />
            </filter>
            <linearGradient
              id="paint0_linear_1015_1397"
              x1="170.8"
              y1="347.917"
              x2="89.998"
              y2="347.2"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#44E6E9" />
              <stop offset="1" stop-color="#0D1722" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_1015_1397"
              x1="170.963"
              y1="343.906"
              x2="98.9972"
              y2="343.329"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#44E6E9" />
              <stop offset="1" stop-color="#0D1722" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_1015_1397"
              x1="160.963"
              y1="351.906"
              x2="88.9972"
              y2="351.329"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#44E6E9" />
              <stop offset="1" stop-color="#0D1722" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div
        ref={containerRef}
        className="relative w-[75%] mx-auto aspect-video border border-dashed border-[#44E6E9]/30 rounded-lg"
      >
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden -z-10"
          ref={containerRef}
        >
          <Image
            src="/rotate.svg"
            alt="rotate"
            width={100}
            height={100}
            className="w-14 h-14 icon-0 floating-icon opacity-0"
            objectFit="cover"
          />
          <Image
            src="/move.svg"
            alt="rotate"
            width={100}
            height={100}
            className="w-14 h-14 icon-0 floating-icon opacity-0"
            objectFit="cover"
          />
          <Image
            src="/last.svg"
            alt="rotate"
            width={100}
            height={100}
            className="w-14 h-14 icon-0 floating-icon opacity-0"
            objectFit="cover"
          />
          <Image
            src="/path.svg"
            alt="rotate"
            width={100}
            height={100}
            className="w-14 h-14 icon-0 floating-icon opacity-0"
            objectFit="cover"
          />
          <Image
            src="/circle.svg"
            alt="rotate"
            width={100}
            height={100}
            className="w-14 h-14 icon-0 floating-icon opacity-0"
            objectFit="cover"
          />
        </div>
        {submissions.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-emerald-300 text-xl text-center p-8">
            🚀 Whoops — no floating words yet! Throw some magic into the portal!
          </div>
        )}

        {submissions.map((submission, i) => (
          <div
            key={submission.id}
            ref={(el) => {
              submissionRefs.current[i] = el;
            }}
            className="absolute flex justify-center boxes w-[300px] px-4 py-10  bg-white/5 backdrop-blur-xl border border-[#7bffeb]/20 rounded-xl text-sm "
          >
            {submission.text}
          </div>
        ))}
      </div>

      <Link
        href="/"
        ref={linkRef}
        className="flex gap-2 text-emerald-100 hover:text-emerald-500 transition-all duration-300"
      >
        <span className="arrow block">←</span>
        <h1>Back to Home</h1>
      </Link>
    </div>
  );
}

export default SubmissionsPage;
