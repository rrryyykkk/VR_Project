import { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

interface SceneProps {
  image: string;
  onLoaded?: () => void;
}

export default function Scene({ image, onLoaded }: SceneProps) {
  const texture = useLoader(THREE.TextureLoader, image);

  useEffect(() => {
    const start = performance.now();

    if (texture) {
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 4;

      if (onLoaded) onLoaded();

      const end = performance.now();
      console.log(`Scene "${image}" render took ${end - start} ms`);
    }
  }, [texture, image, onLoaded]);

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 32, 16]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
