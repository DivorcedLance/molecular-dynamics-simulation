import { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Atom } from '../models/Atom';
import AtomComponent from '../components/AtomComponent';
import { createAtoms, updateAtoms } from '../lib/atomFunctions';

const AtomsAnimation = ({ isRunning, atomCount, seed }: { isRunning: boolean, atomCount: number, seed: number }) => {

    const cutoff = 0.5; // Radio de vecinos
    const springConstant = 0.5; // Constante del resorte
    const rotationalConstant = 0.1; // Constante rotacional
    const G = 6.67430e4; // Constante gravitacional

    const [atoms, setAtoms] = useState<Atom[]>([]);

    useEffect(() => {
        setAtoms(createAtoms(atomCount, 4, 0.1, seed))
    }, [atomCount, seed]);

    useFrame(({ clock }) => {
        if (isRunning) updateAtoms(atoms, clock.getDelta(), cutoff, springConstant, rotationalConstant, G);
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
