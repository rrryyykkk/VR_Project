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
    if (texture) {
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 4;
      if (onLoaded) onLoaded();
    }
  }, [texture, onLoaded]);

  return (
    <mesh scale={[-1, 1, 1]}>
      {/* sphere dibalik di sumbu X dengan segment lebih ringan */}
      <sphereGeometry args={[500, 32, 16]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
