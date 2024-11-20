import * as THREE from 'three';

interface AtomData {
    id: string;
    position: [number, number, number];
}

interface MessageData {
    atoms: AtomData[];
    cutoff: number;
}

interface NeighborsData {
    [id: string]: string[];
}

self.onmessage = (event: MessageEvent<MessageData>) => {
    const { atoms, cutoff } = event.data;

    const neighbors: NeighborsData = {};

    atoms.forEach(atomA => {
        const atomNeighbors: string[] = [];
        const posA = new THREE.Vector3(...atomA.position);

        atoms.forEach(atomB => {
            if (atomA.id !== atomB.id) {
                const posB = new THREE.Vector3(...atomB.position);
                const distance = posA.distanceTo(posB);

                if (distance <= cutoff) {
                    atomNeighbors.push(atomB.id);
                }
            }
        });

        neighbors[atomA.id] = atomNeighbors;
    });

    postMessage(neighbors);
};

export {};
