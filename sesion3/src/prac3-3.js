import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Stats from 'three/examples/jsm/libs/stats.module';

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

    // CUBE ROTATION
    const cubeRotation = ( delta * Math.PI * 2 ) / 24;
    box.rotation.y += cubeRotation;

    // JUMPSCARE
    material.bumpScale = controlData.bumpScale;
    stats.update( );

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
camera.position.set( 0, 0, 300 );

// LIGHTS
let light = new THREE.PointLight( 0xffffff, 10, 2500, 0 );
light.position.set( 50, 50, 50 );
scene.add( light );

light = new THREE.AmbientLight( 0x808080 ); // soft white light
scene.add( light );

const geometry = new THREE.BoxGeometry( 100, 100, 100 );

const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
const material = new THREE.MeshPhongMaterial(
    {
        map: textureLoader.load( "../textures/brick.jpg" ),
        bumpMap: textureLoader.load( "../textures/brick-map.jpg" )
    } );


// CONTROLS
const controlData = {
    bumpScale: material.bumpScale
}

const gui = new GUI( );
gui.add( controlData, 'bumpScale', -10, 10 ).step(.1).name( 'bumpScale' );

const stats = new Stats( );
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '16px';
document.body.appendChild( stats.domElement );

const box = new THREE.Mesh( geometry, material );

box.rotation.set( Math.PI / 5, Math.PI / 5, 0 );

scene.add( box );
renderer.render( scene, camera );

animate();