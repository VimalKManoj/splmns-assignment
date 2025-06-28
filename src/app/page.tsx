"use client";

import React, { useState } from "react";
import Image from "next/image";
import VersionOne from "@/components/versionOne";
import ViewTwo from "@/components/versionTwo";

function Home() {
  const [activeVersion, setActiveVersion] = useState<number>(0);

  const renderActiveView = () => {
    switch (activeVersion) {
      case 0:
        return <VersionOne />;
      case 1:
        return <ViewTwo />;
      default:
        return <VersionOne />;
    }
  };

  return (
    <main className="relative flex flex-col h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 " aria-hidden>
        <Image
          src="/bg.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <div className="flex-1">{renderActiveView()}</div>

      {/* Version Switch Buttons */}
      <div className="w-full flex justify-center gap-6 p-6 bg-transparent">
        <VersionButton
          label="Version One"
          isActive={activeVersion === 0}
          onClick={() => setActiveVersion(0)}
        />
        <VersionButton
          label="Version Two"
          isActive={activeVersion === 1}
          onClick={() => setActiveVersion(1)}
        />
      </div>
    </main>
  );
}

type VersionButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

const VersionButton: React.FC<VersionButtonProps> = ({
  label,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    aria-pressed={isActive}
    className={`px-6 py-2 rounded-3xl cursor-pointer backdrop-blur-3xl border border-[#7bffeb]/20 transition-all duration-300
      ${
        isActive
          ? "bg-white/15 text-emerald-100"
          : "bg-white/5 hover:bg-white/10 text-white"
      }`}
  >
    {label}
  </button>
);

export default Home;
