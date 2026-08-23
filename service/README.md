# unfair-tos-detector service

Microservicio Node.js que detecta cláusulas abusivas en Términos de Servicio, extraído del
worker de detección de la app estática (`static/js/unfairTosDetection.js`). Usa el mismo
modelo (`marmolpen3/lexglue-unfair-tos-onnx`, vía `@xenova/transformers@2.6.0`) y la misma
clasificación en 8 categorías (`ltd`, `ter`, `ch`, `cr`, `use`, `law`, `j`, `a`).

Dos formas de consumirlo desde otro proyecto:

- **`packages/core`**: librería npm importable en proceso (sin red).
- **`packages/api`**: API REST fina sobre `core`, pensada para correr en Docker.

## Instalación

```bash
cd service
npm install
```

## Uso como librería (`packages/core`)

Desde otro proyecto Node (mismo monorepo o instalando el paquete):

```js
import { analyzeText, analyzeClauses } from "unfair-tos-detector-core";

const results = await analyzeText("Full ToS text here...");
// o, si ya tienes las cláusulas separadas:
const { summary: summary2, clauses: clauses2 } = await analyzeClauses(["Clause one.", "Clause two."]);

clauses.forEach(c => console.log(c.term, c.isUnfair, c.wordCount, c.ltd, c.ter, /* ... */));
console.log(summary); // { totalClauses, unfairClauses, totalWords }
```

La primera llamada descarga y cachea el modelo desde Hugging Face Hub (puede tardar);
las siguientes reutilizan el modelo ya cargado en memoria.

## Uso local de la API

```bash
npm run start
```

```bash
curl -X POST http://localhost:3000/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "We may terminate your account at any time without notice."}'
```

Body admite `{ "text": "..." }` (se trocea en frases con `sbd`) o
`{ "clauses": ["...", "..."] }` (cláusulas ya separadas).

Respuesta:

```json
{
  "summary": {
    "totalClauses": 1,
    "unfairClauses": 1,
    "totalWords": 11,
    "sectionCount": 0
  },
  "clauses": [
    {
      "term": "We may terminate your account at any time without notice.",
      "isUnfair": true,
      "wordCount": 11,
      "ltd": 0.12, "ter": 0.91, "ch": 0.08, "cr": 0.03,
      "use": 0.05, "law": 0.01, "j": 0.02, "a": 0.01
    }
  ]
}
```

`sectionCount` es un heurístico: cuenta líneas que empiezan con numeración de sección de
nivel superior (`"1. ..."`, `"6 Third party claims"`, `"Section 3: ..."`, `"Article 4"`),
ignorando subsecciones tipo `"6.1 ..."`. Solo se calcula cuando se manda `text` completo
(con `clauses` sueltas no hay estructura de líneas del documento original que analizar,
así que `sectionCount` viene `null`). Al ser heurístico, depende del formato del documento
de entrada — no es infalible con cualquier ToS.

El servicio es **sin estado**: no persiste nada. `summary` y `clauses` van listos para que
el proyecto consumidor los guarde en su propia base de datos.

`GET /health` devuelve `503` mientras el modelo carga y `200` cuando está listo para servir.

## Docker

El build context es la raíz `service/` (necesita ver `packages/core` además de `packages/api`):

```bash
cd service
docker build -f packages/api/Dockerfile -t unfair-tos-detector-api .
docker run --rm -p 3000:3000 unfair-tos-detector-api
```

El contenedor descarga el modelo desde Hugging Face Hub en el primer arranque (misma
descarga bajo demanda que ya hace la app en el navegador). Si en el futuro se necesita un
arranque sin acceso a red, se puede pre-hornear el modelo en la imagen en build time —
no implementado todavía.

## Publicar el paquete `core`

`package.json` de `core` ya está listo (`unfair-tos-detector-core`), pero **no se ha
publicado**. Cuando se quiera exponer a npm: `cd packages/core && npm publish` (requiere
decidir visibilidad/registro explícitamente).

## Nota sobre el frontend estático

Este servicio es aditivo. La app estática (`index.html`, `playground.html`, etc. en la
raíz del repo) no ha sido modificada y sigue ejecutando el modelo enteramente en el
navegador con su propio Web Worker.
