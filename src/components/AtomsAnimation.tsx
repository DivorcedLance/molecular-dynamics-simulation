import { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Atom } from '../models/Atom';
import AtomComponent from '../components/AtomComponent';
import { createAtoms, updateAtoms } from '../lib/atomFunctions';
import { Config } from '../types';

const AtomsAnimation = ({ isRunning, atomCount, config, seed }: { isRunning: boolean, atomCount: number, config: Config, seed: number }) => {

    const cutoff = config.cutoff; // Distancia de corte
    const springConstant = config.springConstant; // Constante de resorte
    const rotationalConstant = config.rotationalConstant; // Constante de rotación
    const G = config.G; // Constante gravitacional

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
