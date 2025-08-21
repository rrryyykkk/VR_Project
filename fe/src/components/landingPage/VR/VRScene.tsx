import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

interface SceneProps {
  image: string;
}

export default function Scene({ image }: SceneProps) {
  const texture = useLoader(THREE.TextureLoader, image);

  return (
    <mesh scale={[-1, 1, 1]}>
      {" "}
      {/* dibalik di sumbu X */}
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
