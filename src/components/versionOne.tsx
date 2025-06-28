"use client";
import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Quicksand } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const quickSans = Quicksand({ subsets: ["latin"] });

gsap.registerPlugin(DrawSVGPlugin);

function VersionOne() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const portalRef = useRef<HTMLDivElement>(null);
  const [showSubmissionsLink, setShowSubmissionsLink] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    gsap.to("#gradient-blur", {
      attr: { stdDeviation: 20 }, // max glow blur
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.fromTo(
      ".form-animation",
      { translateY: -20, opacity: 0 },
      {
        translateY: 0,
        opacity: 1,
        duration: 1,
        ease: "power1.inOut",
      }
    );

    gsap.to(".arrow", {
      x: 10,
      duration: 0.5,
      repeat: -1,
      ease: "power1.inOut",
      yoyo: true,
    });

    gsap.set(".portal", { scaleY: 0 });

    const icons = gsap.utils.toArray(".floating-icon");

    icons.forEach((el: any) => {
      const parentWidth = portalRef.current?.offsetWidth || window.innerWidth;
      const parentHeight =
        portalRef.current?.offsetHeight || window.innerHeight;

      // Set initial random position
      gsap.set(el, {
        x: gsap.utils.random(0, parentWidth),
        y: gsap.utils.random(0, parentHeight),
        rotation: gsap.utils.random(-180, 180),
      });
      gsap.to(el, { opacity: 1, duration: 0.5, ease: "power1.inOut" });
      // Animate random motion
      gsap.to(el, {
        x: `+=${gsap.utils.random(-200, 200)}`,
        y: `+=${gsap.utils.random(-200, 200)}`,
        rotation: `+=${gsap.utils.random(-360, 360)}`,
        duration: gsap.utils.random(4, 8),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, []);

  useEffect(() => {
    if (showSubmissionsLink) {
      gsap.fromTo(
        linkRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [showSubmissionsLink]);

  const moveIconsToPortal = () => {
    const icons = gsap.utils.toArray(".floating-icon");

    const parentWidth = portalRef.current?.offsetWidth || window.innerWidth;
    const parentHeight = portalRef.current?.offsetHeight || window.innerHeight;

    icons.forEach((el: any) => {
      // Kill existing motion
      gsap.killTweensOf(el);

      // Animate to portal (right-center of portalRef)
      gsap.to(el, {
        x: parentWidth + 100, // 60 = icon size buffer
        y: parentHeight / 2 - 30,
        duration: 2,
        opacity: 0,
        ease: "power2.inOut",
        onComplete: () => {
          // After reaching portal, reset to random position
          gsap.set(el, {
            opacity: 0,
            x: gsap.utils.random(0, parentWidth - 60),
            y: gsap.utils.random(0, parentHeight - 60),
          });

          // Resume random floating
          gsap.to(el, { opacity: 1, duration: 0.5, ease: "power1.inOut" });

          gsap.to(el, {
            x: `+=${gsap.utils.random(-200, 200)}`,
            y: `+=${gsap.utils.random(-200, 200)}`,
            rotation: `+=${gsap.utils.random(-360, 360)}`,
            duration: gsap.utils.random(4, 8),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      });
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !inputRef.current) return;

    const id = uuidv4();
    const submission = { id, text: input };

    const div = document.createElement("div");
    div.innerText = input;
    div.className =
      "absolute px-4 py-2   text-white  shadow pointer-events-none z-50";
    const rect = inputRef.current.getBoundingClientRect();
    div.style.top = `${rect.top + 4.5}px`;
    div.style.left = `${rect.left - 52}px`;
    div.style.position = "absolute";
    if (!portalRef.current) return;
    portalRef.current.appendChild(div);

    gsap.to(div, {
      x: window.innerWidth + 260,
      duration: 1.5,
      ease: "power2.in",
      onComplete: () => {
        const stored = JSON.parse(localStorage.getItem("subs") || "[]");

        // Push new one and keep only last 5
        const updated = [...stored, submission].slice(-5);

        localStorage.setItem("subs", JSON.stringify(updated));
        div.remove();
      },
    });
    moveIconsToPortal();

    gsap.to(".portal", {
      opacity: 1,
      scaleY: 1,
      duration: 1,
      ease: "power1.inOut",
    });

    setShowSubmissionsLink(true);
    setInput("");
    inputRef.current.focus();
  };
  return (
    <div
      className={`flex flex-col gap-10 h-[90vh] p-10 justify-center items-center relative overflow-hidden ${quickSans.className} `}
    >
      <div
        ref={portalRef}
        className=" absolute m-20 h-full w-[94%] pointer-events-none overflow-hidden z-50 "
      />
      <div className=" absolute m-20 h-full w-[94%] pointer-events-none overflow-hidden -z-10 ">
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

      <div className="absolute -right-16 transform  top-1/2 -translate-y-1/2 portal opacity-0">
        <svg
          width="245"
          height="693"
          viewBox="0 0 245 693"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_di_1015_1397)">
            <ellipse cx="122" cy="347" rx="32" ry="243" fill="#0B1A24" />
            <path
              id="path1"
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
              id="path2"
            />
          </g>
          <g filter="url(#filter2_i_1015_1397)">
            <path
              d="M117.5 113.5C117.723 113.5 118.141 113.584 118.789 114.139C119.454 114.708 120.232 115.667 121.081 117.131C122.78 120.058 124.502 124.537 126.187 130.536C129.544 142.495 132.597 159.919 135.17 181.589C140.313 224.895 143.5 284.792 143.5 351C143.5 417.208 140.313 477.105 135.17 520.411C132.597 542.081 129.544 559.505 126.187 571.464C124.502 577.463 122.78 581.942 121.081 584.869C120.232 586.333 119.454 587.292 118.789 587.861C118.141 588.416 117.723 588.5 117.5 588.5C117.277 588.5 116.859 588.416 116.211 587.861C115.546 587.292 114.768 586.333 113.919 584.869C112.22 581.942 110.498 577.463 108.813 571.464C105.456 559.505 102.403 542.081 99.8301 520.411C94.6875 477.105 91.5 417.208 91.5 351C91.5 284.792 94.6875 224.895 99.8301 181.589C102.403 159.919 105.456 142.495 108.813 130.536C110.498 124.537 112.22 120.058 113.919 117.131C114.768 115.667 115.546 114.708 116.211 114.139C116.859 113.584 117.277 113.5 117.5 113.5Z"
              stroke="url(#paint2_linear_1015_1397)"
              stroke-width="5"
              id="path3"
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
      <form
        onSubmit={handleSubmit}
        className="space-y-6 form-animation opacity-0  p-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-[#7bffeb]/20 z-10"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
          Text It, Toss It, Watch It Fly ✨
        </h1>
        <input
          ref={inputRef}
          value={input}
          maxLength={120}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border-b border-[#7bffeb]/60 outline-none bg-transparent text-white"
          placeholder="Type something fun..."
        />

        <button
          type="submit"
          className="border-2 border-transparent rounded-full px-10 py-2 font-semibold  cursor-pointer transition
            [background:linear-gradient(#0e100f,#0e100f)_padding-box,linear-gradient(to_right,#34D399,#7bffeb)_border-box]"
        >
          Toss it
        </button>
      </form>

      <Link
        href={"/submissions"}
        ref={linkRef}
        className="flex gap-2 opacity-0 text-emerald-100 hover:text-emerald-500 transition-all duration-300 cursor-pointer"
      >
        <h1>Go to Submissions</h1> <span className="arrow block">→</span>
      </Link>
    </div>
  );
}

export default VersionOne;
