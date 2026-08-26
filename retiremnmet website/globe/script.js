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

const travelCountryContent = {
    ARM: "Armenia",
    AUS: "Australia",
    AUT: "Austria",
    BHR: "Bahrain",
    CAN: "Canada",
    CHN: "China",
    CYP: "Cyprus",
    CZE: "Czech Republic",
    DNK: "Denmark",
    EGY: "Egypt",
    FRA: "France",
    GEO: "Georgia",
    DEU: "Germany",
    GRC: "Greece",
    IDN: "Indonesia",
    IRN: "Iran",
    IRQ: "Iraq",
    ITA: "Italy",
    JPN: "Japan",
    JOR: "Jordan",
    KEN: "Kenya",
    KWT: "Kuwait",
    MNE: "Montenegro",
    NPL: "Nepal",
    NLD: "Netherlands",
    NOR: "Norway",
    OMN: "Oman",
    POL: "Poland",
    QAT: "Qatar",
    SAU: "Saudi Arabia",
    SRB: "Serbia",
    SGP: "Singapore",
    ZAF: "South Africa",
    ESP: "Spain",
    LKA: "Sri Lanka",
    SWE: "Sweden",
    CHE: "Switzerland",
    TZA: "Tanzania",
    THA: "Thailand",
    TUR: "Turkey",
    ARE: "United Arab Emirates",
    GBR: "United Kingdom",
    USA: "United States"
};

const countryGroup = new THREE.Group();
earth.add(countryGroup);

const countryMeshes = [];
const travelCountryMeshes = [];
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

const travelCountryMaterial = new THREE.MeshBasicMaterial({
    color: 0xffa500,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
    depthWrite: false
});

const travelCountryBorderMaterial = new THREE.LineBasicMaterial({
    color: 0xd6b08c,
    transparent: true,
    opacity: 0.58
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
            #globeViz #travel-country-tooltip{position:absolute;left:0;top:0;z-index:5;padding:8px 11px;color:#f4eee8;background:rgba(5,5,5,.78);border:1px solid rgba(173,125,82,.46);box-shadow:0 14px 34px rgba(0,0,0,.34);backdrop-filter:blur(10px);font:500 12px/1.2 Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;pointer-events:none;opacity:0;transform:translate3d(-999px,-999px,0);transition:opacity .18s ease;}
            #globeViz #travel-country-tooltip.open{opacity:1;}
        `;
        document.head.appendChild(style);
    }

    return panel;
}

ensureCountryPanel();
const travelCountryTooltip = document.createElement("div");
travelCountryTooltip.id = "travel-country-tooltip";
travelCountryTooltip.setAttribute("role", "status");
globeContainer.appendChild(travelCountryTooltip);
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

function unwrapRing(ring) {
    if (!ring || ring.length < 4) return [];

    const points = [];
    let previousLon = ring[0][0];

    for (let i = 0; i < ring.length; i++) {
        let lon = ring[i][0];
        const lat = ring[i][1];

        while (lon - previousLon > 180) lon -= 360;
        while (previousLon - lon > 180) lon += 360;

        points.push(new THREE.Vector2(lon, lat));
        previousLon = lon;
    }

    if (
        points.length > 1 &&
        points[0].distanceToSquared(points[points.length - 1]) < 1e-12
    ) {
        points.pop();
    }

    const cleaned = [];

    points.forEach((point) => {
        if (
            !cleaned.length ||
            cleaned[cleaned.length - 1].distanceToSquared(point) > 1e-16
        ) {
            cleaned.push(point);
        }
    });

    return cleaned;
}

function pointInRing(point, ring) {
    let inside = false;

    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi = ring[i].x;
        const yi = ring[i].y;
        const xj = ring[j].x;
        const yj = ring[j].y;
        const intersects = ((yi > point.y) !== (yj > point.y)) &&
            (point.x < ((xj - xi) * (point.y - yi)) / ((yj - yi) || 1e-12) + xi);

        if (intersects) inside = !inside;
    }

    return inside;
}

function projectToLocalPlane(points, originLon, originLat, cosLat) {
    return points.map((point) => new THREE.Vector2(
        (point.x - originLon) * cosLat,
        point.y - originLat
    ));
}

// Earcut triangles are planar. On a sphere those chords sink into the globe
// and look like holes. Split long edges on the sphere surface.
function subdivideSphericalTriangles(lonLatPoints, triangles, radius = 1.016, maxAngleDeg = 2.5) {
    const maxChordSq = Math.pow(
        2 * radius * Math.sin(THREE.MathUtils.degToRad(maxAngleDeg) / 2),
        2
    );
    const vertices = lonLatPoints.map((point) => lonLatToVector3(point.x, point.y, radius));
    let faces = triangles.map((triangle) => triangle.slice());
    const midpointIndex = new Map();

    const edgeKey = (a, b) => (a < b ? `${a}:${b}` : `${b}:${a}`);

    const getMidpointIndex = (a, b) => {
        const key = edgeKey(a, b);

        if (midpointIndex.has(key)) return midpointIndex.get(key);

        const mid = vertices[a].clone().add(vertices[b]);

        if (mid.lengthSq() < 1e-16) {
            mid.copy(vertices[a]);
        } else {
            mid.normalize().multiplyScalar(radius);
        }

        const index = vertices.length;

        vertices.push(mid);
        midpointIndex.set(key, index);

        return index;
    };

    for (let pass = 0; pass < 12; pass++) {
        const nextFaces = [];
        let splitAny = false;

        for (let i = 0; i < faces.length; i++) {
            const a = faces[i][0];
            const b = faces[i][1];
            const c = faces[i][2];
            const ab = vertices[a].distanceToSquared(vertices[b]);
            const bc = vertices[b].distanceToSquared(vertices[c]);
            const ca = vertices[c].distanceToSquared(vertices[a]);
            const longest = Math.max(ab, bc, ca);

            if (longest <= maxChordSq) {
                nextFaces.push(faces[i]);
                continue;
            }

            splitAny = true;

            if (longest === ab) {
                const mid = getMidpointIndex(a, b);
                nextFaces.push([a, mid, c], [mid, b, c]);
            } else if (longest === bc) {
                const mid = getMidpointIndex(b, c);
                nextFaces.push([a, b, mid], [a, mid, c]);
            } else {
                const mid = getMidpointIndex(c, a);
                nextFaces.push([a, b, mid], [b, c, mid]);
            }
        }

        faces = nextFaces;

        if (!splitAny) break;
    }

    return { vertices, faces };
}

function getFeatureIsoCode(feature) {
    const isoCode = feature.properties["ISO3166-1-Alpha-3"];

    if (isoCode && isoCode !== "-99") return isoCode;

    const fallbackIsoByName = {
        France: "FRA",
        Norway: "NOR"
    };

    return fallbackIsoByName[feature.properties.name] || isoCode;
}

function buildCountryPolygonMesh(
    rings,
    countryData,
    material = countryMaterial,
    borderMaterial = countryBorderMaterial,
    meshCollection = countryMeshes
) {
    if (!rings || !rings.length) return;

    const outerRing = unwrapRing(rings[0]);

    if (outerRing.length < 3) return;

    const holeRings = [];

    // Extra GeoJSON rings are holes only when they sit inside the outer ring.
    // Same-file extra land (islands stored as extra rings) is built separately.
    for (let i = 1; i < rings.length; i++) {
        const ring = unwrapRing(rings[i]);

        if (ring.length < 3) continue;

        if (pointInRing(ring[0], outerRing)) {
            holeRings.push(ring);
        } else {
            buildCountryPolygonMesh(
                [rings[i]],
                countryData,
                material,
                borderMaterial,
                meshCollection
            );
        }
    }

    let originLon = 0;
    let originLat = 0;

    outerRing.forEach((point) => {
        originLon += point.x;
        originLat += point.y;
    });

    originLon /= outerRing.length;
    originLat /= outerRing.length;

    const cosLat = Math.max(
        0.15,
        Math.abs(Math.cos(THREE.MathUtils.degToRad(originLat)))
    );
    const outerXY = projectToLocalPlane(outerRing, originLon, originLat, cosLat);
    const holeXY = holeRings.map((ring) => (
        projectToLocalPlane(ring, originLon, originLat, cosLat)
    ));
    const triangles = THREE.ShapeUtils.triangulateShape(outerXY, holeXY);

    if (!triangles.length) return;

    const sourcePoints = [...outerRing, ...holeRings.flat()];
    const subdivided = subdivideSphericalTriangles(sourcePoints, triangles);
    const vertices = [];

    subdivided.faces.forEach((triangle) => {
        triangle.forEach((pointIndex) => {
            const vertex = subdivided.vertices[pointIndex];

            vertices.push(vertex.x, vertex.y, vertex.z);
        });
    });

    if (!vertices.length) return;

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
    );

    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);

    mesh.userData.country = countryData;

    countryGroup.add(mesh);
    meshCollection.push(mesh);

    const addBorder = (ring) => {
        if (!ring || ring.length < 2) return;

        const borderVertices = [];

        ring.forEach((point) => {
            const vertex = lonLatToVector3(
                point.x,
                point.y,
                1.018
            );

            borderVertices.push(
                vertex.x,
                vertex.y,
                vertex.z
            );
        });

        const borderGeometry = new THREE.BufferGeometry();

        borderGeometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                borderVertices,
                3
            )
        );

        countryGroup.add(
            new THREE.LineLoop(
                borderGeometry,
                borderMaterial
            )
        );
    };

    addBorder(outerRing);
    holeRings.forEach(addBorder);
}

function addHighlightedCountry(feature) {
    const isoCode = getFeatureIsoCode(feature);
    const countryData = highlightedCountryContent[isoCode];
    const travelCountryName = travelCountryContent[isoCode];

    if (!countryData && !travelCountryName) return;

    const coordinates = feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;

    coordinates.forEach((polygon) => {
        if (countryData) {
            buildCountryPolygonMesh(
                polygon,
                countryData
            );
        } else {
            buildCountryPolygonMesh(
                polygon,
                { country: travelCountryName },
                travelCountryMaterial,
                travelCountryBorderMaterial,
                travelCountryMeshes
            );
        }
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

function positionTravelTooltip(event, countryName) {
    const containerBounds = globeContainer.getBoundingClientRect();
    const offset = 14;
    const tooltipX = event.clientX - containerBounds.left + offset;
    const tooltipY = event.clientY - containerBounds.top + offset;

    travelCountryTooltip.textContent = countryName;
    travelCountryTooltip.style.transform = `translate3d(${tooltipX}px, ${tooltipY}px, 0)`;
    travelCountryTooltip.classList.add("open");
}

function hideTravelTooltip() {
    travelCountryTooltip.classList.remove("open");
}

function updateTravelTooltip(event) {
    if (event.pointerType !== "mouse" || dragState.active) {
        hideTravelTooltip();
        return;
    }

    const canvasBounds = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    pointer.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(travelCountryMeshes, false);

    if (hits.length > 0) {
        positionTravelTooltip(event, hits[0].object.userData.country.country);
    } else {
        hideTravelTooltip();
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
    updateTravelTooltip(event);

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
renderer.domElement.addEventListener("pointerleave", hideTravelTooltip);

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

    earth.rotation.y += 0.003;
    clouds.rotation.y += 0.0036;
    atmosphere.rotation.y += 0.003;

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
