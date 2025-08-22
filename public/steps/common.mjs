
export function createIconButton( bi, title = '' ) {
	
	let button = document.createElement('button');
		button.className = 'btn btn-primary m-1'; // btn-sm
		
	let icon = document.createElement('i');
		icon.className = 'bi bi-'+ bi;
	
	button.appendChild( icon );
	
	if( title ) {
		
		let span = document.createElement('span');
			span.className = 'p-2';
			span.innerHTML = title;
		
		button.appendChild( span );
		
		return { button, icon, span };
	
	}
	
	return { button, icon };
	
}

export function createSwitchCheckbox( title, checked = true ) {
	
	let div = document.createElement('div');
		div.className = 'form-check form-switch';
		
	let input = document.createElement('input');
		input.type = 'checkbox';
		input.className = 'form-check-input toggle-switch';
		input.setAttribute('role', 'switch');
	
	if( checked ) 
		input.setAttribute('checked', '');
	
	let label = document.createElement('label');
		label.className = 'form-check-label';
		label.innerHTML = title;
	
	div.appendChild( input );
	div.appendChild( label );
	
	return { div, label, input };
	
}

export function createInputFile() {
	
	let div = document.createElement('div');
		div.className = 'mb-3';
		
	let input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.className = 'form-control';
	
	let label = document.createElement('label');
		label.className = 'form-label';
		label.innerHTML = 'Escolha um arquivo de imagem.';
	
	div.appendChild( label );
	div.appendChild( input );
	
	return { div, label, input };
	
}

export function createInput( title, value, onchange ) {
	
	let div = document.createElement('div');
		div.className = 'input-group mb-3';
		
	let input = document.createElement('input');
		input.value = value;
		input.onchange = onchange;
		input.className = 'form-control';
	
	let span = document.createElement('span');
		span.className = 'input-group-text';
		span.innerHTML = title;
	
	div.appendChild( span );
	div.appendChild( input );
	
	return { div, span, input };
	
}

export function createRangeInput( title, min, max, value, step, onchange ) {
	
	let div = document.createElement('div');
		div.className = 'mb-3';
		
	let input = document.createElement('input');
		input.type = 'range';
		input.min = min;
		input.max = max;
		input.step = step;
		input.value = value;
		input.onchange = onchange;
		input.className = 'form-range';
	
	let label = document.createElement('span');
		label.className = 'form-label';
		label.innerHTML = title;
	
	label.appendChild( input );
	div.appendChild( label );
	
	return { div, label, input };
	
}


export function createSelect( title, options, onchange ) {
	
	let div = document.createElement('div');
		div.className = 'mb-3';
		
	let select = document.createElement('select');
		select.onchange = onchange;
		select.className = 'form-select';
	
	for( let opt of options ) {
		
		let o = document.createElement('option');
			o.value = opt;
			o.innerHTML = opt;
			
		select.appendChild( o );
		
	}
	
	let span = document.createElement('span');
		span.className = 'form-label';
		span.innerHTML = title;
	
	div.appendChild( span );
	div.appendChild( select );
	
	return { div, span, select };
	
}




