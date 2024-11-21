import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Atom } from '../models/Atom';
import * as THREE from 'three';
import GravitationalWorker from '../workers/gravitationalWorker?worker';
import NeighborsWorker from '../workers/neighborsWorker?worker';
import LocalForcesWorker from '../workers/localForcesWorker?worker';
import ColorsWorker from '../workers/colorWorker?worker';
import { createAtoms, updateAtomsParallel } from '../lib/atomFunctions';
import AtomComponent from '../components/AtomComponent';

const AtomsAnimationParallel = ({ isRunning, atomCount, seed }: { isRunning: boolean, atomCount: number, seed: number }) => {

    const cutoff = 0.5; // Radio de vecinos
    const springConstant = 0.5; // Constante del resorte
    const rotationalConstant = 0.1; // Constante rotacional
    const G = 6.67430e4; // Constante gravitacional

    const [atoms, setAtoms] = useState<Atom[]>([]);
    const gravitationalWorkerRef = useRef<Worker | null>(null);
    const neighborsWorkerRef = useRef<Worker | null>(null);
    const localForcesWorkerRef = useRef<Worker | null>(null);
    const colorsWorkerRef = useRef<Worker | null>(null);

    useEffect(() => {
        setAtoms(createAtoms(atomCount, 4, 0.1, seed))
    }, [atomCount, seed]);

    useEffect(() => {
        gravitationalWorkerRef.current = new GravitationalWorker();
        neighborsWorkerRef.current = new NeighborsWorker();
        localForcesWorkerRef.current = new LocalForcesWorker();
        colorsWorkerRef.current = new ColorsWorker();

        return () => {
            gravitationalWorkerRef.current?.terminate();
            neighborsWorkerRef.current?.terminate();
            localForcesWorkerRef.current?.terminate();
            colorsWorkerRef.current?.terminate();
        };
    }, []);

    useFrame(({ clock }) => {
        if (isRunning) {
            const deltaTime = clock.getDelta();
    
            const atomData = atoms.map(atom => ({
                id: atom.id,
                position: [atom.position.x, atom.position.y, atom.position.z],
                velocity: [atom.velocity.x, atom.velocity.y, atom.velocity.z],
                mass: atom.mass,
                originalColor: atom.originalColor,
            }));
    
            const gravitationalPromise = new Promise<Map<string, THREE.Vector3>>((resolve) => {
                gravitationalWorkerRef.current?.postMessage({ atoms: atomData, G });
                gravitationalWorkerRef.current!.onmessage = ({ data }: MessageEvent) => {
                    const forces = new Map(
                        Object.entries(data as Record<string, [number, number, number]>).map(([id, force]) => [id, new THREE.Vector3(...force)])
                    );
                    resolve(forces);
                };
            });
    
            const neighborsPromise = new Promise<Map<string, Atom[]>>((resolve) => {
                neighborsWorkerRef.current?.postMessage({ atoms: atomData, cutoff });
                neighborsWorkerRef.current!.onmessage = ({ data }: MessageEvent) => {
                    const neighbors = new Map(
                        Object.entries(data).map(([id, neighborIds]) => [
                            id,
                            (neighborIds as string[]).map((neighborId: string) => atoms.find(atom => atom.id === neighborId)!),
                        ])
                    );
                    resolve(neighbors);
                };
            });
    
            Promise.all([gravitationalPromise, neighborsPromise])
                .then(([gravitationalForces, neighbors]) => {
                    const neighborsData = Array.from(neighbors.entries()).map(([id, neighbors]) => ({
                        id,
                        neighbors: neighbors.map(neighbor => neighbor.id),
                    }));
    
                    // Promesa para calcular fuerzas locales
                    const localForcesPromise = new Promise<Map<string, THREE.Vector3>>((resolve) => {
                        localForcesWorkerRef.current?.postMessage({
                            atoms: atomData,
                            neighbors: neighborsData,
                            springConstant,
                            rotationalConstant,
                        });
                        localForcesWorkerRef.current!.onmessage = ({ data }: MessageEvent) => {
                            const forces = new Map(
                                Object.entries(data as Record<string, [number, number, number]>).map(([id, force]) => [id, new THREE.Vector3(...force)])
                            );
                            resolve(forces);
                        };
                    });
    
                    // Promesa para calcular colores
                    const colorsPromise = new Promise<Map<string, string>>((resolve) => {
                        colorsWorkerRef.current?.postMessage({ atoms: atomData, neighbors: neighborsData });
                        colorsWorkerRef.current!.onmessage = ({ data }: MessageEvent) => {
                            const colors = new Map(
                                Object.entries(data as Record<string, string>)
                            );
                            resolve(colors);
                        };
                    });
    
                    return Promise.all([localForcesPromise, colorsPromise]).then(([localForces, colors]) => ({
                        gravitationalForces,
                        localForces,
                        colors,
                    }));
                })
                .then(({ gravitationalForces, localForces, colors }) => {
                    updateAtomsParallel(
                        atoms,
                        gravitationalForces,
                        localForces,
                        colors,
                        deltaTime
                    )
                })
                .catch(error => console.error('Simulation error:', error));
        }
    });

    return (
        <>
            {atoms.map(atom => (
                <AtomComponent key={atom.id} atom={atom} />
            ))}
        </>
    );
};

export default AtomsAnimationParallel;
