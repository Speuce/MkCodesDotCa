import { Camera } from "three";

/**
 * Abstract class defining the objects, rotation, lighting, and camera movement in a scene
 * 
 * @class Scene
 */
export class Scene {
    constructor(startY, endY) {
        if (this.constructor == Scene) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.startY = startY;
        this.endY = endY;
    }

    /**
     * Adds all the objects of the current scene to the threejs scene
     * @param {THREE.Scene} scene the scene to add objects to.
     */
    addObjects(scene) { }

    /**
     * Called when the scene is to be started, implementation optional.
     * @param {Camera} camera the camera, to be repositioned within this method
     */
    onStart(camera) { }

    /**
     * Handles the scrolling within the scene
     * @param {number} scrollY the amount the user has scrolled (global)
     * @param {Camera} camera the camera, to be repositioned within this method
     */
    onScroll(scrollY, camera) {
        throw new Error("Unimplemented method: handleScroll")
    }

    /**
     * Called when the scene is to be finished, implementation optional.
     * @param {Camera} camera the camera, to be repositioned within this method
     */
    onEnd(camera) { }

}