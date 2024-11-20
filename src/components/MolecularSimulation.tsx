import { Canvas } from '@react-three/fiber';
import AtomsAnimation from './AtomsAnimation';
import { OrbitControls } from '@react-three/drei';

const MolecularSimulation = () => {
    return (
        <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <AtomsAnimation />
            <OrbitControls />
        </Canvas>
    );
};

export default MolecularSimulation;
