(function () {
	// menu
	const responsiveMenu = document.querySelector('.menu-icon');
	const menu = document.querySelector('.menu');
	const menuItem = document.querySelector('.menu-item');
	// Event listeners
	document.addEventListener('DOMContentLoaded', () => {
		// menu
		responsiveMenu.addEventListener('click', () =>
			menu.classList.toggle('menu-activo')
		);

		menu.addEventListener('click', (event) => {
			removerMenu(event);
		});
	});

	// funciones
	function removerMenu(event) {
		if (
			event.target.classList.contains('menu-item') ||
			(event.target.classList.contains('icon') &&
				menu.classList.contains('menu-activo'))
		) {
			menu.classList.remove('menu-activo');
		}
	}
})();

//Hide menu when scrolling

//get sizewindows

function tamVentana() {
	var tam = [0, 0];
	if (typeof window.innerWidth != 'undefined') {
		tam = [window.innerWidth, window.innerHeight];
	} else if (
		typeof document.documentElement != 'undefined' &&
		typeof document.documentElement.clientWidth != 'undefined' &&
		document.documentElement.clientWidth != 0
	) {
		tam = [
			document.documentElement.clientWidth,
			document.documentElement.clientHeight,
		];
	} else {
		tam = [
			document.getElementsByTagName('body')[0].clientWidth,
			document.getElementsByTagName('body')[0].clientHeight,
		];
	}
	return tam;
}

const nav = document.querySelector('nav');
let scroll = 0;

function watchMenu(e) {
	let sizeScreen = tamVentana();
	if (scroll < window.scrollY) {
		scroll = window.scrollY - 1;
		nav.style.top = `${-nav.clientHeight}px`;
	} else {
		console.log(sizeScreen);
		scroll = window.scrollY + 1;
		nav.style.top = 0;
	}
}

window.addEventListener('scroll', watchMenu);

// Formulario
(function () {
	const form = document.querySelector('#form');
	const txtNombre = document.querySelector('#Nombre');
	const txtEmail = document.querySelector('#Email');
	const txtMensaje = document.querySelector('#Mensaje');
	const respuesta = document.querySelector('#respuesta');

	// Validar cada campo
	txtEmail.addEventListener('input', validarFormulario);
	txtNombre.addEventListener('input', validarFormulario);
	txtMensaje.addEventListener('input', validarFormulario);

	// Validar envio
	form.addEventListener('submit', enviarCorreo);

	const mensajeObj = {
		Nombre: '',
		Email: '',
		Mensaje: '',
	};

	// Funciones
	function validarFormulario(event) {
		const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		// Reiniciar el valor del objeto
		mensajeObj[this.id] = '';

		//Validar que el valor no sea menor a 2 caracteres
		if (this.value.length <= 2) {
			mostrarError(this); // Mostrar el Error

			return; // Detener el codigo
		} else {
			//Borrar el mensaje de error en tal caso que el input sea valido

			if (form.querySelector(`.text${this.id}`)) {
				form.querySelector(`.text${this.id}`).remove();
			}
		}

		// Validar que el input es tipo email
		if (this.type === 'email') {
			// Validar el correo
			if (!er.test(event.target.value)) {
				mostrarError(event.target);
				return;
			}
		}

		// Ingresar el valor al objeto del mensaje
		mensajeObj[event.target.id] = event.target.value;
	}

	// Funci??n para crear el mensaje para mostrar el error
	function mostrarError(element) {
		// Creando el label con el mensaje
		let label = document.createElement('small');
		label.textContent = `${element.id} no valido*`;
		label.classList.add(`text${element.id}`);

		// Validando que exista, para evitar repetir
		if (!form.querySelector(`.text${element.id}`)) {
			element.before(label);

			return;
		}
	}

	// Funci??n para enviar el correo
	function enviarCorreo(event) {
		event.preventDefault();

		const { Nombre, Email, Mensaje } = mensajeObj;

		// Crear un spinner mientras se hace la operaci??n de enviar el correo
		const spinner = document.createElement('div');

		spinner.classList.add('carga');

		spinner.innerHTML = `
          <div class="spinner">
              <div class="double-bounce1"></div>
              <div class="double-bounce2"></div>
          </div> 
          `;

		respuesta.appendChild(spinner);

		// Validar si el objeto del mensaje es valido
		if (Nombre === '' || Mensaje === '' || Email === '') {
			respuesta.removeChild(spinner);

			// Mostrar el mensaje de error
			mostrarMensaje('El formulario esta vacio', 'error');
		} else {
			fetch(
				'https://formsubmit.co/ajax/8597b2b1c5da909e5d6fcbef4cb06f61',
				{
					method: 'POST',
					body: new FormData(form),
				}
			)
				.then((resp) => resp.json())
				.then((result) => {
					respuesta.removeChild(spinner);

					mostrarMensaje('Mensaje enviado', 'success');

					formatearForm();
				})
				.catch((err) => {
					respuesta.removeChild(spinner);

					mostrarMensaje(err, 'error');
				});
		}
	}

	// Fuci??n para formatear el form y el mensajeObj
	function formatearForm() {
		mensajeObj.Nombre = '';
		mensajeObj.Email = '';
		mensajeObj.Mensaje = '';

		txtNombre.value = '';
		txtEmail.value = '';
		txtMensaje.value = '';
	}

	// Funci??n en el cual se muestra un mensaje con el estado del envi??
	function mostrarMensaje(mensaje, tipo) {
		// Crear el mensaje
		const mensajeDiv = document.createElement('div');
		const mensajeTitulo = document.createElement('h3');
		const mensajeDesc = document.createElement('p');

		// Validar si no existe ya un mensaje, para no duplicar
		if (respuesta.classList.contains('respuesta') === true) {
			return;
		} else {
			mensajeDesc.textContent = mensaje;

			// Crear el contenido y la clase del mensaje, ademas de validar el tipo
			if (tipo === 'error') {
				mensajeTitulo.textContent = '??Error!';
				mensajeDiv.classList.add(
					'error',
					'border-content-sm',
					'shadow-gray-sm'
				);

				mensajeDiv.appendChild(mensajeTitulo);
				mensajeDiv.appendChild(mensajeDesc);
			}
			if (tipo === 'success') {
				mensajeTitulo.textContent = '??Success!';
				mensajeDiv.classList.add(
					'success',
					'border-content-sm',
					'shadow-gray-sm'
				);

				mensajeDiv.appendChild(mensajeTitulo);
				mensajeDiv.appendChild(mensajeDesc);
			}

			// Agregar el mensaje al html
			respuesta.classList.add('respuesta');
			respuesta.appendChild(mensajeDiv);

			// Borrar el mensaje
			setTimeout(() => {
				mensajeDiv.remove();
				respuesta.classList.remove('respuesta');
			}, 3000);
		}
	}
})();
