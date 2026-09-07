DROP TABLE IF EXISTS PLATOTIPICO;

CREATE TABLE PLATOTIPICO (
  id      SERIAL PRIMARY KEY,
  nombre  VARCHAR(255) NOT NULL,
  puntaje INT NOT NULL
);

INSERT INTO PLATOTIPICO (nombre, puntaje) VALUES
('sopa de mani',    1),
('aji de fideo',    1),
('majadito',        2),
('pique',           2),
('saice',           2),
('silpancho',       3),
('charque',         3),
('picante mixto',   3),
('fricase',         4),
('chajchu',         4);