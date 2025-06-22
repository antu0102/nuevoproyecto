function obtenerParametroURL(parametro) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parametro);
}

function cargarDetalles() {
    const proyectoId = parseInt(obtenerParametroURL('id'));
    const proyectos = JSON.parse(localStorage.getItem('proyectos'));
    const proyecto = proyectos.find(p => p.id === proyectoId);
    
    if (!proyecto) {
        window.location.href = 'index.html';
        return;
    }
    
    // Actualizar el contenido de la página
    document.getElementById('proyecto-titulo').textContent = proyecto.titulo;
        // Cargar las imágenes en el slider
        const slideContainer = document.getElementById('proyecto-imagenes');
        proyecto.imagenes.forEach(imagen => {
            const item = document.createElement('div');
            item.className = 'item';
            item.style.backgroundImage = `url(${imagen})`;
            slideContainer.appendChild(item);
        });
    // document.getElementById('proyecto-imagenes').src = proyecto.imagen;
    document.getElementById('proyecto-imagenes').alt = proyecto.titulo;
    document.getElementById('proyecto-descripcion').textContent = proyecto.descripcion;
    
    // Actualizar información del arquitecto incluyendo la foto
    document.getElementById('arquitecto-nombre').textContent = proyecto.arquitecto.nombre;
    document.getElementById('arquitecto-foto').src = proyecto.arquitecto.foto;
    document.getElementById('arquitecto-foto').alt = `Foto de ${proyecto.arquitecto.nombre}`;
    document.getElementById('arquitecto-experiencia').textContent = proyecto.arquitecto.experiencia;
    document.getElementById('arquitecto-contacto').textContent = `Contacto: ${proyecto.arquitecto.contacto}`;
    
    // Configurar el slider
    inicializarSlider();

    // Mostrar otros proyectos del arquitecto
    const otrosProyectosDiv = document.getElementById('otros-proyectos');
    otrosProyectosDiv.innerHTML = '<h4>Otros proyectos del arquitecto:</h4>';
    const otrosProyectosList = document.createElement('ul');
    otrosProyectosList.className = 'otros-proyectos-lista';
    
    proyecto.arquitecto.otrosProyectos.forEach(proyectoId => {
        const otroProyecto = proyectos.find(p => p.id === proyectoId);
        if (otroProyecto) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = `detalles.html?id=${otroProyecto.id}`;
            link.textContent = otroProyecto.titulo;
            li.appendChild(link);
            otrosProyectosList.appendChild(li);
        }
    });
    
    otrosProyectosDiv.appendChild(otrosProyectosList);
}

function inicializarSlider() {
    const slide = document.querySelector('.slide');
    const items = document.querySelectorAll('.item');
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');
    let currentIndex = 0;

    function updateSlide() {
        slide.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateSlide();
    });

    next.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateSlide();
    });

        // Opcional: Añadir navegación con teclado
        // document.addEventListener('keydown', (e) => {
        //     if (e.key === 'ArrowLeft') {
        //         prev.click();
        //     } else if (e.key === 'ArrowRight') {
        //         next.click();
        //     }
        // });
    }

document.addEventListener('DOMContentLoaded', cargarDetalles);