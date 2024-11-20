// src/lib/atomFunctions.ts
import * as THREE from "three";
import { Atom } from "../models/Atom";

// Calcular vecinos (sin modificar los átomos)
export function calculateNeighbors(atoms: Atom[], cutoff: number): Map<string, Atom[]> {
  const neighborMap = new Map<string, Atom[]>();
  atoms.forEach(atom => {
      const neighbors = atoms.filter(other =>
          other !== atom && atom.position.distanceTo(other.position) <= cutoff
      );
      neighborMap.set(atom.id, neighbors);
  });
  return neighborMap;
}

// Calcular fuerzas gravitacionales (sin modificar los átomos)
export function calculateGravitationalForces(atoms: Atom[], G: number): Map<string, THREE.Vector3> {
  const forces = new Map<string, THREE.Vector3>();

  atoms.forEach(atom => forces.set(atom.id, new THREE.Vector3()));

  for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
          const displacement = new THREE.Vector3().subVectors(atoms[j].position, atoms[i].position);
          const r = Math.max(displacement.length(), 0.2); // Evitar singularidades
          const forceMagnitude = (G * atoms[i].mass * atoms[j].mass) / (r * r);
          const forceDirection = displacement.normalize();
          const force = forceDirection.multiplyScalar(forceMagnitude);

          forces.get(atoms[i].id)?.add(force);
          forces.get(atoms[j].id)?.add(force.negate());
      }
  }

  return forces;
}

// Calcular fuerzas locales (vibracionales y rotacionales)
export function calculateLocalForces(
  atoms: Atom[],
  neighbors: Map<string, Atom[]>,
  springConstant: number,
  rotationalConstant: number
): Map<string, THREE.Vector3> {
  const forces = new Map<string, THREE.Vector3>();

  atoms.forEach(atom => forces.set(atom.id, new THREE.Vector3()));

  atoms.forEach(atom => {
      const atomForces = forces.get(atom.id)!;
      const atomNeighbors = neighbors.get(atom.id) || [];

      atomNeighbors.forEach(neighbor => {
          // Fuerza vibracional
          const restLength = 1; // Longitud de equilibrio
          const displacement = atom.position.distanceTo(neighbor.position) - restLength;
          const vibrationalForce = new THREE.Vector3()
              .subVectors(neighbor.position, atom.position)
              .normalize()
              .multiplyScalar(-springConstant * displacement);

          // Fuerza rotacional
          const relativeDisplacement = new THREE.Vector3().subVectors(neighbor.position, atom.position);
          const rotationalForce = new THREE.Vector3(-relativeDisplacement.y, relativeDisplacement.x, 0)
              .normalize()
              .multiplyScalar(rotationalConstant);

          // Sumar fuerzas al átomo actual
          atomForces.add(vibrationalForce).add(rotationalForce);
      });
  });

  return forces;
}

// Actualizar posiciones y velocidades
export function updateAtoms(
  atoms: Atom[],
  globalForces: Map<string, THREE.Vector3>,
  localForces: Map<string, THREE.Vector3>,
  colors: Map<string, string>,
  deltaTime: number
): void {
  atoms.forEach(atom => {
    const globalForce = globalForces.get(atom.id) || new THREE.Vector3();
    const localForce = localForces.get(atom.id) || new THREE.Vector3();
    const newColor = colors.get(atom.id) || atom.color;

    atom.update(globalForce, localForce, newColor, deltaTime);
  });
}