# Henri Data Breach

Ferramenta web em React para avaliação de severidade de incidentes de data breach, baseada na metodologia da ENISA.

## Visão geral

O projeto permite:

- registrar dados básicos do incidente
- avaliar os critérios da metodologia passo a passo
- gerar um relatório PDF com a pontuação final
- publicar a aplicação via GitHub Pages

## Stack

- React
- Vite
- Tailwind CSS
- GSAP
- jsPDF

## Desenvolvimento local

Instalar dependências:

```bash
npm install
```

Rodar em ambiente local:

```bash
npm run dev
```

Gerar build de produção:

```bash
npm run build
```

Visualizar a build localmente:

```bash
npm run preview
```

## Deploy

O deploy está configurado para GitHub Pages com GitHub Actions.

Repositório:

`https://github.com/lucas-werner/henridatabreach`

URL esperada de produção:

`https://lucas-werner.github.io/henridatabreach/`

Para publicar:

1. faça push para `main`
2. abra `Settings > Pages`
3. defina `Source` como `GitHub Actions`

## Estrutura principal

- `src/App.jsx`: composição principal da aplicação
- `src/assessmentData.js`: critérios, textos e opções de avaliação
- `src/components/`: componentes de interface
- `public/`: assets estáticos, incluindo o logo usado no PDF

## Referência metodológica

Documento original da ENISA:

`https://www.enisa.europa.eu/sites/default/files/publications/Data%20breach%20severity%20methodology_1.0.pdf`

## Autor

Made by Lucas Noronha  
`https://lucasnoronha.com`
