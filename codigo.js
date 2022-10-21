/* API https://retoolapi.dev/W095G7/productos*/

// Estructura de las filas
var fila="<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td><td class='action'><input type='button' value='Borrar' class='boton' onclick='borrar(this)'></td></tr>";
// Datos
var productos=null;
// Clasificacion
function codigoCat(catstr) {
	var code="null";
	switch(catstr) {
		case "electronicos":code="c1";break;
	    case "joyeria":code="c2";break;
		case "caballeros":code="c3";break;
		case "damas":code="c4";break;
	}
	return code;
}   
// Variable orden de fila
var orden=0;
// Llena las filas de la tabla
function listarProductos(productos) {
	// Obteniendo componentes de la tabla
	var precio=document.getElementById("price"); 
	precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
	var num=productos.length;
	var listado=document.getElementById("listado");
	var formulario=document.getElementById("formulario");
	var ids,titles,prices,descriptions,categories,fotos, action;
	var tbody=document.getElementById("tbody"),nfila=0;
	tbody.innerHTML="";
	var catcode;
	// Se crean las filas que contendra la tabla
	for(i=0;i<num;i++)
		tbody.innerHTML+=fila;
	// Elemento Fila
	var tr; 
	// Obteniendo celda
	ids=document.getElementsByClassName("id");
	titles=document.getElementsByClassName("title");
	descriptions=document.getElementsByClassName("description");
	categories=document.getElementsByClassName("category");   
	fotos=document.getElementsByClassName("foto");   
	prices=document.getElementsByClassName("price");
	// Se evalua el orden de las filas
	if(orden===0) {orden=-1;precio.innerHTML="Precio"}
	else if(orden==1) {ordenarAsc(productos,"price");precio.innerHTML="Precio A";precio.style.color="darkgreen"}
	else if(orden==-1) {ordenarDesc(productos,"price");precio.innerHTML="Precio D";precio.style.color="blue"}
	// Se cambia la visualizacion de los contenedores
	listado.style.display="block";
	formulario.style.display="block";
	// Se llena la tabla con los datos obtenidos
	for(nfila=0;nfila<num;nfila++) {
		ids[nfila].innerHTML=productos[nfila].id;
		titles[nfila].innerHTML=productos[nfila].title;
		descriptions[nfila].innerHTML=productos[nfila].description;
		categories[nfila].innerHTML=productos[nfila].category;
		catcode=codigoCat(productos[nfila].category);
		tr=categories[nfila].parentElement;
		tr.setAttribute("class",catcode);
		prices[nfila].innerHTML="$"+productos[nfila].price;
		fotos[nfila].innerHTML="<img src='"+productos[nfila].image+"'>";
		fotos[nfila].firstChild.setAttribute("onclick","window.open('"+productos[nfila].image+"');" );
	}
}
// Realiza la operación POST en la API
function insertar() {
	const input_title = document.querySelector("#input-title");
	const input_description = document.querySelector("#input-description");
	const input_price = document.querySelector("#input-price");
	const input_category = document.querySelector("#input-category");
	
	if(!(input_title.value === "" && input_description.value === "" && input_price.value === "" && input_category.value === "")) {
		var result = null;
		var producto = {
			title: input_title.value,
			description: input_description.value,
			price: input_price.value,
			category: input_category.value,
			image: "https://cdn.pixabay.com/photo/2016/07/23/12/54/box-1536798_960_720.png", /* imagen por defecto */
		}
		fetch("https://api-generator.retool.com/W095G7/productos",
		{method:"post", body: JSON.stringify(producto),
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json; charset=UTF-8',
			}
		}).then(response=>response.json()).then(data=>{
			result=data;
			obtenerProductos();
			alert("Se ha insertado un nuevo registro: " + producto.title);
		});

		input_title.value = ""; input_description.value = ""; input_price.value = ""; input_category.value = "";
	}
}
// Realiza la operacion DELETE en la API
function borrar(boton) {
	var currentRow = boton.closest("tr");
	var id =  currentRow.getElementsByClassName("id")[0].innerHTML;
	var result = null;

	fetch("https://api-generator.retool.com/W095G7/productos/" + id,{method:"DELETE"})
		.then(response=>response.json())
		.then(data=>{
			result=data;
			obtenerProductos();
			alert("Se ha eliminado el registro con id = " + id);
		}
	);
}
// Realiza la operacion GET en la API
function obtenerProductos() {
	orden = 0;
	fetch("https://api-generator.retool.com/W095G7/productos").then(res=>res.json()).then(
		data=>{
			productos=data;
			productos.forEach(
			function(producto) {
				producto.price=parseFloat(producto.price);
			});
		listarProductos(data);
	});
}
// Ordena los elementos de la tabla de forma descendente
function ordenarDesc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
    	if(a[p_key] > b[p_key]) return -1;
		if(a[p_key] < b[p_key]) return 1;
		return 0;
   });
}
// Ordena los elementos de la tabla de forma ascendente
function ordenarAsc(p_array_json, p_key) {
    p_array_json.sort(function (a, b) {
    	if(a[p_key] > b[p_key]) return 1;
		if(a[p_key] < b[p_key]) return -1;
		return 0;
   });
}