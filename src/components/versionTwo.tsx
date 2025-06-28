"use client";

import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import { v4 as uuidv4 } from "uuid";
import { useBouncingCircle } from "./useBouncingCircle";

import Image from "next/image";

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Quicksand } from "next/font/google";

const quickSans = Quicksand({ subsets: ["latin"] });

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, SplitText);

function ViewTwo() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const submissionRefs = useRef<Record<string, HTMLDivElement>>({});
  const freeIndexes = useRef<number[]>([]);
  const targetBoxes = useRef<NodeListOf<HTMLDivElement> | null>(null);

  const [inputs, setInputs] = useState("");
  const [circleStarted, setCircleStarted] = useState(false);

  const circleColors = [
    "linear-gradient(to top right, #34D399, #F0FDFA)",
    "linear-gradient(to top right, #F43F5E, #FFE4E6)",
    "linear-gradient(to top right, #8B5CF6, #F3E8FF)",
    "linear-gradient(to top right, #14B8A6, #CCFBF1)",
    "linear-gradient(to top right, #E879F9, #FAE8FF)",
  ];

  // Hook to control bouncing circle
  useBouncingCircle(circleRef, containerRef, circleColors, circleStarted);

  const addSplitTextAnimation = (el: HTMLDivElement, index: number) => {
    const text = el.innerText;
    el.innerHTML = `<h1 id="floating-text">${text}</h1>`;

    const split = SplitText.create(el.querySelector("#floating-text"), {
      type: "words,chars",
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

    switch (index % 5) {
      case 0:
        // Bouncy elastic char pop
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
        // Words slide in from random X and bounce
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
        // Chars swing down like a curtain
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
        // Words scale + bounce on y-axis randomly
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
        // Chars rotate, squash, fade
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

  const animateIcon = (index: number) => {
    const iconClass = `.icon-${index}`;

    switch (index) {
      case 0:
        gsap.to(iconClass, {
          rotate: 360,
          duration: 0.8,
          repeatDelay: 0.5,
          ease: "linear.inOut",
          repeat: -1,
        });
        break;

      case 1:
        const tl = gsap.timeline({
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        tl.to(iconClass, {
          x: 40,
          rotate: 360,
          duration: 1.5,
        }).to(iconClass, {
          x: -40,
          duration: 1.5,
          rotate: -360,
        });
        break;

      case 2:
        gsap.fromTo(
          ".icon-2 .animated-path",
          { drawSVG: "0% 0%" },
          {
            drawSVG: "0% 100%",
            duration: 3,
            repeat: -1,
            ease: "power1.inOut",
          }
        );
        break;

      case 3:
        gsap
          .timeline({
            repeat: -1,
            defaults: { duration: 2, ease: "expo.inOut" },
          })
          .to(".icon-3 #shape1", { morphSVG: ".icon-3 #shape4" })
          .to(".icon-3 #shape1", { morphSVG: ".icon-3 #shape1" });
        break;

      case 4:
        gsap.to(iconClass, {
          scale: 1.5,
          yoyo: true,
          repeat: -1,
          duration: 1,
          ease: "sine.inOut",
        });
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputs.trim() || !inputRef.current || !containerRef.current) return;

    const newId = uuidv4();
    if (!targetBoxes.current) {
      targetBoxes.current =
        containerRef.current.querySelectorAll(".target-box");
    }

    const currentItems = Object.keys(submissionRefs.current);
    if (currentItems.length >= 5 && freeIndexes.current.length === 0) {
      const oldestId = currentItems[0];
      const oldestEl = submissionRefs.current[oldestId];
      if (oldestEl) {
        const indexToFree = parseInt(oldestEl.dataset.index || "0");
        freeIndexes.current.push(indexToFree);
        gsap.to(oldestEl, {
          opacity: 0,
          y: 50,
          duration: 0.5,
          ease: "power1.inOut",
          onComplete: () => {
            oldestEl.remove();
            delete submissionRefs.current[oldestId];
          },
        });
      }
    }

    const targetIndex =
      freeIndexes.current.length > 0
        ? freeIndexes.current.shift()!
        : currentItems.length;

    const inputRect = inputRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const floatDiv = document.createElement("div");
    floatDiv.innerText = inputs;
    floatDiv.className =
      "absolute text-white font-semibold cursor-pointer pointer-events-auto px-3 py-2 bg-gray-800 rounded-lg text-center";
    floatDiv.style.left = `${inputRect.left - containerRect.left}px`;
    floatDiv.style.top = `${inputRect.top - containerRect.top}px`;
    floatDiv.style.width = `${inputRect.width}px`;
    floatDiv.style.maxWidth = `${inputRect.width}px`;
    floatDiv.dataset.index = String(targetIndex);
    containerRef.current.appendChild(floatDiv);

    submissionRefs.current[newId] = floatDiv;

    floatDiv.onclick = () => {
      freeIndexes.current.push(targetIndex);
      gsap.to(floatDiv, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "power1.inOut",
        onComplete: () => {
          floatDiv.remove();
          delete submissionRefs.current[newId];
        },
      });
    };

    requestAnimationFrame(() => {
      const floatRect = floatDiv.getBoundingClientRect();
      const targetBox = targetBoxes.current![targetIndex];
      const targetRect = targetBox.getBoundingClientRect();

      gsap.to(floatDiv, {
        left: `${
          targetRect.left - containerRect.left + targetBox.clientWidth / 2 - 100
        }px`,
        top: `${
          targetRect.top -
          containerRect.top +
          targetBox.clientHeight / 2 -
          floatRect.height / 2
        }px`,
        width: "200px",
        backgroundColor: "rgba(0,0,0,0)",
        maxWidth: "200px",
        duration: 2,
        ease: "power3.out",
        onComplete: () => {
          gsap.to(targetBox, {
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
          });
          animateIcon(targetIndex);

          addSplitTextAnimation(floatDiv, targetIndex);

          if (!circleStarted) setCircleStarted(true);
        },
      });
    });

    setInputs("");
  };

  return (
    <div
      className={`${quickSans.className} h-[90vh] flex  p-8 gap-8 text-white z-10`}
    >
      <div className="w-1/3 space-y-4">
        <h1 className="text-2xl p-4  bg-[linear-gradient(to_right,#34D399,#7bffeb)] bg-clip-text text-transparent">
          Text It, Toss It, Watch It Fly ✨
        </h1>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4 p-4 rounded"
        >
          <input
            ref={inputRef}
            value={inputs}
            maxLength={100}
            onChange={(e) => setInputs(e.target.value)}
            className="w-full p-3 border-b border-[#7bffeb]/60 outline-none bg-transparent text-white"
            placeholder="Enter text"
          />
          <button
            type="submit"
            className="border-2 border-transparent rounded-full px-10 py-2 font-semibold cursor-pointer transition
              [background:linear-gradient(#0e100f,#0e100f)_padding-box,linear-gradient(to_right,#34D399,#7bffeb)_border-box]"
            disabled={!inputs.trim()}
          >
            Submit
          </button>
        </form>
      </div>

      <div className="flex-1 p-4 ">
        <h2 className="text-2xl  mb-4  bg-[linear-gradient(to_right,#34D399,#7bffeb)] bg-clip-text text-transparent">
          Floating Words Zone 🌈
        </h2>
        <div
          ref={containerRef}
          className="relative w-full aspect-video rounded-lg grid grid-cols-6 gap-4 mt-10 0 p-4 border border-[#7bffeb]/20"
        >
          <div
            ref={circleRef}
            className="absolute top-0 left-0 blur-md w-40 h-40 -z-10 rounded-full opacity-0 backdrop-blur-2xl"
            style={{ background: circleColors[0] }}
          ></div>

          <div
            className="target-box bg-white/5 backdrop-blur-3xl border border-[#7bffeb]/20 opacity-0 p-6 rounded-xl relative  col-span-2"
            data-index="0"
          >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-fit h-fit -z-10">
              <Image
                src="/rotate.svg"
                alt="rotate"
                width={100}
                height={100}
                className="w-14 h-14 icon-0"
                objectFit="cover"
              />
            </div>
          </div>

          {/* Box 1 */}
          <div
            className="target-box bg-white/5 backdrop-blur-3xl border border-[#7bffeb]/20 opacity-0 p-6 rounded-xl relative col-span-2"
            data-index="1"
          >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-fit h-fit -z-10">
              <Image
                src="/move.svg"
                alt="move"
                width={100}
                height={100}
                className="w-14 h-14 icon-1"
                objectFit="cover"
              />
            </div>
          </div>

          {/* Box 2 */}
          <div
            className="target-box bg-white/5 backdrop-blur-3xl border border-[#7bffeb]/20 opacity-0 p-6 rounded-xl relative col-span-2"
            data-index="2"
          >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-fit h-fit -z-10">
              <svg
                className="w-14 h-14 icon icon-2"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="grad2"
                    x1="100"
                    y1="0"
                    x2="100"
                    y2="200"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#A7B5FF" />
                    <stop offset="1" stopColor="#F3ACFF" />
                  </linearGradient>
                </defs>
                <path
                  className="animated-path"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  stroke="url(#grad2)"
                  strokeWidth="3"
                  d="M0 0C0 55.2285 44.7715 100 100 100C44.7715 100 0 144.772 0 200H12C12 151.399 51.3989 112 100 112C148.601 112 188 151.399 188 200H200C200 144.772 155.228 100 100 100C155.228 100 200 55.2285 200 0H188C188 48.6011 148.601 88 100 88C51.3989 88 12 48.6011 12 0H0ZM24 0C24 41.9736 58.0264 76 100 76C141.974 76 176 41.9736 176 0H164C164 35.3462 135.346 64 100 64C64.6538 64 36 35.3462 36 0H24ZM48 0C48 28.7188 71.2812 52 100 52C128.719 52 152 28.7188 152 0H140C140 22.0914 122.091 40 100 40C77.9086 40 60 22.0914 60 0H48ZM100 124C141.974 124 176 158.026 176 200H164C164 164.654 135.346 136 100 136C64.6538 136 36 164.654 36 200H24C24 158.026 58.0264 124 100 124ZM100 148C128.719 148 152 171.281 152 200H140C140 177.909 122.091 160 100 160C77.9086 160 60 177.909 60 200H48C48 171.281 71.2812 148 100 148Z"
                />
              </svg>
            </div>
          </div>

          {/* Box 3 */}
          <div
            className="target-box bg-white/5 backdrop-blur-3xl border border-[#7bffeb]/20 opacity-0 p-6 rounded-xl relative col-span-3"
            data-index="3"
          >
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-fit h-fit -z-10">
              <svg
                id="svg-stage"
                className="w-14 h-14 icon icon-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id="grad3"
                    x1="0"
                    y1="0"
                    x2="99"
                    y2="99"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.2" stopColor="rgb(255, 135, 9)" />
                    <stop offset="0.7" stopColor="rgb(247, 189, 248)" />
                  </linearGradient>
                  <path id="shape4" d="M50,1l49,49L50,99L1,50L50,1z" />
                </defs>

                <path
                  id="shape1"
                  fill="url(#grad3)"
                  d="M74.6 50.2h-.2v-.4h.2a24.4 24.4 0 1 0-24.4-24.4v.2h-.4v-.2a24.4 24.4 0 1 0-24.4 24.4h.2v.4h-.2a24.4 24.4 0 1 0 24.4 24.4v-.2h.4v.2a24.4 24.4 0 1 0 24.4-24.4z"
                />
              </svg>
            </div>
          </div>

          {/* Box 4 */}
          <div
            className="target-box bg-white/5 backdrop-blur-3xl border border-[#7bffeb]/20 opacity-0 p-6 rounded-xl relative col-span-3"
            data-index="4"
          >
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-fit h-fit -z-10">
              <Image
                src="/last.svg"
                alt="last"
                width={100}
                height={100}
                className="w-14 h-14 icon-4"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTwo;
