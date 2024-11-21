import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';
import { FaPlay, FaPause, FaSyncAlt } from 'react-icons/fa';

import AtomsAnimation from '../components/AtomsAnimation';
import AtomsAnimationParallel from '../components/AtomsAnimationParallel';
import { generateRandomSeed } from '../lib/randomUtils';
import { AtomAnimationConfig } from '../types';

const MolecularSimulation = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [atomCount, setAtomCount] = useState(50);
    const [seed, setSeed] = useState(generateRandomSeed());
    const [config] = useState({
        "cutoff": 0.5,
        "springConstant": 0.5,
        "rotationalConstant": 0.1,
        "G": 6.67430e3,
        "positionDispersion": 4,
        "velocityDispersion": 0.1
    } as AtomAnimationConfig);

    return (
        <div className='relative w-full h-full'>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 p-4 z-10 flex gap-4 items-center">
                <button
                    className='flex items-center justify-center p-3 bg-black text-white rounded-full shadow-lg hover:bg-slate-600'
                    onClick={() => setIsRunning(!isRunning)}
                >
                    {isRunning ? <FaPause size={12} /> : <FaPlay size={12} />}
                </button>

                <input
                    type='number'
                    value={atomCount}
                    onChange={(e) => setAtomCount(parseInt(e.target.value))}
                    className='text-center w-24 h-12 text-xl border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:outline-none'
                    max={150}
                    min={1}
                />
                
                <button
                    className='flex items-center justify-center p-3 bg-black text-white rounded-full shadow-lg hover:bg-slate-600'
                    onClick={() => setSeed(generateRandomSeed())}
                >
                    <FaSyncAlt size={12} />
                </button>
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
                    <h1 className='absolute top-0 right-0 p-4 text-2xl'>Sequential</h1>
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
