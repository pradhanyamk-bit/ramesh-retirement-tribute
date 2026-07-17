// ============================
// Scene
// ============================

const scene = new THREE.Scene();
const globeContainer = document.getElementById("globeViz") || document.getElementById("globe-container");

function getGlobeSize() {
    const bounds = globeContainer.getBoundingClientRect();

    return {
        width: Math.max(1, bounds.width || globeContainer.clientWidth),
        height: Math.max(1, bounds.height || globeContainer.clientHeight)
    };
}

const initialGlobeSize = getGlobeSize();


// ============================
// Camera
// ============================

const camera = new THREE.PerspectiveCamera(

45,

initialGlobeSize.width / initialGlobeSize.height,

0.1,

1000

);

camera.position.z = 3.2;


// ============================
// Renderer
// ============================

const renderer = new THREE.WebGLRenderer({

antialias:true

});

renderer.setSize(

initialGlobeSize.width,

initialGlobeSize.height

);

renderer.setPixelRatio(window.devicePixelRatio);

globeContainer.appendChild(renderer.domElement);


// ============================
// Earth
// ============================

const geometry = new THREE.SphereGeometry(

1,

128,

128

);

const textureLoader = new THREE.TextureLoader();

const earthTexture = textureLoader.load(
    "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
);

const bumpTexture = textureLoader.load(
    "https://threejs.org/examples/textures/planets/earth_bump_2048.jpg"
);
const cloudTexture = textureLoader.load(
    "https://threejs.org/examples/textures/planets/earth_clouds_1024.png"
);

const material = new THREE.MeshPhongMaterial({

    map: earthTexture,

    bumpMap: bumpTexture,

    bumpScale: 0.02,

shininess: 6,

specular: new THREE.Color(0x222222)

});

const earth = new THREE.Mesh(

geometry,

material

);

scene.add(earth);
// ============================
// Clouds
// ============================

const cloudGeometry = new THREE.SphereGeometry(
    1.01,
    128,
    128
);

const cloudMaterial = new THREE.MeshPhongMaterial({

    map: cloudTexture,

    transparent: true,

    opacity: 0.35,

    depthWrite: false

});

const clouds = new THREE.Mesh(
    cloudGeometry,
    cloudMaterial
);

scene.add(clouds);
// ============================
// Atmosphere
// ============================

const atmosphereGeometry = new THREE.SphereGeometry(
    1.03,
    128,
    128
);

const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x4a90e2,
    transparent: true,
    opacity: 0.0,
    side: THREE.BackSide
});

const atmosphere = new THREE.Mesh(
    atmosphereGeometry,
    atmosphereMaterial
);

scene.add(atmosphere);

// ============================
// Highlighted Countries
// ============================

const highlightedCountryContent = {
    IND: {
        country: "India",
        title: "Director Operations<br>Energy Industries, IMEA Region",
        years: "2019 – 2026",
        description: "Led operations across India, the Middle East and Africa for ABB's Energy Industries business. Oversaw engineering, project management, supply chain, quality, digital services and strategic growth across one of ABB's largest global regions."
    },

    QAT: {
        country: "Qatar",
        title: "Lead DCS<br>Commissioning Engineer",
        years: "1995 – 1998",
        description: "Led commissioning of control and HMI systems for the Ras Abu Fontas Power & Water Plant in Doha, contributing to one of ABB's major early power and desalination projects."
    },

    ARE: {
        country: "United Arab Emirates",
        title: "Regional Leadership<br>Middle East Operations",
        years: "1999 – 2025",
        description: "Built and led multiple ABB businesses in the UAE, progressing from Head of Department to Regional Operations Manager, Regional Manager and Regional Business Director. Drove operational excellence, business growth and large-scale engineering initiatives across the Middle East."
    },

    CYP: {
        country: "Cyprus",
        title: "Lead DCS<br>Commissioning Engineer",
        years: "1998 – 1999",
        description: "Commissioned control and HMI systems for the 300 MW Vasilikos Power Station, strengthening ABB's automation capabilities and expanding his international project experience."
    },

    EGY: {
        country: "Egypt",
        title: "Cluster Manager<br>Egypt (North Africa)",
        years: "2025 – 2026",
        description: "Stepped in during a critical period to lead ABB's Egypt Cluster, stabilizing operations, guiding organizational change and delivering one of the strongest business performances in recent years."
    }
};

const countryGroup = new THREE.Group();
earth.add(countryGroup);

const countryMeshes = [];
const countryMaterial = new THREE.MeshBasicMaterial({
    color: 0xb71c1c,
    transparent: true,
    opacity: 0.82,
    side: THREE.DoubleSide,
    depthWrite: false
});

const countryBorderMaterial = new THREE.LineBasicMaterial({
    color: 0xff8a80,
    transparent: true,
    opacity: 0.72
});

function ensureCountryPanel() {
    let panel = document.getElementById("country-panel");

    if (!panel) {
        panel = document.createElement("aside");
        panel.id = "country-panel";
        panel.setAttribute("aria-live", "polite");
        panel.innerHTML = `
            <button id="country-panel-close" type="button" aria-label="Close country information">&times;</button>
            <p id="country-panel-country"></p>
            <h2 id="country-panel-title"></h2>
            <p id="country-panel-years"></p>
            <p id="country-panel-description"></p>
        `;
        globeContainer.appendChild(panel);
    }

    if (!document.getElementById("globe-panel-contained-style")) {
        const style = document.createElement("style");
        style.id = "globe-panel-contained-style";
        style.textContent = `
            #globeViz canvas,
            #globe-container canvas{display:block;width:100%;height:100%;}
            #globeViz #country-panel{position:absolute;top:0;right:0;width:min(360px,86vw);height:100%;padding:72px 34px 34px;color:#f4eee8;background:rgba(5,5,5,.78);border-left:1px solid rgba(173,125,82,.42);box-shadow:-18px 0 44px rgba(0,0,0,.42);transform:translateX(100%);transition:transform .35s ease;z-index:4;backdrop-filter:blur(10px);}
            #globeViz #country-panel.open{transform:translateX(0);}
            #globeViz #country-panel-close{position:absolute;top:22px;right:24px;width:34px;height:34px;border:1px solid rgba(173,125,82,.55);color:#ad7d52;background:transparent;font-size:28px;line-height:28px;cursor:pointer;}
            #globeViz #country-panel-country{margin-bottom:10px;color:#ad7d52;font:600 13px/1.3 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;}
            #globeViz #country-panel-title{margin-bottom:14px;color:#fff;font:400 30px/1.16 Georgia,serif;}
            #globeViz #country-panel-years{margin-bottom:24px;color:#d7c6b7;font:500 14px/1.5 Arial,sans-serif;}
            #globeViz #country-panel-description{color:#e9ded4;font:400 15px/1.7 Arial,sans-serif;}
        `;
        document.head.appendChild(style);
    }

    return panel;
}

ensureCountryPanel();
const countryPanel = document.getElementById("country-panel");
const countryPanelCountry = document.getElementById("country-panel-country");
const countryPanelTitle = document.getElementById("country-panel-title");
const countryPanelYears = document.getElementById("country-panel-years");
const countryPanelDescription = document.getElementById("country-panel-description");
const countryPanelClose = document.getElementById("country-panel-close");

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragState = {
    active: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    hasDragged: false,
    rotationX: 0,
    rotationY: 0,
    resumeAt: 0
};

const dragSensitivity = 0.003;
const dragDamping = 0.14;
const dragThreshold = 3;

renderer.domElement.style.touchAction = "none";
renderer.domElement.style.cursor = "grab";

function rotateGlobe(horizontal, vertical) {
    earth.rotation.y += horizontal;
    clouds.rotation.y += horizontal;
    atmosphere.rotation.y += horizontal;

    earth.rotation.x += vertical;
    clouds.rotation.x += vertical;
    atmosphere.rotation.x += vertical;
}

function lonLatToVector3(lon, lat, radius = 1.016) {
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon + 180);

    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

function normalizeLongitude(lon, referenceLon) {
    let normalized = lon;

    while (normalized - referenceLon > 180) normalized -= 360;
    while (referenceLon - normalized > 180) normalized += 360;

    return normalized;
}

function buildCountryPolygonMesh(ring, countryData) {
    if (ring.length < 4) return;

    const referenceLon = ring[0][0];
    const shapePoints = ring.map(([lon, lat]) => {
        return new THREE.Vector2(normalizeLongitude(lon, referenceLon), lat);
    });

    const triangles = THREE.ShapeUtils.triangulateShape(shapePoints, []);
    const vertices = [];

    triangles.forEach((triangle) => {
        triangle.forEach((pointIndex) => {
            const sourcePoint = shapePoints[pointIndex];
            const vertex = lonLatToVector3(sourcePoint.x, sourcePoint.y);
            vertices.push(vertex.x, vertex.y, vertex.z);
        });
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, countryMaterial);
    mesh.userData.country = countryData;
    countryGroup.add(mesh);
    countryMeshes.push(mesh);

    const borderVertices = [];

    shapePoints.forEach((point) => {
        const vertex = lonLatToVector3(point.x, point.y, 1.018);
        borderVertices.push(vertex.x, vertex.y, vertex.z);
    });

    const borderGeometry = new THREE.BufferGeometry();
    borderGeometry.setAttribute("position", new THREE.Float32BufferAttribute(borderVertices, 3));

    countryGroup.add(new THREE.LineLoop(borderGeometry, countryBorderMaterial));
}

function addHighlightedCountry(feature) {
    const isoCode = feature.properties["ISO3166-1-Alpha-3"];
    const countryData = highlightedCountryContent[isoCode];

    if (!countryData) return;

    const coordinates = feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;

    coordinates.forEach((polygon) => {
        buildCountryPolygonMesh(polygon[0], countryData);
    });
}

function openCountryPanel(countryData) {
    countryPanelCountry.textContent = countryData.country;
    countryPanelTitle.innerHTML = countryData.title;
    countryPanelYears.textContent = countryData.years;
    countryPanelDescription.textContent = countryData.description;
    countryPanel.classList.add("open");
}

fetch("https://cdn.jsdelivr.net/gh/datasets/geo-countries@master/data/countries.geojson")
    .then((response) => response.json())
    .then((geojson) => {
        geojson.features.forEach(addHighlightedCountry);
    })
    .catch((error) => {
        console.warn("Country boundaries could not be loaded.", error);
    });

function openCountryAtPointer(event) {
    const canvasBounds = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    pointer.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(countryMeshes, false);

    if (hits.length > 0) {
        openCountryPanel(hits[0].object.userData.country);
    }
}

renderer.domElement.addEventListener("pointerdown", (event) => {
    dragState.active = true;
    dragState.pointerId = event.pointerId;
    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;
    dragState.hasDragged = false;

    renderer.domElement.setPointerCapture(event.pointerId);
    renderer.domElement.style.cursor = "grabbing";
});

renderer.domElement.addEventListener("pointermove", (event) => {
    if (!dragState.active || event.pointerId !== dragState.pointerId) return;

    const deltaX = event.clientX - dragState.lastX;
    const deltaY = event.clientY - dragState.lastY;

    if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
        dragState.hasDragged = true;
    }

    if (dragState.hasDragged) {
        dragState.rotationX += deltaX * dragSensitivity;
        dragState.rotationY += deltaY * dragSensitivity;
        dragState.resumeAt = performance.now() + 2000;
    }

    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;
});

function endDrag(event) {
    if (!dragState.active || event.pointerId !== dragState.pointerId) return;

    if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
    }

    dragState.active = false;
    dragState.pointerId = null;
    renderer.domElement.style.cursor = "grab";

    if (dragState.hasDragged) {
        dragState.resumeAt = performance.now() + 2000;
    } else {
        openCountryAtPointer(event);
    }
}

renderer.domElement.addEventListener("pointerup", endDrag);
renderer.domElement.addEventListener("pointercancel", endDrag);

countryPanelClose.addEventListener("click", () => {
    countryPanel.classList.remove("open");
});
// ============================
// Stars
// ============================

const starGeometry = new THREE.BufferGeometry();

const starCount = 6000;

const starVertices = [];

for (let i = 0; i < starCount; i++) {

    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;

    starVertices.push(x, y, z);

}

starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starVertices, 3)
);

const starMaterial = new THREE.PointsMaterial({

    color: 0xffffff,

    size: 0.8,

    sizeAttenuation: true

});

const stars = new THREE.Points(
    starGeometry,
    starMaterial
);

scene.add(stars);


// ============================
// Lighting
// ============================

const sunlight = new THREE.DirectionalLight(
    0xffffff,
    2.8
);

sunlight.position.set(5, 3, 5);

scene.add(sunlight);

const ambient = new THREE.AmbientLight(
    0xffffff,
    0.35
);

scene.add(ambient);


// ============================
// Animation
// ============================

function animate(){

requestAnimationFrame(animate);

const horizontalDrag = dragState.rotationX * dragDamping;
const verticalDrag = dragState.rotationY * dragDamping;

dragState.rotationX -= horizontalDrag;
dragState.rotationY -= verticalDrag;

rotateGlobe(horizontalDrag, verticalDrag);

if (!dragState.active && performance.now() >= dragState.resumeAt) {
    earth.rotation.y += 0.0015;
    clouds.rotation.y += 0.0018;
    atmosphere.rotation.y += 0.0015;
}

renderer.render(

scene,

camera

);

}

animate();


// ============================
// Resize
// ============================

window.addEventListener("resize",()=>{

const globeSize = getGlobeSize();

camera.aspect=

globeSize.width/globeSize.height;

camera.updateProjectionMatrix();

renderer.setSize(

globeSize.width,

globeSize.height

);

});

