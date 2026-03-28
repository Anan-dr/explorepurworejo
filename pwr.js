// ================= DATA 16 WISATA =================
const wisata = [
  {nama:"Pantai Jatimalang", kategori:"Pantai", lat:-7.761, lng:109.981},
  {nama:"Gua Seplawan", kategori:"Alam", lat:-7.566, lng:110.022},
  {nama:"Curug Siklotok", kategori:"Air Terjun", lat:-7.586, lng:110.019},
  {nama:"Taman Sidandang", kategori:"Air Terjun", lat:-7.584, lng:110.018},
  {nama:"Museum Tosan Aji", kategori:"Budaya", lat:-7.709, lng:110.008},
  {nama:"Pantai Ketawang", kategori:"Pantai", lat:-7.804, lng:109.913},
  {nama:"Alun-Alun Purworejo", kategori:"Kota", lat:-7.713, lng:110.008},
  {nama:"Desa Wisata Pandanrejo", kategori:"Desa", lat:-7.650, lng:110.020},
  {nama:"Bedug Pendowo", kategori:"Religi", lat:-7.708, lng:110.005},

  {nama:"Pantai Jetis", kategori:"Pantai", lat:-7.800, lng:109.900},
  {nama:"Curug Muncar", kategori:"Air Terjun", lat:-7.590, lng:110.030},
  {nama:"Heroes Park", kategori:"Kota", lat:-7.710, lng:110.010},
  {nama:"Hutan Pinus Kalilo", kategori:"Alam", lat:-7.600, lng:110.050},
  {nama:"Demaji Ecopark", kategori:"Desa", lat:-7.650, lng:110.030},
  {nama:"Gunung Kunir", kategori:"Alam", lat:-7.580, lng:110.040},
  {nama:"Dawet Jembatan Butuh", kategori:"Kuliner", lat:-7.720, lng:110.020}
];

// ================= PETA GIS =================
const map = L.map('map').setView([-7.7, 109.95], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// marker
wisata.forEach(w => {
  L.marker([w.lat, w.lng])
    .addTo(map)
    .bindPopup(`<b>${w.nama}</b><br>${w.kategori}`);
});

// ================= RUMUS HAVERSINE =================
function jarak(lat1, lon1, lat2, lon2){
  const R = 6371;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLon = (lon2-lon1)*Math.PI/180;

  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2)**2;

  return R * (2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

// ================= ANALISIS JARAK =================
const center = {lat:-7.713, lng:110.008};

const tbody = document.querySelector("#table tbody");

wisata.forEach(w=>{
  const d = jarak(center.lat, center.lng, w.lat, w.lng).toFixed(2);

  tbody.innerHTML += `
    <tr>
      <td>${w.nama}</td>
      <td>${w.kategori}</td>
      <td>${d}</td>
    </tr>
  `;
});

// ================= WISATA TERDEKAT =================
function getLocation(){
  navigator.geolocation.getCurrentPosition(pos=>{
    const user = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };

    const hasil = wisata.map(w=>({
      ...w,
      d: jarak(user.lat, user.lng, w.lat, w.lng)
    }))
    .sort((a,b)=>a.d-b.d)
    .slice(0,5);

    let html = "<h3>Wisata Terdekat:</h3>";
    hasil.forEach(w=>{
      html += `<p>${w.nama} - ${w.d.toFixed(2)} km</p>`;
    });

    document.getElementById("nearest").innerHTML = html;
  });
}