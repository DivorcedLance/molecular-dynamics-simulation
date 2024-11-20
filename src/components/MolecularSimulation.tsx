import { Canvas } from '@react-three/fiber';
import AtomsAnimation from './AtomsAnimation';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';

const MolecularSimulation = () => {
    const [isRunning, setIsRunning] = useState(false);

    return (
        <div className='relative w-full h-full'>
            <div className="absolute top-0 left-0 p-4 z-10">
                <button onClick={() => setIsRunning(!isRunning)}>
                    {isRunning ? 'Pause' : 'Play'}
                </button>
            </div>

            <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <AtomsAnimation isRunning={isRunning}/>
                <OrbitControls />
            </Canvas>
        </div>
    );
};

export default MolecularSimulation;
