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

const playButton = document.createElement( 'button' );
playButton.innerHTML = 'Play Video';
playButton.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>';
playButton.classList = 'play-button';
document.body.appendChild( playButton );

playButton.addEventListener( 'click', ( ) => {
    video.play( );
    playButton.style.display = 'none';
});

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
video.onplay = ( ) => {
    video.play( );
    playButton.style.display = 'none';
};

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