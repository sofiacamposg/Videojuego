#GLADIATOR -> Esquema de Base de Datos
#Equipo 6: Daniela, Sofia y Ariel

CREATE DATABASE IF NOT EXISTS gladiator; 
USE gladiator;

#  Tabla: Jugador
CREATE TABLE Jugador (  #nombre tipo restricción
    jugador_id INT NOT NULL AUTO_INCREMENT,
    nombre_usuario VARCHAR(30) NOT NULL UNIQUE,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_runs INT NOT NULL DEFAULT 0 CHECK (total_runs >= 0),
    total_derrotas INT NOT NULL DEFAULT 0 CHECK (total_derrotas >= 0),
    total_victorias INT NOT NULL DEFAULT 0 CHECK (total_victorias >= 0),
    PRIMARY KEY (jugador_id)
);

#  Tabla: Arquetipoa
CREATE TABLE Arquetipo (
    arquetipo_id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL UNIQUE,
    hp_inicio INT NOT NULL DEFAULT 0 CHECK (hp_inicio >= 0),
    velocidad_inicio INT NOT NULL DEFAULT 0 CHECK (velocidad_inicio >= 0),
    daño_inicio INT NOT NULL DEFAULT 0 CHECK (daño_inicio >= 0),
    PRIMARY KEY (arquetipo_id)
);

# añadimos los arquetipos
INSERT INTO Arquetipo (nombre, hp_inicio, velocidad_inicio, daño_inicio) VALUES
    ('Guerrero', 120, 5, 20),
    ('Lancero',  100, 6, 25),
    ('Pesado',   150, 3, 15);

#  Tabla: Nivel
CREATE TABLE Nivel (
    nivel_id INT NOT NULL AUTO_INCREMENT,
    num_nivel INT NOT NULL UNIQUE CHECK (num_nivel BETWEEN 1 AND 3),
    tiempo_obj INT NOT NULL CHECK (tiempo_obj > 0),
    PRIMARY KEY (nivel_id)
);

# añadimos los 3 niveles con el tiempo meta
INSERT INTO Nivel (num_nivel, tiempo_obj) VALUES
    (1, 30),
    (2, 30),
    (3, 30);

#  Tabla: Carta
CREATE TABLE Carta (
    carta_id INT NOT NULL AUTO_INCREMENT,
    nombre_carta VARCHAR(30) NOT NULL UNIQUE,
    tipo_carta BOOLEAN NOT NULL,  #TRUE = power-up / FALSE = castigo
    efecto_carta FLOAT NOT NULL,
    ##duracion_efecto INT NOT NULL CHECK (duracion_efecto >= 0), 0 para permanetne??
    PRIMARY KEY (carta_id)
);

#  Tabla: Enemigo
CREATE TABLE Enemigo (
    enemigo_id INT NOT NULL AUTO_INCREMENT,
    nivel_id INT NOT NULL,
    nombre_enemigo VARCHAR(30) NOT NULL UNIQUE,
    hp_inicio INT NOT NULL CHECK (hp_inicio > 0),
    velocidad_inicio INT NOT NULL CHECK (velocidad_inicio > 0),
    daño_inicio INT NOT NULL CHECK (daño_inicio > 0),
    queEs VARCHAR(4) NOT NULL,  #NPC / BOSS
    PRIMARY KEY (enemigo_id),
    FOREIGN KEY (nivel_id) REFERENCES Nivel(nivel_id)
);

#  Tabla: Partida
CREATE TABLE Partida (
    partida_id INT NOT NULL AUTO_INCREMENT,
    jugador_id INT NOT NULL,
    arquetipo_id INT NOT NULL,
    inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    final TIMESTAMP NULL,
    duracion INT NOT NULL DEFAULT 0 CHECK (duracion >= 0),
    nivel_alcanzado INT NOT NULL CHECK (nivel_alcanzado BETWEEN 1 AND 3),
    fama_final INT NOT NULL DEFAULT 0 CHECK (fama_final >= 0),
    vida INT NOT NULL CHECK (vida BETWEEN 1 AND 5),
    PRIMARY KEY (partida_id),
    FOREIGN KEY (jugador_id) REFERENCES Jugador(jugador_id),
    FOREIGN KEY (arquetipo_id) REFERENCES Arquetipo(arquetipo_id)
);

#  Tabla: nivelEspecifico
CREATE TABLE nivelEspecifico (
    nivelEspecifico_id INT NOT NULL AUTO_INCREMENT,
    partida_id INT NOT NULL,
    nivel_id INT NOT NULL,
    tiempo_completado INT NOT NULL CHECK (tiempo_completado >= 0),
    hp_restante INT NOT NULL CHECK (hp_restante > 0),
    fama_ganada INT NOT NULL CHECK (fama_ganada > 0),
    powerups_obtenidos INT NOT NULL CHECK (powerups_obtenidos IN (1, 2)),
    castigos_obtenidos INT NOT NULL CHECK (castigos_obtenidos IN (1, 2)),
    terminado BOOLEAN NOT NULL,  #TRUE = completo
    PRIMARY KEY (nivelEspecifico_id),
    FOREIGN KEY (partida_id) REFERENCES Partida(partida_id),
    FOREIGN KEY (nivel_id) REFERENCES Nivel(nivel_id)
);

#  Tabla: cartaUsada
CREATE TABLE cartaUsada (
    cartaUsada_id INT NOT NULL AUTO_INCREMENT,
    nivelEspecifico_id INT NOT NULL,
    carta_id INT NOT NULL,
    tiempo_uso TIMESTAMP NOT NULL,
    duracion_efecto INT NOT NULL CHECK (duracion_efecto >= 0),
    PRIMARY KEY (cartaUsada_id),
    FOREIGN KEY (nivelEspecifico_id) REFERENCES nivelEspecifico(nivelEspecifico_id),
    FOREIGN KEY (carta_id) REFERENCES Carta(carta_id)
);

#  Tabla: enemigoUsado
CREATE TABLE enemigoUsado (
    enemigoUsado_id INT NOT NULL AUTO_INCREMENT,
    nivelEspecifico_id INT NOT NULL,
    enemigo_id INT NOT NULL,
    ##aparecidos INT NOT NULL DEFAULT 0 CHECK (aparecidos >= 0), #modificar para solo aceptar actualizar al final del nivel 
    ##eliminados INT NULL CHECK (eliminados IS NULL OR eliminados >= 0),  #modificar para solo aceptar actualizar al final del nivel 
    PRIMARY KEY (enemigoUsado_id),
    FOREIGN KEY (nivelEspecifico_id) REFERENCES nivelEspecifico(nivelEspecifico_id),
    FOREIGN KEY (enemigo_id) REFERENCES Enemigo(enemigo_id)
);