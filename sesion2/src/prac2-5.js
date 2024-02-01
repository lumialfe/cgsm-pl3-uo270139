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

const pointLight = new THREE.PointLight( 0xFFFFFF, 10, 5000, 0 );
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
const earthAtmosphereGroup = new THREE.Object3D();
earthAtmosphereGroup.add( earth );
earthAtmosphereGroup.add( atmosphere );
earthAtmosphereGroup.rotateZ(0.36);

//MOON
geometry = new THREE.SphereGeometry( 17.374, 100, 100 );
mapUrl = "../textures/moonMap.gif";   // The file used as texture
map = textureLoader.load( mapUrl, ( ) => { renderer.render( scene, camera ); } );
material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map: map, transparent: true } );
const moon = new THREE.Mesh( geometry, material );
// Move the Moon away from the coordinate origin (the Earth)
// NOT TO SCALE. Real value: Math.sqrt( distance * distance / 2 )
const distance = 384400;
moon.position.set( Math.sqrt( distance / 2 ), 0, -Math.sqrt( distance / 2 ) );
// Rotate the Moon to face visible side to the Earth (tidal locking)
moon.rotation.y = Math.PI;
// Moon should rotate around the Earth: an Object3D is needed
const moonGroup = new THREE.Object3D( );
moonGroup.add( moon );
// The Moon orbit is a bit tilted
moonGroup.rotation.x = 0.089;

scene.add( earthAtmosphereGroup, moonGroup );
renderer.render( scene, camera );