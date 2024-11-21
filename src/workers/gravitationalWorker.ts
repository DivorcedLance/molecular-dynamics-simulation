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
    
    // Calcular fuerzas globales (entre todos)
    const MIN_DISTANCE = 0.2; // Evitar singularidades

    for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
            const displacement = new THREE.Vector3().subVectors(
                new THREE.Vector3().fromArray(atoms[j].position),
                new THREE.Vector3().fromArray(atoms[i].position)
            );
            const r = Math.max(displacement.length(), MIN_DISTANCE);

            // Fuerza gravitacional
            const forceMagnitude = (G * atoms[i].mass * atoms[j].
                mass) / (r * r);
            const forceDirection = displacement.normalize();

            const force = forceDirection.multiplyScalar(forceMagnitude);

            if (!forces[atoms[i].id]) {
                forces[atoms[i].id] = [0, 0, 0];
            }

            if (!forces[atoms[j].id]) {
                forces[atoms[j].id] = [0, 0, 0];
            }

            forces[atoms[i].id] = forces[atoms[i].id].map((value, index) => value + force.toArray()[index]) as [number, number, number];

            forces[atoms[j].id] = forces[atoms[j].id].map((value, index) => value - force.toArray()[index]) as [number, number, number];
        }
    }
    postMessage(forces);
};

export {};
