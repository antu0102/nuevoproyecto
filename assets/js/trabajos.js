// Datos de ejemplo (en una aplicación real, estos vendrían de una base de datos)
const proyectos = [
    {
        id: 1,
        titulo: "Miniferia Dibujos y palabras",
        imagen: "../img/proximoseventos/team-1.png",
        imagenes: [
            "../img/proximoseventos/team-1.png",
            "../img/proximoseventos/team-1.png",
            "../img/proximoseventos/team-1.png",
            "../img/proximoseventos/team-1.png"
        ],
        descripcion: "Venta de arte e ilustración, así como prints, totebag pintados, bitácoras ilustradas, fanzines, stickers.",
        arquitecto: {
            nombre: "Juana Atoche",
            foto: "aaa",
            experiencia: "15 años de experiencia en arquitectura sustentable",
            contacto: "antuanel28@gmail.com",
            otrosProyectos: [4]
        }
    },
    {
        id: 2,
        titulo: "Feria Owa",
        imagen: "../img/proximoseventos/team-2.jpg",
        imagenes: [
            "../img/proximoseventos/team-2.jpg",
            "../img/proximoseventos/team-2.jpg",
            "../img/proximoseventos/team-2.jpg",
            "../img/proximoseventos/team-2.jpg"
        ],
        descripcion: "Ofrecer una amplia gama de productos artísticos, la feria promueve el contacto directo entre los visitantes y los creadores.",
        arquitecto: {
            nombre: "Nnadaasd asdasd",
            foto: "sdfrggg",
            experiencia: "20 años especializándose en edificios comerciales",
            contacto: "antuanel28@gmail.com",
            otrosProyectos: [3]
        }
    },
    {
        id: 3,
        titulo: "DevFest Fest Lima",
        imagen: "../img/proximoseventos/team-3.jpg",
        imagenes: [
            "../img/proximoseventos/team-3.jpg",
            "../img/proximoseventos/team-3.jpg",
            "../img/proximoseventos/team-3.jpg",
            "../img/proximoseventos/team-3.jpg"
        ],
        descripcion: "Evento anual de desarrolladores de tecnología de Google que renune a todos los desarrolladores para difundir actualizaciones digitales.",
        arquitecto: {
            nombre: "asfaffa",
            foto: "affaag",
            experiencia: "20 años especializándose en edificios comerciales",
            contacto: "antuanel28@gmail.com",
            otrosProyectos: [2]
        }
    },
    
];

// Guardar los datos en localStorage para acceder desde la página de detalles
localStorage.setItem('proyectos', JSON.stringify(proyectos));

// Función para cargar la galería de proyectos
function cargarGaleria() {
    const galeriaElement = document.querySelector('.galeria-proyectos');
    
    proyectos.forEach(proyecto => {
        const proyectoLink = document.createElement('a');
        proyectoLink.href = `detalles.html?id=${proyecto.id}`;
        proyectoLink.className = 'proyecto-card';
        proyectoLink.innerHTML = `
            <img src="${proyecto.imagen}" alt="${proyecto.titulo}">
            <h3>${proyecto.titulo}</h3>
        `;
        
        galeriaElement.appendChild(proyectoLink);
    });
}

// Cargar la galería cuando se carga la página
document.addEventListener('DOMContentLoaded', cargarGaleria);