import type { Object3D } from 'three';
import { BackSide, BufferAttribute, Color, Mesh, ShaderMaterial, SphereBufferGeometry } from 'three';

import { GLOBE_RADIUS } from '../world-map.constants';

const fragmentShader = `
uniform vec3 color;
uniform float coefficient;
uniform float power;
varying vec3 vVertexNormal;
varying vec3 vVertexWorldPosition;
void main() {
  vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;
  vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;
  viewCameraToVertex = normalize(viewCameraToVertex);
  float intensity	= pow(
    coefficient + dot(vVertexNormal, viewCameraToVertex),
    power
  );
  gl_FragColor = vec4(color, intensity);
}`;

const vertexShader = `
varying vec3 vVertexWorldPosition;
varying vec3 vVertexNormal;
void main() {
  vVertexNormal	= normalize(normalMatrix * normal);
  vVertexWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export function getAtmosphereGlow(): Object3D {
  // Geometry with resized vertex positions according to normals
  const glowGeometry = new SphereBufferGeometry(GLOBE_RADIUS, 75, 75);
  const position = new Float32Array(glowGeometry.attributes.position.count * 3);
  for (let idx = 0, len = position.length; idx < len; idx++) {
    const normal = glowGeometry.attributes.normal.array[idx];
    const curPos = glowGeometry.attributes.position.array[idx];
    position[idx] = curPos + normal * GLOBE_RADIUS * 0.15;
  }
  glowGeometry.setAttribute('position', new BufferAttribute(position, 3));

  const glowMaterial = new ShaderMaterial({
    depthWrite: false,
    fragmentShader,
    transparent: true,
    uniforms: {
      coefficient: {
        value: 0.1,
      },
      color: {
        value: new Color('lightskyblue'),
      },
      power: {
        value: 2.45,
      },
    },
    vertexShader,
    side: BackSide,
  });

  return new Mesh(glowGeometry, glowMaterial);
}
