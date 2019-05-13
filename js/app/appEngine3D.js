var earthMesh = null;
class Application {
	constructor() {
		this.objects = [];
		this.createScene();

		// This handles the window/viewport when a resize occurs
		window.addEventListener('resize', this.handleResize.bind(this), true);
	}

	createScene() {
		this.clock = new THREE.Clock();
		this.scene = new THREE.Scene();

		// Camera Object
		var fov = 60,
			aspect = window.innerWidth / window.innerHeight,
			near = 0.1,
			far = 10000;
		this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		this.camera.up = new THREE.Vector3(0, 1, 0);
		// Rotation
		this.camera.lookAt(new THREE.Vector3(-2.87, -0.73, -2.96));
		// Position
		this.camera.position.set(-84.34, 45.55, -59.97);

		this.keyboard = new KeyboardState();

		this.controls = new THREE.OrbitControls( this.camera );
		this.controls.damping = 0.2;
		// Vertical
		this.controls.minPolarAngle = grausToRadianos(0);
		this.controls.maxPolarAngle = grausToRadianos(100);
		//this.controls.mouseButtons = {ORBIT: THREE.MOUSE.LEFT, ZOOM: -1, PAN: -1};

		this.controls.keys = {LEFT: 65, UP: 87, RIGHT: 68, BOTTOM: 83};

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setClearColor(new THREE.Color(0x000, 1.0));
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		document.body.appendChild(this.renderer.domElement);

		this.animate();
	}


	getDirection() {
		var direction = new THREE.Vector3(0, 0, 0);

		// Determine Direction of yawObject
		var yawObjectDirection = new THREE.Vector3(0, 0, -1);
		yawObjectDirection.applyEuler(this.yawObject.rotation, this.yawObject.rotation.order);

		// Determine Direction of pitchObject
		var pitchObjectDirection = new THREE.Vector3(0, 0, -1);
		pitchObjectDirection.applyEuler(this.pitchObject.rotation, this.pitchObject.rotation.order);

		// Combine
		direction.x = yawObjectDirection.x;
		direction.y = pitchObjectDirection.y;
		direction.z = yawObjectDirection.z;

		return direction;
	}

	rotateCamera(rotX, rotY, rotZ) {
		this.camera.rotation.x += rotX;
		this.camera.rotation.y += rotY;

		// Enforce X-axis boundaries (rotates around y-axis)
		this.camera.rotation.x = Math.max(this.minCameraRotX, Math.min(this.maxCameraRotX, this.camera.rotation.x));

		// Enforce Y-axis boundaries (rotates around x-axis)
		this.camera.rotation.y = Math.max(this.minCameraRotY, Math.min(this.maxCameraRotY, this.camera.rotation.y));
	}

	animate() {
		this.renderer.clear();

		requestAnimationFrame(() => this.animate());

		//this.playerControls();
		//this.keybUpdate();
		this.controls.update();

		this.objects.forEach((object) => object.update());

		this.render();
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	keybUpdate() {
		var delta = this.clock.getDelta(), 		// seconds
			moveDistance = 50 * delta; 		// 200 pixels per second
		this.keyboard.update();

		if ( this.keyboard.pressed("W") ) {
			var direction = this.camera.getWorldDirection();

			this.camera.position.add(direction);
			this.camera.position.y = 130;
		}

		if ( this.keyboard.pressed("S") )  {
			var direction = this.camera.getWorldDirection();

			this.camera.position.sub(direction);
			this.camera.position.y = 130;
		}

	}

	update() {
		var delta = this.clock.getDelta(), 		// seconds
			moveDistance = 50 * delta, 		// 200 pixels per second
			rotateAngle = Math.PI / 2 * delta; 	// pi/2 radians (90 graus) per second
		this.keyboard.update();

		if ( this.keyboard.pressed("A") ) {
			this.camera.translateX(10.0 * -moveDistance);
		}

		if ( this.keyboard.pressed("D") ) {
			this.camera.translateX(10.0 * moveDistance);
		}

		if ( this.keyboard.pressed("W") ) {
			var obj = new THREE.Object3D();
			obj.position.copy(this.camera.position);
			obj.rotation.copy(this.camera.rotation);

			var direction = obj.getWorldDirection();

			this.camera.position.sub(direction);
			this.camera.position.y = 30;
		}

		if ( this.keyboard.pressed("S") )  {
			var obj = new THREE.Object3D();
			obj.position.copy(this.camera.position);
			obj.rotation.copy(this.camera.rotation);

			var direction = obj.getWorldDirection();

			this.camera.position.add(direction);
			this.camera.position.y = 30;
		}
	}

	playerControls() {
		if (this.camControls.controlsEnabled) {
			var time = performance.now();
			var delta = (time - this.camControls.prevTime) / 1000;

			this.camControls.velocity.x -= this.camControls.velocity.x * 10.0 * delta;
			this.camControls.velocity.z -= this.camControls.velocity.z * 10.0 * delta;

			this.camControls.velocity.y -= 9.8 * 100.0 * delta; 	// 100.0 = mass

			if (this.camControls.moveForward) this.camControls.velocity.z -= 400.0 * delta;
			if (this.camControls.moveBackward) this.camControls.velocity.z += 400.0 * delta;

			if (this.camControls.moveLeft) this.camControls.velocity.x -= 400.0 * delta;
			if (this.camControls.moveRight) this.camControls.velocity.x += 400.0 * delta;

			if (this.camControls.rotateX) {
				this.camControls.rotateVelocity.x /= 10.0 * delta;
			} else {
				this.camControls.rotateVelocity.x = 0.0;
			}

			this.camControls.rotateVelocity.x = 0.0;
			this.camControls.rotateVelocity.x = grausToRadianos(this.camControls.rotateVelocity.x);

			if (this.camControls.rotateY) {
				this.camControls.rotateVelocity.y /= 10.0 * delta;
			} else {
				this.camControls.rotateVelocity.y = 0.0;
			}

			this.camControls.rotateVelocity.y = grausToRadianos(this.camControls.rotateVelocity.y);
			this.rotateCamera(this.camControls.rotateVelocity.x, this.camControls.rotateVelocity.y, 0);

			this.controls.getObject().translateX(this.camControls.velocity.x * delta);
			this.controls.getObject().translateY(this.camControls.velocity.y * delta);
			this.controls.getObject().translateZ(this.camControls.velocity.z * delta);

			if (this.controls.getObject().position.y < 10) {
				this.camControls.velocity.y = 0;
				this.controls.getObject().position.y = 10;
				this.camControls.canJump = true;
			}

			this.camControls.prevTime = time;
		}
	}

	add(mesh) {
		if (Array.isArray(mesh)) {
			var count1 = 0;
			for(var index in mesh) {
				this.objects.push(mesh[index]);
				this.scene.add(mesh[index].getMesh());
			}
		} else {
			this.objects.push(mesh);
			this.scene.add(mesh.getMesh());
		}
	}

	handleResize() {
		this.camera.aspect = (window.innerWidth / window.innerHeight);
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
