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

    // Render the scene
    renderer.render( scene, camera );

    // Request the browser to execute the animation-rendering loop
    requestAnimationFrame( animate );
};

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 0, 20, 0 );

// LIGHTS
let light = new THREE.DirectionalLight( 0xffffff, 2 );
light.position.set(0, 0.5, 100);
scene.add( light );

light = new THREE.AmbientLight( 0x808080 ); // soft white light
scene.add( light );

// FLOOR
const helper = new THREE.GridHelper( 800, 40, 0x444444, 0x444444 );
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
    specialFaceMaterial_1,
];

// A box has 6 faces
const materials_2 = [
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    specialFaceMaterial_2,
    regularFaceMaterial,
];

const box_1 = new THREE.Mesh( geometry, materials_1 );
box_1.position.set( 0, 25, 300 );
scene.add( box_1 );

const box_2 = new THREE.Mesh( geometry, materials_2 );
box_2.position.set( 0, 25, -300 );
scene.add( box_2 );

// STATS
const stats = new Stats( );
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '16px';
document.body.appendChild( stats.domElement );

// CONTROLS
const controls = new FirstPersonControls( camera, renderer.domElement );
controls.movementSpeed = 70;
controls.lookSpeed = 0.1;
controls.noFly = false;
controls.lookVertical = false;

scene.add( helper );
renderer.render( scene, camera );

animate();