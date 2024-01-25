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

// Figure Creation
const box = new THREE.Mesh( new THREE.BoxGeometry( 50, 50, 50 ), new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ).translateX( -100 );
const cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 25, 25, 50, 16 ), new THREE.MeshBasicMaterial( { color: 0x0000ff } ) ).rotateX( Math.PI / 4);
const sphere = new THREE.Mesh( new THREE.SphereGeometry( 25, 16, 16 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) ).translateX( 100 );

const figures = [ box, cylinder, sphere ];

for (let fig of figures) {
    scene.add( fig );
}
renderer.render( scene, camera );