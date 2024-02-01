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
const CAMERA_POSITION = [0, 0, 1500]

const SCALE = 100;
const EARTH_RADIUS = 6371 / SCALE;
const ATMOSPHERE_RADIUS = 6421 / SCALE;
const MOON_RADIUS = 1737.4 / SCALE;
// const SUN_RADIUS = 696340 / SCALE;
const SUN_RADIUS = EARTH_RADIUS * 2;
const SUN_POSITION = [900, 0, 500];

const clock = new THREE.Clock( );

function animate( ) {

    const delta = clock.getDelta( ); // Elapsed time in seconds

    // EARTH ROTATION
    const earthRotation = ( delta * Math.PI * 2 ) / 24;
    earth.rotation.y += earthRotation;
    atmosphere.rotation.y += earthRotation * 0.95;

    // MOON ROTATION
    const moonRotation = ( delta * Math.PI * 2 ) / 674;
    moon.rotation.y += moonRotation;
    moonGroup.rotation.y += moonRotation;

    // SUN ANIMATION
    uniforms[ "time" ].value += 0.2 * delta;

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
camera.position.set( ...CAMERA_POSITION );
// camera.position.set( 0, 200, 800 );
// camera.rotation.set( -0.274, 0, 0 );

//LIGHT
const pointLight = new THREE.PointLight( 0xFFFFFF, 10, 5000, 0 );
pointLight.position.set( ...SUN_POSITION );
scene.add( pointLight );

// EARTH
let geometry = new THREE.SphereGeometry( EARTH_RADIUS, 100, 100 );
let mapUrl = "../textures/earthMap.gif";   // The file used as texture
const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
let map = textureLoader.load( mapUrl, ( ) => { renderer.render( scene, camera ); } );
let material = new THREE.MeshPhongMaterial( { map: map } );
const earth = new THREE.Mesh( geometry, material );

//ATMOSPHERE
geometry = new THREE.SphereGeometry( ATMOSPHERE_RADIUS, 100, 100 );
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
geometry = new THREE.SphereGeometry( MOON_RADIUS, 100, 100 );
mapUrl = "../textures/moonMap.gif";   // The file used as texture
map = textureLoader.load( mapUrl, ( ) => { renderer.render( scene, camera ); } );
material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map: map } );
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

//SUN
const NOISEMAP = '../textures/cloud.png';
const SUNMAP = '../textures/lavatile.jpg';
const uniforms = {
    "fogDensity": { value: 0 },
    "fogColor": { value: new THREE.Vector3( 0, 0, 0 ) },
    "time": { value: 1.0 },
    "uvScale": { value: new THREE.Vector2( 3.0, 1.0 ) },
    "texture1": { value: textureLoader.load( NOISEMAP ) },
    "texture2": { value: textureLoader.load( SUNMAP ) }
};

uniforms[ "texture1" ].value.wrapS = uniforms[ "texture1" ].value.wrapT = THREE.RepeatWrapping;
uniforms[ "texture2" ].value.wrapS = uniforms[ "texture2" ].value.wrapT = THREE.RepeatWrapping;

const vertexShader = require( '../shaders/vertex.glsl' );
const fragmentShader = require( '../shaders/fragment.glsl' );

material = new THREE.ShaderMaterial( {
    uniforms,
    vertexShader,
    fragmentShader
} );

geometry = new THREE.SphereGeometry( SUN_RADIUS, 100, 100 );
map = textureLoader.load( mapUrl, ( ) => { renderer.render( scene, camera ); } );
const sun = new THREE.Mesh( geometry, material );
sun.position.set( ...SUN_POSITION );

scene.add( earthAtmosphereGroup, moonGroup, sun );
renderer.render( scene, camera );

animate();