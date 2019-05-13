class appControls {
	constructor(blocker, instructions) {
		this.blocker = blocker;
		this.instructions = instructions;

		this.controlsEnabled = false;

		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.rotateX = false;
		this.rotateY = false;
		this.canJump = false;

		this.prevTime = performance.now();
		this.velocity = new THREE.Vector3();
		this.rotateVelocity = new THREE.Vector2();

		this.havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

		if (this.havePointerLock) {
			this.controlElement = document.body;

			// Hook pointer lock state change events
			document.addEventListener('pointerlockchange', this.pointerLockChange.bind(this), false);
			document.addEventListener('mozpointerlockchange', this.pointerLockChange.bind(this), false);
			document.addEventListener('webkitpointerlockchange', this.pointerLockChange.bind(this), false);

			document.addEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
			document.addEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
			document.addEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);

			// Hook mouse move events
			document.addEventListener('mousemove', this.pointerLockMouseMove.bind(this), false);

			this.instructions.addEventListener('click', this.lockPointer.bind(this), false);
		} else {
			this.instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
		}

		document.addEventListener('keydown', this.onKeyDown.bind(this), false);
		document.addEventListener('keyup', this.onKeyUp.bind(this), false);
		document.addEventListener('mousemove', this.pointerLockMouseMove.bind(this), false);
	}

	// https://www.html5rocks.com/en/tutorials/pointerlock/intro/
	pointerLockMouseMove(event) {
		this.movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		this.movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		this.rotateX = false;
		if (this.movementX < 0) {
			this.rotateVelocity.x = this.movementX;
			this.rotateX = true;
		} else if (this.movementX > 0) {
			this.rotateVelocity.x = this.movementX;
			this.rotateX = true;
		}

		this.rotateY = false;
		if (this.movementY < 0) {
			this.rotateVelocity.y = -this.movementY;
			this.rotateY = true;
		} else if (this.movementY > 0) {
			this.rotateVelocity.y = -this.movementY;
			this.rotateY = true;
		}
	}

	pointerLockChange(event) {
		if (document.pointerLockElement === this.controlElement || document.mozPointerLockElement === this.controlElement || document.webkitPointerLockElement === this.controlElement) {
			// Pointer was just locked

			this.controlsEnabled = true;
			//this.enabled = true;

			// Enable the mousemove listener
			document.addEventListener('mousemove', this.pointerLockMouseMove.bind(this), false);

			this.blocker.style.display = 'none';
		} else {
			// Pointer was just unlocked

			// Disable the mousemove listener
			document.removeEventListener("mousemove", this.pointerLockMouseMove.bind(this), false);
			//this.unlockHook(this.element);

			//this.enabled = false;
			this.blocker.style.display = '-webkit-box';
			this.blocker.style.display = '-moz-box';
			this.blocker.style.display = 'box';

			this.instructions.style.display = '';
		}
	}

	pointerLockError(event) {
		this.instructions.style.display = '';
	}

	lockPointer(event) {
		this.instructions.style.display = 'none';

		// Ask the browser to lock the pointer
		this.controlElement.requestPointerLock = this.controlElement.requestPointerLock || this.controlElement.mozRequestPointerLock || this.controlElement.webkitRequestPointerLock;
		this.controlElement.requestPointerLock();
	}

	onKeyDown(event) {
		switch(event.keyCode) {
			case 38: // up
			case 87: // w
				this.moveForward = true;
				break;

			case 37: // left
			case 65: // a
				this.moveLeft = true;
				break;

			case 40: // down
			case 83: // s
				this.moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				this.moveRight = true;
				break;

			case 32: // space
				if (this.canJump === true)
					this.velocity.y += 350;
				this.canJump = false;
				break;
		}
	}

	onKeyUp(event) {
		switch( event.keyCode ) {
			case 38: // up
			case 87: // w
				this.moveForward = false;
				break;

			case 37: // left
			case 65: // a
				this.moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				this.moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				this.moveRight = false;
				break;
		}
	}
}
