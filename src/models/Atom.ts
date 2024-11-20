import * as THREE from 'three';

// src/models/Atom.ts
export class Atom {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mass: number;
  force: THREE.Vector3;

  constructor(position = new THREE.Vector3(), velocity = new THREE.Vector3(), mass = 1) {
      this.position = position;
      this.velocity = velocity;
      this.mass = mass;
      this.force = new THREE.Vector3(); // Inicialmente sin fuerza
  }

  applyForceFrom(other: Atom) {
    // const G = 6.67430e-11; // Constante gravitacional (simplificada)
    const G = 6.67430e1; // Constante gravitacional (simplificada)
    const MIN_DISTANCE = 0.2; // Distancia mínima para evitar singularidades

    const r = Math.max(this.position.distanceTo(other.position), MIN_DISTANCE);
    const forceMagnitude = (G * this.mass * other.mass) / (r * r);
    const forceDirection = new THREE.Vector3().subVectors(other.position, this.position).normalize();
    const force = forceDirection.multiplyScalar(forceMagnitude);
    this.force.add(force);
}

    // Rebota cuando el átomo alcanza los límites del espacio de simulación
    checkBounds(boundary: number) {
        if (this.position.x > boundary || this.position.x < -boundary) {
            this.velocity.x *= -1; // Invertir dirección en X
        }
        if (this.position.y > boundary || this.position.y < -boundary) {
            this.velocity.y *= -1; // Invertir dirección en Y
        }
        if (this.position.z > boundary || this.position.z < -boundary) {
            this.velocity.z *= -1; // Invertir dirección en Z
        }
    }


  // Método para actualizar la posición y velocidad en cada paso del tiempo
  update(deltaTime: number) {
      // Actualizar la velocidad basada en la fuerza y la masa
      const acceleration = this.force.clone().divideScalar(this.mass);
      this.velocity.add(acceleration.multiplyScalar(deltaTime));
      
      // Actualizar la posición basada en la velocidad
      this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
      
      // Restablecer la fuerza para el próximo cálculo
      this.force.set(0, 0, 0);
  }
}
