import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { AtomAnimationConfig } from '../types';
import { Atom } from '../models/Atom';
import { createAtoms, updateAtomsParallel } from '../lib/atomFunctions';
import AtomComponent from '../components/AtomComponent';

import GravitationalWorker from '../workers/gravitationalWorker?worker';
import NeighborsWorker from '../workers/neighborsWorker?worker';
import LocalForcesWorker from '../workers/localForcesWorker?worker';
import ColorsWorker from '../workers/colorWorker?worker';

const AtomsAnimationParallel = ({ isRunning, atomCount, seed, config }: { isRunning: boolean, atomCount: number, seed: number, config: AtomAnimationConfig }) => {
    const [atoms, setAtoms] = useState<Atom[]>([]);

    const gravitationalWorkerRef = useRef<Worker | null>(null);
    const neighborsWorkerRef = useRef<Worker | null>(null);
    const localForcesWorkerRef = useRef<Worker | null>(null);
    const colorsWorkerRef = useRef<Worker | null>(null);

    useEffect(() => {
        setAtoms(createAtoms(atomCount, config.positionDispersion, config.velocityDispersion, seed))
    }, [atomCount, config.positionDispersion, config.velocityDispersion, seed]);

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
            updateAtomsParallel(
                atoms,
                deltaTime,
                config.cutoff,
                config.springConstant,
                config.rotationalConstant,
                config.G,
                gravitationalWorkerRef,
                neighborsWorkerRef,
                localForcesWorkerRef,
                colorsWorkerRef
            )
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
