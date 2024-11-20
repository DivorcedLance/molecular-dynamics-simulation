import * as THREE from 'three';

interface AtomData {
    id: string;
    position: [number, number, number];
}

interface NeighborData {
    id: string;
    neighbors: string[];
}

interface MessageData {
    atoms: AtomData[];
    neighbors: NeighborData[];
    springConstant: number;
    rotationalConstant: number;
}

interface ForceData {
    [id: string]: [number, number, number];
}

self.onmessage = (event: MessageEvent<MessageData>) => {
    const { atoms, neighbors, springConstant, rotationalConstant } = event.data;

    const forces: ForceData = {};

    const atomMap = new Map<string, AtomData>(
        atoms.map(atom => [atom.id, atom])
    );

    neighbors.forEach(({ id, neighbors }) => {
        const atom = atomMap.get(id);
        if (!atom) return;

        const force = new THREE.Vector3();

        neighbors.forEach(neighborId => {
            const neighbor = atomMap.get(neighborId);
            if (!neighbor) return;

            // Vibrational force
            const restLength = 1; // Rest length of the spring
            const posA = new THREE.Vector3(...atom.position);
            const posB = new THREE.Vector3(...neighbor.position);
            const displacement = posA.distanceTo(posB) - restLength;
            const springForce = new THREE.Vector3()
                .subVectors(posB, posA)
                .normalize()
                .multiplyScalar(-springConstant * displacement);

            force.add(springForce);

            // Rotational force (simplified)
            const rotationForce = new THREE.Vector3(
                -(posB.y - posA.y),
                posB.x - posA.x,
                0
            )
                .normalize()
                .multiplyScalar(rotationalConstant);

            force.add(rotationForce);
        });

        forces[id] = [force.x, force.y, force.z];
    });

    postMessage(forces);
};

export {};
