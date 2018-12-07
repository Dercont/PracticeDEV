(function (a) {

    app = { //MASTER-OBJECT
        main: function (a) {
            app.malla()
        },

        reloadPage: () => {
            window.location.reload();
        },

        closeModal: () => {
            document.getElementById("my-modal").style.display = 'none';
         },

        alertPerdiste: () => {
            document.getElementById("my-modal").style.display = 'block';
            console.log("Se disparo");
          
        },

        alertGanaste: () => {
            window.alert("ganaste")
            window.location.href = "vistas/ganador";
        },

        //almacenamiento y estatus del juego

        arrMalla: [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []] //USADO EN ASIGNACION DE BOMBAS
        ,

        gameOver: false,

        toWin: 256,

        //funcionalidades

        malla: () => {
            CONTENEDOR = document.querySelector('div.malla')
            CANTIDAD_FILAS = 16
            CANTIDAD_COLUMNAS = 16
            CANTIDAD_BOMBAS = 5
            banderas_disp = 40
            MOD = 16
            MAX = 15
            MIN = 0
            hasBomba = false;

            for (let i = 0; i < CANTIDAD_FILAS * CANTIDAD_COLUMNAS; i++) {
                x = Math.trunc(i % MOD)
                y = Math.trunc(i / MOD)
                m = document.createElement('button')
                txt = x + ',' + y
                m.classList.add('mina_cerrada')
                m.setAttribute('id', txt)
                m.setAttribute('posx', x)
                m.setAttribute('posy', y)
                m.addEventListener('click', app.abrirCelda)
                m.addEventListener('contextmenu', app.bandera)
                app.arrMalla[y].push(m)
                CONTENEDOR.appendChild(m)
            }

            //Cuando: Se tienen 40 bombas por asignar, Entonces: Asignar 40 bombas aleatoriamente a la malla de celdas cerradas
            for (let i = 0; i < CANTIDAD_BOMBAS; i++) {
                rx = Math.floor((Math.random() * MAX) + MIN)
                ry = Math.floor((Math.random() * MAX) + MIN)

                //Cuando: No tenga bomba, Entonces: Asignar bombas
                if (!app.arrMalla[rx][ry].classList.contains('bomba')) {
                    app.arrMalla[rx][ry].classList.add('bomba')
                    //app.arrMalla[rx][ry].innerText = '*'

                    //Cuando: Se asigne una bomba, Entonces: Reducir en 1 unidad cantidad de celdas que tiene que abrir el jugador para ganar
                    app.toWin--
                } else {
                    //Cuando: Tenga bomba, Entonces: Reducir iteración del FOR en -1 unidad
                    i--;
                }
            }
            console.log('celdas renaining para ganar:', app.toWin)
        },

        floodfill: (cell) => {
            x = parseInt(cell.getAttribute('posx'))
            y = parseInt(cell.getAttribute('posy'))
            arr = []

            //Escanear vecinos va de izquierda a derecha, de arriba hacia abajo:
            for (let j = y - 1; j <= y + 1; j++) {
                for (let i = x - 1; i <= x + 1; i++) {
                    if (x === i && y === j) {

                        //Cuando: Se escanee a uno mismo, Entonces: No hacer nada
                    } else {
                        try {
                            if (app.arrMalla[j][i].classList.contains('mina_cerrada')) {
                                arr.push(app.arrMalla[j][i])
                            }
                            if (app.arrMalla[j][i].classList.contains('bandera')) {
                                arr.push(app.arrMalla[j][i])
                            }
                        } catch (err) {
                        }
                    }
                }
            }

            arr.forEach(e => {

                //Cuando: Se detecte bandera,Entonces: Transformarla en celda cerrada
                if (e.classList.contains('bandera')) {
                    document.getElementById(e.getAttribute('posx') + ',' + e.getAttribute('posy')).classList.remove('bandera')
                    document.getElementById(e.getAttribute('posx') + ',' + e.getAttribute('posy')).classList.add('mina_cerrada')
                    document.getElementById(e.getAttribute('posx') + ',' + e.getAttribute('posy')).click()
                    banderas_disp++
                    marcador = str1.concat(banderas_disp, str2)
                    document.getElementById("contador").innerHTML = marcador;
                } else {
                    document.getElementById(e.getAttribute('posx') + ',' + e.getAttribute('posy')).click()
                }
            });
        },

        nivelDeRiesgo: (cell, arr) => {
            sum = 0

            arr.forEach(e => {

                //Cuando: Se encuentre una bomba, Entonces: Incrementar indice de peligro
                try {
                    if (e.classList.contains('bomba')) {
                        sum++
                    }
                } catch (err) { }
            });

            if (sum > 0) {
                cell.innerText = sum
            } else {

                //Cuando: No hayan bombas vecinas ,Entonces: Listar vecinos cerrados
                app.floodfill(cell)
            }
        },

        escanearAlrededor: (x, y) => {
            arr = []

            //Escanear vecinos válidos de izquierda a derecha, de arriba hacia abajo:
            for (let j = y - 1; j <= y + 1; j++) {
                for (let i = x - 1; i <= x + 1; i++) {
                    if (x === i && y === j) {

                        //Cuando: Se escanee sobre sí mismo, Entonces: No hacer nada
                    } else {
                        try {
                            arr.push(app.arrMalla[j][i])
                        } catch (e) { }
                    }
                }
            }
            app.nivelDeRiesgo(app.arrMalla[y][x], arr)
        },

        mostrarMinas: () => {
            for (let i = 0; i < 16; i++) {
                for (let j = 0; j < 16; j++) {

                    //Cuando: Se encuentre mina, Entonces: Mostrar Mina
                    if (app.arrMalla[i][j].classList.contains('bomba')) {
                        app.arrMalla[i][j].classList.remove('mina_cerrada')
                        app.arrMalla[i][j].classList.add('mina_abierta')
                        //app.arrMalla[i][j].innerText = '*'
                    }
                }
            }
        },

        bandera: (element) => {
            str1 = "Banderas: "
            str2 = " / 40"

            if (!app.gameOver) {
                px = parseInt(element.currentTarget.getAttribute('posx'))
                py = parseInt(element.currentTarget.getAttribute('posy'))
                id = px + ',' + py
                e = document.getElementById(id);

                //Cuando: Celda está cerrada, Entonces: Pasa a ser cerrada con bandera
                if (e.classList.contains('mina_cerrada') && (banderas_disp > 0)) {
                    e.classList.remove('mina_cerrada')
                    e.classList.add('bandera')

                    //Cuando: Pasa a ser con Bandera, Entonces: Disminuir banderas disponibles. 
                    banderas_disp--;
                    marcador = str1.concat(banderas_disp, str2)
                    document.getElementById("contador").innerHTML = marcador;

                    //Cuando: Celda pasa a ser solamente celda cerrada, Entonces: Aumentar banderas disponibles.
                } else if (e.classList.contains('bandera')) {
                    e.classList.remove('bandera')
                    e.classList.add('mina_cerrada')
                    banderas_disp++;
                    marcador = str1.concat(banderas_disp, str2)
                    document.getElementById("contador").innerHTML = marcador;
                }
            }
        },

        abrirCelda: (element) => {
            if (!app.gameOver) {
                if (app.toWin === 1) {
                    px = parseInt(element.currentTarget.getAttribute('posx'))
                    py = parseInt(element.currentTarget.getAttribute('posy'))
                    id = px + ',' + py
                    e = document.getElementById(id)

                    //Cuando: Celda está cerrada, Entonces: Abrir celda
                    if (e.classList.contains('mina_cerrada')) {
                        e.classList.remove('mina_cerrada')
                        e.classList.add('mina_abierta')

                        if (e.classList.contains('bomba')) {
                            app.mostrarMinas()
                            app.alertPerdiste()
                            app.gameOver = true
                        } else {
                            app.toWin--
                            console.log('celdas para ganar:', app.toWin)
                            app.escanearAlrededor(px, py)
                            app.alertGanaste();
                        }
                    }
                    //lanzar ventana de ganador

                    app.gameOver = true

                } else {
                    px = parseInt(element.currentTarget.getAttribute('posx'))
                    py = parseInt(element.currentTarget.getAttribute('posy'))
                    id = px + ',' + py
                    e = document.getElementById(id);

                    //Cuando: Celda está cerrada, Entonces: Abrir celda
                    if (e.classList.contains('mina_cerrada')) {
                        e.classList.remove('mina_cerrada')
                        e.classList.add('mina_abierta')
                        if (e.classList.contains('bomba')) {
                            console.log('dead')
                            app.mostrarMinas();
                            app.alertPerdiste()
                            app.gameOver = true
                        } else {
                            app.toWin--
                            console.log('celdas para ganar:', app.toWin)
                            app.escanearAlrededor(px, py)
                        }
                    }
                }
            }
        }
    };
    a.app = app
})(window);
