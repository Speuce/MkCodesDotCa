import * as THREE from 'three';

/**
 * Creates a basic mesh-material object with the given parameters
 * @param {number} color 
 * @param {BufferGeometry} geometry the geometry model 
 * @param {number} x the x-position
 * @param {number} y the y-position
 * @param {number} z the z-position
 * @param {number} rotationx 
 * @param {number} rotationy 
 * @param {number} rotationz 
 */
export function createBasicObject(geometry, color, x = 0, y = 0, z = 0, rotationX = 0, rotationY = 0, rotationZ = 0) {
    const material = new THREE.MeshBasicMaterial({ color: color, wireframe: true });
    const basicObject = new THREE.Mesh(geometry, material);
    basicObject.position.x = x;
    basicObject.position.y = y;
    basicObject.position.z = z;
    basicObject.rotation.x = rotationX;
    basicObject.rotation.y = rotationY;
    basicObject.rotation.z = rotationZ;
    return basicObject
}

/**
 * Creates a basic sphere with the given parameters in space and returns it.
 * @param {number} radius the radius of the sphere
 * @returns the created threejs object
 */
export function createBasicSphereObject(radius, color, x = 0, y = 0, z = 0, rotationX = 0, rotationY = 0, rotationZ = 0) {
    return createBasicObject(new THREE.SphereGeometry(radius), color, x, y, z, rotationX, rotationY, rotationZ)
}