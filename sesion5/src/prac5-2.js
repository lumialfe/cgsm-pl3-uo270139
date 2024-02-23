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

const clock = new THREE.Clock( );

function animate( ) {

    const delta = clock.getDelta( ); // Elapsed time in seconds

    // CUBE ROTATION
    const screenRotation = ( delta * Math.PI * 2 ) / 10;
    wall.rotation.y += screenRotation;

    if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

        imageContext.drawImage( video, 0, 0 );
        if ( texture ) texture.needsUpdate = true;
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

const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 0, 0, 1500 );

const url = "http://localhost:8080/assets/sintel_trailer.mpd";
const player = dashjs.MediaPlayer().create();
player.initialize(document.querySelector("#player"), url, true);

const video = document.getElementById( 'player' );

const image = document.createElement( 'canvas' );
image.width = 1920;  // Video width
image.height = 1080; // Video height
const imageContext = image.getContext( '2d' );
imageContext.fillStyle = '#000000';
imageContext.fillRect( 0, 0, image.width - 1, image.height - 1 );
const texture = new THREE.Texture( image );

const material = new THREE.MeshBasicMaterial( { map: texture } );
material.side = THREE.DoubleSide;
const wall = new THREE.Mesh( new THREE.PlaneGeometry( image.width, image.height, 4, 4 ), material );
wall.position.set( 0, 0, 0 );
wall.rotation.y = 0;

scene.add( wall );

renderer.render( scene, camera );

animate();