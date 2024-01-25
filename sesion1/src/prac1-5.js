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

const camera = new THREE.PerspectiveCamera ( 60, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 50, 0, 300 );

// Figure Creation
const box = new THREE.Mesh( new THREE.BoxGeometry( 50, 50, 50 ), new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ).translateX( -100 );
const cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 25, 25, 50, 16 ), new THREE.MeshBasicMaterial( { color: 0x0000ff } ) ).rotateX( Math.PI / 4);
const sphere = new THREE.Mesh( new THREE.SphereGeometry( 25, 16, 16 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) ).translateX( 100 );

const house = createHouseGeometry();

const figures = [ box, cylinder, sphere, ...house ];

for (let fig of figures) {
    scene.add( fig );
}
renderer.render( scene, camera );

function createHouseGeometry() {
    const geometryRoof = new THREE.BufferGeometry();
    const geometryBase = new THREE.BufferGeometry();

    const roofVertices = new Float32Array( [
        // Roof vertices
        100, 0, 0,
        50, 50, 0,
        0, 0, 0,    
    ] );

    // Faces (indices of vertices)
    const roofIndices = [
        0, 1, 2
    ];

    const baseVertices = new Float32Array( [
        // Base vertices
        100, 0, 0,
        0, 0, 0,
        0, 100, 0,
        100, 100, 0
    ] );

    // Faces (indices of vertices)
    const baseIndices = [
        2, 1, 0,
        3, 2, 0
    ];

    geometryRoof.setIndex( roofIndices );
    geometryRoof.setAttribute( 'position', new THREE.BufferAttribute( roofVertices, 3 ) );
    geometryBase.setIndex( baseIndices );
    geometryBase.setAttribute( 'position', new THREE.BufferAttribute( baseVertices, 3 ) );

    return [
        new THREE.Mesh( geometryRoof, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ).translateX(150).translateZ(100), 
        new THREE.Mesh( geometryBase, new THREE.MeshBasicMaterial( { color: 0x0000ff } ) ).translateX(150)
    ];
}