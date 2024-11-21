// src/lib/atomFunctions.ts
import * as THREE from "three";
import { Atom } from "../models/Atom";
import { seedRandom } from "./randomUtils";

export function createAtoms(atomCount: number, positionDispersion: number, velocityDispersion: number, seed: number): Atom[] {
  const colors = [
      "#FF5733", "#33FF57", "#3357FF", "#F7DC6F", "#C70039",
      "#900C3F", "#581845", "#FFC300", "#DAF7A6", "#FF33A1",
      "#33FFF9", "#9933FF", "#F933FF", "#33FF77", "#77FF33",
      "#FFD700", "#FFA07A", "#20B2AA", "#87CEFA", "#778899",
      "#00FA9A", "#48D1CC", "#FF4500", "#DC143C", "#8B0000",
      "#FF6347", "#7B68EE", "#00BFFF", "#4169E1", "#32CD32",
      "#FF1493", "#FF69B4", "#9400D3", "#8A2BE2", "#A52A2A",
      "#5F9EA0", "#4682B4", "#66CDAA", "#FF8C00", "#8B4513",
      "#FA8072", "#9932CC", "#2E8B57", "#BDB76B", "#556B2F",
      "#D2691E", "#FFB6C1", "#FF69B4", "#CD5C5C", "#E9967A"
  ];

  const random = seedRandom(seed);
  const shuffledColors = [...colors].sort(() => random() - 0.5);

  const newAtoms: Atom[] = [];

  for (let i = 0; i < atomCount; i++) {
      const position = new THREE.Vector3(
          (random() - 0.5) * positionDispersion,
          (random() - 0.5) * positionDispersion,
          (random() - 0.5) * positionDispersion
      );
      const velocity = new THREE.Vector3(
          (random() - 0.5) * velocityDispersion,
          (random() - 0.5) * velocityDispersion,
          (random() - 0.5) * velocityDispersion
      );
      const mass = random() * 5 + 1;
      const color = shuffledColors[i % shuffledColors.length];
      newAtoms.push(new Atom(position, velocity, mass, color));
  }

  return newAtoms;
}

export function applyLongRangeForces(atoms: Atom[], G: number) {
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

export function updateAtoms (atoms: Atom[], deltaTime: number, cutoff: number, springConstant: number, rotationalConstant: number, G: number) {
  // Calcular fuerzas globales (entre todos)
  applyLongRangeForces(atoms, G);

  // Actualizar listas de vecinos
  atoms.forEach(atom => atom.updateNeighborList(atoms, cutoff));

  // Calcular fuerzas locales (entre vecinos)
  atoms.forEach(atom => {
      atom.neighbors.forEach(neighbor => {
          atom.applyVibrationalForce(neighbor, springConstant);
          atom.applyRotationalForce(neighbor, rotationalConstant);
      });
  });

  // Actualizar posiciones de los átomos
  atoms.forEach(atom => atom.updatePosVelByDelta(deltaTime));
}

// Actualizar posiciones y velocidades
export function updateAtomsParallel(
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
