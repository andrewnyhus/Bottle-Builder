$(document).ready(function (){

    mapboxgl.accessToken = 'pk.eyJ1IjoiZnVlcnRlbnVldmFjYXNhIiwiYSI6ImNqMGgzdTg5ZzAydnEyd3J1cHF4eG54eHUifQ.Aikx4qEIowhrKbSVhNEpRw';


    var map = new mapboxgl.Map({
        container: 'display_map',
        style: 'mapbox://styles/mapbox/satellite-streets-v9',
        center: [-91.874, 42.760], // longitude, latitude
        zoom: 1,
    });


});