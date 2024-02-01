import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

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

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 0, 0, 300 );

const pointLight = new THREE.PointLight( 0xFFFFFF, 15, 5000, 0 );
pointLight.position.set( 1000, 0, 0 );
scene.add( pointLight );

// EARTH
let geometry = new THREE.SphereGeometry( 63.71, 100, 100 );
let mapUrl = "../textures/earthMap.gif";   // The file used as texture
const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
let map = textureLoader.load( mapUrl, ( ) => { renderer.render( scene, camera ); } );
let material = new THREE.MeshPhongMaterial( { map: map } );
const earth = new THREE.Mesh( geometry, material );

//ATMOSPHERE
geometry = new THREE.SphereGeometry( 64.21, 100, 100 );
mapUrl = "../textures/atmosphereMap.png";   // The file used as texture
map = textureLoader.load( mapUrl, ( ) => { renderer.render( scene, camera ); } );
material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map: map, transparent: true } );
const atmosphere = new THREE.Mesh( geometry, material );

//EARTH AND ATMOSPHERE GROUPING
earth.position.set( 0, 0, 0 );
atmosphere.position.set( 0, 0, 0 );
const objEarthAtmosphere = new THREE.Object3D();
objEarthAtmosphere.add( earth );
objEarthAtmosphere.add( atmosphere );
objEarthAtmosphere.rotateZ(0.36);

scene.add( objEarthAtmosphere );
renderer.render( scene, camera );