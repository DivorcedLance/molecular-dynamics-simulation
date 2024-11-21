import { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { AtomAnimationConfig } from '../types';
import { Atom } from '../models/Atom';
import { createAtoms, updateAtomsSequential } from '../lib/atomFunctions';
import AtomComponent from '../components/AtomComponent';

const AtomsAnimation = ({ isRunning, atomCount, seed, config }: { isRunning: boolean, atomCount: number, seed: number, config: AtomAnimationConfig }) => {

    const [atoms, setAtoms] = useState<Atom[]>([]);

    useEffect(() => {
        setAtoms(createAtoms(atomCount, config.positionDispersion, config.velocityDispersion, seed))
    }, [atomCount, config.positionDispersion, config.velocityDispersion, seed]);

    useFrame(({ clock }) => {
        if (isRunning) updateAtomsSequential(atoms, clock.getDelta(), config.cutoff, config.springConstant, config.rotationalConstant, config.G);
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
