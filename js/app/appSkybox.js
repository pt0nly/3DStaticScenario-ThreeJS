// Skybox namespace
var Skybox = {
	// Cube with particle system
	Dome: class extends ObjectBasic {
		constructor(name, radius, widthSegments, heightSegments, position, rotation, texturePath) {
			super();

			// Create material
			this.createMaterial(texturePath);

			// Create a sphere
			this.mesh = new Objects.Sphere(
				name,
				{ 'radius': radius, 'widthSegments': widthSegments, 'heightSegments': heightSegments },
				this.material,
				position, 	// Position
				rotation	// Rotation
			).getMesh();

			this.mesh.receiveShadow = false;
		}

		update() {
			super.update();
		}

		getMesh() {
			super.getMesh();

			return this.mesh;
		}

		getMaterial() {
			super.getMaterial();

			return this.material;
		}

		getAmbientLight() {
			return this.ambientLight.getMesh();
		}

		createMaterial(texturePath) {
			// 4096 is the maximum width for maps
			var texture = THREE.ImageUtils.loadTexture(texturePath);

			this.material = new THREE.MeshPhongMaterial({
				wireframe: false,
				//side: THREE.BackSide
				side: THREE.DoubleSide
			});
			this.material.map = texture;
		}
	}
};
