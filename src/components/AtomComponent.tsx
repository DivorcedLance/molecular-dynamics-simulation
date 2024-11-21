import { useFrame } from "@react-three/fiber";
import { Atom } from "../models/Atom";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const AtomComponent = ({ atom }: { atom: Atom }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [position, setPosition] = useState(atom.position.clone());

    useFrame(() => {
        // Actualiza la posición visual del átomo
        if (meshRef.current) {
            setPosition(atom.position.clone());
        }
    });

    useEffect(() => {
        if (meshRef.current) {
            // Cambia el color directamente en el material del mesh
            (meshRef.current.material as THREE.MeshStandardMaterial).color.set(atom.color);
        }
    }, [atom.color]);

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.position.copy(position);
        }
    }, [position]);

    return (
        <>
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color={atom.color} />
            </mesh>
        </>
    );
};

export default AtomComponent;