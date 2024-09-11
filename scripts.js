
// Función para navegar a una página diferente
function navigateToPage(page) {
    window.location.href = page;
}

// Asignar eventos de click a los elementos del navbar
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('odontologos-link').addEventListener('click', () => {
        navigateToPage('odontologos.html');
    });

    document.getElementById('pacientes-link').addEventListener('click', () => {
        navigateToPage('pacientes.html');
    });

    document.getElementById('turnos-link').addEventListener('click', () => {
        navigateToPage('turnos.html');
    });
});
const apiUrl = 'http://localhost:8080/odontologo';

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("odontologo-form");
    const odontologoList = document.getElementById("odontologo-list");
    const searchOdontologoBtn = document.getElementById("searchOdontologoBtn");
    const searchResult = document.getElementById("searchResult");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const odontologoId = document.getElementById("odontologoId").value;
        if (odontologoId) {
            updateOdontologo(odontologoId);
        } else {
            addOdontologo();
        }
    });

    searchOdontologoBtn.addEventListener("click", function () {
        const searchId = document.getElementById("searchId").value;
        if (searchId) {
            searchOdontologoById(searchId);
        }
    });

    function addOdontologo() {
        const odontologo = {
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            numeroMatricula: document.getElementById("numeroMatricula").value,
            
            
        };

        fetch(`${apiUrl}/agregar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(odontologo)
        })
        .then(response => response.json())
        .then(() => {
            form.reset();
            loadOdontologos();
        })
        .catch(error => console.error('Error:', error));
    }

    function loadOdontologos() {
        fetch(`${apiUrl}/buscarTodos`)
            .then(response => response.json())
            .then(odontologos => renderOdontologos(odontologos))
            .catch(error => console.error('Error:', error));
    }

    function renderOdontologos(odontologos) {
        odontologoList.innerHTML = '';

        odontologos.forEach(odontologo => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${odontologo.id}</td>
                <td>${odontologo.nombre}</td>
                <td>${odontologo.apellido}</td>
                <td>${odontologo.numeroMatricula}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editOdontologo(${odontologo.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteOdontologo(${odontologo.id})">Eliminar</button>
                </td>
            `;

            odontologoList.appendChild(tr);
        });
    }

    function searchOdontologoById(id) {
        fetch(`${apiUrl}/buscar/${id}`)
            .then(response => response.json())
            .then(odontologo => {
                console.log(odontologo)
                if (!odontologo.statusCode) {
                    searchResult.innerHTML = `
                        <div class="alert alert-info">
                            <strong>ID:</strong> ${odontologo.id}<br>
                            <strong>Nombre:</strong> ${odontologo.nombre}<br>
                            <strong>Apellido:</strong> ${odontologo.apellido}<br>
                            <strong>Numero de Matricula:</strong> ${odontologo.numeroMatricula}<br>
                        </div>
                    `;
                } else {
                    searchResult.innerHTML = `<div class="alert alert-danger">Odontologo no encontrado</div>`;
                }
            })
            .catch(error => {
                console.error('Error:', error)
            });
    }

    window.editOdontologo = function(id) {
        fetch(`${apiUrl}/buscar/${id}`)
            .then(response => response.json())
            .then(odontologo => {
                document.getElementById("odontologoId").value = odontologo.id;
                document.getElementById("apellido").value = odontologo.apellido;
                document.getElementById("nombre").value = odontologo.nombre;
                document.getElementById("numeroMatricula").value = odontologo.numeroMatricula;
            })
            .catch(error => console.error('Error:', error));
    }

    function updateOdontologo(id) {
        const odontologo = {
            id:id,
            apellido: document.getElementById("apellido").value,
            nombre: document.getElementById("nombre").value,
            numeroMatricula: document.getElementById("numeroMatricula").value,
        };

        fetch(`${apiUrl}/modificar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(odontologo)
        })
        .then(() => {
            document.getElementById("odontologoId").value = null;
            form.reset();
            loadOdontologos();
        })
        .catch(error => console.error('Error:', error));
    }

    window.deleteOdontologo = function(id) {
        fetch(`${apiUrl}/eliminar/${id}`, {
            method: 'DELETE',
        })
        .then(() => loadOdontologos())
        .catch(error => console.error('Error:', error));
    }

    loadOdontologos();
});
