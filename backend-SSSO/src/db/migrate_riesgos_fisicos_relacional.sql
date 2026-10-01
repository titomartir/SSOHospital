BEGIN;

CREATE TABLE peligro_medidas (
  id SERIAL PRIMARY KEY,
  peligro_id INTEGER NOT NULL,
  medida_preventiva_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT peligro_medidas_unq UNIQUE (peligro_id, medida_preventiva_id),
  CONSTRAINT peligro_medidas_peligro_id_fkey FOREIGN KEY (peligro_id)
    REFERENCES peligros(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT peligro_medidas_medida_preventiva_id_fkey FOREIGN KEY (medida_preventiva_id)
    REFERENCES medidas_preventivas(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE peligro_medida_acciones (
  id SERIAL PRIMARY KEY,
  peligro_medida_id INTEGER NOT NULL,
  accion_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT peligro_medida_acciones_unq UNIQUE (peligro_medida_id, accion_id),
  CONSTRAINT peligro_medida_acciones_peligro_medida_id_fkey FOREIGN KEY (peligro_medida_id)
    REFERENCES peligro_medidas(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT peligro_medida_acciones_accion_id_fkey FOREIGN KEY (accion_id)
    REFERENCES acciones(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE peligro_medida_accion_recursos (
  peligro_medida_accion_id INTEGER NOT NULL,
  recurso_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (peligro_medida_accion_id, recurso_id),
  CONSTRAINT peligro_medida_accion_recursos_peligro_medida_accion_id_fkey FOREIGN KEY (peligro_medida_accion_id)
    REFERENCES peligro_medida_acciones(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT peligro_medida_accion_recursos_recurso_id_fkey FOREIGN KEY (recurso_id)
    REFERENCES recursos(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE peligro_medida_accion_responsables (
  peligro_medida_accion_id INTEGER NOT NULL,
  responsable_id INTEGER NOT NULL,
  tipo VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (peligro_medida_accion_id, responsable_id),
  CONSTRAINT peligro_medida_accion_responsables_tipo_chk CHECK (tipo IN ('PRINCIPAL', 'APOYO')),
  CONSTRAINT pma_responsables_pma_id_fkey FOREIGN KEY (peligro_medida_accion_id)
    REFERENCES peligro_medida_acciones(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT peligro_medida_accion_responsables_responsable_id_fkey FOREIGN KEY (responsable_id)
    REFERENCES responsables(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE UNIQUE INDEX idx_peligro_medida_accion_resp_principal
  ON peligro_medida_accion_responsables(peligro_medida_accion_id)
  WHERE tipo = 'PRINCIPAL';

ALTER TABLE matriz_evaluacion_detalles
  ADD COLUMN peligro_medida_accion_id INTEGER;

ALTER TABLE matriz_evaluacion_detalles
  ADD CONSTRAINT matriz_evaluacion_detalles_peligro_medida_accion_id_fkey
  FOREIGN KEY (peligro_medida_accion_id)
  REFERENCES peligro_medida_acciones(id)
  ON UPDATE CASCADE
  ON DELETE RESTRICT;

CREATE INDEX idx_matriz_eval_detalles_peligro_medida_accion
  ON matriz_evaluacion_detalles(peligro_medida_accion_id);

CREATE TABLE matriz_detalle_recursos (
  detalle_id INTEGER NOT NULL,
  recurso_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (detalle_id, recurso_id),
  CONSTRAINT matriz_detalle_recursos_detalle_id_fkey FOREIGN KEY (detalle_id)
    REFERENCES matriz_evaluacion_detalles(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT matriz_detalle_recursos_recurso_id_fkey FOREIGN KEY (recurso_id)
    REFERENCES recursos(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE matriz_detalle_responsables (
  detalle_id INTEGER NOT NULL,
  responsable_id INTEGER NOT NULL,
  tipo VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (detalle_id, responsable_id),
  CONSTRAINT matriz_detalle_responsables_tipo_chk CHECK (tipo IN ('PRINCIPAL', 'APOYO')),
  CONSTRAINT matriz_detalle_responsables_detalle_id_fkey FOREIGN KEY (detalle_id)
    REFERENCES matriz_evaluacion_detalles(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT matriz_detalle_responsables_responsable_id_fkey FOREIGN KEY (responsable_id)
    REFERENCES responsables(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE UNIQUE INDEX idx_matriz_detalle_resp_principal
  ON matriz_detalle_responsables(detalle_id)
  WHERE tipo = 'PRINCIPAL';

CREATE INDEX idx_peligro_medidas_medida_preventiva_id
  ON peligro_medidas(medida_preventiva_id);

CREATE INDEX idx_peligro_medida_acciones_accion_id
  ON peligro_medida_acciones(accion_id);

CREATE INDEX idx_peligro_medida_accion_recursos_recurso_id
  ON peligro_medida_accion_recursos(recurso_id);

CREATE INDEX idx_peligro_medida_accion_resp_responsable_id
  ON peligro_medida_accion_responsables(responsable_id);

CREATE INDEX idx_matriz_detalle_recursos_recurso_id
  ON matriz_detalle_recursos(recurso_id);

CREATE INDEX idx_matriz_detalle_responsables_responsable_id
  ON matriz_detalle_responsables(responsable_id);

COMMIT;
