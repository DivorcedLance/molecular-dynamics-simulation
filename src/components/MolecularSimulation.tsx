import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';

// Importa ambos componentes
import AtomsAnimation from '../components/AtomsAnimation';
import AtomsAnimationParallel from '../components/AtomsAnimationParallel';
import { generateRandomSeed } from '../lib/randomUtils';

const MolecularSimulation = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [atomCount, setAtomCount] = useState(50);
    const [seed] = useState(generateRandomSeed());
    const [config] = useState({
        "cutoff": 0.5,
        "springConstant": 0.5,
        "rotationalConstant": 0.1,
        "G": 6.67430e3
    });

    return (
        <div className='relative w-full h-full'>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 p-4 z-10 flex gap-4">
                <button className='border-black text-center text-4xl' onClick={() => setIsRunning(!isRunning)}>
                    {isRunning ? 'Pause' : 'Play'}
                </button>
                <input
                    type='number'
                    value={atomCount}
                    onChange={(e) => setAtomCount(parseInt(e.target.value))}
                    className='border-black text-center text-4xl w-24'
                    // max min
                    max={150}
                    min={1}
                />
            </div>
            <div className='flex gap-4 h-full'>
                <div className='w-1/2'>
                    <h1 className='absolute top-0 left-0 p-4 text-2xl'>Parallel</h1>
                    <Canvas>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <AtomsAnimationParallel isRunning={isRunning} atomCount={atomCount} seed={seed} config={config}/>
                        <OrbitControls />
                    </Canvas>
                </div>
                <div className='w-1/2'>
                    <h1 className='absolute top-0 right-0 p-4 text-2xl '>Sequential</h1>
                    <Canvas>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <AtomsAnimation isRunning={isRunning} atomCount={atomCount} seed={seed} config={config}/>
                        <OrbitControls />
                    </Canvas>
                </div>
            </div>
        </div>
    );
};

export default MolecularSimulation;
