import * as THREE from 'three';

// src/models/Atom.ts

export class Atom {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    mass: number;
    force: THREE.Vector3;
    neighbors: Atom[] = [];
    color: string; // Color del átomo
    originalColor: string; // Color original del átomo

    constructor(position = new THREE.Vector3(), velocity = new THREE.Vector3(), mass = 1, color = '#ffffff') {
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
        this.force = new THREE.Vector3();
        this.neighbors = [];
        this.color = color;
        this.originalColor = color;
    }

    // Fuerza vibracional (resorte)
    calculateVibrationalForce(other: Atom, springConstant: number) {
        const restLength = 1; // Longitud de equilibrio del "resorte"
        const displacement = this.position.distanceTo(other.position) - restLength;
        const forceDirection = new THREE.Vector3().subVectors(other.position, this.position).normalize();
        const force = forceDirection.multiplyScalar(-springConstant * displacement);
        this.force.add(force);
    }

    // Fuerza rotacional (simplificada)
    calculateRotationalForce(other: Atom, rotationalConstant: number) {
        const displacement = new THREE.Vector3().subVectors(other.position, this.position);
        const perpendicularForce = new THREE.Vector3(-displacement.y, displacement.x, 0).normalize();
        const force = perpendicularForce.multiplyScalar(rotationalConstant);
        this.force.add(force);
    }

    // Método para actualizar la posición y velocidad en cada paso del tiempo
    update(deltaTime: number) {
        // Calcular aceleración
        const acceleration = this.force.clone().divideScalar(this.mass);
    
        // Actualizar velocidad y posición
        this.velocity.add(acceleration.multiplyScalar(deltaTime));
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    
        // Restablecer fuerza
        this.force.set(0, 0, 0);
    }

    // Método para actualizar la lista de vecinos y sincronizar colores
    updateNeighborList(atoms: Atom[], cutoff: number) {
        this.neighbors = atoms.filter(other =>
            other !== this && this.position.distanceTo(other.position) <= cutoff
        );

        // Sincroniza colores con vecinos
        if (this.neighbors.length > 0) {
            const mainColor = this.neighbors[0].color; // Usa el color del primer vecino
            this.color = mainColor;
            this.neighbors.forEach(neighbor => (neighbor.color = mainColor));
        } else {
            this.color = this.originalColor;
        }
    }
}


export function calculateLongRangeForces(atoms: Atom[], G: number) {
    const MIN_DISTANCE = 0.2; // Evitar singularidades

    for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
            const displacement = new THREE.Vector3().subVectors(atoms[j].position, atoms[i].position);
            const r = Math.max(displacement.length(), MIN_DISTANCE);

            // Fuerza gravitacional
            const forceMagnitude = (G * atoms[i].mass * atoms[j].mass) / (r * r);
            const forceDirection = displacement.normalize();

            // Aplicar fuerza a ambos átomos
            const force = forceDirection.multiplyScalar(forceMagnitude);
            atoms[i].force.add(force);
            atoms[j].force.add(force.negate());
        }
    }
}