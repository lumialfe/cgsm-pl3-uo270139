import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

window.addEventListener( 'resize', ( ) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
}, false );

if ( WEBGL.isWebGLAvailable() ) {
    document.getElementById('webGL-check').innerText = 'WebGL is available!';
    document.getElementById('webGL-check').classList = 'webGl-check webGL-available';
} else {
    document.getElementById('webGL-check').innerText = 'WebGL is NOT available!';
    document.getElementById('webGL-check').classList = 'webGl-check webGL-not-available';
}

const clock = new THREE.Clock( );

function animate( ) {

    const delta = clock.getDelta( ); // Elapsed time in seconds

    // Update the controls
    controls.update( delta );
    stats.update( );

    // Update the stats
    stats.update( );

    // RAY CASTING
    rayCaster.setFromCamera( mouse, camera );

    // Look for all the intersected objects
    const intersects = rayCaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {

        // Sorted by Z (close to the camera)
        if ( intersectedObject != intersects[ 0 ].object ) {

            intersectedObject = intersects[ 0 ].object;
            console.log( 'New intersected object: ' + intersectedObject.name );
        }
    } else {

        intersectedObject = null;
    }

    // Render the scene
    renderer.render( scene, camera );

    // Request the browser to execute the animation-rendering loop
    requestAnimationFrame( animate );
};

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// CAMERA
const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 500, 40, 0 );
camera.lookAt( 0, 40, 0 );

const listener = new THREE.AudioListener();
camera.add( listener );

// LIGHTS
let light = new THREE.PointLight( 0xffffff, 2, 0, 0 );
light.position.set(0, 25, 0);
scene.add( light );

light = new THREE.AmbientLight( 0x808080 ); // soft white light
scene.add( light );

// FLOOR
const helper = new THREE.GridHelper( 800, 40, 0x444444, 0x444444 );
helper.name = 'Floor';
helper.position.y = 0.1;

const geometry = new THREE.BoxGeometry( 50, 50, 50 );

// MATERIALS
const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
const specialFaceMaterial_1 = new THREE.MeshPhongMaterial(
    {
        map: textureLoader.load( "../textures/brick-button.png" ),
        bumpMap: textureLoader.load( "../textures/brick-button-map.png" )
    } );
const specialFaceMaterial_2 = new THREE.MeshPhongMaterial(
    {
        map: textureLoader.load( "../textures/brick-button.png" ),
        bumpMap: textureLoader.load( "../textures/brick-button-map.png" )
    } );
const specialFaceMaterialOn_1 = new THREE.MeshPhongMaterial(
    {
        map: textureLoader.load( "../textures/brick-button-on.png" ),
        bumpMap: textureLoader.load( "../textures/brick-button-map.png" )
    } );
const specialFaceMaterialOn_2 = new THREE.MeshPhongMaterial(
    {
        map: textureLoader.load( "../textures/brick-button-on.png" ),
        bumpMap: textureLoader.load( "../textures/brick-button-map.png" )
    } );
const regularFaceMaterial = new THREE.MeshPhongMaterial(
    {
        map: textureLoader.load( "../textures/brick.jpg" ),
        bumpMap: textureLoader.load( "../textures/brick-map.jpg" )
    } );

// A box has 6 faces
const materials_1 = [
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    specialFaceMaterialOn_1,
];

// A box has 6 faces
const materials_2 = [
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    specialFaceMaterialOn_2,
    regularFaceMaterial,
];

const box_1 = new THREE.Mesh( geometry, materials_1 );
box_1.position.set( 0, 25, 300 );
box_1.name = 'Music Box'
scene.add( box_1 );

const box_2 = new THREE.Mesh( geometry, materials_2 );
box_2.position.set( 0, 25, -300 );
box_2.name = 'Dog Cage'
scene.add( box_2 );

// AUDIO
const audioLoader = new THREE.AudioLoader();
const sound_1 = new THREE.PositionalAudio( listener );
audioLoader.load( './audio/376737_Skullbeatz___Bad_Cat_Maste.ogg', ( buffer ) => {
    sound_1.setBuffer( buffer );
    sound_1.setRefDistance( 20 );
    sound_1.setLoop( true );
    sound_1.setRolloffFactor( 1 );
    sound_1.play(); // Modern browsers do not allow sound to start without user interaction
});
box_1.add( sound_1 );

const sound_2 = new THREE.PositionalAudio( listener );
audioLoader.load( './audio/dog.ogg', ( buffer ) => {
    sound_2.setBuffer( buffer );
    sound_2.setRefDistance( 20 );
    sound_2.setLoop( true );
    sound_2.setRolloffFactor( 1 );
    sound_2.play(); // Modern browsers do not allow sound to start without user interaction
});
box_2.add( sound_2 );

// STATS
const stats = new Stats( );
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '16px';
document.body.appendChild( stats.domElement );

// CONTROLS
const controls = new FirstPersonControls( camera, renderer.domElement );
controls.movementSpeed = 100;
controls.lookSpeed = 0.05;
controls.noFly = false;
controls.lookVertical = false;

// RAY CASTING
const rayCaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersectedObject = null;

document.body.addEventListener( 'mousemove', ( event ) => {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}, false );

// SOUND INTERACTION
document.body.addEventListener( 'keydown', ( event ) => {
    // Space key code
    const spaceKeyCode = 32;
    // Space pressed and intersected object
    if ( event.keyCode === spaceKeyCode && intersectedObject ) {
        console.log( 'Space pressed on: ' + intersectedObject.name );

        // Play or stop the sound
        switch ( intersectedObject.name ) {
            case 'Music Box':
                if ( sound_1.isPlaying ) {
                    sound_1.pause();
                    box_1.material[ 5 ] = specialFaceMaterial_1;
                } else {
                    sound_1.play();
                    box_1.material[ 5 ] = specialFaceMaterialOn_1;
                }
                box_1.material.needsUpdate = true;
                break;
            case 'Dog Cage':
                if ( sound_2.isPlaying ) {
                    sound_2.pause();
                    box_2.material[ 4 ] = specialFaceMaterial_2;
                } else {
                    sound_2.play();
                    box_2.material[ 4 ] = specialFaceMaterialOn_2;
                }
                box_2.material.needsUpdate = true;
                break;
        }
    }
}, false );

scene.add( helper );
renderer.render( scene, camera );

animate();