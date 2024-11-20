import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Atom } from '../models/Atom';
import * as THREE from 'three';

const AtomComponent = ({ atom, color }: { atom: Atom, color: string }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [position, setPosition] = useState(atom.position.clone());

    useFrame(() => {
        if (meshRef.current) {
            setPosition(atom.position.clone());
        }
    });

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.position.copy(position);
        }
    }, [position]);

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};


const AtomsAnimation = () => {
    const atoms = useMemo(() => {
        const atomCount = 10; // Número de átomos
        const newAtoms: Atom[] = [];
        for (let i = 0; i < atomCount; i++) {
            const position = new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5
            );
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            );
            const mass = Math.random() * 5 + 1; // Masa aleatoria entre 1 y 6
            newAtoms.push(new Atom(position, velocity, mass));
        }
        return newAtoms;
    }, []);

    useFrame(({ clock }) => {
        const deltaTime = clock.getDelta();
        // Calcular las fuerzas entre todos los átomos
        for (let i = 0; i < atoms.length; i++) {
            for (let j = i + 1; j < atoms.length; j++) {
                atoms[i].applyForceFrom(atoms[j]);
                atoms[j].applyForceFrom(atoms[i]);
            }
        }

        atoms.forEach(atom => {
            atom.update(deltaTime);
            atom.checkBounds(5); // Límite del espacio
        });

        // Actualizar las posiciones y velocidades
        atoms.forEach(atom => atom.update(deltaTime));
    });

    const colors = useMemo(() => {
        return atoms.map(() => `hsl(${Math.random() * 360}, 100%, 50%)`);
    }, [atoms]);

    return (
        <>
            {atoms.map((atom, index) => (
                <AtomComponent key={index} atom={atom} color={colors[index]} />
            ))}
        </>
    );
};

export default AtomsAnimation;
