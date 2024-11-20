    import { useEffect, useRef, useState } from 'react';
    import { useFrame } from '@react-three/fiber';
    import { Atom, calculateLongRangeForces } from '../models/Atom';
    import * as THREE from 'three';

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

    const AtomsAnimation = ({ isRunning } : { isRunning: boolean } ) => {

        const cutoff = 0.5; // Radio de vecinos
        const springConstant = 0.5; // Constante del resorte
        const rotationalConstant = 0.1; // Constante rotacional
        const G = 6.67430e1; // Constante gravitacional

        const [atoms, setAtoms] = useState<Atom[]>([]);

        function initAtoms () {
            // Inicializar los átomos
            const atomCount = 70;

            const colors = [
                "#FF5733", "#33FF57", "#3357FF", "#F7DC6F", "#C70039",
                "#900C3F", "#581845", "#FFC300", "#DAF7A6", "#FF33A1",
                "#33FFF9", "#9933FF", "#F933FF", "#33FF77", "#77FF33",
                "#FFD700", "#FFA07A", "#20B2AA", "#87CEFA", "#778899",
                "#00FA9A", "#48D1CC", "#FF4500", "#DC143C", "#8B0000",
                "#FF6347", "#7B68EE", "#00BFFF", "#4169E1", "#32CD32",
                "#FF1493", "#FF69B4", "#9400D3", "#8A2BE2", "#A52A2A",
                "#5F9EA0", "#4682B4", "#66CDAA", "#FF8C00", "#8B4513",
                "#FA8072", "#9932CC", "#2E8B57", "#BDB76B", "#556B2F",
                "#D2691E", "#FFB6C1", "#FF69B4", "#CD5C5C", "#E9967A"
            ].sort(() => Math.random() - 0.5);

            const newAtoms: Atom[] = [];

            for (let i = 0; i < atomCount; i++) {
                const position = new THREE.Vector3(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4
                );
                const velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1
                );
                const mass = Math.random() * 5 + 1;
                const color = colors[i % colors.length];
                newAtoms.push(new Atom(position, velocity, mass, color));
            }

            setAtoms(newAtoms);
        }

        function updateAtoms (deltaTime: number) {
            // Actualizar listas de vecinos
            atoms.forEach(atom => atom.updateNeighborList(atoms, cutoff));
        
            // Calcular fuerzas locales (entre vecinos)
            atoms.forEach(atom => {
                atom.neighbors.forEach(neighbor => {
                    atom.calculateVibrationalForce(neighbor, springConstant);
                    atom.calculateRotationalForce(neighbor, rotationalConstant);
                });
            });
        
            // Calcular fuerzas globales (entre todos)
            calculateLongRangeForces(atoms, G);
        
            // Actualizar posiciones de los átomos
            atoms.forEach(atom => atom.update(deltaTime));
        }

        useEffect(() => {
            initAtoms();
        }, []);

        useFrame(({ clock }) => {
            if (isRunning) updateAtoms(clock.getDelta());
        });

        return (
            <>
                {atoms.map((atom, index) => (
                    <AtomComponent key={index} atom={atom} />
                ))}
            </>
        );
    };


    export default AtomsAnimation;
