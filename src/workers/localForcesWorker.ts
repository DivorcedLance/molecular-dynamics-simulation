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

        const atomPosition = new THREE.Vector3(...atom.position);
        const force = new THREE.Vector3();

        neighbors.forEach(neighborId => {
            const neighbor = atomMap.get(neighborId);
            if (!neighbor) return;

            const neighborPosition = new THREE.Vector3(...neighbor.position);

            // Vibrational force (spring force)
            const restLength = 1; // Rest length of the spring
            const displacement = neighborPosition.distanceTo(atomPosition) - restLength;
            const forceDirection = new THREE.Vector3()
                .subVectors(neighborPosition, atomPosition)
                .normalize();
            const vibrationalForce = forceDirection.multiplyScalar(-springConstant * displacement);

            // Add vibrational force
            force.add(vibrationalForce);

            // Rotational force
            const relativePosition = new THREE.Vector3()
                .subVectors(neighborPosition, atomPosition);
            const perpendicularForce = new THREE.Vector3(
                -relativePosition.y,
                relativePosition.x,
                0
            ).normalize();
            const rotationalForce = perpendicularForce.multiplyScalar(rotationalConstant);

            // Add rotational force
            force.add(rotationalForce);
        });

        // Store the calculated force for the current atom
        forces[id] = [force.x, force.y, force.z];
    });

    postMessage(forces);
};

export {};
