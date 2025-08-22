
import { createIconButton } from './steps/common.mjs'

import * as steps from './steps/index.mjs';
//import InputStep from './steps/InputStep.mjs';
//import CropStep from './steps/CropStep.mjs';
//import GrayScaleStep from './steps/GrayScaleStep.mjs';

//import DIP from "./DIP.mjs";
//import Renderer2D from "../src/js/Renderer2D.mjs";

///
window.addEventListener('load', function(e) {
	
	const input = new steps.InputStep();
	
//	console.log( input );
	
	//let current = input;
	
	const stepsContainer = document.getElementById('stepsContainer');
	
	///
	stepsContainer.appendChild( input.node );
	
	const buttonsList0 = document.getElementById('buttonsList0');
	const buttonsList1 = document.getElementById('buttonsList1');
	const buttonsList2 = document.getElementById('buttonsList2');
	
	function addButton( parentNode, type ) {
		
		let { button } = createIconButton( 'plus', type );
		
		button.addEventListener('click', function() {
			
			let lastStep = input.getLastStep();
			
			let step = new steps[ type ]();
				
			stepsContainer.appendChild( step.node );
			
			lastStep.append( step );
			
			step.compute();
			
		});
		
		parentNode.appendChild( button );
		
	}
	
	///
	addButton( buttonsList0, 'CropStep' );
	addButton( buttonsList0, 'GrayScaleStep' );
	addButton( buttonsList0, 'NegativeStep' );
	addButton( buttonsList0, 'BrightnessStep' );
	addButton( buttonsList0, 'ContrastStep' );
	addButton( buttonsList0, 'ThresholdStep' );
	addButton( buttonsList1, 'ClaheStep' );
	addButton( buttonsList1, 'ConvolutionStep' );
	addButton( buttonsList1, 'ErodeStep' );
	addButton( buttonsList1, 'DilateStep' );
	addButton( buttonsList1, 'OpenStep' );
	addButton( buttonsList1, 'CloseStep' );
	
	
	
	/*
	
	const stepsContainer = document.getElementById('steps-container');
	const addStepBtn = document.getElementById('add-step-btn');
	let stepCount = 0;

	// Função para criar um novo bloco de passo
	function createStepBlock() {
		stepCount++;
		const stepItem = document.createElement('div');
		stepItem.className = 'section-box';
		stepItem.dataset.id = stepCount;

		stepItem.innerHTML = `
			<button type="button" class="btn-close remove-step-btn" aria-label="Remover"></button>
			<div class="d-flex justify-content-between align-items-center mb-2">
				<h6 class="m-0 text-muted">Passo ${stepCount}</h6>
				<div class="form-check form-switch">
					<input class="form-check-input toggle-switch" type="checkbox" role="switch" checked>
					<label class="form-check-label small">Ativar</label>
				</div>
			</div>
			<select class="form-select form-select-sm step-type-select mb-2">
				<option value="grayscale">Tons de Cinza</option>
				<option value="brightness">Ajuste de Brilho</option>
				<option value="contrast">Ajuste de Contraste</option>
				<option value="blur">Blur</option>
			</select>
			<div class="step-controls">
				</div>
		`;
		return stepItem;
	}

	// Função para atualizar os controles do passo com base no tipo selecionado
	function updateStepControls(stepItem, type) {
		const controlsContainer = stepItem.querySelector('.step-controls');
		controlsContainer.innerHTML = '';
		
		if (type === 'brightness' || type === 'contrast') {
			const rangeControl = document.createElement('div');
			rangeControl.innerHTML = `
				<label class="form-label small">${type === 'brightness' ? 'Brilho' : 'Contraste'}: <span class="range-value">50</span></label>
				<input type="range" class="form-range" min="0" max="100" value="50">
			`;
			controlsContainer.appendChild(rangeControl);
			rangeControl.querySelector('input').addEventListener('input', (e) => {
				rangeControl.querySelector('.range-value').innerText = e.target.value;
			});
		} else if (type === 'blur') {
			const rangeControl = document.createElement('div');
			rangeControl.innerHTML = `
				<label class="form-label small">Intensidade: <span class="range-value">1</span></label>
				<input type="range" class="form-range" min="0" max="10" value="1">
			`;
			controlsContainer.appendChild(rangeControl);
			rangeControl.querySelector('input').addEventListener('input', (e) => {
				rangeControl.querySelector('.range-value').innerText = e.target.value;
			});
		}
	}

	// Evento para adicionar um novo passo
	addStepBtn.addEventListener('click', () => {
		const newStep = createStepBlock();
		stepsContainer.appendChild(newStep);

		// Adiciona listener para o seletor de tipo
		const select = newStep.querySelector('.step-type-select');
		updateStepControls(newStep, select.value);
		select.addEventListener('change', (e) => {
			updateStepControls(newStep, e.target.value);
		});

		// Adiciona listener para o botão de toggle
		newStep.querySelector('.toggle-switch').addEventListener('change', (e) => {
			if (!e.target.checked) {
				newStep.classList.add('inactive');
			} else {
				newStep.classList.remove('inactive');
			}
		});

		// Adiciona listener para o botão de remover
		newStep.querySelector('.remove-step-btn').addEventListener('click', () => {
			newStep.remove();
		});
	});

	// Simulação do restante da funcionalidade
	document.getElementById('imageInput').addEventListener('change', function(event) {
		const preview = document.getElementById('preview');
		const file = event.target.files[0];
		if (file) {
			preview.src = URL.createObjectURL(file);
			preview.style.display = 'block';
		} else {
			preview.style.display = 'none';
		}
	});

	document.querySelector('.btn-primary').addEventListener('click', function() {
		const inputImageSrc = document.getElementById('preview').src;
		const outputImage = document.getElementById('outputImage');
		const outputMessage = document.getElementById('outputMessage');
		
		if (inputImageSrc && inputImageSrc.startsWith('blob:')) {
			// Aqui você chamaria sua lib para processar a imagem
			outputImage.src = inputImageSrc; // Exemplo
			outputImage.style.display = 'block';
			outputMessage.style.display = 'none';
		} else {
			outputMessage.innerText = 'Por favor, selecione uma imagem para processar.';
			outputMessage.style.display = 'block';
			outputImage.style.display = 'none';
		}
	});

*/

}, false);





