/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { useStore, VOCABULARY_DATA } from "../store";
import { VocabularyWord, ExploreCategory } from "../types";
import gsap from "gsap";

// --- 3D COMPOSITE MODEL HANDLERS ---

function ModelComposer({ id, color }: { id: string; color: string }) {
  switch (id) {
    case "apple":
      return <AppleModel color={color} />;
    case "orange":
      return <OrangeModel color={color} />;
    case "banana":
      return <BananaModel color={color} />;
    case "grapes":
      return <GrapesModel color={color} />;
    case "strawberry":
      return <StrawberryModel color={color} />;
    case "cat":
      return <CatModel color={color} />;
    case "dog":
      return <DogModel color={color} />;
    case "rabbit":
      return <RabbitModel color={color} />;
    case "bear":
      return <BearModel color={color} />;
    case "pig":
      return <PigModel color={color} />;
    case "fish":
      return <FishModel color={color} />;
    case "crab":
      return <CrabModel color={color} />;
    case "starfish":
      return <StarfishModel color={color} />;
    case "whale":
      return <WhaleModel color={color} />;
    case "octopus":
      return <OctopusModel color={color} />;
    case "lion":
      return <LionModel color={color} />;
    case "elephant":
      return <ElephantModel color={color} />;
    case "monkey":
      return <MonkeyModel color={color} />;
    case "zebra":
      return <ZebraModel color={color} />;
    case "giraffe":
      return <GiraffeModel color={color} />;
    default:
      return (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color={color} roughness={0.3} />
        </mesh>
      );
  }
}

function AppleModel({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.46, 30, 24]} />
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.1} />
      </mesh>
      {/* Apple stem */}
      <mesh position={[0, 0.44, 0]} rotation={[0.1, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.25, 8]} />
        <meshStandardMaterial color="#78350F" />
      </mesh>
      {/* Green leaf */}
      <mesh position={[0.12, 0.48, 0.08]} rotation={[0.2, 0.4, 0.3]} castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>
    </group>
  );
}

function OrangeModel({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.48, 28, 24]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Orange tiny core & leaf */}
      <mesh position={[0, 0.46, 0]} castShadow>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#047857" />
      </mesh>
    </group>
  );
}

function BananaModel({ color }: { color: string }) {
  return (
    <group rotation={[0, 0, -0.4]}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.7, 6]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[-0.08, 0.3, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.35, 6]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[0.1, -0.3, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.1, 0.04, 0.25, 6]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Brown bottom tip */}
      <mesh position={[0.15, -0.42, 0]} castShadow>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#451A03" />
      </mesh>
    </group>
  );
}

function GrapesModel({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} castShadow><sphereGeometry args={[0.15, 12, 12]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[-0.14, 0.08, 0.14]} castShadow><sphereGeometry args={[0.15, 12, 12]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.14, 0.08, -0.14]} castShadow><sphereGeometry args={[0.15, 12, 12]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[-0.1, -0.1, -0.08]} castShadow><sphereGeometry args={[0.15, 12, 12]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.1, -0.1, 0.08]} castShadow><sphereGeometry args={[0.15, 12, 12]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, -0.22, 0]} castShadow><sphereGeometry args={[0.15, 12, 12]} /><meshStandardMaterial color={color} /></mesh>
      {/* Stem */}
      <mesh position={[0, 0.3, 0]} rotation={[0.4, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
        <meshStandardMaterial color="#451A03" />
      </mesh>
    </group>
  );
}

function StrawberryModel({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, -0.04, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.38, 0.72, 20]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow>
        <coneGeometry args={[0.22, 0.12, 8]} />
        <meshStandardMaterial color="#059669" />
      </mesh>
      {/* Small spot decorations */}
      <mesh position={[0, 0.12, 0.22]} scale={[0.025, 0.045, 0.025]}><sphereGeometry args={[1, 6, 6]} /><meshStandardMaterial color="#FEF08A" /></mesh>
      <mesh position={[-0.12, 0.06, 0.16]} scale={[0.025, 0.045, 0.025]}><sphereGeometry args={[1, 6, 6]} /><meshStandardMaterial color="#FEF08A" /></mesh>
      <mesh position={[0.12, 0.06, 0.16]} scale={[0.025, 0.045, 0.025]}><sphereGeometry args={[1, 6, 6]} /><meshStandardMaterial color="#FEF08A" /></mesh>
    </group>
  );
}

function CatModel({ color }: { color: string }) {
  return (
    <group>
      {/* Cat head */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.62, 0.52, 0.52]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Pointy ears */}
      <mesh position={[-0.22, 0.46, 0]} rotation={[0, 0, 0.2]} castShadow>
        <coneGeometry args={[0.16, 0.26, 4]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
      <mesh position={[0.22, 0.46, 0]} rotation={[0, 0, -0.2]} castShadow>
        <coneGeometry args={[0.16, 0.26, 4]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.13, 0.22, 0.27]}><sphereGeometry args={[0.07, 8, 8]} /><meshStandardMaterial color="#FFF" /></mesh>
      <mesh position={[-0.13, 0.22, 0.32]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      <mesh position={[0.13, 0.22, 0.27]}><sphereGeometry args={[0.07, 8, 8]} /><meshStandardMaterial color="#FFF" /></mesh>
      <mesh position={[0.13, 0.22, 0.32]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      {/* Nose */}
      <mesh position={[0, 0.1, 0.28]}><sphereGeometry args={[0.045, 8, 8]} /><meshStandardMaterial color="#F472B6" /></mesh>
      {/* Cat body */}
      <mesh position={[0, -0.22, -0.08]} castShadow>
        <boxGeometry args={[0.52, 0.42, 0.72]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function DogModel({ color }: { color: string }) {
  return (
    <group>
      {/* Dog head */}
      <mesh position={[0, 0.2, 0.12]} castShadow>
        <boxGeometry args={[0.58, 0.52, 0.52]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Ears left & right */}
      <mesh position={[-0.3, 0.16, 0.12]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.2]} />
        <meshStandardMaterial color="#451A03" />
      </mesh>
      <mesh position={[0.3, 0.16, 0.12]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.2]} />
        <meshStandardMaterial color="#451A03" />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.08, 0.4]} castShadow>
        <boxGeometry args={[0.22, 0.18, 0.18]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>
      <mesh position={[0, 0.14, 0.49]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      {/* Eyes */}
      <mesh position={[-0.12, 0.24, 0.38]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      <mesh position={[0.12, 0.24, 0.38]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      {/* Body */}
      <mesh position={[0, -0.22, -0.1]} castShadow>
        <boxGeometry args={[0.5, 0.45, 0.78]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function RabbitModel({ color }: { color: string }) {
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Long ears */}
      <group position={[-0.14, 0.5, 0]}>
        <mesh castShadow><boxGeometry args={[0.08, 0.4, 0.06]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, 0, 0.012]}><boxGeometry args={[0.04, 0.28, 0.04]} /><meshStandardMaterial color="#F472B6" /></mesh>
      </group>
      <group position={[0.14, 0.5, 0]}>
        <mesh castShadow><boxGeometry args={[0.08, 0.4, 0.06]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, 0, 0.012]}><boxGeometry args={[0.04, 0.28, 0.04]} /><meshStandardMaterial color="#F472B6" /></mesh>
      </group>
      {/* Eyes */}
      <mesh position={[-0.1, 0.22, 0.22]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#EF4444" /></mesh>
      <mesh position={[0.1, 0.22, 0.22]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#EF4444" /></mesh>
      {/* Body & tail */}
      <mesh position={[0, -0.2, -0.1]} castShadow>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, -0.26, -0.46]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function BearModel({ color }: { color: string }) {
  return (
    <group>
      {/* Round teddy bear head */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[-0.28, 0.52, 0]} rotation={[0, 0, 0.4]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 10]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0.28, 0.52, 0]} rotation={[0, 0, -0.4]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 10]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Round snout */}
      <mesh position={[0, 0.18, 0.3]} castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
      <mesh position={[0, 0.2, 0.41]}><sphereGeometry args={[0.038, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      {/* Big bear body */}
      <mesh position={[0, -0.24, -0.08]} castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  );
}

function PigModel({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.15, 0.08]} castShadow>
        <boxGeometry args={[0.5, 0.45, 0.45]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.06, 0.32]} castShadow>
        <boxGeometry args={[0.18, 0.12, 0.1]} />
        <meshStandardMaterial color="#EC4899" />
      </mesh>
      {/* Piggy Ears */}
      <mesh position={[-0.2, 0.36, 0.04]} rotation={[0, 0, 0.3]} castShadow>
        <coneGeometry args={[0.08, 0.2, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.2, 0.36, 0.04]} rotation={[0, 0, -0.3]} castShadow>
        <coneGeometry args={[0.08, 0.2, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, -0.18, -0.1]} castShadow>
        <boxGeometry args={[0.55, 0.42, 0.74]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function FishModel({ color }: { color: string }) {
  return (
    <group>
      {/* Fish main bodies */}
      <mesh scale={[1.35, 0.85, 0.32]} castShadow>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
      {/* Tail fin */}
      <mesh position={[-0.72, 0, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <coneGeometry args={[0.2, 0.45, 3]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>
      {/* Eye */}
      <mesh position={[0.26, 0.1, 0.22]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color="#FFF" /></mesh>
      <mesh position={[0.26, 0.1, 0.28]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
    </group>
  );
}

function CrabModel({ color }: { color: string }) {
  return (
    <group>
      <mesh scale={[1.3, 0.65, 1.1]} castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
      {/* Left Pinching Claw */}
      <mesh position={[-0.4, 0.18, 0.26]} rotation={[0.9, 0.2, 0]} castShadow>
        <boxGeometry args={[0.18, 0.18, 0.22]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Right Claw */}
      <mesh position={[0.4, 0.18, 0.26]} rotation={[0.9, -0.2, 0]} castShadow>
        <boxGeometry args={[0.18, 0.18, 0.22]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Two stalk eyes */}
      <group position={[-0.12, 0.3, 0.26]}>
        <mesh castShadow><cylinderGeometry args={[0.025, 0.025, 0.18, 6]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, 0.09, 0]}><sphereGeometry args={[0.045, 8, 8]} /><meshStandardMaterial color="#FFF" /></mesh>
        <mesh position={[0, 0.09, 0.025]}><sphereGeometry args={[0.022, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      </group>
      <group position={[0.12, 0.3, 0.26]}>
        <mesh castShadow><cylinderGeometry args={[0.025, 0.025, 0.18, 6]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, 0.09, 0]}><sphereGeometry args={[0.045, 8, 8]} /><meshStandardMaterial color="#FFF" /></mesh>
        <mesh position={[0, 0.09, 0.025]}><sphereGeometry args={[0.022, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      </group>
    </group>
  );
}

function StarfishModel({ color }: { color: string }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color={color} /></mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5;
        return (
          <mesh 
            key={i} 
            position={[Math.sin(angle) * 0.32, Math.cos(angle) * 0.32, 0]} 
            rotation={[0, 0, -angle]}
            castShadow
          >
            <coneGeometry args={[0.12, 0.5, 8]} />
            <meshStandardMaterial color={color} roughness={0.3} />
          </mesh>
        );
      })}
      {/* Eyes */}
      <mesh position={[-0.06, 0.04, 0.16]}><sphereGeometry args={[0.026, 6, 6]} /><meshStandardMaterial color="#000" /></mesh>
      <mesh position={[0.06, 0.04, 0.16]}><sphereGeometry args={[0.026, 6, 6]} /><meshStandardMaterial color="#000" /></mesh>
    </group>
  );
}

function WhaleModel({ color }: { color: string }) {
  return (
    <group>
      <mesh scale={[1.42, 0.95, 0.95]} castShadow>
        <sphereGeometry args={[0.6, 24, 18]} />
        <meshStandardMaterial color={color} roughness={0.15} />
      </mesh>
      <mesh position={[-0.9, 0.08, 0]} scale={[0.9, 0.38, 0.32]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.45, 0.45, 0.45]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-1.15, 0.18, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <coneGeometry args={[0.14, 0.36, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* White belly panel */}
      <mesh position={[0, -0.2, 0]} scale={[1.15, 0.45, 0.85]} receiveShadow>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color="#FFF" roughness={0.4} />
      </mesh>
      {/* Smiley eyes */}
      <mesh position={[0.36, 0.12, 0.42]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      <mesh position={[0.36, 0.12, -0.42]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
    </group>
  );
}

function OctopusModel({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.26, 0]} castShadow>
        <sphereGeometry args={[0.42, 20, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Googly eyes */}
      <group position={[-0.15, 0.28, 0.35]}>
        <mesh><sphereGeometry args={[0.07, 8, 8]} /><meshStandardMaterial color="#FFF" /></mesh>
        <mesh position={[0, 0, 0.04]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      </group>
      <group position={[0.15, 0.28, 0.35]}>
        <mesh><sphereGeometry args={[0.07, 8, 8]} /><meshStandardMaterial color="#FFF" /></mesh>
        <mesh position={[0, 0, 0.04]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      </group>
      {/* Eight wiggling cylinder tentacles */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const ratio = (i * Math.PI * 2) / 8;
        return (
          <group key={i} position={[Math.sin(ratio) * 0.2, -0.05, Math.cos(ratio) * 0.2]} rotation={[0.35, ratio, 0.15]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.07, 0.04, 0.45, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function LionModel({ color }: { color: string }) {
  return (
    <group>
      {/* Golden body */}
      <mesh position={[0, -0.18, -0.05]} castShadow>
        <boxGeometry args={[0.5, 0.42, 0.76]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Huge Brown Mane */}
      <mesh position={[0, 0.18, 0.18]} castShadow>
        <boxGeometry args={[0.78, 0.72, 0.45]} />
        <meshStandardMaterial color="#78350F" roughness={0.5} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.2, 0.32]} castShadow>
        <boxGeometry args={[0.48, 0.45, 0.32]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* White Snout */}
      <mesh position={[0, 0.06, 0.45]} castShadow>
        <boxGeometry args={[0.22, 0.16, 0.12]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.1, 0.52]}><sphereGeometry args={[0.045, 6, 6]} /><meshStandardMaterial color="#000" /></mesh>
      {/* Eyes */}
      <mesh position={[-0.11, 0.24, 0.45]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      <mesh position={[0.11, 0.24, 0.45]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      {/* Cute ears */}
      <mesh position={[-0.22, 0.5, 0.18]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.12, 0.12, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.22, 0.5, 0.18]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.12, 0.12, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function ElephantModel({ color }: { color: string }) {
  return (
    <group>
      {/* Strong heavy body */}
      <mesh position={[0, -0.15, -0.1]} castShadow>
        <boxGeometry args={[0.74, 0.65, 0.95]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Big Head */}
      <mesh position={[0, 0.26, 0.18]} castShadow>
        <boxGeometry args={[0.55, 0.52, 0.48]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Giant flat grey Ears left & right */}
      <mesh position={[-0.4, 0.28, 0.12]} rotation={[0, -0.2, 0.15]} castShadow>
        <boxGeometry args={[0.08, 0.45, 0.38]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0.4, 0.28, 0.12]} rotation={[0, 0.2, -0.15]} castShadow>
        <boxGeometry args={[0.08, 0.45, 0.38]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Elephant Trunk curve up */}
      <mesh position={[0, -0.05, 0.46]} rotation={[0.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.05, 0.5, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, -0.22, 0.54]} rotation={[1.1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.045, 0.35, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* White Tusks left & right */}
      <mesh position={[-0.14, -0.05, 0.43]} rotation={[1.1, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.015, 0.28, 6]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>
      <mesh position={[0.14, -0.05, 0.43]} rotation={[1.1, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.015, 0.28, 6]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>
      {/* Small black eyes */}
      <mesh position={[-0.16, 0.28, 0.4]}><sphereGeometry args={[0.045, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      <mesh position={[0.16, 0.28, 0.4]}><sphereGeometry args={[0.045, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
    </group>
  );
}

function MonkeyModel({ color }: { color: string }) {
  return (
    <group>
      {/* Brown monkey body */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[0.45, 0.42, 0.45]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Round head */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Sweet monkey round ears */}
      <mesh position={[-0.32, 0.18, 0]} rotation={[0, 0, 0.35]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 10]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
      <mesh position={[0.32, 0.18, 0]} rotation={[0, 0, -0.35]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 10]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
      {/* Cute monkey face mask */}
      <mesh position={[0, 0.1, 0.16]} castShadow scale={[1.3, 1, 0.5]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#FED7AA" />
      </mesh>
      {/* Monkey eyes */}
      <mesh position={[-0.08, 0.16, 0.22]}><sphereGeometry args={[0.038, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      <mesh position={[0.08, 0.16, 0.22]}><sphereGeometry args={[0.038, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      {/* Small banana in hand! */}
      <group position={[0.18, -0.16, 0.25]} rotation={[0, 0.2, 0.8]}>
        <mesh castShadow><cylinderGeometry args={[0.04, 0.03, 0.18, 6]} /><meshStandardMaterial color="#EAB308" /></mesh>
      </group>
    </group>
  );
}

function ZebraModel({ color }: { color: string }) {
  return (
    <group>
      {/* Zebra striped body */}
      <mesh position={[0, -0.2, -0.05]} castShadow>
        <boxGeometry args={[0.48, 0.42, 0.76]} />
        <meshStandardMaterial color="#FFF" roughness={0.3} />
      </mesh>
      {/* Procedural stripes overlays on body */}
      {[-0.2, 0, 0.2].map((z, idx) => (
        <mesh key={idx} position={[0, -0.19, -0.05 + z]} castShadow>
          <boxGeometry args={[0.495, 0.43, 0.06]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      {/* Striped neck */}
      <mesh position={[0, 0.18, 0.22]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.22, 0.48, 0.26]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>
      {/* Slices on neck */}
      <mesh position={[0, 0.18, 0.22]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.235, 0.1, 0.27]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.4, 0.35]} castShadow>
        <boxGeometry args={[0.24, 0.24, 0.42]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>
      {/* Black snout */}
      <mesh position={[0, 0.34, 0.54]} castShadow>
        <boxGeometry args={[0.20, 0.14, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Zebra eyes */}
      <mesh position={[-0.13, 0.43, 0.42]}><sphereGeometry args={[0.045, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      <mesh position={[0.13, 0.43, 0.42]}><sphereGeometry args={[0.045, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
    </group>
  );
}

function GiraffeModel({ color }: { color: string }) {
  return (
    <group>
      {/* Golden body */}
      <mesh position={[0, -0.28, -0.05]} castShadow>
        <boxGeometry args={[0.45, 0.38, 0.65]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Extremely long giraffe neck */}
      <mesh position={[0, 0.35, 0.18]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.1, 8]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Spots on neck */}
      {[-0.1, 0.15, 0.4].map((y, idx) => (
        <mesh key={idx} position={[0, 0.05 + y * 1.2, 0.2 + (y * 0.05)]} scale={[1.1, 0.8, 1.1]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color="#92400E" />
        </mesh>
      ))}
      {/* Giraffe Head */}
      <mesh position={[0, 0.94, 0.24]} castShadow>
        <boxGeometry args={[0.2, 0.18, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Cute ears & horns */}
      <mesh position={[-0.12, 1.04, 0.14]} rotation={[0, 0, 0.4]} castShadow>
        <coneGeometry args={[0.04, 0.15, 4]} />
        <meshStandardMaterial color="#92400E" />
      </mesh>
      <mesh position={[0.12, 1.04, 0.14]} rotation={[0, 0, -0.4]} castShadow>
        <coneGeometry args={[0.04, 0.15, 4]} />
        <meshStandardMaterial color="#92400E" />
      </mesh>
      {/* Large black eyes */}
      <mesh position={[-0.11, 0.96, 0.3]}><sphereGeometry args={[0.038, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
      <mesh position={[0.11, 0.96, 0.3]}><sphereGeometry args={[0.038, 8, 8]} /><meshStandardMaterial color="#000" /></mesh>
    </group>
  );
}

// --- WORLD ENVIRONMENT FILLERS (SCENERY) ---

// --- BREATHING GROUND PLANT SUBCOMPONENTS ---
function BreathingFlower({ position, index }: { position: [number, number, number]; index: number }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const cycle = Math.sin(time * 2.2 + index * 0.7);
    const scaleX = 1 + cycle * 0.08;
    const scaleY = 1 + cycle * 0.12; // stretch upwards more organically
    const scaleZ = 1 + cycle * 0.08;
    ref.current.scale.set(scaleX, scaleY, scaleZ);
  });

  return (
    <group ref={ref} position={position}>
      {/* Flower stem node */}
      <mesh>
        <cylinderGeometry args={[0.015, 0.015, 0.1, 6]} />
        <meshStandardMaterial color="#059669" />
      </mesh>
      {/* Flower core */}
      <mesh position={[0, 0.06, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#FBBF24" />
      </mesh>
      {/* Flower Petals */}
      <mesh position={[0, 0.065, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.14, 6]} />
        <meshStandardMaterial color="#FFF" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function BreathingSeaweed({ position, index }: { position: [number, number, number]; index: number }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const cycle = Math.sin(time * 1.8 + index * 1.0);
    const scaleX = 1 + cycle * 0.08;
    const scaleY = 1 + cycle * 0.16; // elegant vertical expansion
    const scaleZ = 1 + cycle * 0.08;
    ref.current.scale.set(scaleX, scaleY, scaleZ);
  });

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.25}>
      <group ref={ref} position={position}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.8, 6]} />
          <meshStandardMaterial color="#0D9488" roughness={0.4} flatShading />
        </mesh>
      </group>
    </Float>
  );
}

function BreathingGrass({ position, index }: { position: [number, number, number]; index: number }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const cycle = Math.sin(time * 2.4 + index * 0.9);
    const scaleX = 1 + cycle * 0.07;
    const scaleY = 1 + cycle * 0.14; // tall stretchy grass breathing rhythm
    const scaleZ = 1 + cycle * 0.07;
    ref.current.scale.set(scaleX, scaleY, scaleZ);
  });

  return (
    <group ref={ref} position={position}>
      <mesh position={[-0.05, 0.1, 0]} rotation={[0, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.01, 0.015, 0.2, 4]} />
        <meshStandardMaterial color="#EAB308" />
      </mesh>
      <mesh position={[0.05, 0.12, 0]} rotation={[0, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.01, 0.015, 0.25, 4]} />
        <meshStandardMaterial color="#CA8A04" />
      </mesh>
    </group>
  );
}

function Scenery({ category }: { category: string }) {
  if (category === "garden") {
    // Render trees and flowers
    return (
      <group>
        {/* Soft pastel fence poles */}
        {[-3.5, 3.5].map((x, idx) => (
          <group key={idx} position={[x, 0, 0]}>
            <mesh position={[0, 0.4, -2]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
              <meshStandardMaterial color="#D7C49E" />
            </mesh>
            <mesh position={[0, 0.4, 2]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
              <meshStandardMaterial color="#D7C49E" />
            </mesh>
          </group>
        ))}

        {/* Dynamic green trees in background */}
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <group position={[-3, 1, -2.5]}>
            <mesh position={[0, -0.4, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.2, 1.2, 8]} />
              <meshStandardMaterial color="#78350F" />
            </mesh>
            <mesh position={[0, 0.5, 0]} castShadow>
              <sphereGeometry args={[0.7, 16, 16]} />
              <meshStandardMaterial color="#059669" flatShading />
            </mesh>
          </group>
        </Float>

        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
          <group position={[3, 0.8, -2.8]}>
            <mesh position={[0, -0.3, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.16, 1, 8]} />
              <meshStandardMaterial color="#78350F" />
            </mesh>
            <mesh position={[0, 0.4, 0]} castShadow>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial color="#10B981" flatShading />
            </mesh>
          </group>
        </Float>

        {/* Tiny sweet flowers scattered with breathing animation */}
        {[
          [-1.5, -1.8], [1.8, -1.5], [-2.5, 1.5], [2.7, 1.2], [0, -2.4]
        ].map(([x, z], i) => (
          <BreathingFlower key={i} position={[x, 0.02, z]} index={i} />
        ))}
      </group>
    );
  }

  if (category === "pet") {
    // Doghouse and playing items
    return (
      <group>
        {/* Cute simplified dog house on the left background */}
        <group position={[-2.8, 0, -2]}>
          {/* Main walls */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[1, 0.9, 1]} />
            <meshStandardMaterial color="#D7C49E" />
          </mesh>
          {/* Triangular Roof mesh */}
          <mesh position={[0, 1.05, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <boxGeometry args={[0.82, 0.82, 1.1]} />
            <meshStandardMaterial color="#EF4444" />
          </mesh>
          {/* Cute door hole */}
          <mesh position={[0, 0.25, 0.51]}>
            <boxGeometry args={[0.45, 0.5, 0.02]} />
            <meshStandardMaterial color="#451A03" />
          </mesh>
        </group>

        {/* Small colorful ball ornament rolling around */}
        <Float speed={3} rotationIntensity={1.5} floatIntensity={0.5}>
          <group position={[2.5, 0.15, -1.5]}>
            <mesh castShadow>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#EC4899" roughness={0.2} />
            </mesh>
            {/* Striped ring */}
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <ringGeometry args={[0.225, 0.24, 16]} />
              <meshStandardMaterial color="#3B82F6" side={THREE.DoubleSide} />
            </mesh>
          </group>
        </Float>
      </group>
    );
  }

  if (category === "sea") {
    // Seashells, underwater rocks, and bubble flows
    return (
      <group>
        {/* Soft yellow ocean floor rocks */}
        <group position={[-2.5, 0.12, -2]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial color="#B5A988" roughness={0.8} />
          </mesh>
        </group>
        <group position={[2.8, 0.08, -1.8]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="#B5A988" roughness={0.8} />
          </mesh>
        </group>

        {/* Floating seaweed tubes with breathing animation */}
        {[
          [-2.2, -1.2, 0.5], [2.4, -0.8, -0.4], [-3, 0.8, -1.5], [2.8, 1.2, 1.5]
        ].map(([x, z, scaleY], i) => (
          <BreathingSeaweed key={i} position={[x, 0.4, z]} index={i} />
        ))}

        {/* Floating ocean floor star stars */}
        <mesh position={[-1.5, 0.01, 1.8]} rotation={[Math.PI / 2, 0, 0.5]}>
          <sphereGeometry args={[0.08, 5, 2]} />
          <meshStandardMaterial color="#FB923C" />
        </mesh>
      </group>
    );
  }

  if (category === "animals") {
    return (
      <group>
        {/* Soft desert/safari rocks */}
        <group position={[-2.8, 0.1, -1.5]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.8} />
          </mesh>
        </group>
        <group position={[2.5, 0.08, -2.4]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.45, 8, 8]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.9} />
          </mesh>
        </group>

        {/* Tall safari acacia tree styled mesh */}
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.15}>
          <group position={[2.8, 0.7, -1.2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.05, 0.1, 1.4, 8]} />
              <meshStandardMaterial color="#78350F" />
            </mesh>
            {/* Flat Savannah canopy levels */}
            <mesh position={[0, 0.7, 0]} castShadow>
              <boxGeometry args={[1.5, 0.2, 1.2]} />
              <meshStandardMaterial color="#15803D" roughness={0.5} />
            </mesh>
            <mesh position={[0.2, 0.85, -0.1]} castShadow>
              <boxGeometry args={[1.0, 0.15, 0.8]} />
              <meshStandardMaterial color="#166534" roughness={0.5} />
            </mesh>
          </group>
        </Float>

        {/* Tiny dry/yellow grass weeds scattered with breathing animation */}
        {[
          [-1.5, -1.8], [1.8, -1.5], [-2.4, 1.4], [1.2, -2.2]
        ].map(([x, z], i) => (
          <BreathingGrass key={i} position={[x, 0, z]} index={i} />
        ))}
      </group>
    );
  }

  return null;
}

// --- INTERACTIVE INDIVIDUAL 3D ITEM WRAPPER ---

interface ModelWrapperProps {
  word: VocabularyWord;
  isFocused: boolean;
  onSelect: (word: VocabularyWord) => void;
}

function InteractiveModel({ word, isFocused, onSelect }: ModelWrapperProps) {
  const { challengeEnabled } = useStore();
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Apply cursor pointer when hovered
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "default";
    return () => {
      document.body.style.cursor = "default";
    };
  }, [hovered]);

  // Handle bouncy spring / elastic jump when this specific word is chosen!
  useEffect(() => {
    if (isFocused && groupRef.current) {
      // Trigger a dramatic GSAP physical jump and rotation spin
      gsap.fromTo(
        groupRef.current.position,
        { y: word.position[1] },
        { 
          y: word.position[1] + 1.2, 
          duration: 0.35, 
          yoyo: true, 
          repeat: 1, 
          ease: "power1.out" 
        }
      );
      
      gsap.fromTo(
        groupRef.current.rotation,
        { y: 0 },
        { 
          y: Math.PI * 2, 
          duration: 0.7, 
          ease: "power2.out" 
        }
      );
    }
  }, [isFocused, word.position]);

  // Gentle floating animation per item when not active
  useFrame((state) => {
    if (groupRef.current && !isFocused) {
      // Floating offset based on item's id to desynchronize them
      const offset = word.id.charCodeAt(0) * 0.1;
      groupRef.current.position.y = 
        word.position[1] + Math.sin(state.clock.elapsedTime * 1.8 + offset) * 0.08;
      
      // Slight smooth spinning rotation
      groupRef.current.rotation.y = 
        Math.sin(state.clock.elapsedTime * 0.4 + offset) * 0.15;
    }
  });

  // Calculate actual scale based on item default scale and hover state
  const baseScale = typeof word.scale === "number" ? word.scale : 1;
  const currentScale = hovered ? baseScale * 1.22 : baseScale;

  return (
    <group 
      ref={groupRef} 
      position={word.position}
      scale={[currentScale, currentScale, currentScale]}
    >
      {/* Invisible larger click target sphere for easy interaction */}
      <mesh 
        onClick={(e) => {
          e.stopPropagation();
          onSelect(word);
          
          if (e.point) {
            const event = new CustomEvent("spawn-touch-particles", {
              detail: {
                point: e.point.clone(),
                color: word.color || "#38BDF8"
              }
            });
            window.dispatchEvent(event);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        visible={false}
      >
        <sphereGeometry args={[0.75, 12, 12]} />
      </mesh>

      {/* Main Composite Child-Friendly mesh model element */}
      <group>
        <ModelComposer id={word.id} color={word.color} />
      </group>

      {/* Glow highlight under the active/hovered 3D element */}
      {(hovered || isFocused) && (
        <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[0.25, 0.45, 16]} />
          <meshBasicMaterial 
            color={isFocused ? "#FBBF24" : word.color} 
            transparent 
            opacity={isFocused ? 0.75 : 0.4} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* FLOATING TEXT BADGE OVER THE MODEL (Pointer events disabled on Html labels) */}
      <Html 
        distanceFactor={6} 
        position={[0, 1.1, 0]} 
        center 
        className="pointer-events-none select-none transition-all duration-300 transform scale-100"
      >
        <div 
          className={`px-3 py-1 bg-white border-2 rounded-full shadow-md text-slate-800 flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 ${
            isFocused 
              ? "border-yellow-400 scale-110 shadow-lg translate-y-[-4px]" 
              : hovered 
                ? "border-amber-300 scale-105" 
                : "border-slate-200 opacity-90"
          }`}
        >
          <span className="text-base">{word.emoji}</span>
          <span className="text-xs md:text-sm font-black uppercase tracking-tight">
            {challengeEnabled ? "❓" : word.word}
          </span>
        </div>
      </Html>
    </group>
  );
}

// --- MAIN CANVAS COMPONENT ---

function StarModel3D({ color, scale = 1 }: { color: string; scale?: number }) {
  const meshRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 1.2;
    }
  });

  return (
    <group ref={meshRef} scale={[scale, scale, scale]}>
      <mesh castShadow>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.1} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5;
        return (
          <mesh 
            key={i} 
            position={[Math.sin(angle) * 0.15, Math.cos(angle) * 0.15, 0]} 
            rotation={[0, 0, -angle]}
            castShadow
          >
            <coneGeometry args={[0.07, 0.22, 8]} />
            <meshStandardMaterial color={color} metalness={0.2} roughness={0.1} />
          </mesh>
        );
      })}
    </group>
  );
}

function DrawingRenderer() {
  const { currentDrawingElements } = useStore();
  
  return (
    <group>
      {currentDrawingElements.map((el) => {
        const size = el.size || 0.25;
        const pos = el.position || [0, 0, 0];
        
        switch (el.type) {
          case "free":
            if (!el.points || el.points.length === 0) return null;
            return (
              <group key={el.id}>
                {el.points.map((pt, idx) => (
                  <mesh key={`${el.id}-${idx}`} position={pt} castShadow>
                    <sphereGeometry args={[size * 0.5, 8, 8]} />
                    <meshStandardMaterial color={el.color} roughness={0.2} metalness={0.1} />
                  </mesh>
                ))}
              </group>
            );
            
          case "cube":
            return (
              <mesh key={el.id} position={pos} castShadow receiveShadow>
                <boxGeometry args={[size, size, size]} />
                <meshStandardMaterial color={el.color} roughness={0.25} metalness={0.15} />
              </mesh>
            );
            
          case "sphere":
            return (
              <mesh key={el.id} position={pos} castShadow receiveShadow>
                <sphereGeometry args={[size * 0.5, 16, 16]} />
                <meshStandardMaterial color={el.color} roughness={0.1} metalness={0.2} />
              </mesh>
            );
            
          case "cylinder":
            return (
              <mesh key={el.id} position={pos} castShadow receiveShadow>
                <cylinderGeometry args={[size * 0.35, size * 0.35, size, 16]} />
                <meshStandardMaterial color={el.color} roughness={0.3} metalness={0.1} />
              </mesh>
            );
            
          case "cone":
            return (
              <mesh key={el.id} position={pos} castShadow receiveShadow>
                <coneGeometry args={[size * 0.35, size, 16]} />
                <meshStandardMaterial color={el.color} roughness={0.2} metalness={0.1} />
              </mesh>
            );
            
          case "star":
            return (
              <group key={el.id} position={pos}>
                <StarModel3D color={el.color} scale={size * 1.3} />
              </group>
            );
            
          default:
            return null;
        }
      })}
    </group>
  );
}

function DrawingSurface() {
  const { 
    drawingModeEnabled, 
    activeDrawingTool, 
    activeDrawingColor, 
    activeBrushSize,
    addDrawingElement, 
    currentDrawingElements,
    setDrawingElements 
  } = useStore();
  
  const isDrawingRef = useRef(false);
  const activeStrokeIdRef = useRef<string | null>(null);
  const lastPointRef = useRef<[number, number, number] | null>(null);

  if (!drawingModeEnabled || activeDrawingTool === "orbit") return null;

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (e.button !== undefined && e.button !== 0) return;
    
    const point: [number, number, number] = [e.point.x, e.point.y + 0.015, e.point.z];
    isDrawingRef.current = true;
    
    if (activeDrawingTool === "free") {
      const strokeId = Math.random().toString(36).substring(2, 9);
      activeStrokeIdRef.current = strokeId;
      lastPointRef.current = point;
      
      const newElement: any = {
        id: strokeId,
        type: "free",
        color: activeDrawingColor,
        size: activeBrushSize,
        points: [point]
      };
      addDrawingElement(newElement);
    } else {
      const shapeId = Math.random().toString(36).substring(2, 9);
      const newElement: any = {
        id: shapeId,
        type: activeDrawingTool,
        color: activeDrawingColor,
        size: activeBrushSize,
        position: point
      };
      addDrawingElement(newElement);
    }
  };

  const handlePointerMove = (e: any) => {
    e.stopPropagation();
    if (!isDrawingRef.current || activeDrawingTool !== "free" || !activeStrokeIdRef.current || !lastPointRef.current) return;
    
    const point: [number, number, number] = [e.point.x, e.point.y + 0.015, e.point.z];
    const dx = point[0] - lastPointRef.current[0];
    const dy = point[1] - lastPointRef.current[1];
    const dz = point[2] - lastPointRef.current[2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    if (dist > 0.1) {
      lastPointRef.current = point;
      
      setDrawingElements(
        currentDrawingElements.map((el) => {
          if (el.id === activeStrokeIdRef.current) {
            return {
              ...el,
              points: [...(el.points || []), point]
            };
          }
          return el;
        })
      );
    }
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    activeStrokeIdRef.current = null;
    lastPointRef.current = null;
  };

  return (
    <group>
      <gridHelper args={[8, 16, "#F59E0B", "#FCD34D"]} position={[0, 0.405, 0]} />
      
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.4, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
      >
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial transparent opacity={0.05} color="#D97706" depthWrite={false} />
      </mesh>
    </group>
  );
}

function RobloxAvatarModel() {
  return (
    <group>
      {/* Simple blocky Roblox-style avatar body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.55, 0.7, 0.35]} />
        <meshStandardMaterial color="#2563EB" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.98, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#FBBF24" roughness={0.35} metalness={0.05} />
      </mesh>
      <mesh position={[-0.28, 0.45, 0]} castShadow>
        <boxGeometry args={[0.12, 0.45, 0.12]} />
        <meshStandardMaterial color="#2563EB" roughness={0.4} />
      </mesh>
      <mesh position={[0.28, 0.45, 0]} castShadow>
        <boxGeometry args={[0.12, 0.45, 0.12]} />
        <meshStandardMaterial color="#2563EB" roughness={0.4} />
      </mesh>
      <mesh position={[-0.14, 0.1, 0]} castShadow>
        <boxGeometry args={[0.14, 0.4, 0.14]} />
        <meshStandardMaterial color="#111827" roughness={0.6} />
      </mesh>
      <mesh position={[0.14, 0.1, 0]} castShadow>
        <boxGeometry args={[0.14, 0.4, 0.14]} />
        <meshStandardMaterial color="#111827" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.05, 0.22]} castShadow>
        <boxGeometry args={[0.22, 0.18, 0.02]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
      <mesh position={[0, 0.8, 0.28]} castShadow>
        <boxGeometry args={[0.35, 0.14, 0.08]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  );
}

interface PlayerAvatarProps {
  controlsRef: React.RefObject<any>;
  category: ExploreCategory;
}

function PlayerAvatar({ controlsRef, category }: PlayerAvatarProps) {
  const playerRef = useRef<THREE.Group>(null);
  const positionRef = useRef(new THREE.Vector3(0, 0, 2.4));
  const directionRef = useRef(0);
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });
  const speed = 2.8;
  const maxRadius = 4.5;
  const { camera } = useThree();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "w":
        case "arrowup":
          moveState.current.forward = true;
          break;
        case "s":
        case "arrowdown":
          moveState.current.backward = true;
          break;
        case "a":
        case "arrowleft":
          moveState.current.left = true;
          break;
        case "d":
        case "arrowright":
          moveState.current.right = true;
          break;
        default:
          return;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "w":
        case "arrowup":
          moveState.current.forward = false;
          break;
        case "s":
        case "arrowdown":
          moveState.current.backward = false;
          break;
        case "a":
        case "arrowleft":
          moveState.current.left = false;
          break;
        case "d":
        case "arrowright":
          moveState.current.right = false;
          break;
        default:
          return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const current = positionRef.current;
    const move = moveState.current;
    const velocity = new THREE.Vector3();

    if (move.forward) velocity.z -= 1;
    if (move.backward) velocity.z += 1;
    if (move.left) velocity.x -= 1;
    if (move.right) velocity.x += 1;

    if (velocity.lengthSq() > 0.001) {
      velocity.normalize().multiplyScalar(speed * delta);
      current.add(velocity);
      if (current.length() > maxRadius) {
        current.setLength(maxRadius);
      }
      directionRef.current = Math.atan2(velocity.x, velocity.z);
    }

    if (playerRef.current) {
      playerRef.current.position.copy(current);
      playerRef.current.rotation.y = directionRef.current;
    }

    const desiredCameraPosition = new THREE.Vector3(current.x, current.y + 2.6, current.z + 4.6);
    const lookAtTarget = new THREE.Vector3(current.x, current.y + 0.8, current.z);

    camera.position.lerp(desiredCameraPosition, 0.1);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(lookAtTarget, 0.14);
      controlsRef.current.update();
    } else {
      camera.lookAt(lookAtTarget);
    }
  });

  const landColor = category === "sea" ? "#0EA5E9" : category === "animals" ? "#84CC16" : category === "pet" ? "#F59E0B" : "#22C55E";

  return (
    <group ref={playerRef} position={[0, 0, 2.4]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <circleGeometry args={[0.35, 28]} />
        <meshStandardMaterial color={landColor} opacity={0.35} transparent />
      </mesh>
      <RobloxAvatarModel />
    </group>
  );
}

// --- DYNAMIC CAMERA ADJUSTMENT CONTROLLER COMPONENT ---
function CameraController({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const { camera } = useThree();

  useEffect(() => {
    const handleCameraAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { action } = customEvent.detail || {};
      if (!action) return;

      if (!controlsRef.current) return;
      const controls = controlsRef.current;

      const target = controls.target;
      const offset = new THREE.Vector3().copy(camera.position).sub(target);
      
      switch (action) {
        case "zoom-in": {
          offset.multiplyScalar(0.75);
          const dist = offset.length();
          if (dist >= 1.0) {
            camera.position.copy(target).add(offset);
          }
          break;
        }
        case "zoom-out": {
          offset.multiplyScalar(1.25);
          const dist = offset.length();
          if (dist <= 12.0) {
            camera.position.copy(target).add(offset);
          }
          break;
        }
        case "pan-left": {
          const right = new THREE.Vector3();
          camera.matrix.extractBasis(right, new THREE.Vector3(), new THREE.Vector3());
          const delta = right.clone().multiplyScalar(-0.4);
          target.add(delta);
          camera.position.add(delta);
          break;
        }
        case "pan-right": {
          const right = new THREE.Vector3();
          camera.matrix.extractBasis(right, new THREE.Vector3(), new THREE.Vector3());
          const delta = right.clone().multiplyScalar(0.4);
          target.add(delta);
          camera.position.add(delta);
          break;
        }
        case "pan-up": {
          const up = new THREE.Vector3();
          camera.matrix.extractBasis(new THREE.Vector3(), up, new THREE.Vector3());
          const delta = up.clone().multiplyScalar(0.4);
          target.add(delta);
          camera.position.add(delta);
          break;
        }
        case "pan-down": {
          const up = new THREE.Vector3();
          camera.matrix.extractBasis(new THREE.Vector3(), up, new THREE.Vector3());
          const delta = up.clone().multiplyScalar(-0.4);
          target.add(delta);
          camera.position.add(delta);
          break;
        }
        case "reset": {
          target.set(0, 0, 0);
          camera.position.set(0, 2.5, 4.5);
          break;
        }
        default:
          break;
      }
      
      camera.updateProjectionMatrix();
      controls.update();
    };

    window.addEventListener("app-camera-control", handleCameraAction);
    return () => {
      window.removeEventListener("app-camera-control", handleCameraAction);
    };
  }, [camera, controlsRef]);

  return null;
}

// --- UNDERWATER BUBBLE PARTICLE COMPONENT ---
function UnderwaterBubbles() {
  const count = 18;
  const meshRef = useRef<THREE.Group>(null);
  const bubbleData = useRef<{ pos: [number, number, number]; speed: number; yStart: number; scale: number }[]>([]);

  if (bubbleData.current.length === 0) {
    bubbleData.current = Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 4.5 + Math.random() * 4; // outside the central island
      return {
        pos: [
          Math.cos(angle) * radius,
          Math.random() * 8 - 4,
          Math.sin(angle) * radius
        ],
        speed: 0.8 + Math.random() * 1.5,
        yStart: -4,
        scale: 0.1 + Math.random() * 0.25
      };
    });
  }

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.children.forEach((child, i) => {
      const data = bubbleData.current[i];
      if (!data) return;
      child.position.y += data.speed * delta;
      child.position.x += Math.sin(state.clock.elapsedTime + i) * 0.005; // gentle side wobble
      if (child.position.y > 6) {
        child.position.y = data.yStart;
      }
    });
  });

  return (
    <group ref={meshRef}>
      {bubbleData.current.map((data, i) => (
        <mesh key={i} position={data.pos} scale={data.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.35} roughness={0} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// --- DYNAMIC BACKGROUND SKYBOX ENVIRONMENT DECORATION COMPONENT ---
function SkyboxBackgroundScene() {
  const skyboxBackground = useStore((state) => state.skyboxBackground);
  const environmentTheme = useStore((state) => state.environmentTheme);

  // Gentle floating animation to rotate space group
  const spaceGroupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (spaceGroupRef.current) {
      spaceGroupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  // Render mountain models
  if (skyboxBackground === "mountain") {
    const capColor = environmentTheme === "night" ? "#E2E8F0" : environmentTheme === "twilight" ? "#FFD1DC" : "#FFFFFF";
    const bodyColor = environmentTheme === "night" ? "#1E293B" : environmentTheme === "twilight" ? "#653457" : "#0F766E";
    return (
      <group>
        {/* Mountain 1 */}
        <group position={[-5.8, 0, -8.2]}>
          <mesh position={[0, 2.5, 0]} castShadow>
            <coneGeometry args={[3.2, 5, 5]} />
            <meshStandardMaterial color={bodyColor} flatShading roughness={0.9} />
          </mesh>
          <mesh position={[0, 4.3, 0]}>
            <coneGeometry args={[1.35, 2.1, 5]} />
            <meshStandardMaterial color={capColor} flatShading roughness={0.9} />
          </mesh>
        </group>

        {/* Mountain 2 */}
        <group position={[5.8, 0, -8.5]}>
          <mesh position={[0, 2.2, 0]} castShadow>
            <coneGeometry args={[2.8, 4.4, 5]} />
            <meshStandardMaterial color={bodyColor} flatShading roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.8, 0]}>
            <coneGeometry args={[1.2, 1.8, 5]} />
            <meshStandardMaterial color={capColor} flatShading roughness={0.9} />
          </mesh>
        </group>

        {/* Mountain 3 - Tall Center */}
        <group position={[0, 0, -10.5]}>
          <mesh position={[0, 3.6, 0]} castShadow>
            <coneGeometry args={[4.2, 7.2, 5]} />
            <meshStandardMaterial color={bodyColor} flatShading roughness={0.9} />
          </mesh>
          <mesh position={[0, 6.3, 0]}>
            <coneGeometry args={[1.7, 3.0, 5]} />
            <meshStandardMaterial color={capColor} flatShading roughness={0.9} />
          </mesh>
        </group>

        {/* Mountain 4 - Left-Far */}
        <group position={[-9.5, 0, -4.5]}>
          <mesh position={[0, 2.0, 0]} castShadow>
            <coneGeometry args={[2.5, 4, 5]} />
            <meshStandardMaterial color={bodyColor} flatShading roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.4, 0]}>
            <coneGeometry args={[1.0, 1.6, 5]} />
            <meshStandardMaterial color={capColor} flatShading roughness={0.9} />
          </mesh>
        </group>

        {/* Mountain 5 - Right-Far */}
        <group position={[9.5, 0, -4.5]}>
          <mesh position={[0, 2.4, 0]} castShadow>
            <coneGeometry args={[2.8, 4.8, 5]} />
            <meshStandardMaterial color={bodyColor} flatShading roughness={0.9} />
          </mesh>
          <mesh position={[0, 4.1, 0]}>
            <coneGeometry args={[1.1, 1.9, 5]} />
            <meshStandardMaterial color={capColor} flatShading roughness={0.9} />
          </mesh>
        </group>
      </group>
    );
  }

  // Render underwater scene elements
  if (skyboxBackground === "underwater") {
    const isDark = environmentTheme === "night" || environmentTheme === "twilight";
    const plantColor1 = isDark ? "#064E3B" : "#10B981";
    const plantColor2 = isDark ? "#14532D" : "#059669";
    const plantColor3 = isDark ? "#1E1B4B" : "#F43F5E"; // Red coral
    
    return (
      <group>
        {/* Underwater magical bubble generator */}
        <UnderwaterBubbles />

        {/* Floating wavy kelps (seaweeds) made using stack of scaling spheres */}
        <group position={[-5.8, 0, -6.5]}>
          {[0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4].map((y, index) => (
            <mesh key={index} position={[Math.sin(y * 1.5) * 0.15, y, 0]} castShadow>
              <sphereGeometry args={[0.32 - y * 0.05, 8, 8]} />
              <meshStandardMaterial color={plantColor1} flatShading roughness={0.9} />
            </mesh>
          ))}
        </group>

        <group position={[5.8, 0, -6.2]}>
          {[0, 0.4, 0.8, 1.2, 1.6, 2.0].map((y, index) => (
            <mesh key={index} position={[Math.cos(y * 1.5) * 0.12, y, 0]} castShadow>
              <sphereGeometry args={[0.26 - y * 0.04, 8, 8]} />
              <meshStandardMaterial color={plantColor2} flatShading roughness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Coral/Anemone structures */}
        <group position={[-6.2, 0, -1.5]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.2, 0.8, 6]} />
            <meshStandardMaterial color={plantColor3} flatShading />
          </mesh>
          <mesh position={[0.2, 0.7, 0]} rotation={[0, 0, 0.4]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.6, 6]} />
            <meshStandardMaterial color={plantColor3} flatShading />
          </mesh>
          <mesh position={[-0.2, 0.6, 0]} rotation={[0, 0, -0.4]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.5, 6]} />
            <meshStandardMaterial color={plantColor3} flatShading />
          </mesh>
        </group>

        <group position={[6.2, 0, 1.5]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.15, 0.6, 6]} />
            <meshStandardMaterial color="#FDA4AF" flatShading />
          </mesh>
        </group>
      </group>
    );
  }

  // Render space scene elements
  if (skyboxBackground === "space") {
    const isDark = environmentTheme === "night" || environmentTheme === "twilight";
    const rocketBody = isDark ? "#E2E8F0" : "#FFFFFF";
    const rocketFin = isDark ? "#EF4444" : "#F43F5E";

    return (
      <group ref={spaceGroupRef}>
        {/* Planet 1 - Large ringed planet in background */}
        <Float speed={2.2} rotationIntensity={0.3} floatIntensity={0.5} position={[-7.5, 4.5, -7]}>
          <group>
            {/* Main sphere */}
            <mesh castShadow>
              <sphereGeometry args={[1.1, 16, 16]} />
              <meshStandardMaterial color="#FBBF24" flatShading roughness={0.6} />
            </mesh>
            {/* Flat-shaded ring around planet */}
            <mesh rotation={[Math.PI / 3, 0.2, 0]}>
              <ringGeometry args={[1.4, 2.1, 16]} />
              <meshStandardMaterial color="#A78BFA" transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </Float>

        {/* Planet 2 - Small glowing planet in background */}
        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.4} position={[7, 3.8, -9]}>
          <group>
            <mesh>
              <sphereGeometry args={[0.55, 12, 12]} />
              <meshStandardMaterial color="#EC4899" flatShading roughness={0.5} />
            </mesh>
          </group>
        </Float>

        {/* Tiny floating geometric low-segment sphere asteroids surrounding */}
        {[-8, -5, 5, 8].map((x, i) => {
          const z = i % 2 === 0 ? -4 : -8;
          const y = 1.2 + (i % 3) * 0.8;
          const size = 0.2 + (i % 4) * 0.08;
          return (
            <group key={i} position={[x, y, z]}>
              <mesh castShadow>
                <sphereGeometry args={[size, 4, 3]} />
                <meshStandardMaterial color="#64748B" flatShading roughness={1.0} />
              </mesh>
            </group>
          );
        })}

        {/* Cute Low Poly Rocket hovering in space */}
        <Float speed={3.5} rotationIntensity={0.6} floatIntensity={0.7} position={[-4.5, 3.2, -4]}>
          <group rotation={[0.4, 0.4, -0.2]}>
            {/* Rocket Body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.9, 8]} />
              <meshStandardMaterial color={rocketBody} flatShading />
            </mesh>
            {/* Nosecone */}
            <mesh position={[0, 0.65, 0]} castShadow>
              <coneGeometry args={[0.22, 0.4, 8]} />
              <meshStandardMaterial color={rocketFin} flatShading />
            </mesh>
            {/* Fin 1 */}
            <mesh position={[0.2, -0.3, 0]} rotation={[0, 0, -0.4]}>
              <boxGeometry args={[0.12, 0.35, 0.05]} />
              <meshStandardMaterial color={rocketFin} flatShading />
            </mesh>
            {/* Fin 2 */}
            <mesh position={[-0.2, -0.3, 0]} rotation={[0, 0, 0.4]}>
              <boxGeometry args={[0.12, 0.35, 0.05]} />
              <meshStandardMaterial color={rocketFin} flatShading />
            </mesh>
          </group>
        </Float>
      </group>
    );
  }

  // Plain/Standard theme: return nothing extra
  return null;
}

// --- CELESTIAL BACKGROUND OBJECTS DEPENDING ON ENV THEME ---
function CelestialBody({ theme }: { theme: "day" | "night" | "twilight" }) {
  if (theme === "night") {
    return (
      <group>
        {/* Magic Glowing Full Moon in background */}
        <mesh position={[5, 9, -12]}>
          <sphereGeometry args={[1.1, 16, 16]} />
          <meshBasicMaterial color="#FEF08A" />
        </mesh>
        <mesh position={[5, 9, -12]}>
          <sphereGeometry args={[1.35, 16, 16]} />
          <meshBasicMaterial color="#FEF08A" transparent opacity={0.25} />
        </mesh>

        {/* Floating background star fields */}
        <group position={[-2, 6, -10]}>
          <mesh position={[-4, 3, -1]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[4, 2, -1.5]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>
          <mesh position={[-1, 4, -3]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[1.5, 3.5, -2]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#FEF3C7" />
          </mesh>
          <mesh position={[-6, 1, -2]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
      </group>
    );
  } else if (theme === "twilight") {
    return (
      <group>
        {/* Soft Low Purple-Rose Sunset Sun */}
        <mesh position={[6, 7, -13]}>
          <sphereGeometry args={[1.3, 16, 16]} />
          <meshBasicMaterial color="#FDA4AF" />
        </mesh>
        <mesh position={[6, 7, -13]}>
          <sphereGeometry args={[1.6, 16, 16]} />
          <meshBasicMaterial color="#F43F5E" transparent opacity={0.2} />
        </mesh>
      </group>
    );
  } else {
    // Standard Day Mode
    return (
      <group>
        {/* Bright Glowing Sun */}
        <mesh position={[5, 11, -11]}>
          <sphereGeometry args={[1.0, 16, 16]} />
          <meshBasicMaterial color="#FBBF24" />
        </mesh>
        <mesh position={[5, 11, -11]}>
          <sphereGeometry args={[1.3, 16, 16]} />
          <meshBasicMaterial color="#FBBF24" transparent opacity={0.25} />
        </mesh>
      </group>
    );
  }
}

export default function ThreeCanvas() {
  const { activeCategory, currentWord, selectWord, drawingModeEnabled, activeDrawingTool, environmentTheme, skyboxBackground } = useStore();
  const controlsRef = useRef<any>(null);

  const handleSelectWord = (word: VocabularyWord) => {
    selectWord(word);
  };

  if (!activeCategory) return null;

  // Filter vocabulary corresponding to the chosen active zone category
  const filteredWords = VOCABULARY_DATA.filter((w) => w.category === activeCategory);

  // Set visual colors depending on category theme and child theme selection
  const getEnvironmentProps = () => {
    // Base colors by zone category
    const bases = {
      garden: {
        floor: "#A7F3D0", // Emerald Green
        sky: "#F0FDF4",
        ambient: 0.8,
        fog: "#D1FAE5"
      },
      pet: {
        floor: "#FDE68A", // Soft yellow wooden floor
        sky: "#FFFBEB",
        ambient: 0.85,
        fog: "#FEF3C7"
      },
      sea: {
        floor: "#A5F3FC", // Teal sand floor
        sky: "#ECFEFF",
        ambient: 0.9,
        fog: "#CFFAFE"
      },
      animals: {
        floor: "#BBF7D0", // Lime safari green
        sky: "#FEF08A",
        ambient: 0.85,
        fog: "#FEF9C3"
      }
    };

    const base = bases[activeCategory] || bases.garden;

    // Determine custom sky and fog override depending on selected skybox background
    let skyboxSkyOverride: string | null = null;
    let skyboxFogOverride: string | null = null;

    if (skyboxBackground === "mountain") {
      if (environmentTheme === "night") {
        skyboxSkyOverride = "#0F172A";
        skyboxFogOverride = "#1E293B";
      } else if (environmentTheme === "twilight") {
        skyboxSkyOverride = "#F472B6";
        skyboxFogOverride = "#FCE7F3";
      } else {
        skyboxSkyOverride = "#BAE6FD"; // Crisp mountain blue
        skyboxFogOverride = "#E0F2FE";
      }
    } else if (skyboxBackground === "underwater") {
      if (environmentTheme === "night") {
        skyboxSkyOverride = "#020617"; // Midnight abyss
        skyboxFogOverride = "#151B3E";
      } else if (environmentTheme === "twilight") {
        skyboxSkyOverride = "#1E3A8A"; // Deep navy
        skyboxFogOverride = "#172554";
      } else {
        skyboxSkyOverride = "#06B6D4"; // Ocean turquoise
        skyboxFogOverride = "#CFFAFE";
      }
    } else if (skyboxBackground === "space") {
      if (environmentTheme === "night") {
        skyboxSkyOverride = "#03001C"; // Stellar void
        skyboxFogOverride = "#0B0033";
      } else if (environmentTheme === "twilight") {
        skyboxSkyOverride = "#4A044E"; // Cosmic magenta
        skyboxFogOverride = "#701A75";
      } else {
        skyboxSkyOverride = "#1E1B4B"; // Dark space indigo
        skyboxFogOverride = "#312E81";
      }
    }

    if (environmentTheme === "night") {
      let dirIntensity = 0.5;
      let dirColor = "#93C5FD"; // Magical pale blue light (moonlight)
      if (skyboxBackground === "mountain") {
        dirIntensity = 0.45;
        dirColor = "#A5B4FC"; // Crisp starlight blue-purple
      } else if (skyboxBackground === "underwater") {
        dirIntensity = 0.35;
        dirColor = "#0E7490"; // Deep cyan oceanic abyss light
      } else if (skyboxBackground === "space") {
        dirIntensity = 0.55;
        dirColor = "#C084FC"; // Outer space cosmic stellar purple glow
      }
      return {
        floorColor: activeCategory === "sea" ? "#164E63" : activeCategory === "garden" ? "#064E3B" : activeCategory === "pet" ? "#78350F" : "#14532D",
        skyColor: skyboxSkyOverride || (activeCategory === "sea" ? "#030712" : "#020617"),
        ambientStrength: 0.35,
        fogColor: skyboxFogOverride || (activeCategory === "sea" ? "#082F49" : "#0F172A"),
        directionalLightIntensity: dirIntensity,
        directionalLightColor: dirColor,
        pointLightIntensity: skyboxBackground === "space" ? 1.0 : 0.85
      };
    } else if (environmentTheme === "twilight") {
      let dirIntensity = 0.9;
      let dirColor = "#F43F5E"; // Cozy warm rose-pink sunset shade
      if (skyboxBackground === "mountain") {
        dirIntensity = 0.95;
        dirColor = "#FDA4AF"; // Soft mountain pass warm peak haze
      } else if (skyboxBackground === "underwater") {
        dirIntensity = 0.6;
        dirColor = "#BE185D"; // Crimson twilight bioluminescence water filtered light
      } else if (skyboxBackground === "space") {
        dirIntensity = 1.05;
        dirColor = "#E879F9"; // Beautiful cosmic nebula twilight violet-magenta temperature
      }
      return {
        floorColor: activeCategory === "sea" ? "#0E7490" : activeCategory === "garden" ? "#047857" : activeCategory === "pet" ? "#92400E" : "#15803D",
        skyColor: skyboxSkyOverride || "#4C1D95", // Sunset violet sky
        ambientStrength: 0.6,
        fogColor: skyboxFogOverride || "#2D0B5A", // Sunset twilight fog
        directionalLightIntensity: dirIntensity,
        directionalLightColor: dirColor,
        pointLightIntensity: 0.65
      };
    } else {
      // "day" mode - original natural palettes
      let dirIntensity = 1.3;
      let dirColor = "#FFFFFF"; // Balanced daylight
      if (skyboxBackground === "mountain") {
        dirIntensity = 1.4;
        dirColor = "#F0FDFA"; // Crisp clear-sky alpine light temperature
      } else if (skyboxBackground === "underwater") {
        dirIntensity = 0.85;
        dirColor = "#22D3EE"; // Shimmering sun-rays filtered depth turquoise temperature
      } else if (skyboxBackground === "space") {
        dirIntensity = 1.25;
        dirColor = "#E0E7FF"; // Bright star-point cosmic white-indigo glow
      }
      return {
        floorColor: skyboxBackground === "underwater" ? "#083344" : base.floor,
        skyColor: skyboxSkyOverride || base.sky,
        ambientStrength: base.ambient,
        fogColor: skyboxFogOverride || base.fog,
        directionalLightIntensity: dirIntensity,
        directionalLightColor: dirColor,
        pointLightIntensity: 0.4
      };
    }
  };

  const expandPosition = (position: [number, number, number], factor = 1.45) => {
    const [x, y, z] = position;
    const spreadX = x * factor + (Math.abs(x) < 0.4 ? 0 : Math.sign(x) * 0.18);
    const spreadZ = z * factor + (Math.abs(z) < 0.4 ? 0 : Math.sign(z) * 0.18);
    return [spreadX, y, spreadZ] as [number, number, number];
  };

  const env = getEnvironmentProps();

  return (
    <div className="absolute inset-0 z-10 w-full h-full">
      <Canvas
        id="three-webgl-canvas"
        camera={{ position: [0, 3.4, 7.2], fov: 48 }}
        shadows
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        style={{ background: env.skyColor }}
      >
        {/* Soft, friendly fog system for immersive atmosphere */}
        <fog attach="fog" args={[env.fogColor, 5, 12]} />

        {/* --- LIGHTS --- */}
        <ambientLight intensity={env.ambientStrength} />
        
        {/* Celestial background elements like stars, moon or sun */}
        <CelestialBody theme={environmentTheme} />
        
        {/* Custom background environments: mountain, underwater, space, plain */}
        <SkyboxBackgroundScene />
        
        {/* Sun-like Directional light emitting warm shadows */}
        <directionalLight
          position={[5, 6, 4]}
          intensity={env.directionalLightIntensity || 1.25}
          color={env.directionalLightColor || "#FFFFFF"}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={15}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
        />

        {/* Soft fill point lights */}
        <pointLight position={[-4, 3, -2]} intensity={env.pointLightIntensity || 0.4} />

        {/* --- 3D ENVIRONMENT GROUND GRID --- */}
        <group position={[0, 0, 0]}>
          {/* Main rounded styled island ground turf */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow position={[0, -0.01, 0]}>
            <cylinderGeometry args={[5.5, 5.6, 0.2, 48]} />
            <meshStandardMaterial color={env.floorColor} roughness={0.7} />
          </mesh>

          {/* Under-shadow cylinder outline */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
            <cylinderGeometry args={[5.6, 5.6, 0.05, 48]} />
            <meshBasicMaterial color="#475569" transparent opacity={0.15} />
          </mesh>
        </group>

        {/* --- DYNAMIC SCENERY --- */}
        <Scenery category={activeCategory} />

        {/* --- INTERACTIVE VOCABULARY GRAPHICS --- */}
        {filteredWords.map((word) => (
          <InteractiveModel
            key={word.id}
            word={{ ...word, position: expandPosition(word.position) }}
            isFocused={currentWord?.id === word.id}
            onSelect={handleSelectWord}
          />
        ))}

        {/* --- PLAYER AVATAR AND MOVEMENT --- */}
        <PlayerAvatar controlsRef={controlsRef} category={activeCategory} />

        {/* --- 3D DRAWING ELEMENTS --- */}
        <DrawingRenderer />

        {/* --- 3D DRAWING TRACING GRID SURFACE --- */}
        <DrawingSurface />

        {/* --- 3D PARTICLE CELEBRATION EFFECT --- */}
        <WordCelebrationParticles />

        {/* --- 3D TOUCH FEEDBACK PARTICLE EFFECT --- */}
        <TouchFeedbackParticles />

        {/* --- DYNAMIC CAMERA CONTROLLER MANAGER --- */}
        <CameraController controlsRef={controlsRef} />

        {/* --- CAMERA INTERACTION CONTROL --- */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enabled={!drawingModeEnabled || activeDrawingTool === "orbit"}
          enablePan={true}
          enableZoom={true}
          minDistance={1.0}
          maxDistance={16}
          minPolarAngle={0.08}
          maxPolarAngle={Math.PI / 2 - 0.05} // prevent going underwater or ground level
        />
      </Canvas>
    </div>
  );
}

// --- TOUCH FEEDBACK PARTICLE COMPONENT ---
interface TouchParticle {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: string;
  type: "bubble" | "star";
  size: number;
  life: number; // 1.0 down to 0
  angle: number;
  spinSpeed: number;
}

function TouchFeedbackParticles() {
  const { skyboxBackground, activeCategory } = useStore();
  const [particles, setParticles] = useState<TouchParticle[]>([]);
  const idCounter = useRef(0);

  useEffect(() => {
    const handleSpawn = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { point, color } = customEvent.detail || {};
      if (!point) return;

      const newParticles: TouchParticle[] = [];
      const isUnderwater = skyboxBackground === "underwater" || activeCategory === "sea";
      const particleType = isUnderwater ? "bubble" : "star";
      const count = isUnderwater ? 8 : 12;

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 0.8) - 0.2); // upward hemisphere
        const strength = isUnderwater ? (0.6 + Math.random() * 1.2) : (1.0 + Math.random() * 1.8);
        
        const vx = Math.sin(phi) * Math.cos(theta) * strength;
        const vy = Math.abs(Math.cos(phi) * strength) + (isUnderwater ? 0.35 : 0.65);
        const vz = Math.sin(phi) * Math.sin(theta) * strength;

        newParticles.push({
          id: idCounter.current++,
          position: point.clone(),
          velocity: new THREE.Vector3(vx, vy, vz),
          color: isUnderwater ? "#38BDF8" : color || "#FBBF24",
          type: particleType,
          size: isUnderwater ? (0.04 + Math.random() * 0.1) : (0.05 + Math.random() * 0.12),
          life: 1.0,
          angle: Math.random() * Math.PI,
          spinSpeed: (Math.random() - 0.5) * 5
        });
      }

      setParticles((prev) => [...prev, ...newParticles].slice(-100));
    };

    window.addEventListener("spawn-touch-particles", handleSpawn);
    return () => {
      window.removeEventListener("spawn-touch-particles", handleSpawn);
    };
  }, [skyboxBackground, activeCategory]);

  useFrame((state, delta) => {
    if (particles.length === 0) return;

    const dt = Math.min(delta, 0.1);

    setParticles((prev) => {
      const updated: TouchParticle[] = [];
      for (const p of prev) {
        const nextLife = p.life - dt * (p.type === "bubble" ? 0.95 : 1.3);
        if (nextLife <= 0) continue;

        p.position.x += p.velocity.x * dt;
        p.position.y += p.velocity.y * dt;
        p.position.z += p.velocity.z * dt;

        if (p.type === "bubble") {
          p.position.x += Math.sin(state.clock.getElapsedTime() * 5 + p.id) * 0.006;
          p.position.z += Math.cos(state.clock.getElapsedTime() * 4 + p.id) * 0.005;
          p.velocity.y += 0.4 * dt;
          p.velocity.x *= 0.93;
          p.velocity.z *= 0.93;
        } else {
          p.velocity.x *= 0.9;
          p.velocity.y -= 1.8 * dt; // gravity arc
          p.velocity.z *= 0.9;
          p.angle += p.spinSpeed * dt;
        }

        p.life = nextLife;
        updated.push(p);
      }
      return updated;
    });
  });

  return (
    <group>
      {particles.map((p) => {
        const currentScale = p.size * p.life;
        return (
          <group 
            key={p.id} 
            position={[p.position.x, p.position.y, p.position.z]} 
            scale={[currentScale, currentScale, currentScale]}
            rotation={[p.type === "star" ? p.angle : 0, p.type === "star" ? p.angle * 0.5 : 0, 0]}
          >
            {p.type === "bubble" ? (
              <mesh>
                <sphereGeometry args={[1, 10, 10]} />
                <meshStandardMaterial 
                  color="#E0F2FE" 
                  emissive="#0284C7"
                  emissiveIntensity={0.6}
                  transparent 
                  opacity={p.life * 0.45} 
                  roughness={0.1}
                  metalness={0.1}
                />
              </mesh>
            ) : (
              <group>
                <mesh position={[0, 0.15, 0]}>
                  <coneGeometry args={[0.3, 0.4, 4]} />
                  <meshStandardMaterial 
                    color={p.color} 
                    emissive={p.color}
                    emissiveIntensity={0.5}
                    flatShading 
                    transparent
                    opacity={p.life * 0.95}
                  />
                </mesh>
                <mesh position={[0, -0.15, 0]} rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[0.3, 0.4, 4]} />
                  <meshStandardMaterial 
                    color={p.color} 
                    emissive={p.color}
                    emissiveIntensity={0.5}
                    flatShading 
                    transparent
                    opacity={p.life * 0.95}
                  />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}

// Sparkly 3D physics celebration particle burst for kids game feel!
interface ActiveParticle {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: string;
  shape: "sphere" | "box" | "cone";
  size: number;
  life: number; // 1.0 down to 0
}

function WordCelebrationParticles() {
  const { lastLearnedWordId, clearLastLearnedWordId } = useStore();
  const [particles, setParticles] = useState<ActiveParticle[]>([]);
  const idCounter = useRef(0);

  useEffect(() => {
    if (!lastLearnedWordId) return;

    const word = VOCABULARY_DATA.find((w) => w.id === lastLearnedWordId);
    if (word) {
      const [wx, wy, wz] = word.position;
      
      const newParticles: ActiveParticle[] = [];
      const particleColors = [
        word.color, 
        "#FBBF24", // Gold/Stars
        "#38BDF8", // Magic Blue
        "#EC4899", // Cute Pink
        "#FFF",    // Sparkly white
        "#10B981"  // Bright Emerald
      ];

      for (let i = 0; i < 45; i++) {
        // Random spherical distribute directions
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const speed = 1.2 + Math.random() * 3.0;

        const vx = Math.sin(phi) * Math.cos(theta) * speed;
        const vy = (Math.sin(phi) * Math.sin(theta) * speed) + 2.4; // upward bounce bias
        const vz = Math.cos(phi) * speed;

        const shapes: ("sphere" | "box" | "cone")[] = ["sphere", "box", "cone"];
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        const randomColor = particleColors[Math.floor(Math.random() * particleColors.length)];

        newParticles.push({
          id: idCounter.current++,
          position: new THREE.Vector3(wx, wy + 0.5, wz),
          velocity: new THREE.Vector3(vx, vy, vz),
          color: randomColor,
          shape: randomShape,
          size: 0.05 + Math.random() * 0.12,
          life: 1.0
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);
    }

    clearLastLearnedWordId();
  }, [lastLearnedWordId, clearLastLearnedWordId]);

  useFrame((state, delta) => {
    if (particles.length === 0) return;

    const dt = Math.min(delta, 0.1);

    setParticles((prev) => {
      const updated: ActiveParticle[] = [];
      for (const p of prev) {
        const nextLife = p.life - dt * 0.85; // life countdown
        if (nextLife <= 0) continue;

        // Kinematics motion integration
        p.position.x += p.velocity.x * dt;
        p.position.y += p.velocity.y * dt;
        p.position.z += p.velocity.z * dt;

        // Apply downward gravity and drag resistances
        p.velocity.y -= 4.2 * dt;
        p.velocity.x *= 0.95;
        p.velocity.y *= 0.95;
        p.velocity.z *= 0.95;

        p.life = nextLife;
        updated.push(p);
      }
      return updated;
    });
  });

  return (
    <group>
      {particles.map((p) => (
        <mesh 
          key={p.id} 
          position={p.position} 
          scale={[p.size * p.life, p.size * p.life, p.size * p.life]}
        >
          {p.shape === "sphere" ? (
            <sphereGeometry args={[0.5, 6, 6]} />
          ) : p.shape === "box" ? (
            <boxGeometry args={[0.5, 0.5, 0.5]} />
          ) : (
            <coneGeometry args={[0.3, 0.6, 5]} />
          )}
          <meshBasicMaterial 
            color={p.color} 
            transparent 
            opacity={p.life * 0.9} 
          />
        </mesh>
      ))}
    </group>
  );
}
