import * as THREE from 'three';

interface AtomData {
    id: string;
    position: [number, number, number];
    mass: number;
}

interface MessageData {
    atoms: AtomData[];
    G: number;
}

interface ForceData {
    [id: string]: [number, number, number];
}

self.onmessage = (event: MessageEvent<MessageData>) => {
    const { atoms, G } = event.data;

    const forces: ForceData = {};

    atoms.forEach(atomA => {
        const force = new THREE.Vector3();

        atoms.forEach(atomB => {
            if (atomA.id !== atomB.id) {
                const posA = new THREE.Vector3(...atomA.position);
                const posB = new THREE.Vector3(...atomB.position);
                const displacement = new THREE.Vector3().subVectors(posB, posA);
                const distance = Math.max(displacement.length(), 0.2);
                const forceMagnitude = (G * atomA.mass * atomB.mass) / (distance * distance);
                const forceDirection = displacement.normalize();
                force.add(forceDirection.multiplyScalar(forceMagnitude));
            }
        });

        forces[atomA.id] = [force.x, force.y, force.z];
    });

    postMessage(forces);
};

export {};
