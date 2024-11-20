import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';

// Importa ambos componentes
import AtomsAnimation from '../components/AtomsAnimation';
import AtomsAnimationParallel from '../components/AtomsAnimationParallel';

const MolecularSimulation = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [useParallel, setUseParallel] = useState(true); // Estado para alternar el componente

    return (
        <div className='relative w-full h-full'>
            <div className="absolute top-0 left-0 p-4 z-10 flex gap-4">
                <button onClick={() => setIsRunning(!isRunning)}>
                    {isRunning ? 'Pause' : 'Play'}
                </button>
                <button onClick={() => setUseParallel(!useParallel)}>
                    {useParallel ? 'Parallel' : 'Standard'}
                </button>
            </div>

            <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                {/* Renderiza el componente seleccionado */}
                {useParallel ? (
                    <AtomsAnimationParallel isRunning={isRunning} />
                ) : (
                    <AtomsAnimation isRunning={isRunning} />
                )}
                <OrbitControls />
            </Canvas>
        </div>
    );
};

export default MolecularSimulation;
