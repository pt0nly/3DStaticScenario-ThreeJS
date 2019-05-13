function checkExist(value) {
	return !(typeof (value) == "undefined" || value == null);
}

function grausToRadianos(graus) {
	return (graus * Math.PI / 180);
}

function radianosToGraus(radianos) {
	return (radianos * 180 / Math.PI);
}

// Basic Object
class ObjectBasic {
	constructor(scale, position, rotation) {
		// Scale
		this.scale = (!checkExist(scale) ? { x: 1, y: 1, z: 1 } : scale);
		if (!checkExist(this.scale.x)) this.scale.x = 1;
		if (!checkExist(this.scale.y)) this.scale.y = 1;
		if (!checkExist(this.scale.z)) this.scale.z = 1;

		// Position
		this.position = (!checkExist(position) ? { x: 0, y: 0, z: 0 } : position);
		if (!checkExist(this.position.x)) this.position.x = 0;
		if (!checkExist(this.position.y)) this.position.y = 0;
		if (!checkExist(this.position.z)) this.position.z = 0;

		// Rotation
		this.rotation = (!checkExist(rotation) ? {x: 0, y: 0, z: 0} : rotation);
		if (!checkExist(this.rotation.x)) this.rotation.x = 0;
		if (!checkExist(this.rotation.y)) this.rotation.y = 0;
		if (!checkExist(this.rotation.z)) this.rotation.z = 0;

		this.material = null;
		this.mesh = null;
	}

	update() { }

	getMesh() { }

	getMaterial() { }
}

// Object namespace
var Objects = {
	// Cube with particle system
	CubeParticleSystem: class extends ObjectBasic {
		constructor(name, cubeSize, texturePath, transparent, size, segments, position, rotation) {
			super(null, position, rotation);

			// Texture
			transparent = (!checkExist(transparent) ? false : transparent);

			// Segments
			segments = (!checkExist(segments)  ? {width: 1, height: 1, depth: 1} : segments);
			segments.width = (!checkExist(segments.width) ? 1 : segments.width);
			segments.height = (!checkExist(segments.height) ? 1 : segments.height);
			segments.depth = (!checkExist(segments.depth) ? 1 : segments.depth);

			this.geometry = new THREE.BoxGeometry(cubeSize.width, cubeSize.height, cubeSize.depth, segments.width, segments.height, segments.depth);
			this.material = new Material.ParticleBasicMaterial(texturePath, transparent, size);

			this.particleSystem = new THREE.ParticleSystem(geometry, material);
			this.particleSystem.sortParticles = true;
			this.particleSystem.name = name;

			// Position
			this.particleSystem.position.set(this.position.x, this.position.y, this.position.z);

			// Rotation
			this.particleSystem.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
		}

		update() {
			super.update();
		}

		getParticleSystem() {
			return this.particleSystem;
		}

		getMesh() {
			super.getMesh();

			return this.mesh;
		}

		getMaterial() {
			super.getMaterial();

			return this.material;
		}
	},

	// Cube
	Cube: class extends ObjectBasic {
		constructor(size, position, rotation) {
			super(null, position, rotation);

			this.geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
			this.material = new THREE.MeshBasicMaterial();

			this.mesh = new THREE.Mesh(this.geometry, this.material);

			// Position
			this.mesh.position.set(this.position.x, this.position.y, this.position.z);

			// Rotation
			this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
		}

		update() {
			super.update();

			this.mesh.rotation.x += 0.1;
			this.mesh.rotation.y += 0.1;
		}

		getMesh() {
			super.getMesh();

			return this.mesh;
		}

		getMaterial() {
			super.getMaterial();

			return this.material;
		}
	},

	// Sphere
	Sphere: class extends ObjectBasic {
		constructor(name, params, material, position, rotation) {
			super(null, position, rotation);

			// Sphere Parameters
			this.params = {
				'radius': (!checkExist(params.radius) ? 50 : params.radius),
				'widthSegments': (!checkExist(params.widthSegments) ? 8 : params.widthSegments),
				'heightSegments': (!checkExist(params.heightSegments) ? 6 : params.heightSegments),
				'phiStart': (!checkExist(params.phiStart) ? 0 : params.phiStart),
				'phiLength': (!checkExist(params.phiLength) ? (Math.PI * 2) : params.phiLength),
				'thetaStart': (!checkExist(params.thetaStart) ? 0 : params.thetaStart),
				'thetaLength': (!checkExist(params.thetaLength) ? (Math.PI) : params.thetaLength),
			};
			if (this.params.widthSegments < 3) this.params.widthSegments = 3;
			if (this.params.heightSegments < 2) this.params.heightSegments = 2;

			// Create geometry
			this.geometry = new THREE.SphereGeometry(
				this.params.radius,
				this.params.widthSegments, this.params.heightSegments,
				this.params.phiStart, this.params.phiLength,
				this.params.thetaStart, this.params.thetaLength
			);

			if (!checkExist(material)) {
				// Create material
				this.material = new THREE.MeshPhongMaterial({ color: 0xe4e4e4 });
			} else {
				// Use defined material
				this.material = material;
			}

			// Create a Mesh
			this.mesh = new THREE.Mesh(this.geometry, this.material);
			if (typeof (name) == String && name.length > 0) {
				this.mesh.name = name;
			}

			// Mesh position
			this.mesh.position.set(this.position.x, this.position.y, this.position.z);

			// Mesh rotation
			this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
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
	},

	// Plane
	Plane: class extends ObjectBasic {
		constructor(size, segments, materialParams, receiveShadow, position, rotation) {
			super(nucall, position, rotation);

			segments = (!checkExist(segments) ? { width: 1, height: 1 } : segments);
			receiveShadow = (!checkExist(receiveShadow) ? false : receiveShadow);

			this.geometry = new THREE.PlaneGeometry(size.width, size.height, segments.width, segments.height);
			this.material = new THREE.MeshPhongMaterial(materialParams);

			this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.mesh.receiveShadow = receiveShadow;

			// Mesh position
			this.mesh.position.set(this.position.x, this.position.y, this.position.z);

			// Mesh rotation
			this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
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
	},

	Load: {
		// Load OBJ models
		OBJ: class extends ObjectBasic {
			constructor(model, scale, position, rotation, scene) {
				super(scale, position, rotation);

				// Model
				model = {
					'path': (!checkExist(model.path) ? "" : model.path),
					'file': (!checkExist(model.file) ? "" : model.file)
				};
				if (model.path.length > 0 && model.path.substr(model.path.length - 1, 1) != "/") {
					model.path += "/";
				}

				// Container to return loaded object
				var container = new THREE.Object3D();

				// Variables to be used within the subfunctions
				var _material = this.material,
					_mesh = this.mesh,
					_scale = this.scale,
					_position = this.position,
					_rotation = this.rotation;

				var mtlLoader = new THREE.MTLLoader();
				mtlLoader.setPath(model.path);
				mtlLoader.load(model.file + ".mtl", function(materials) {
					materials.preload();

					var objLoader = new THREE.OBJLoader();
					objLoader.setMaterials(materials);
					objLoader.setPath(model.path);
					objLoader.load(model.file + ".obj",
						// onLoad
						function (object) {
							object.position.set(_position.x, _position.y, _position.z);
							object.rotation.set(_rotation.x, _rotation.y, _rotation.z);
							object.scale.set(_scale.x, _scale.y, _scale.z);

							container.add(object);
						},

						// onProgress
						function(xhr) {
							if (xhr.lengthComputable) {
								var percentComplete = xhr.loaded / xhr.total * 100;
								console.log( Math.round(percentComplete, 2) + '% downloaded' );
							}
						},

						// onError
						function(xhr) { }
					);
				});

				// Copies container to the object's mesh
				this.mesh = container;
			}

			getMesh() {
				super.getMesh();

				return this.mesh;
			}

			getMaterial() {
				super.getMaterial();

				return this.material;
			}

			getPercentComplete() {
				return this.percentComplete;
			}
		},

		// Load JSON models
		JSON: class extends ObjectBasic {
			constructor(model, scale, position, rotation) {
				super(scale, position, rotation);

				// Model
				model = {
					'path': (!checkExist(model.path) ? "" : model.path),
					'file': (!checkExist(model.file) ? "" : model.file)
				};
				if (model.path.length > 0 && model.path.substr(model.path.length - 1, 1) != "/") {
					model.path += "/";
				}

				var container = THREE.Object3D();

				var _material = this.material,
					_mesh = this.mesh,
					_scale = this.scale,
					_position = this.position,
					_rotation = this.rotation;


				var loader = new THREE.JSONLoader();
				loader.load(model.path + model.file, function(geometry, materials) {
					_material = new THREE.MeshFaceMaterial(materials);

					_mesh = new THREE.Mesh(geometry, material);
					_mesh.position.set(_position.x, _position.y, _position.z);
					_mesh.rotation.set(_rotation.x, _rotation.y, _rotation.z);
					_mesh.scale.set(_scale.x, _scale.y, _scale.z);

					container.add(_mesh);
				});

				this.mesh = container;
			}

			getMesh() {
				super.getMesh();

				return this.mesh;
			}

			getMaterial() {
				super.getMaterial();

				return this.material;
			}
		}
	}
};
